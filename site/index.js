/*global _, $, document, console */
/*jshint node:true, -W083 */
"use strict"; 

var ui = require('./ui.js');
var showTable = require('./showTable.js');
var reconstructGames = require('./reconstructGames.js');
var graphics = require('./graphics.js');
var fillInData = require('./fillInData.js');

// Just to avoid errors while converting to browserify
//var module = {};

var games = null;
var boards = null;
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

    fillInData.fillBoards(boards, games);

    // Compute board totals
    _.each(boardRange, function (boardNumber) {
        var board = boards[boardNumber];
        computeBoardTotals(board.board1);
        _.each(yearRange, function (year) {
            computeBoardTotals(board.boardsByYear[year]);
        });
    });

    showTable.showBoards(boards);
    graphics.chartBy4(boards);
};


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var showFinalJeopardy = function () {
    var fjDiv = $('#final-div');
    if(fjDiv.text().length > 0) {
        fjDiv.empty();
        return;
    }
    var rights = 0, wrongs = 0;
    var rightWrongByYear = {};
    _.each(yearRange, function (year) {
        rightWrongByYear[year] = [0,0];
    });
    
    _.each(games, function (gameData) {
        var finalData = gameData.finalData;
        var year = parseInt(gameData.gameDate.substring(0,4),10);
        rights += finalData.rights;
        wrongs += finalData.wrongs;
        rightWrongByYear[year][0] += finalData.rights;
        rightWrongByYear[year][1] += finalData.wrongs;
    });
    
    var divisor = rights + wrongs;
    if(divisor === 0) divisor = 1;
    fjDiv.html('Final Jeopardy: right=' + rights + ', wrong=' + wrongs +
               ' or <span class="stats-color-2">' + Math.round(100*rights/divisor) + '% right</span>');
    
    var rightWrongData = [];
    _.each(yearRange, function (year) {
        var rw = rightWrongByYear[year];
        var ratio = 0;
        var divisor = rw[0] + rw[1];
        if(divisor !== 0) ratio = Math.round(100*rw[0]/divisor);
        rightWrongData.push([year.toString(), ratio]);
    });
    graphics.chartFinal(rightWrongData);
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

    ui.setupUI(boards);

    $.getJSON('data/allGamesCompact.json', function (data) {
        games = reconstructGames.reconstructGames(data);

        console.log('games.slice(0,10)', games.slice(0, 10));

        refreshBoards();
    });
});

exports.yearRange = function(){return yearRange;};
exports.boardRange = function(){return boardRange;};
exports.showFinalJeopardy = showFinalJeopardy;
exports.refreshBoards = refreshBoards;
