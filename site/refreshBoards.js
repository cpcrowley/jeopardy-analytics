"use strict"; 

var showTable = require('./showTable.js');
var fillBoards = require('./fillBoards.js');
var graphics = require('./graphics.js');
var dataStore = require('./dataStore.js');
var _ = require('lodash');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var fetchOptions = function (boardNumber) {
    var tts = document.getElementById('total-to-show-' + boardNumber);
    var ioo = document.getElementById('include-out-of-order-' + boardNumber);
    var idd = document.getElementById('include-daily-doubles-' + boardNumber);
    var wr = document.getElementById('which-rounds-' + boardNumber);
    var ps = document.getElementById('percent-select-' + boardNumber);
    var sc = document.getElementById('show-counts-' + boardNumber);

    return {
        totalToShow: tts.options[tts.selectedIndex].value,
        includeOutOfOrder: ioo.options[ioo.selectedIndex].value,
        includeDailyDoubles: idd.options[idd.selectedIndex].value,
        whichRounds: wr.options[wr.selectedIndex].value,
        percentSelect: ps.options[ps.selectedIndex].value,
        showCounts: sc.options[sc.selectedIndex].value
    };
};

//------------------------------------------------------------------------------
// The 0-index parts of the boards, rows and columns, are the totals.
// This functions add up internal nodes and fills in the 0-index totals cells.
//------------------------------------------------------------------------------
var computeBoardTotals = function (board) {
    if (board === null) {
        console.log('ERROR: computeBoardTotals, board is null');
        return;
    }

    var colTotals = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    var col;

    for (var row = 1; row < 6; ++row) {
        var total0 = 0;
        var total1 = 0;
        for (col = 1; col < 7; ++col) {
            var n0 = board[row][col][0];
            total0 += n0;
            colTotals[col][0] += n0;
            var n1 = board[row][col][1];
            total1 += n1;
            colTotals[col][1] += n1;
        }
        board[row][0][0] = total0;
        colTotals[0][0] += total0;
        board[row][0][1] = total1;
        colTotals[0][1] += total1;
    }

    for (col = 0; col < 7; ++col) {
        board[0][col][0] = colTotals[col][0];
        board[0][col][1] = colTotals[col][1];
    }
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var zeroOutBoard = function (board) {
    for (var irow = 0; irow < 6; ++irow) {
        var row = board[irow];
        for (var icol = 0; icol < 7; ++icol) {
            row[icol] = [0, 0];
        }
    }
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function () {

    // Reinitialize boards
    _.each(dataStore.boardRange, function (boardNumber) {
        var board = dataStore.boards()[boardNumber];
        board.options = fetchOptions(boardNumber);
        zeroOutBoard(board.board1);
        _.each(dataStore.yearRange, function (year) {
            zeroOutBoard(board.boardsByYear[year]);
        });
    });

    fillBoards();

    // Compute board totals
    _.each(dataStore.boardRange, function (boardNumber) {
        var board = dataStore.boards()[boardNumber];
        computeBoardTotals(board.board1);
        _.each(dataStore.yearRange, function (year) {
            computeBoardTotals(board.boardsByYear[year]);
        });
    });

    showTable();
    graphics('chartBy4', dataStore.boards(), 'Results for each of the four option boxes above');
};
