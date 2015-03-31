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

        refreshBoards();
    });
};


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
exports.init = init;
exports.games = function(){return games;};
exports.boards = function(){return boards;};
exports.yearRange = yearRange;
exports.boardRange = boardRange;

