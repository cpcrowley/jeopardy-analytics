"use strict";

var charts = require('./charts.js');
var reconstructGames = require('./reconstructGames.js');
var refreshBoards = require('./refreshBoards.js');
var _ = require('lodash');

var games = null;
var boards = null;
var yearRange = _.range(1984, 2016);
var boardRange = _.range(1, 5);
var optionsList = [
    {key:'showOptionsBlock1', defaultValue: true},
    {key:'showOptionsBlock2', defaultValue: true},
    {key:'showOptionsBlock3', defaultValue: false},
    {key:'showOptionsBlock4', defaultValue: false},
    {key:'animationDelay', defaultValue: 500},
    {key:'showCounts', defaultValue: false},
    {key:'showTotals', defaultValue: false},
    {key:'showGameBoard', defaultValue: false},
    {key:'showGraph', defaultValue: true},
    {key:'showFinalJeopardy', defaultValue: false},
    {key:'showExamples', defaultValue: false},
    {key:'showHelp', defaultValue: false}
];
var options = {};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var getFinalJeopardyDiv = function () {
    var fjDiv = $('#final-div');
    if (fjDiv.text().length === 0) {
        var rights = 0,
            wrongs = 0;
        var rightWrongByYear = {};
        _.each(yearRange, function (year) {
            rightWrongByYear[year] = [0, 0];
        });

        _.each(games(), function (gameData) {
            var finalData = gameData.finalData;
            var year = parseInt(gameData.gameDate.substring(0, 4), 10);
            rights += finalData.rights;
            wrongs += finalData.wrongs;
            rightWrongByYear[year][0] += finalData.rights;
            rightWrongByYear[year][1] += finalData.wrongs;
        });

        var divisor = rights + wrongs;
        if (divisor === 0) divisor = 1;
        fjDiv.html('Final Jeopardy: right=' + rights + ', wrong=' + wrongs +
                   ' or <span class="stats-color-2">' + Math.round(100 * rights / divisor) +
                   '% right</span>');

        var rightWrongData = [];
        _.each(yearRange, function (year) {
            var rw = rightWrongByYear[year];
            var ratio = 0;
            var divisor = rw[0] + rw[1];
            if (divisor !== 0) ratio = Math.round(100 * rw[0] / divisor);
            rightWrongData.push([year.toString(), ratio]);
        });
        charts('chartFinal', rightWrongData, 'Final Jeopardy correct answers by year');
    }

    return fjDiv;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var getOption = function (optionName) {
    return options[optionName];
};
var setOption = function (optionName, newValue) {
    // Convert "true"/"false" string values to boolean values
    if(newValue==='true') newValue = true;
    else if(newValue==='false') newValue = false;
    
    // Set the option and save it in localStorage
    options[optionName] = newValue;
    localStorage[optionName] = newValue;
    
    // For some options we need to take some actions when they are set
    var div;
    switch(optionName) {
        case 'showGraph':
            div = $('#graph-div');
            if(div.length > 0) {
                div[newValue ? 'slideDown' : 'slideUp'](options.animationDelay);
            }
            break;
        case 'showGameBoard':
            div = $('#boardTable');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
            }
            break;
        case 'showFinalJeopardy':
            div = getFinalJeopardyDiv();
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
            }
            break;
        case 'showHelp':
            div = $('#helpDiv');
            if(div.length > 0) {
                div[newValue ? 'slideDown' : 'slideUp'](options.animationDelay);
            }
            break;
        case 'showOptionsBlock1':
            div = $('.controls-div-inline.stats-color-1');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
                refreshBoards();
            }
            break;
        case 'showOptionsBlock2':
            div = $('.controls-div-inline.stats-color-2');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
                refreshBoards();
            }
            break;
        case 'showOptionsBlock3':
            div = $('.controls-div-inline.stats-color-3');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
                refreshBoards();
            }
            break;
        case 'showOptionsBlock4':
            div = $('.controls-div-inline.stats-color-4');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
                refreshBoards();
            }
            break;
    }
};


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var getOptionsFromLocalStorage = function () {
    _.each(optionsList, function (optionListItem) {
        var key = optionListItem.key;
        var savedValue = localStorage[key];
        if(_.isUndefined(savedValue)) {
            savedValue = optionListItem.defaultValue;
        }
        setOption(key, savedValue);
    });
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
var init = function() {
    getOptionsFromLocalStorage();
    
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
exports.getOption = getOption;
exports.setOption = setOption;
exports.games = function(){return games;};
exports.boards = function(){return boards;};
exports.yearRange = yearRange;
exports.boardRange = boardRange;

