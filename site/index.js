/*global _, $, document, console */
/*global fillBoards, showBoards, recontructGames, setupUI */
/*jshint node:true, -W083 */
"use strict";

var games = null;
var boards = null;
var boardTable = null;
var yearRange = _.range(1984, 2016);
var boardRange = _.range(1, 5);

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

    for (var col = 0; col < 7; ++col) {
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
var refreshBoards = function () {

    // Reinitialize boards
    _.each(boardRange, function (boardNumber) {
        var board = boards[boardNumber];
        board.options = fetchOptions(boardNumber);
        zeroOutBoard(board.board1);
        _.each(yearRange, function (year) {
            zeroOutBoard(board.boardsByYear[year]);
        });
    });
    //console.log('refreshBoards: boards', boards);

    fillBoards(boards, games);

    // Compute board totals
    _.each(boardRange, function (boardNumber) {
        var board = boards[boardNumber];
        computeBoardTotals(board.board1);
        _.each(yearRange, function (year) {
            computeBoardTotals(board.boardsByYear[year]);
        });
    });

    showBoards(boards, boardTable);
};


//------------------------------------------------------------------------------
// Create the HTML for the main display board.
//------------------------------------------------------------------------------
var createBoardTableHtml = function () {
    var topTitles = ['', 'Totals', 'Category 1', 'Category 2', 'Category 3',
                     'Category 4', 'Category 5', 'Category 6'];
    var leftTitles = ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600',
                      '$1000/$2000', 'Totals'];

    var numCols = topTitles.length;
    var row, col;
    var html = '<table class="table table-bordered">';
    html += '<thead><tr>';
    for (col = 0; col < numCols; ++col) {
        html += '<th>' + topTitles[col] + '</th>';
    }
    html += '</tr></thead>';

    html += '<tbody>';
    var numRows = leftTitles.length;
    for (row = 0; row < numRows; ++row) {
        html += '<tr>';
        html += '<th>' + leftTitles[row] + '</th>';
        for (col = 1; col < numCols; ++col) {
            html += '<td></td>';
        }
        html += '</tr>';
    }
    html += '</tbody>';

    html += '</table>';
    return html;
};

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
$(document).ready(function () {
    var html = createBoardTableHtml();
    boardTable = $(html);
    $('#table-div').append(boardTable);

    // Initialize boards
    boards = [null]; // boards[0] is never used. Subscripts work out better this way,
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

    setupUI(boards);

    $.getJSON('data/allGamesCompact.json', function (data) {
        games = recontructGames(data);

        console.log('games.slice(0,10)', games.slice(0, 10));

        refreshBoards();
    });
});