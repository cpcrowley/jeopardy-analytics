"use strict"; 

var reconstructGames = require('./reconstructGames.js');
var refreshBoards = require('./refreshBoards.js');
var _ = require('lodash');

var games = null;
var boards = null;
var yearRange = _.range(1984, 2016);
var boardRange = _.range(1, 5);

//------------------------------------------------------------------------------
// This board holds basic infomation about a set of games.
// This creates initial zeroed-out versions of the boards.
//------------------------------------------------------------------------------
var createZeroedRow = function () {
    var row = [];
    for (var i = 0; i < 7; ++i) {
        row[i] = [0, 0];
    }
    return row;
};
var createZeroedBoard = function () {
    var board = [];
    for (var i = 0; i < 6; ++i) {
        board[i] = createZeroedRow();
    }
    return board;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var init = function() {
    // Initialize boards
    boards = [null]; // boards[0] is never used. Subscripts work out better that way.
    _.each(boardRange, function (boardNumber) {
        var board = {
            boardNumber: boardNumber,
            options: null,
            board1: createZeroedBoard()
        };
        var boardsByYear = {};
        _.each(yearRange, function (year) {
            boardsByYear[year] = createZeroedBoard();
        });
        board.boardsByYear = boardsByYear;
        boards.push(board);
    });

    $.getJSON('data/allGamesCompact.json', function (jsonData) {
        games = reconstructGames(jsonData);

        console.log('games.slice(0,10)', games.slice(0, 10));

        refreshBoards(boards, games);
    });
};

//------------------------------------------------------------------------------
// This doesn't go here but I'm not sure where to put it.
//------------------------------------------------------------------------------
var titleFromOptions = function (options) {
    var title = '';
    switch (options.percentSelect) {
        case "cell":
            title += "%";
            break;
        case "row":
            title += "% (based on row)";
            break;
        case "column":
            title += "% (based on column)";
            break;
        case "board":
            title += "% (board on whole board)";
            break;
    }
    title += ' ';
    switch (options.totalToShow) {
        case "none":
            title += "None";
            break;
        case "total":
            title += "Total";
            break;
        case "1-any":
            title += "Answered correctly";
            break;
        case "1-0":
            title += "Answered correctly (none wrong)";
            break;
        case "1-1":
            title += "Answered correctly (+1 wrong)";
            break;
        case "1-2":
            title += "Answered correctly (+2 wrong)";
            break;
        case "0-any":
            title += "No correct answer";
            break;
        case "0-0":
            title += "No answers at all";
            break;
        case "0-1":
            title += "1 wrong answer";
            break;
        case "0-2":
            title += "2 wrong answers";
            break;
        case "03":
            title += "3 wrong answers";
            break;
    }
    title += ', ';
    switch (options.whichRounds) {
        case "both":
            title += "includes both rounds";
            break;
        case "single":
            title += "Jeopardy round ONLY";
            break;
        case "double":
            title += "Double Jeopardy round ONLY";
            break;
    }
    switch (options.includeDailyDoubles) {
        case "include":
            title += "";
            break;
        case "exclude":
            title += ", excluding Daily Doubles";
            break;
        case "only":
            title += ", Daily Doubles ONLY";
            break;
    }
    switch (options.includeOutOfOrder) {
        case "include":
            title += "";
            break;
        case "first-only":
            title += ", first out-of-order answers ONLY";
            break;
        case "any-only":
            title += ", out-of-order answers ONLY";
            break;
    }
    return title;
};


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
exports.titleFromOptions = titleFromOptions;
exports.init = init;
exports.games = function(){return games;};
exports.boards = function(){return boards;};
exports.yearRange = yearRange;
exports.boardRange = boardRange;

