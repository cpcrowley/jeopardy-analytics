/* jshint node:true */
"use strict";

var _ = require('underscore');
var roundMatrix = require('./library.js');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createYearSummaries = function(gameSummaries) {
    var ys = [];
    for(var i=1984; i<2015; ++i) ys[i] = roundMatrix.createZeroedStats();

    _.each(gameSummaries, function(gameSummary){
        roundMatrix.addStats(ys[gameSummary.year], gameSummary);
    });
    return ys;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var findInClues = function(s, games) {
    var numClues = 0,
        hits = 0,
        ret = '';

    _.each(games, function(gameInfo) {
        var clues = [];
        if(gameInfo.round1) clues = clues.concat(gameInfo.round1.clues);
        if(gameInfo.round2) clues = clues.concat(gameInfo.round2.clues);

        _.each(clues, function(clue){
            ++numClues;
            if((clue.clueText.indexOf(s)>=0) || (clue.answer.indexOf(s)>=0)) {
                ret += gameInfo.title+': clue:'+clue.clueText+'<br/>\n';
                ++hits;
            }
        });
    });

    return '<h4>Found "' + s + '" in '+hits + ' of ' + numClues + ' clues</h4><br/>\n\n' + ret;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var playerResults = function(playerName, games, byround) {
    var numGames = games.length;
    var i;
    var numPlayerGames = 0;

    var n = playerName.indexOf(' ');
    if(n < 0) {
        n = playerName.length;
        console.log("ERROR: player name has no spaces: "+playerName);
    }
    var playerFirstName = playerName.substring(0,n);

    // Set up answers arrays
    var answers = createZeroedGame();

    for(var iGame = 0; iGame < numGames; ++iGame) {
        var gameInfo = games[iGame];

        var playerFound = false;
        for(i=0; i<gameInfo.contestants.length; ++i) {
            if(playerName == gameInfo.contestants[i]) {
                playerFound = true;
                break;
            }
        }

        if(!playerFound) continue;

        ++numPlayerGames;

        if(gameInfo.round1) {
            analyzeRound(answers, 0, 1984, gameInfo.round1.clues);
        }

        if(gameInfo.round2) {
            analyzeRound(answers, 1, 1984, gameInfo.round2.clues);
        }
    }

    return answers;
};

exports.createYearSummaries = createYearSummaries;
exports.findInClues = findInClues;
exports.playerResults = playerResults;
