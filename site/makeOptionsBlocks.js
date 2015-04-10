/*jshint -W083 */
"use strict";

var charts = require('./charts.js');
var dataStore = require('./dataStore.js');
var refreshBoards = require('./refreshBoards.js');
var titleFromOptions = require('./titleFromOptions.js');
var _ = require('lodash');

var cb0, cb1, cb2, cb3, cb4, optionsBlock;

var animationDelay = 500;

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeOptionList = function (items) {
    var s = '';
    _.each(items, function (item) {
        s += '<option value="' + item[0] + '">' + item[1] + '</option>';
    });
    return s;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeSelectControlsBlock = function (bId, label, options) {
    var s =
        '<div class="controls-block">' +
        '<label for="' + bId + '-<%= cbId %>">' + label + '</label>' +
        '<select id="' + bId + '-<%= cbId %>" class="stats-color-<%= cbId %> form-control">' +
        options +
        '</select>' +
        '</div>';
    return s;
};

//------------------------------------------------------------------------------
// wide==='wide' means all the controls are in a long line.
// Otherwise there is one label-control per line so the box is roughly square.
//------------------------------------------------------------------------------
var makeControlsBlockTemplate = function () {
    return _.template(
        '<div class="controls-div-inline stats-color-<%= cbId %>">' +
        '<span class="controls-title"><%= cbId %>:</span>' +
        '<button type="button" class="btn btn-default btn-sm graph-button">Graph by Year</button>' +
        makeSelectControlsBlock('show-filter', 'Show this filter?', makeOptionList([
            ["show", "Yes"],
            ["doNotShow", "No"]])) +
        '<div class="controls-subtitle">Clues to include</div>' +
        makeSelectControlsBlock('include-daily-doubles', 'Daily doubles', makeOptionList([
            ["dontcare", "Include all"],
            ["exclude", "No (exclude)"],
            ["only", "Yes (only)"]])) +
        makeSelectControlsBlock('include-out-of-order', 'Out of order', makeOptionList([
            ["dontcare", "Yes"],
            ["first-only", "First OO only"],
            ["any-only", "Only"]])) +
        makeSelectControlsBlock('which-rounds', 'Rounds', makeOptionList([
            ["dontcare", "Both rounds"],
            ["single", "Jeopardy"],
            ["double", "Double Jeopardy"]])) +
        '<div class="controls-subtitle">What to count</div>' +
        makeSelectControlsBlock('number-right', '# correct', makeOptionList([
            ["any", "Any"],
            ["0", "0"],
            ["1", "1"]])) +
        makeSelectControlsBlock('number-wrong', '# wrong', makeOptionList([
            ["any", "Any"],
            ["1-3", "1-3"],
            ["0", "0"],
            ["1", "1"],
            ["2", "2"],
            ["3", "3"]])) +
        '<div class="controls-subtitle">What to show</div>' +
        makeSelectControlsBlock('percent-select', '%', makeOptionList([
            ["cell", "passed/cell total"],
            ["row", "passed/row total"],
            ["column", "passed/column total"],
            ["board", "passed/board total"]])) +
        '</div>');
};

var cb0;

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeCheckboxBlock = function (elementId, label, clickHandler) {
    var cbb = $('<div class="controls-block-inline">' +
                '<input type="checkbox" id="' + elementId + '"/>' +
                '<label for="' + elementId + '">' + label + '</label>' +
                '</div>');
    cbb.find('input')
    .on('click', clickHandler)
    .prop('checked',  dataStore.getOption(elementId));
    return cbb;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeOverallControlsBlock = function () {
    cb0 = $('<div id="controls-overall" class="stats-color-Reset">Show: </div>');
    cb0.append(makeCheckboxBlock('showCounts', 'Counts', function () {
        dataStore.setOption('showCounts', this.checked);
        refreshBoards();
    }));
    cb0.append(makeCheckboxBlock('showTotals', 'Totals', function () {
        dataStore.setOption('showTotals', this.checked);
        refreshBoards();
    }));
    cb0.append(makeCheckboxBlock('showOptions', 'Options', function () {
        var optionsDiv = $('#options-div');
        //console.log('showOptions', this, this.checked, optionsDiv[0]);
        $('#options-div')[this.checked ? 'slideDown' : 'slideUp'](animationDelay);
        dataStore.setOption('showOptions', this.checked);
    }));
    cb0.append(makeCheckboxBlock('showSummary', 'Summary', function () {
        $('#summary-table')[this.checked ? 'slideDown' : 'slideUp'](animationDelay);
        dataStore.setOption('showSummary', this.checked);
    }));
    cb0.append(makeCheckboxBlock('showLegend', 'Legend', function () {
        $('#legend-div')[this.checked ? 'slideDown' : 'slideUp'](animationDelay);
        dataStore.setOption('showLegend', this.checked);
    }));
    cb0.append(makeCheckboxBlock('showGameBoard', 'Game Board', function () {
        $('#boardTable')[this.checked ? 'show' : 'hide'](animationDelay);
        dataStore.setOption('showGameBoard', this.checked);
    }));
    cb0.append(makeCheckboxBlock('showGraph', 'Graph', function () {
        $('#graph-div')[this.checked ? 'slideDown' : 'slideUp'](animationDelay);
        dataStore.setOption('showGraph', this.checked);
    }));
    cb0.append(makeCheckboxBlock('showFinalJeopardy', 'Final Jeopardy', function () {
        getFinalJeopardyDiv()[this.checked ? 'show' : 'hide'](animationDelay);
        dataStore.setOption('showFinalJeopardy', this.checked);
    }));
    cb0.append(makeCheckboxBlock('showHelp', 'Help', function () {
        $('#helpDiv')[this.checked ? 'slideDown' : 'slideUp'](animationDelay);
        dataStore.setOption('showHelp', this.checked);
    }));
    
    return cb0;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var getFinalJeopardyDiv = function () {
    var fjDiv = $('#final-div');
    if (fjDiv.text().length === 0) {
        var rights = 0,
            wrongs = 0;
        var rightWrongByYear = {};
        _.each(dataStore.yearRange, function (year) {
            rightWrongByYear[year] = [0, 0];
        });

        _.each(dataStore.games(), function (gameData) {
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
                   ' or <span class="stats-color-2">' + Math.round(100 * rights / divisor) + '% right</span>');

        var rightWrongData = [];
        _.each(dataStore.yearRange, function (year) {
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
var handleCheckboxClick = function () {
    return function () {
        
    };
};

module.exports = function () {
    
    //--------------------------------------------------------------------------
    // Make top control block
    //--------------------------------------------------------------------------
    cb0 = makeOverallControlsBlock();
    
    //--------------------------------------------------------------------------
    // Make the 4 options blocks
    //--------------------------------------------------------------------------
    var controlBlockHtmlTemplate = makeControlsBlockTemplate();

    cb1 = $(controlBlockHtmlTemplate({cbId: '1'}));
    cb1.find('select:eq(0)')[0].selectedIndex = 3;
    cb1.find('select:eq(4)')[0].selectedIndex = 1;
    cb1.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[1];
        charts('chartByYear', board.boardsByYear, '1: ' + titleFromOptions(board.options));
    });

    cb2 = $(controlBlockHtmlTemplate({cbId: '2'}));
    cb2.find('select:eq(0)')[0].selectedIndex = 3;
    cb2.find('select:eq(4)')[0].selectedIndex = 2;
    cb2.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[2];
        charts('chartByYear', board.boardsByYear, '2: ' + titleFromOptions(board.options));
    });

    cb3 = $(controlBlockHtmlTemplate({cbId: '3'}));
    cb3.find('select:eq(0)')[0].selectedIndex = 3;
    cb3.find('select:eq(3)')[0].selectedIndex = 2;
    cb3.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[3];
        charts('chartByYear', board.boardsByYear, '3: ' + titleFromOptions(board.options));
    });

    cb4 = $(controlBlockHtmlTemplate({cbId: '4'}));
    cb4.find('select:eq(0)')[0].selectedIndex = 3;
    cb4.find('select:eq(2)')[0].selectedIndex = 2;
    cb4.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[4];
        charts('chartByYear', board.boardsByYear, '4: ' + titleFromOptions(board.options));
    });

    //--------------------------------------------------------------------------
    // Put them all together
    //--------------------------------------------------------------------------
    optionsBlock = $('<div id="options-div"></div>').append(cb1, cb2, cb3, cb4);
    var allOptionsDiv = $('<div id="all-options-div"></div>').append(cb0, optionsBlock);
    allOptionsDiv.find('select').on('change', refreshBoards);

    
    return allOptionsDiv;

};

//--------------------------------------------------------------------------
// Make the reset block
//--------------------------------------------------------------------------
/*cb5 = $(controlBlockHtmlTemplate({cbId: 'Reset'}));
    cb5.find('.graph-button').remove();

    _.each([0, 1, 2, 3, 4, 5, 6], function (index) {
        var selector = 'select:eq(' + index + ')';
        cb5.find(selector).on('change', function () {
            var selectedIndex = this.selectedIndex;
            cb1.find(selector)[0].selectedIndex = selectedIndex;
            cb2.find(selector)[0].selectedIndex = selectedIndex;
            cb3.find(selector)[0].selectedIndex = selectedIndex;
            cb4.find(selector)[0].selectedIndex = selectedIndex;
            refreshBoards();
        });
    });*/
