/* jshint node:true */
"use strict";

//------------------------------------------------------------------------------
// This node.js program reads the HTML version of a a game and writes a JSON
// version of the game. It does this for all HTML files in the ./games directory.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Load the modules we will need
//------------------------------------------------------------------------------
var fs      = require('fs');           // to write the html to a file
var cheerio = require('cheerio');      // to parse html
var _       = require('underscore');   // functional JavaScript library
var library = require('./library.js'); // my library of useful functions

//------------------------------------------------------------------------------
// Make this global since it is used by functions
//------------------------------------------------------------------------------
var $;
var shortHtmlFiles = 0;
var shortHtmlSize = 5000;
var shortHtmlDates = '';

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function addClueAndAnswer(clueText, answerText) {
  var newLength = clueStrings.push(clueText)
  answerStrings.push(answerText)
  return newLength - 1
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function addCategory(category) {
  var indexOfCategory = categoryStrings.findIndex(function(item) {
    return category === item[0]
  })
  if (indexOfCategory < 0) {
    indexOfCategory = iCategory
    categoryStrings.push([category,0])
    ++iCategory
  }
  categoryStrings[indexOfCategory][1] += 1
  return indexOfCategory
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function addPlayerName(playerName) {
  var indexOfPlayerName = playerNames.indexOf(playerName)
  if (indexOfPlayerName < 0) {
    indexOfPlayerName = iPlayerName
    playerNames.push(playerName)
    ++iPlayerName
  }
  return indexOfPlayerName
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function firstNamesStringToPlayerIndexArray(firstNames, playersFirstNames) {
  if (firstNames.length === 0) return []
  return firstNames.split(' ').map(function(playerFirstName) {
    return playersFirstNames.indexOf(playerFirstName)
  })
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var parseRound = function (round, filename, playersFirstNames) {
  var roundJsonOld = {};
  var roundJson = {};

  var categoriesOld = [];
  var categories = [];
  round.find('.category_name').filter(function () {
    var categoryName = $(this).text()
    categoriesOld.push(categoryName);
    categories.push(addCategory(categoryName))
  });
  roundJsonOld.categories = categoriesOld;
  roundJson.categories = categories;

  if (categories.length < 5) {
    console.log('ERROR: only found ' + categories.length +
    ' categories in ' + round + ' filename=' + filename);
  }

  //<em class="correct_response"><i>ANSWER</i></em>

  var cluesOld = [];
  var clues = [];
  // Selector 'table tr td div' isolates one part of each cell's HTML.
  // We can pick out all the information we need from this DIV.
  round.find('table tr td div').filter(function() {
    var div = $(this);

    // the onmouseover attribute contains the clue and the answer.
    // Analyze the command string in the mouseover handler.
    var mm = div.attr('onmouseover');
    var n = mm.indexOf("stuck', '");
    var len = mm.length;
    var mouseoverHtml = mm.substring(n + 9, len - 2);
    var $mo = cheerio.load(mouseoverHtml);
    var answerText = $mo('.correct_response').text();
    var rightAnswerBy = $mo('.right').text();
    var wrongAnswersBy = [];
    $mo('.wrong').filter(function () {
      var data = $(this);
      var s = data.text();
      if (s !== "Triple Stumper") {
        wrongAnswersBy.push(s);
      }
    });

    // Get the clue text from mouseout
    var mm2 = div.attr('onmouseout');
    var n2 = mm2.indexOf("stuck', '");
    var clueText = mm2.substring(n2 + 9, mm2.length - 2);

    // Get the other values from the TR
    var tds = div.find('td');
    var clueId = tds.eq(0).attr('id');
    var value = tds.eq(1).text();

    // The jeopardy and double jeopardy rounds have different spacing.
    var jOrDj, col, row;
    if (clueId.charAt(5) === 'J') {
      jOrDj = ' J';
      col = clueId.substring(7, 8);
      row = clueId.substring(9, 10);
    } else {
      jOrDj = 'DJ';
      col = clueId.substring(8, 9);
      row = clueId.substring(10, 11);
    }

    // Daily doubles also have different spacing.
    var isDD;
    if (value.charAt(0) === 'D') {
      isDD = true;
      value = library.stripNonDigits(value);
    } else {
      isDD = false;
      value = value.substring(1);
    }

    cluesOld.push({
      "clueText": clueText,
      "answer": answerText,
      "rightAnswerBy": rightAnswerBy,
      "wrongAnswersBy": wrongAnswersBy,
      "round": jOrDj,
      "col": parseInt(col),
      "row": parseInt(row),
      "isDD": isDD,
      "value": parseInt(value),
      "outOfOrder": 0,
      "order": parseInt(tds.eq(2).text())
    });

    clues.push([
      addClueAndAnswer(clueText, answerText),
      playersFirstNames.indexOf(rightAnswerBy),
      firstNamesStringToPlayerIndexArray(wrongAnswersBy.join(' '), playersFirstNames),
      parseInt(col, 10),
      parseInt(row, 10),
      (isDD ? 1 : 0),
      parseInt(value),
      parseInt(tds.eq(2).text(), 10) // will convert to: out of order flag
    ]);
  });

  // Sort clues by order answered
  clues.sort(function (a, b) {
    return a[7] - b[7];
  });
  roundJson.clues = clues

  cluesOld.sort(function (a, b) {
    return a.order - b.order;
  });
  roundJsonOld.clues = cluesOld;

  // Add info about jumps
  var board = new Array(5),
  i,
  row,
  col;
  for (row = 0; row < 5; ++row) {
    board[row] = new Array(6);
    for (col = 0; col < 6; ++col) board[row][col] = 0;
  }
  for (var clueIndex = 0; clueIndex < cluesOld.length; ++clueIndex) {
    var clueOld = cluesOld[clueIndex];
    var clue = clues[clueIndex]
    row = clueOld.row - 1;
    col = clueOld.col - 1;
    board[row][col] = 1;
    // See how many other clues in the column are unanswered
    var unansweredAbove = 0;
    for (i = row - 1; i >= 0; --i) {
      if (board[i][col] < 1) ++unansweredAbove;
    }
    var unansweredBelow = 0;
    for (i = row + 1; i < 5; ++i) {
      if (board[i][col] < 1) ++unansweredBelow;
    }
    clue[7] = 0
    if (unansweredAbove > 0) {
      clueOld.outOfOrder = 1;
      clue[7] = 1
      // Is this the first clue in the column to be picked.
      if ((unansweredAbove + unansweredBelow) === 4) {
        clueOld.outOfOrder = 2;
        clue[7] = 2
      }
    }
  }

  return [roundJsonOld, roundJson];
};

//------------------------------------------------------------------------------
// *gameData fields passed in
// ** seasonNumber
// ** gameId
// ** gameNumber
// ** gameDate
// fields added by this function
// ** comments:
// ** contestants:
// ** round1:
// ** round2:
//------------------------------------------------------------------------------
var parseDayHtml = function (html, gameDataOld, path) {
  $ = cheerio.load(html);

  var errorCount = 0;

  var gameData = {}
  gameData.date = gameDataOld.gameDate

  var season = gameDataOld.seasonNumber
  if (season === 'superjeopardy') season = 6;
  if (typeof season === "string") season = parseInt(season, 10)
  gameData.season = season

  gameData.notes = gameDataOld.comments = $('#game_comments').text();

  // Extract some fields
  var contestants = [];
  var players = []
  $('p.contestants a').filter(function () {
    var data = $(this);
    var s = data.text();
    contestants.push(s);
    players.push(addPlayerName(s))
  });

  gameData.players = players;
  gameDataOld.contestants = contestants;
  if (contestants.length < 3) {
    if (html.length < shortHtmlSize) {
      ++shortHtmlFiles;
      shortHtmlDates += ' ' + gameDataOld.gameDate;
    } else {
      console.log('ERROR: less than 3 contestants found in ' + path);
    }
    ++errorCount;
  }

  var playersFirstNames = gameDataOld.contestants.map(function(playerName) {
    var parts = playerName.split(' ')
    // Guard against bad data input
    if (!parts || !parts[0]) {
      parts = ['No name']
      console.log('*** first name FAILURE. contestants:', gameDataOld.contestants)
    }
    return parts[0]
  })

  var roundNumber = 1;
  $('table.round').filter(function () {
    var roundDatas = parseRound($(this), path, playersFirstNames);
    var roundData = roundDatas[1]
    if (roundData) {
      gameData['r'+roundNumber] = roundData
    }
    var roundDataOld = roundDatas[0]
    if (roundDataOld) {
      gameDataOld['round' + roundNumber] = roundDataOld;
    } else {
      if (html.length < shortHtmlSize) {
        ++shortHtmlFiles;
        shortHtmlDates += ' ' + gameDataOld.gameDate;
      } else {
        console.log('ERROR: missing round ' + roundNumber +
        ' in ' + path, this);
      }
      ++errorCount;
    }
    ++roundNumber;
  });

  if (roundNumber < 3) {
    if (html.length < shortHtmlSize) {
      ++shortHtmlFiles;
      shortHtmlDates += ' ' + gameDataOld.gameDate;
    } else {
      console.log('ERROR: found ' + (roundNumber - 1) +
      ' table.round elements in ' + path);
    }
    ++errorCount;
  }

  // Get the final jeopardy data
  var finalDiv = $('table.final_round tr td div');

  var finalCategory = finalDiv.find('td.category_name').text();
  var finalDataOld = {};
  var finalData = {};

  if (finalCategory.length > 0) {
    var mouseoutText = finalDiv.attr('onmouseout');
    var n = mouseoutText.indexOf("stuck', '");
    var finalQuestion = mouseoutText.substring(n + 9, mouseoutText.length - 2);

    var mouseoverText = finalDiv.attr('onmouseover');
    var mouseoverHtml = mouseoverText.substring(mouseoverText.indexOf("<table"),
    mouseoverText.length - 2);

    var n2 = mouseoverHtml.indexOf('<em class=');
    var emHtml = mouseoverHtml.substring(n2);
    var $em = cheerio.load(emHtml);
    var finalAnswer = '';
    $em('em').filter(function () {
      finalAnswer = $(this).text();
    });
    //console.log('n2='+n2+' finalAnswer='+finalAnswer+' emHtml'+emHtml);

    var $mo = cheerio.load(mouseoverHtml);

    var finalRights = '';
    var spacer = '';
    $mo('.right').filter(function () {
      finalRights += spacer + $(this).text();
      spacer = ' ';
    });
    var finalWrongs = '';
    spacer = '';
    $mo('.wrong').filter(function () {
      finalWrongs += spacer + $(this).text();
      spacer = ' ';
    });
    finalDataOld = {
      category: finalCategory,
      question: finalQuestion,
      answer: finalAnswer,
      rights: finalRights,
      wrongs: finalWrongs
    };
    var qaIndex = addClueAndAnswer(finalQuestion, finalAnswer)
    finalData = {
      category: addCategory(finalCategory),
      question: qaIndex,
      answer: qaIndex,
      rights: firstNamesStringToPlayerIndexArray(finalRights, playersFirstNames),
      wrongs: firstNamesStringToPlayerIndexArray(finalWrongs, playersFirstNames)
    };
    //console.log('finalDataOld', finalDataOld);
  }

  gameDataOld.finalJeopardy = finalDataOld;
  gameData.final = finalData;

  gameDataOld.errorCount = errorCount;

  return [gameDataOld, gameData];
};


//******************************************************************************
// node.js main program starts here.
//******************************************************************************

//------------------------------------------------------------------------------
// Get the list of games already fetched
//------------------------------------------------------------------------------
var htmlGameDirectoryName = library.bigDataDir() + 'gamesHTML/';
var jsonGameDirectoryName = library.bigDataDir() + 'gamesJSON/';
var jsonFiles = fs.readdirSync(jsonGameDirectoryName).sort();

var gameDataArray = JSON.parse(fs.readFileSync('data/gameData.json').toString());
var numGames = gameDataArray.length;
console.log('------Processing ' + numGames + ' games');

//------------------------------------------------------------------------------
// Parse and process the HTML files into JSON files
//------------------------------------------------------------------------------
var allGamesOld = [];
var htmlFilesProcessed = 0;
var processStart = new Date().getTime();

var iString = 0
var clueStrings = []
var answerStrings = []

var iCategory = 0
var categoryStrings = []

var iPlayerName = 0
var playerNames = []

var games = []
var totalRounds = 0
var emptyRounds = 0

var gamesRead = 0;
var gamesParsed = 0;

gameDataArray.forEach(function (gameDataIn, index) {

  // DEBUG -- only do three games
  // DEBUG -- only do three games
  // DEBUG -- only do three games
  if (index > 2) return

  ++htmlFilesProcessed;
  var gameDataOld;
  var gameData
  if ((htmlFilesProcessed % 500) === 0) {
    console.log('-----> ' + htmlFilesProcessed + '/' +
    numGames + ' files processed');
  }

  var filenameBase = 'g' + gameDataIn.gameId;
  var filenameJSON = filenameBase + '.json';
  var jsonPath = jsonGameDirectoryName + filenameBase + '.json';

  // NOTE: for now, don't reuse any JSON.
  // After we get the new version working we'll add this back in.
  if (false && _.indexOf(jsonFiles, filenameJSON, true) >= 0) {
    var json = fs.readFileSync(jsonPath).toString();
    gameDataOld = JSON.parse(json);
    ++gamesRead;

  } else {
    var htmlPath = htmlGameDirectoryName + filenameBase + '.html';
    console.log('Creating new gameData from ' + htmlPath)

    var gameHtml = fs.readFileSync(htmlPath, 'utf-8');
    if (!gameHtml) {
      console.log('ERROR reading ' + htmlPath);
      return;
    }

    var gameDatas = parseDayHtml(gameHtml, gameDataIn, htmlPath);
    gameDataOld = gameDatas[0]
    gameData = gameDatas[1]

    if (gameData.errorCount === 0) {
      fs.writeFileSync(jsonPath, JSON.stringify(gameDataOld));
      console.log('--- wrote file to '+jsonPath);
    }
    ++gamesParsed;
  }
  allGamesOld.push(gameDataOld);
  games.push(gameData);
})

console.log('++++ GAMES parsed=' + gamesParsed + ' read=' + gamesRead);
if (shortHtmlDates.length > 0) {
  console.log('***NOTE: found ' + shortHtmlFiles + ' short HTML files');
}

// See how long it took
var et1 = new Date().getTime() - processStart;
console.log('Processed ' + allGamesOld.length + ' of ' + numGames +
' HTML files into JSON in ' + (et1 / 1000).toFixed(1) + ' sec');

console.log('writing allGamesOldHuman.json')
library.writeJSONFile(allGamesOld, './data/allGamesOldHuman.json', 2);
console.log('writing allGamesOld.json')
library.writeJSONFile(allGamesOld, './data/allGamesOld.json', null);

//------------------------------------------------------------------------------
// write out the data files:
// games.json: an array of all the games
// clueStrings.json: an array of each clue in all the games
//   clues in games.json are encoded as indexes into this array.
// answerStrings.json: an array of each answer in all the games
//   answers in games.json are encoded as indexes into this array.
// categoryStrings.json: an array of each category in all the games
//   Duplicates have been removed.
//   categories in games.json are encoded as indexes into this array.
// playerNames.json: an array of each player name in all the games
//   Duplicates have been removed.
//   player names in games.json are encoded as indexes into this array.
//------------------------------------------------------------------------------
var jsonOut = JSON.stringify(games, null, 2)
var outFile = './data/games.json'
console.log(`Write ${jsonOut.length} bytes or ${games.length} games to ${outFile}`)
fs.writeFileSync(outFile, jsonOut, "utf-8")

jsonOut = JSON.stringify(clueStrings, null, 2)
outFile = './data/clueStrings.json'
console.log(`Write ${jsonOut.length} bytes or ${clueStrings.length} strings to ${outFile}`)
fs.writeFileSync(outFile, jsonOut, "utf-8")

jsonOut = JSON.stringify(answerStrings, null, 2)
outFile = './data/answerStrings.json'
console.log(`Write ${jsonOut.length} bytes or ${answerStrings.length} strings to ${outFile}`)
fs.writeFileSync(outFile, jsonOut, "utf-8")

jsonOut = JSON.stringify(categoryStrings, null, 2)
outFile = './data/categoryStrings.json'
console.log(`Write ${jsonOut.length} bytes or ${categoryStrings.length} strings to ${outFile}`)
fs.writeFileSync(outFile, jsonOut, "utf-8")

jsonOut = JSON.stringify(playerNames, null, 2)
outFile = './data/playerNames.json'
console.log(`Write ${jsonOut.length} bytes or ${playerNames.length} strings to ${outFile}`)
fs.writeFileSync(outFile, jsonOut, "utf-8")
