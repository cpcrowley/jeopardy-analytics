/*jshint -W083 */
"use strict";

var charts = require('./charts.js');
var dataStore = require('./dataStore.js');
var refreshBoards = require('./refreshBoards.js');
var titleFromOptions = require('./titleFromOptions.js');
var _ = require('lodash');

var cb1, cb2, cb3, cb4, optionsBlock;

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
        '<div class="controls-titled-box">' +
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
        '</div>' +
        '<div class="controls-titled-box">' +
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
        '</div>' +
        '<div class="controls-titled-box">' +
        '<div class="controls-subtitle">What to show</div>' +
        makeSelectControlsBlock('percent-select', '%', makeOptionList([
            ["cell", "passed/cell total"],
            ["row", "passed/row total"],
            ["column", "passed/column total"],
            ["board", "passed/board total"]])) +
        '</div>' +
        '</div>');
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function () {
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
    
    // Hide the ones not initially visible
    if(!dataStore.getOption('showOptionsBlock1')) {cb1.hide();}
    if(!dataStore.getOption('showOptionsBlock2')) {cb2.hide();}
    if(!dataStore.getOption('showOptionsBlock3')) {cb3.hide();}
    if(!dataStore.getOption('showOptionsBlock4')) {cb4.hide();}

    //--------------------------------------------------------------------------
    // Put them all together
    //--------------------------------------------------------------------------
    optionsBlock = $('<div id="options-div"></div>').append(cb1, cb2, cb3, cb4);
    optionsBlock.find('select').on('change', refreshBoards);

    return optionsBlock;
};
