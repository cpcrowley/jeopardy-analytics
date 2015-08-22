"use strict";

var makeOptionsBlocks = require('./makeOptionsBlocks.js');
var refreshBoards = require('./refreshBoards.js');
var charts = require('./charts.js');
var dataStore = require('./dataStore.js');
var _ = require('lodash');

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
var makeFilterSetToggles = function () {
    return $('<div class="toggles-div">' +
                            '<span class="showBlockTitle">Filter sets: </span>' +
                            '</div>')
    .append(makeCheckboxBlock('showOptionsBlock1', 'Filter 1', function () {
        dataStore.setOption('showOptionsBlock1', this.checked);
    }))
    .append(makeCheckboxBlock('showOptionsBlock2', 'Filter 2', function () {
        dataStore.setOption('showOptionsBlock2', this.checked);
    }))
    .append(makeCheckboxBlock('showOptionsBlock3', 'Filter 3', function () {
        dataStore.setOption('showOptionsBlock3', this.checked);
    }))
    .append(makeCheckboxBlock('showOptionsBlock4', 'Filter 4', function () {
        dataStore.setOption('showOptionsBlock4', this.checked);
    }));
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeBlockToggles = function () {
    return $('<div class="toggles-div">' +
             '<span class="showBlockTitle">Show extra information: </span>' +
             '</div>')
    .append(makeCheckboxBlock('showGameBoard', 'Game Board', function () {
        dataStore.setOption('showGameBoard', this.checked);
    }))
    .append(makeCheckboxBlock('showGraph', 'Graph', function () {
        dataStore.setOption('showGraph', this.checked);
    }))
    .append(makeCheckboxBlock('showFinalJeopardy', 'Final Jeopardy', function () {
        if(this.checked) {
            var fjData = dataStore.getOption('finalJeopardyData');
            var divisor = fjData.rights + fjData.wrongs;
            if (divisor === 0) divisor = 1;
            $('#final-div').html('Final Jeopardy: right=' + fjData.rights +
                                 ', wrong=' + fjData.wrongs +
                                 ' or <span class="stats-color-2">' +
                                 Math.round(100 * fjData.rights / divisor) +
                                 '% right</span>');
            var rightWrongData = [];
            _.each(dataStore.seasonRange, function (season) {
                var rw = fjData.rightWrongBySeason[season];
                var ratio = 0;
                var divisor = rw[0] + rw[1];
                if (divisor !== 0) ratio = Math.round(100 * rw[0] / divisor);
                var seasonString = season.toString();
                if (season===0) { seasonString = 'sj'; }
                rightWrongData.push([seasonString, ratio]);
            });
            charts('chartFinal', rightWrongData, 'Final Jeopardy correct answers by season');
        }
        dataStore.setOption('showFinalJeopardy', this.checked);
    }))
    .append(makeCheckboxBlock('showHelp', 'Help', function () {
        dataStore.setOption('showHelp', this.checked);
    }));
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeCountTotalToggles = function () {
    return $('<div class="toggles-div">' +
             '<span class="showBlockTitle">Show in each cell: % (count/total) </span>' +
             '</div>')
    .append(makeCheckboxBlock('showCounts', 'Counts', function () {
        dataStore.setOption('showCounts', this.checked);
        refreshBoards();
    }))
    .append(makeCheckboxBlock('showTotals', 'Totals', function () {
        dataStore.setOption('showTotals', this.checked);
        refreshBoards();
    }));
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function () {

    //--------------------------------------------------------------------------
    // Create the DIVs
    //--------------------------------------------------------------------------
    var title = $('<h1 class="title-h1 text-align-center">Jeopardy Analytics</h1>');
    var blockToggles = makeBlockToggles();
    var optionsBlocks = makeOptionsBlocks();
    var summaryBlock =
        $(createTableHtml('summary-table',
                          ['', '1', '2', '3', '4'],
                          ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Total']
                         ));
    var legendBlock = $('<div id="legend-div"></div>');
    var filterSetToggles = makeFilterSetToggles();
    var countTotalToggles = makeCountTotalToggles();
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
    $('<div class="container-fluid"></div>')
        .appendTo('body')
        .append(title, filterSetToggles, optionsBlocks, countTotalToggles,
                legendBlock, blockToggles, helpBlock, finalJeopardyBlock,
                fullGameBoardBlock, graphBlock);

    //--------------------------------------------------------------------------
    // Set initial visibility
    //--------------------------------------------------------------------------
    if(!dataStore.getOption('showHelp')) {helpBlock.hide();}
    if(!dataStore.getOption('showFinalJeopardy')) {finalJeopardyBlock.hide();}
    if(!dataStore.getOption('showGameBoard')) {fullGameBoardBlock.hide();}
    if(!dataStore.getOption('showGraph')) {graphBlock.hide();}

};