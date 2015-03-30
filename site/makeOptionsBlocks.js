"use strict";

var charts = require('./charts.js');
var dataStore = require('./dataStore.js');
var refreshBoards = require('./refreshBoards.js');
var titleFromOptions = require('./titleFromOptions.js');
var _ = require('lodash');

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
var makeSelectControlsBlock = function (wide, bId, label, options) {
    var mainDivClass = 'controls-block';
    if (wide === 'wide') {
        mainDivClass = 'controls-block-inline';
    }
    var s =
        '<div class="' + mainDivClass + '">' +
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
var makeControlsBlockTemplate = function (wide) {
    var mainDivClass = 'controls-div-inline';
    if (wide === 'wide') {
        mainDivClass = 'controls-div';
    }
    return _.template(
        '<div class="' + mainDivClass + ' stats-color-<%= cbId %>">' +
        '<span class="controls-title"><%= cbId %>:</span>' +
        '<button type="button" class="btn btn-default btn-sm graph-button">Graph by Year</button>' +
        makeSelectControlsBlock(wide, 'total-to-show', 'Show', makeOptionList([
            ["none", "None"],
            ["total", "total only"],
            ["1-any", "right:1 wrong:any"],
            ["1-0", "right:1 wrong:0"],
            ["1-1", "right:1 wrong:1"],
            ["1-2", "right:1 wrong:2"],
            ["0-any", "right:0 wrong:any"],
            ["0-0", "right:0 wrong:0"],
            ["0-1", "right:0 wrong:1"],
            ["0-2", "right:0 wrong:2"],
            ["0-3", "right:0 wrong:3"]])) +
        makeSelectControlsBlock(wide, 'include-daily-doubles', 'Daily doubles', makeOptionList([
            ["include", "Include"],
            ["exclude", "Exclude"],
            ["only", "Only"]])) +
        makeSelectControlsBlock(wide, 'include-out-of-order', 'Out of order', makeOptionList([
            ["include", "Include"],
            ["first-only", "First OO only"],
            ["any-only", "Any OO only"]])) +
        makeSelectControlsBlock(wide, 'which-rounds', 'Rounds', makeOptionList([
            ["both", "Both"],
            ["single", "Jeopardy only"],
            ["double", "Double only"]])) +
        makeSelectControlsBlock(wide, 'percent-select', '%', makeOptionList([
            ["cell", "By cell"],
            ["row", "By row"],
            ["column", "By column"],
            ["board", "By board"]])) +
        makeSelectControlsBlock(wide, 'show-counts', 'Counts', makeOptionList([
            ["none", "None"],
            ["count", "count only"],
            ["fraction", "count/total"]])) +
        '</div>');
};

module.exports = function () {
    
    var controlBlockHtmlTemplate = makeControlsBlockTemplate('square');
    var defaultShowIndex = 2; // right:1 wrong:any

    var cb1 = $(controlBlockHtmlTemplate({
        cbId: '1'
    }));
    cb1.find('select:eq(0)')[0].selectedIndex = defaultShowIndex;
    cb1.find('select:eq(1)')[0].selectedIndex = 0;
    cb1.find('select:eq(2)')[0].selectedIndex = 0;
    cb1.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[1];
        charts('chartByYear', board.boardsByYear, '1: ' + titleFromOptions(board.options));
    });

    var cb2 = $(controlBlockHtmlTemplate({
        cbId: '2'
    }));
    cb2.find('select:eq(0)')[0].selectedIndex = defaultShowIndex;
    cb2.find('select:eq(1)')[0].selectedIndex = 1;
    cb2.find('select:eq(2)')[0].selectedIndex = 0;
    cb2.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[2];
        charts('chartByYear', board.boardsByYear, '2: ' + titleFromOptions(board.options));
    });

    var cb3 = $(controlBlockHtmlTemplate({
        cbId: '3'
    }));
    cb3.find('select:eq(0)')[0].selectedIndex = defaultShowIndex;
    cb3.find('select:eq(1)')[0].selectedIndex = 2;
    cb3.find('select:eq(2)')[0].selectedIndex = 0;
    cb3.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[3];
        charts('chartByYear', board.boardsByYear, '3: ' + titleFromOptions(board.options));
    });

    var cb4 = $(controlBlockHtmlTemplate({
        cbId: '4'
    }));
    cb4.find('select:eq(0)')[0].selectedIndex = defaultShowIndex;
    cb4.find('select:eq(1)')[0].selectedIndex = 0;
    cb4.find('select:eq(2)')[0].selectedIndex = 2;
    cb4.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[4];
        charts('chartByYear', board.boardsByYear, '4: ' + titleFromOptions(board.options));
    });

    var optionsBlock = $('<div id="options-div"></div>').append(cb1, cb2, cb3, cb4);

    optionsBlock.find('select').on('change', refreshBoards);
    
    return optionsBlock;

};
