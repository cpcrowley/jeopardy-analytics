/*global  _, $, refreshBoards, showFinalJeopardy, chartByYear, chartBy4 */
/*jshint node:true */
"use strict";

var boardTable = null;
var summaryTable = null;

//------------------------------------------------------------------------------
// Do the linking to show and hide the help
//------------------------------------------------------------------------------
var setupHelp = function () {};

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
        '<select id="' + bId + '-<%= cbId %>" class="form-control">' +
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
var createTableHtml = function (topTitles, leftTitles) {
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
//------------------------------------------------------------------------------
var setupUI = function (boards) {
    var container = $('<div class="container-fluid"></div>')
        .appendTo('body');

    // Add title and buttons
    var title = $('<h1>Jeopardy Analytics</h1>')
        .appendTo(container);

    $('<button type="button" class="btn btn-primary graph-button">Refresh</button>')
        .on('click', refreshBoards)
        .appendTo(title);
    $('<button type="button" class="btn btn-primary graph-button">Final Jeopardy</button>')
        .on('click', showFinalJeopardy)
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

    var controlBlock = makeControlsBlockTemplate('square');

    var cb1 = $(controlBlock({
        cbId: '1'
    }));
    cb1.find('select:eq(0)')[0].selectedIndex = 1;
    cb1.find('select:eq(1)')[0].selectedIndex = 0;
    cb1.find('select:eq(2)')[0].selectedIndex = 0;
    cb1.find('.graph-button').on('click', function () {
        chartByYear(boards[1].boardsByYear);
    });

    var cb2 = $(controlBlock({
        cbId: '2'
    }));
    cb2.find('select:eq(0)')[0].selectedIndex = 1;
    cb2.find('select:eq(1)')[0].selectedIndex = 1;
    cb2.find('select:eq(2)')[0].selectedIndex = 0;
    cb2.find('.graph-button').on('click', function () {
        chartByYear(boards[2].boardsByYear);
    });

    var cb3 = $(controlBlock({
        cbId: '3'
    }));
    cb3.find('select:eq(0)')[0].selectedIndex = 1;
    cb3.find('select:eq(1)')[0].selectedIndex = 2;
    cb3.find('select:eq(2)')[0].selectedIndex = 0;
    cb3.find('.graph-button').on('click', function () {
        chartByYear(boards[3].boardsByYear);
    });

    var cb4 = $(controlBlock({
        cbId: '4'
    }));
    cb4.find('.graph-button').on('click', function () {
        chartByYear(boards[4].boardsByYear);
    });
    cb4.find('select:eq(0)')[0].selectedIndex = 1;
    cb4.find('select:eq(2)')[0].selectedIndex = 0;
    cb4.find('select:eq(2)')[0].selectedIndex = 2;
    cb4.find('.graph-button').on('click', function () {
        chartByYear(boards[4].boardsByYear);
    });

    $('<div id="options-div"></div>')
        .append(cb1, cb2, cb3, cb4)
        .appendTo(container);

    // Add in the blocks we need
    var tableRows = ['', '$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Totals']
    var tableCols = ['Totals'];
    summaryTable = $(createTableHtml(tableRows, tableCols));
    container.append(summaryTable);

    container.append('<div id="final-div"></div>');

    container.append('<div id="graph-div"></div>');

    $('<button type="button" class="btn btn-primary graph-button">Show Game Board</button>')
        .on('click', function () {
            if (boardTable.is(':visible')) {
                boardTable.hide(400);
            } else {
                boardTable.show(400);
            }
        })
        .appendTo(container);

    $('<button type="button" class="btn btn-primary graph-button">Show Graph</button>')
        .on('click', function () {
            var graphDiv = $('#graph-div');
            if (graphDiv.is(':visible')) {
                graphDiv.hide(400);
            } else {
                graphDiv.show(400);
            }
        })
        .appendTo(container);

    tableRows = ['', 'Total', 'Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6'];
    tableCols = ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Total'];
    boardTable = $(createTableHtml(tableRows, tableCols)).hide();
    container.append(boardTable);
};

//if(module) { module.exports = setupUI; }