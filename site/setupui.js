"use strict";

var graphics = require('./graphics.js');
var refreshBoards = require('./refreshBoards.js');
var dataStore = require('./dataStore.js');
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

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createTableHtml = function (tableId, topTitles, leftTitles) {
    var numCols = topTitles.length;
    var row, col;
    var html = '<table id="' + tableId + '" class="table table-bordered">';
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
//------------------------------------------------------------------------------
var showFinalJeopardy = function () {
    var fjDiv = $('#final-div');
    if (fjDiv.text().length > 0) {
        fjDiv.empty();
        return;
    }
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
    graphics('chartFinal', rightWrongData, 'Final Jeopardy correct answers by year');
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function () {
    var container = $('<div class="container-fluid"></div>')
        .appendTo('body');

    // Add title and buttons
    var title = $('<h1>Jeopardy Analytics</h1>')
        .appendTo(container);

    $('<button type="button" class="btn btn-primary graph-button">Refresh</button>')
        .on('click', refreshBoards)
        .appendTo(title);
    $('<button type="button" class="btn btn-primary graph-button">Final Jeopardy</button>')
        .on('click', function () {
            showFinalJeopardy();
        })
        .appendTo(title);


    var $helpDiv = $('<div class="well well-sm">No help yet</div>')
        .click(function () {
            $helpToggle.click();
        })
        .appendTo(container)
        .hide();

    var $helpToggle = $('<button type="button" class="btn btn-primary graph-button">Help</button>')
        .click(function () {
            var newLinkText;
            if ($helpDiv.is(':visible')) {
                $helpDiv.hide('normal');
                newLinkText = 'Show Help';
            } else {
                $helpDiv.show('normal');
                newLinkText = 'Hide Help';
            }
            $helpToggle.text(newLinkText);
        })
        .appendTo(title);

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
        graphics('chartByYear', board.boardsByYear, '1: ' + dataStore.titleFromOptions(board.options));
    });

    var cb2 = $(controlBlockHtmlTemplate({
        cbId: '2'
    }));
    cb2.find('select:eq(0)')[0].selectedIndex = defaultShowIndex;
    cb2.find('select:eq(1)')[0].selectedIndex = 1;
    cb2.find('select:eq(2)')[0].selectedIndex = 0;
    cb2.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[2];
        graphics('chartByYear', board.boardsByYear, '2: ' + dataStore.titleFromOptions(board.options));
    });

    var cb3 = $(controlBlockHtmlTemplate({
        cbId: '3'
    }));
    cb3.find('select:eq(0)')[0].selectedIndex = defaultShowIndex;
    cb3.find('select:eq(1)')[0].selectedIndex = 2;
    cb3.find('select:eq(2)')[0].selectedIndex = 0;
    cb3.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[3];
        graphics('chartByYear', board.boardsByYear, '3: ' + dataStore.titleFromOptions(board.options));
    });

    var cb4 = $(controlBlockHtmlTemplate({
        cbId: '4'
    }));
    cb4.find('select:eq(0)')[0].selectedIndex = defaultShowIndex;
    cb4.find('select:eq(1)')[0].selectedIndex = 0;
    cb4.find('select:eq(2)')[0].selectedIndex = 2;
    cb4.find('.graph-button').on('click', function () {
        var board = dataStore.boards()[4];
        graphics('chartByYear', board.boardsByYear, '4: ' + dataStore.titleFromOptions(board.options));
    });

    $('<div id="options-div"></div>')
        .append(cb1, cb2, cb3, cb4)
        .appendTo(container);

    // Add in the blocks we need
    $(createTableHtml('summaryTable',
                      ['', '$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Totals'],
                      ['Totals']))
        .appendTo(container);

    container.append('<div id="legend-div"></div>');

    container.append('<div id="final-div"></div>');

    container.append('<div id="graph-div"></div>');

    $('<button type="button" class="btn btn-primary graph-button">Show Game Board</button>')
        .on('click', function () {
            var boardTable = $('#boardTable');
            var newText;
            if (boardTable.is(':visible')) {
                boardTable.hide(400);
                newText = 'Show Game Board';
            } else {
                boardTable.show(400);
                newText = 'Hide Game Board';
            }
            $(this).text(newText);
        })
        .appendTo(container);

    $('<button type="button" class="btn btn-primary graph-button">Hide Graph</button>')
        .on('click', function () {
            var graphDiv = $('#graph-div');
            var newText;
            if (graphDiv.is(':visible')) {
                graphDiv.hide(400);
                newText = 'Show Graph';
            } else {
                graphDiv.show(400);
                newText = 'Hide Graph';
            }
            $(this).text(newText);
        })
        .appendTo(container);

    $(createTableHtml('boardTable',
                      ['', 'Row Total', 'Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'Cat 5', 'Cat 6'],
                      ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Total']))
        .hide()
        .appendTo(container);
};