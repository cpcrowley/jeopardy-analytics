/*jshint -W083 */
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
var makeSelectControlsBlock = function (bId, label, options) {
    var mainDivClass = 'controls-block';
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
var makeControlsBlockTemplate = function () {
    var mainDivClass = 'controls-div-inline';
    return _.template(
        '<div class="' + mainDivClass + ' stats-color-<%= cbId %>">' +
        '<span class="controls-title"><%= cbId %>:</span>' +
        '<button type="button" class="btn btn-default btn-sm graph-button">Graph by Year</button>' +
        makeSelectControlsBlock('number-right', '# correct', makeOptionList([
            ["doNotShow", "Do not show"],
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
        makeSelectControlsBlock('include-daily-doubles', 'Daily doubles', makeOptionList([
            ["dontcare", "Don't care"],
            ["exclude", "No (exclude)"],
            ["only", "Yes (only)"]])) +
        makeSelectControlsBlock('include-out-of-order', 'Out of order', makeOptionList([
            ["dontcare", "Don't care"],
            ["first-only", "First OO only"],
            ["any-only", "Yes (only)"]])) +
        makeSelectControlsBlock('which-rounds', 'Rounds', makeOptionList([
            ["dontcare", "Don't care"],
            ["single", "Jeopardy"],
            ["double", "Double Jeopardy"]])) +
        makeSelectControlsBlock('percent-select', '%', makeOptionList([
            ["cell", "passed/cell total"],
            ["row", "passed/row total"],
            ["column", "passed/column total"],
            ["board", "passed/board total"]])) +
        makeSelectControlsBlock('show-counts', 'Counts', makeOptionList([
            ["none", "None"],
            ["count", "count only"],
            ["fraction", "count/total"]])) +
        '</div>');
};

module.exports = function () {
    
    var controlBlockHtmlTemplate = makeControlsBlockTemplate();

    var cb1 = $(controlBlockHtmlTemplate({cbId: '1'}));
    cb1.find('select:eq(0)')[0].selectedIndex = 3;
    cb1.find('select:eq(4)')[0].selectedIndex = 1;
    cb1.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[1];
        charts('chartByYear', board.boardsByYear, '1: ' + titleFromOptions(board.options));
    });

    var cb2 = $(controlBlockHtmlTemplate({cbId: '2'}));
    cb2.find('select:eq(0)')[0].selectedIndex = 3;
    cb2.find('select:eq(4)')[0].selectedIndex = 2;
    cb2.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[2];
        charts('chartByYear', board.boardsByYear, '2: ' + titleFromOptions(board.options));
    });

    var cb3 = $(controlBlockHtmlTemplate({cbId: '3'}));
    cb3.find('select:eq(0)')[0].selectedIndex = 3;
    cb3.find('select:eq(3)')[0].selectedIndex = 2;
    cb3.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[3];
        charts('chartByYear', board.boardsByYear, '3: ' + titleFromOptions(board.options));
    });

    var cb4 = $(controlBlockHtmlTemplate({cbId: '4'}));
    cb4.find('select:eq(0)')[0].selectedIndex = 3;
    cb4.find('select:eq(2)')[0].selectedIndex = 2;
    cb4.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[4];
        charts('chartByYear', board.boardsByYear, '4: ' + titleFromOptions(board.options));
    });

    var cb5 = $(controlBlockHtmlTemplate({cbId: 'Reset'}));
    cb5.find('.graph-button').remove();
    
    _.each([0, 1, 2, 3, 4, 5, 6], function (index) {
        var selector = 'select:eq(' + index + ')';
        cb5.find(selector).on('change', function () {
            //console.log('index='+index+' selector='+selector);
            var selectedIndex = this.selectedIndex;
            cb1.find(selector)[0].selectedIndex = selectedIndex;
            cb2.find(selector)[0].selectedIndex = selectedIndex;
            cb3.find(selector)[0].selectedIndex = selectedIndex;
            cb4.find(selector)[0].selectedIndex = selectedIndex;
        });
    });

    var optionsBlock = $('<div id="options-div"></div>').append(cb1, cb2, cb3, cb4, cb5);

    optionsBlock.find('select').on('change', refreshBoards);
    
    return optionsBlock;

};
