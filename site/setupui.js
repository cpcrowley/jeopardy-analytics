"use strict";

var charts = require('./charts.js');
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
module.exports = function () {
    //--------------------------------------------------------------------------
    // Start with the container-fluid to hold everything
    //--------------------------------------------------------------------------
    var container = $('<div class="container-fluid"></div>')
        .appendTo('body');

    // Add title
    $('<h1>Jeopardy Analytics</h1>')
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
    /*$('<button type="button" class="btn btn-primary graph-button">Refresh</button>')
        .on('click', refreshBoards)
        .appendTo(buttonDiv);*/

    // Button to show or hide the game board
    $('<button type="button" class="btn btn-primary graph-button">Show Game Board</button>')
        .on('click', function () {
            var boardTable = $('#boardTable');
            var newText;
            if (boardTable.is(':visible')) {
                boardTable.hide(500);
                newText = 'Show Game Board';
            } else {
                boardTable.show(500);
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
                graphDiv.slideUp(500);
                newText = 'Show Graph';
            } else {
                graphDiv.slideDown(500);
                newText = 'Hide Graph';
            }
            $(this).text(newText);
        })
        .appendTo(buttonDiv);

    // Button to show the Final Jeopardy statistics
    $('<button type="button" id="examplesButton" class="btn btn-primary graph-button">Examples</button>')
        .click(function () {
        var newLinkText;
        var examplesDiv = $('#examplesDiv');
        if (examplesDiv.is(':visible')) {
            examplesDiv.slideUp(500);
            newLinkText = 'Examples';
        } else {
            examplesDiv.slideDown(500);
            newLinkText = 'Hide Examples';
        }
        $('#examplesButton').text(newLinkText);
    })
        .appendTo(buttonDiv);

    $('<button type="button" class="btn btn-primary graph-button">Show Final Jeopardy</button>')
        .on('click', function () {
        var finalJeopardyDiv = getFinalJeopardyDiv();
        var newText;
        if (finalJeopardyDiv.is(':visible')) {
            finalJeopardyDiv.hide(500);
            newText = 'Show Final Jeopardy';
        } else {
            finalJeopardyDiv.show(500);
            newText = 'Hide Final Jeopardy';
        }
        $(this).text(newText);
    })
        .appendTo(buttonDiv);

    // Help and Examples buttons and DIVs
    $('<button type="button" id="helpButton" class="btn btn-primary graph-button">Help</button>')
        .click(function () {
            var newLinkText;
            var helpDiv = $('#helpDiv');
            if (helpDiv.is(':visible')) {
                helpDiv.slideUp(500);
                newLinkText = 'Help';
            } else {
                helpDiv.slideDown(500);
                newLinkText = 'Hide Help';
            }
            $('#helpButton').text(newLinkText);
        })
        .appendTo(buttonDiv);

    $('<div id="examplesDiv" class="well well-sm"></div>')
        .appendTo(container)
        .load('site/examples.html')
        .hide();

    $('<div id="helpDiv" class="well well-sm"></div>')
        .appendTo(container)
        .load('site/help.html')
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