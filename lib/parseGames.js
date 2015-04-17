/* jshint node:true */
"use strict";

//------------------------------------------------------------------------------
// This node.js program reads the HTML version of a a game and writes a JSON
// version of the game. It does this for all HTML files in the ./games directory.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Load the modules we will need
//------------------------------------------------------------------------------
var fs = require('fs'); // to write the html to a file
var cheerio = require('cheerio'); // to parse html
var _ = require('underscore'); // functional JavaScript library
var library = require('./library.js');

//------------------------------------------------------------------------------
// Make this global since it is used by functions
//------------------------------------------------------------------------------
var $;
var shortHtmlFiles = 0;
var shortHtmlSize = 5000;
var shortHtmlDates = '';

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var parseRound = function (round, filename) {
    var roundJson = {};

    var categories = [];
    round.find('.category_name').filter(function () {
        categories.push($(this).text());
    });
    roundJson.categories = categories;

    if (categories.length < 5) {
        console.log('ERROR: only found ' + categories.length +
            ' categories in ' + round + ' filename=' + filename);
    }

    //<em class="correct_response"><i>ANSWER</i></em>

    var clues = [];
    // Selector 'table tr td div' isolates one part of each cell'ls HTML
    // We can pick out all the information we need from this DIV.
    round.find('table tr td div').filter(function () {
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
        //console.log('clue clueText=<'+clueText+'>');

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

        clues.push({
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
    });

    // Sort clues by order answered
    clues.sort(function (a, b) {
        return a.order - b.order;
    });
    roundJson.clues = clues;

    // Add info about jumps
    var board = new Array(5),
        i,
        row,
        col;
    for (row = 0; row < 5; ++row) {
        board[row] = new Array(6);
        for (col = 0; col < 6; ++col) board[row][col] = 0;
    }
    for (var clueIndex = 0; clueIndex < clues.length; ++clueIndex) {
        var clue = clues[clueIndex];
        row = clue.row - 1;
        col = clue.col - 1;
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
        if (unansweredAbove > 0) {
            clue.outOfOrder = 1;
            // Is this the first clue in the column to be picked.
            if ((unansweredAbove + unansweredBelow) === 4) {
                clue.outOfOrder = 2;
            }
        }
    }

    return roundJson;
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
var parseDayHtml = function (html, gameData, path) {
    $ = cheerio.load(html);

    var errorCount = 0;

    gameData.comments = $('#game_comments').text();

    // Extract some fields
    var contestants = [];
    $('p.contestants a').filter(function () {
        var data = $(this);
        var s = data.text();
        contestants.push(s);
    });
    gameData.contestants = contestants;
    if (contestants.length < 3) {
        if (html.length < shortHtmlSize) {
            ++shortHtmlFiles;
            shortHtmlDates += ' ' + gameData.gameDate;
        } else {
            console.log('ERROR: less than 3 contestants found in ' + path);
        }
        ++errorCount;
    }

    var roundNumber = 1;
    $('table.round').filter(function () {
        var roundData = parseRound($(this), path);
        if (roundData) {
            gameData['round' + roundNumber] = roundData;
        } else {
            if (html.length < shortHtmlSize) {
                ++shortHtmlFiles;
                shortHtmlDates += ' ' + gameData.gameDate;
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
            shortHtmlDates += ' ' + gameData.gameDate;
        } else {
            console.log('ERROR: found ' + (roundNumber - 1) +
                ' table.round elements in ' + path);
        }
        ++errorCount;
    }

    // Get the final jeopardy data
    var finalDiv = $('table.final_round tr td div');

    var finalCategory = finalDiv.find('td.category_name').text();
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
        finalData = {
            category: finalCategory,
            question: finalQuestion,
            answer: finalAnswer,
            rights: finalRights,
            wrongs: finalWrongs
        };
        //console.log('finalData', finalData);
    }

    gameData.finalJeopardy = finalData;

    gameData.errorCount = errorCount;

    return gameData;
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
var allGames = [];
var htmlFilesProcessed = 0;
var processStart = new Date().getTime();

var gamesRead = 0;
var gamesParsed = 0;

//var testingLimit = 1100;

_.each(gameDataArray, function (gameDataIn) {
    //if(--testingLimit < 0) {return;}
    ++htmlFilesProcessed;
    var gameData;
    if ((htmlFilesProcessed % 500) === 0) {
        console.log('-----> ' + htmlFilesProcessed + '/' +
            numGames + ' files processed');
    }

    var filenameBase = 'g' + gameDataIn.gameId;
    var filenameJSON = filenameBase + '.json';
    var jsonPath = jsonGameDirectoryName + filenameBase + '.json';

    if (_.indexOf(jsonFiles, filenameJSON, true) >= 0) {
        var json = fs.readFileSync(jsonPath).toString();
        gameData = JSON.parse(json);
        ++gamesRead;

    } else {
        var htmlPath = htmlGameDirectoryName + filenameBase + '.html';

        var gameHtml = fs.readFileSync(htmlPath, 'utf-8');
        if (!gameHtml) {
            console.log('ERROR reading ' + htmlPath);
            return;
        }

        gameData = parseDayHtml(gameHtml, gameDataIn, htmlPath);

        if (gameData.errorCount === 0) {
            fs.writeFileSync(jsonPath, JSON.stringify(gameData));
            //console.log('wrote file to '+jsonPath);
        }
        ++gamesParsed;
    }

    allGames.push(gameData);
});

console.log('++++ GAMES parsed=' + gamesParsed + ' read=' + gamesRead);
if (shortHtmlDates.length > 0) {
    console.log('***NOTE: found ' + shortHtmlFiles + ' short HTML files');
}

// See how long it took
var et1 = new Date().getTime() - processStart;
console.log('Processed ' + allGames.length + ' of ' + numGames +
    ' HTML files into JSON in ' + (et1 / 1000).toFixed(1) + ' sec');

library.writeJSONFile(allGames, library.bigDataDir() + 'allGamesHuman.json', 2);
library.writeJSONFile(allGames, library.bigDataDir() + 'allGames.json', null);

var compressGameData = function(gameData, includePlayerInfo) {
    var round1 = [],
        round2 = [];
    _.each(gameData.round1.clues, function (clue) {
        round1.push([
            (includePlayerInfo ? clue.rightAnswerBy : ((clue.rightAnswerBy.length === 0) ? 0 : 1)),
            (includePlayerInfo ? clue.wrongAnswersBy : clue.wrongAnswersBy.length),
            clue.round,
            clue.col,
            clue.row,
            clue.isDD ? 1 : 0,
            clue.value,
            clue.outOfOrder,
            clue.order]);
    });
    _.each(gameData.round2.clues, function (clue) {
        round2.push([
            (includePlayerInfo ? clue.rightAnswerBy : ((clue.rightAnswerBy.length === 0) ? 0 : 1)),
            (includePlayerInfo ? clue.wrongAnswersBy : clue.wrongAnswersBy.length),
            clue.round,
            clue.col,
            clue.row,
            clue.isDD ? 1 : 0,
            clue.value,
            clue.outOfOrder,
            clue.order]);
    });

    var rights = includePlayerInfo ? '' : 0;
    var wrongs = includePlayerInfo ? '' : 0;
    var finalJeopardy = gameData.finalJeopardy;
    if(finalJeopardy) {
        var rightsString = finalJeopardy.rights;
        if(rightsString) {
            rights = includePlayerInfo ? rightsString : rightsString.split(' ').length;
        }
        var wrongsString = finalJeopardy.wrongs;
        if(wrongsString) {
            wrongs = includePlayerInfo ? wrongsString : wrongsString.split(' ').length;
        }
    }

    var ret;
    if(includePlayerInfo) {
        ret = [gameData.seasonNumber,
               parseInt(gameData.gameId, 10),
               parseInt(gameData.gameNumber, 10),
               gameData.gameDate,
               gameData.contestants,
               round1,
               round2,
               [rights, wrongs]];
    } else {
        ret = [gameData.seasonNumber,
               parseInt(gameData.gameId, 10),
               parseInt(gameData.gameNumber, 10),
               gameData.gameDate,
               round1,
               round2,
               [rights, wrongs]];
    }
    return ret;

};

// Create a compact version of allGames.json 
var allGamesCompact = [];
var allGamesCompact2 = [];
_.each(allGames, function (gameData) {
    if (gameData.errorCount !== 0) {
        return;
    }
    allGamesCompact.push(compressGameData(gameData, false));
    allGamesCompact2.push(compressGameData(gameData, true));

});

library.writeJSONFile(allGamesCompact, library.dataDir() + 'allGamesCompact.json', null);
library.writeJSONFile(allGamesCompact2, library.dataDir() + 'allGamesCompact2.json', null);

