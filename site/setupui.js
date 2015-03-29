"use strict";

var charts = require('./charts.js');
var refreshBoards = require('./refreshBoards.js');
var dataStore = require('./dataStore.js');
var makeOptionsBlocks = require('./makeOptionsBlocks.js');
var _ = require('lodash');

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
    charts('chartFinal', rightWrongData, 'Final Jeopardy correct answers by year');
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function () {
    //--------------------------------------------------------------------------
    // Start with the container-fluid to hold everything
    //--------------------------------------------------------------------------
    var container = $('<div class="container-fluid"></div>')
        .appendTo('body');

    // Add title
    var title = $('<h1>Jeopardy Analytics</h1>')
        .appendTo(container);
    
    // Add options blocks
    container.append(makeOptionsBlocks());
    
    // Add the summary table
    $(createTableHtml('summaryTable',
                      ['', '$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Totals'],
                      ['Totals']))
        .appendTo(container);
    
    // Add in the legend block
    container.append('<div id="legend-div"></div>');

    //--------------------------------------------------------------------------
    // Add in a line of buttons.
    //--------------------------------------------------------------------------
    var buttonDiv = container.append('<div id="button-div"></div>');

    // Button to Refresh everything )going away soon)
    $('<button type="button" class="btn btn-primary graph-button">Refresh</button>')
        .on('click', refreshBoards)
        .appendTo(buttonDiv);
    
    // Button to show the Final Jeopardy statistics
    $('<button type="button" class="btn btn-primary graph-button">Final Jeopardy</button>')
        .on('click', function () {
            showFinalJeopardy();
        })
        .appendTo(buttonDiv);

    // Button to show or hide the game board
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
        .appendTo(buttonDiv);

    // Button to show or hide the graph
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
        .appendTo(buttonDiv);

    // Add in the show an hide Help button
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
        .appendTo(buttonDiv);

    // Add in the Help DIV
    var $helpDiv = $('<div class="well well-sm">No help yet</div>')
    .click(function () {
        $helpToggle.click();
    })
    .appendTo(container)
    .hide();

    // Add in the Final Jeopardy DIV
    container.append('<div id="final-div"></div>');

    // Add in the Board Detail DIV
    $(createTableHtml('boardTable',
                      ['', 'Row Total', 'Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'Cat 5', 'Cat 6'],
                      ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Total']))
        .hide()
        .appendTo(container);

    // Add in the Chart DIV
    container.append('<div id="graph-div"></div>');

};