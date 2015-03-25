/*global  _ */
/*jshint node:true, -W083 */
"use strict";
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

        var increment_count = 1;
        var increment_total = 1;

        // Check the daily double conditions
        if (clue.isDD) {
            switch (board.options.includeDailyDoubles) {
            case 'include':
                break;
            case 'exclude':
                increment_count = 0;
                increment_total = 0;
                break;
            case 'only':
                break;
            }
        } else {
            switch (board.options.includeDailyDoubles) {
            case 'include':
                break;
            case 'exclude':
                break;
            case 'only':
                increment_count = 0;
                increment_total = 0;
                break;
            }
        }

        // Check the out-of-order conditions
        if (increment_count === 1) {
            if (clue.outOfOrder) {
                switch (board.options.includeOutOfOrder) {
                case 'include':
                    break;
                case 'first-only':
                    break;
                case 'any-only':
                    break;
                }
            } else {
                switch (board.options.includeOutOfOrder) {
                case 'include':
                    break;
                case 'first-only':
                    increment_count = 0;
                    increment_total = 0;
                    break;
                case 'any-only':
                    increment_count = 0;
                    increment_total = 0;
                    break;
                }
            }
        }

        // Check the total to show conditions.
        if (increment_count === 1) {
            increment_count = 0;
            switch (board.options.totalToShow) {
            case '1-any':
                if (clue.rightAnswer === 1) increment_count = 1;
                break;
            case '1-0':
                if (clue.rightAnswer === 1 && clue.wrongAnswers === 0) increment_count = 1;
                break;
            case '1-1':
                if (clue.rightAnswer === 1 && clue.wrongAnswers === 1) increment_count = 1;
                break;
            case '1-2':
                if (clue.rightAnswer === 1 && clue.wrongAnswers === 2) increment_count = 1;
                break;

            case '0-any':
                if (clue.rightAnswer === 0) increment_count = 1;
                break;
            case '0-0':
                if (clue.rightAnswer === 0 && clue.wrongAnswers === 0) increment_count = 1;
                break;
            case '0-1':
                if (clue.rightAnswer === 0 && clue.wrongAnswers === 1) increment_count = 1;
                break;
            case '0-2':
                if (clue.rightAnswer === 0 && clue.wrongAnswers === 2) increment_count = 1;
                break;
            case '0-3':
                if (clue.rightAnswer === 0 && clue.wrongAnswers === 3) increment_count = 1;
                break;
            }
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
var fillBoards = function (boards, games) {

    for (var boardNumber = 1; boardNumber < boards.length; ++boardNumber) {
        var board = boards[boardNumber];

        if (board.options.totalToShow === 'none') {
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

module.exports = fillBoards;