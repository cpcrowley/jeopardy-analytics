"use strict";

var makeShowControls = require('./makeShowControls.js');
var makeOptionsBlocks = require('./makeOptionsBlocks.js');
var refreshBoards = require('./refreshBoards.js');
var dataStore = require('./dataStore.js');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createTableHtml = function (tableId, topTitles, leftTitles) {
    var numCols = topTitles.length;
    var row, col;
    var html = '<div id="' + tableId + '">' +
        '<table class="table table-bordered">' +
        '<thead><tr>';
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

    html += '</table></div>';
    return html;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function () {

    //--------------------------------------------------------------------------
    // Create the DIVs
    //--------------------------------------------------------------------------
    var title = $('<h1>Jeopardy Analytics</h1>');
    var showControls = makeShowControls();
    var optionsBlocks = makeOptionsBlocks();
    var summaryBlock =
        $(createTableHtml('summary-table',
                          ['', '1', '2', '3', '4'],
                          ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Total']
                         ));
    var legendBlock = $('<div id="legend-div"></div>');
    var helpBlock = $('<div id="helpDiv" class="well well-sm"></div>')
    .load('site/help.html');
    var finalJeopardyBlock = $('<div id="final-div"></div>');
    var fullGameBoardBlock =
        $(createTableHtml('boardTable',
                          ['', 'Row Total', 'Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'Cat 5', 'Cat 6'],
                          ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Total']));
    var graphBlock = $('<div id="graph-div"></div>');
    
    optionsBlocks.append(summaryBlock);

    //--------------------------------------------------------------------------
    // Create the container and add the DIVs
    //--------------------------------------------------------------------------
    var container = $('<div class="container-fluid"></div>')
    .appendTo('body')
    .append(title, showControls, optionsBlocks,
            legendBlock, helpBlock, finalJeopardyBlock,
            fullGameBoardBlock, graphBlock);

    //--------------------------------------------------------------------------
    // Set initial visibility
    //--------------------------------------------------------------------------
    if(!dataStore.getOption('showLegend')) {legendBlock.hide();}
    if(!dataStore.getOption('showHelp')) {helpBlock.hide();}
    if(!dataStore.getOption('showFinalJeopardy')) {finalJeopardyBlock.hide();}
    if(!dataStore.getOption('showGameBoard')) {fullGameBoardBlock.hide();}
    if(!dataStore.getOption('showGraph')) {graphBlock.hide();}

};