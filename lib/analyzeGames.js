/* jshint node:true */
"use strict";

//------------------------------------------------------------------------------
// xxxx.
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
// Load the modules we will need
//------------------------------------------------------------------------------
var fs = require('fs'); // to write the html to a file
var _ = require('underscore'); // functional JavaScript library
var library = require('./library.js');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var summarizeAnswers = function (clue, answerMatrix) {
    var row = clue.row - 1;
    var numWrong = clue.wrongAnswersBy.length;

    if (clue.rightAnswerBy.length > 0) {
        switch (numWrong) {
        case 0:
            answerMatrix[row][4] += 1;
            break;
        case 1:
            answerMatrix[row][5] += 1;
            break;
        case 2:
            answerMatrix[row][6] += 1;
            break;
        }
    } else {
        switch (numWrong) {
        case 0:
            answerMatrix[row][0] += 1;
            break;
        case 1:
            answerMatrix[row][1] += 1;
            break;
        case 2:
            answerMatrix[row][2] += 1;
            break;
        case 3:
            answerMatrix[row][3] += 1;
            break;
        }
    }
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var summarizeRound = function (roundNumber, gameInfo, gameSummary) {
    var round = (roundNumber === 0) ? gameInfo.round1 : gameInfo.round2;
    if (!round) return false;

    var roundMatrices = gameSummary.rounds[roundNumber];
    _.each(round.clues, function (clue) {
        summarizeAnswers(clue, roundMatrices.all);
        if (clue.outOfOrder !== 0) summarizeAnswers(clue, roundMatrices.oo);
        if (clue.isDD) {
            summarizeAnswers(clue, roundMatrices.alldd);
            if (clue.outOfOrder !== 0) summarizeAnswers(clue, roundMatrices.oodd);
        }
    });
    return true;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var summarizeGames = function (games) {
    var numGames = games.length;
    var missingRounds = 'Missing: ';
    var gameSummaries = [];

    _.each(games, function (gameInfo) {
        var gameSummary = createZeroedGame();
        gameSummary.title = gameInfo.title;
        gameSummary.comments = gameInfo.comments;
        gameSummary.date = gameInfo.date;
        gameSummary.year = gameInfo.year;
        gameSummary.season = gameInfo.season;
        gameSummary.showNumber = gameInfo.showNumber;
        gameSummary.contestants = gameInfo.contestants;

        var validGame = true;
        if (!summarizeRound(0, gameInfo, gameSummary)) {
            missingRounds += ' 1:' + gameInfo.filename;
            validGame = false;
        }
        if (!summarizeRound(1, gameInfo, gameSummary)) {
            missingRounds += ' 2:' + gameInfo.filename;
            validGame = false;
        }
        
        if(validGame !== (gameInfo.errorCount === 0)) {
            console.log('ERROR: validGame=' + validGame + ' and errorCount=' +
                        gameInfo.errorCount, gameInfo);
        }

        if (validGame) {
            gameSummaries.push(gameSummary);
        }
    });
    if (missingRounds.length > 12) console.log(missingRounds);
    return gameSummaries;
};

//------------------------------------------------------------------------------
// Read in the database in JSON and convert it to internal data.
//------------------------------------------------------------------------------
var path = library.bigDataDir() + 'allGames.json';
var games = JSON.parse(fs.readFileSync(path).toString());

// Summarize the game data
var gameSummaries = summarizeGames(games);

library.writeJSONFile(gameSummaries, library.dataDir() + 'gameSummaries.json', null);
library.writeJSONFile(gameSummaries, library.bigDataDir() + 'gameSummariesHuman.json', 1);

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createZeroedGame = function () {
    return {
        // game information
        'title': '',
        'comments': '',
        'date': '',
        'year': 0,
        'season': 0,
        'showNumber': 0,
        'gameId': 0,
        'contestants': [],
        'rounds': library.createZeroedStats()
    };
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var dumpGame = function (title, g) {
    console.log(title, g);
    var r0 = g.rounds[0];
    var r1 = g.rounds[1];
    console.log('sj:all    :' + JSON.stringify(r0.all));
    console.log('dj:all    :' + JSON.stringify(r1.all));
    console.log('sj:alldd  :' + JSON.stringify(r0.alldd));
    console.log('dj:alldd  :' + JSON.stringify(r1.alldd));
    console.log('oosj:all  :' + JSON.stringify(r0.oo));
    console.log('oodj:all  :' + JSON.stringify(r1.oo));
    console.log('oosj:alldd:' + JSON.stringify(r0.oodd));
    console.log('oodj:alldd:' + JSON.stringify(r1.oodd));
};