/*jshint -W083 */
"use strict";

var dataStore = require('./dataStore.js');
var _ = require('lodash');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function fillRound(roundNumber, board, gameData) {
    var clues = gameData['round' + roundNumber].clues;

    var board1 = board.board1;
    var year = parseInt(gameData.gameDate.substring(0, 4), 10);
    var board2 = board.boardsByYear[year];

    _.each(clues, function (clue) {

        // Get the cell values array to use.
        var cell1 = board1[clue.row][clue.col];
        var cell2 = board2[clue.row][clue.col];

        // Start out assuming this clue will be counted.
        var increment_count = 1;
        var increment_total = 1;

        switch(board.options.includeDailyDoubles) {
            case 'dontcare':
                break;
            case 'exclude':
                if (clue.isDD) {
                    increment_count = 0;
                    increment_total = 0;
                }
                break;
            case 'only':
                if (!clue.isDD) {
                    increment_count = 0;
                    increment_total = 0;
                }
                break;
        }

        switch(board.options.includeOutOfOrder) {
            case 'dontcare':
                break;
            case 'any-only':
                if(clue.outOfOrder > 0) {
                    increment_count = 0;
                    increment_total = 0;
                }
                break;
            case 'first-only':
                if(clue.outOfOrder !== 2) {
                    increment_count = 0;
                    increment_total = 0;
                }
                break;
        }

        switch(board.options.numberRight) {
            case 'any':
                break;
            case '0':
                if(clue.rightAnswer !== 0) {
                    increment_count = 0;
                    //increment_total = 0;
                }
                break;
            case '1':
                if(clue.rightAnswer !== 1) {
                    increment_count = 0;
                    //increment_total = 0;
                }
                break;
        }
        
        switch(board.options.numberWrong) {
            case 'any':
                break;
            case '1-3':
                if(clue.wrongAnswers === 0) {
                    increment_count = 0;
                    //increment_total = 0;
                }
                break;
            case '0':
                if(clue.wrongAnswers !== 0) {
                    increment_count = 0;
                    //increment_total = 0;
                }
                break;
            case '1':
                if(clue.wrongAnswers !== 1) {
                    increment_count = 0;
                    //increment_total = 0;
                }
                break;
            case '2':
                if(clue.wrongAnswers !== 2) {
                    increment_count = 0;
                    //increment_total = 0;
                }
                break;
            case '3':
                if(clue.wrongAnswers !== 3) {
                    increment_count = 0;
                    //increment_total = 0;
                }
                break;
        }

        if (increment_count) {
            cell1[1] += 1;
            cell2[1] += 1;
        }
        if (increment_total) {
            cell1[0] += 1;
            cell2[0] += 1;
        }
    });
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function () {

    var boards = dataStore.boards();
    var games = dataStore.games();
    for (var boardNumber = 1; boardNumber < boards.length; ++boardNumber) {
        var board = boards[boardNumber];

        if (!dataStore.getOption('showOptionsBlock'+boardNumber)) {
            break;
        }

        var whichRounds = board.options.whichRounds;
        _.each(games, function (gameData) {
            if (whichRounds !== 'double') {
                fillRound(1, board, gameData);
            }
            if (whichRounds !== 'single') {
                fillRound(2, board, gameData);
            }
        });
    }
};
