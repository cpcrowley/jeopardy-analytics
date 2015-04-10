"use strict";

var makeOptionsBlocks = require('./makeOptionsBlocks.js');
var refreshBoards = require('./refreshBoards.js');
var dataStore = require('./dataStore.js');

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
var setOptionsBlock = function (blockId, s0, s1, s2, s3, s4, s5, s6) {
    var cb = $('.controls-div-inline.stats-color-'+blockId);
    cb.find('select:eq(0)')[0].selectedIndex = s0 || 0;
    cb.find('select:eq(1)')[0].selectedIndex = s1 || 0;
    cb.find('select:eq(2)')[0].selectedIndex = s2 || 0;
    cb.find('select:eq(3)')[0].selectedIndex = s3 || 0;
    cb.find('select:eq(4)')[0].selectedIndex = s4 || 0;
    cb.find('select:eq(5)')[0].selectedIndex = s5 || 0;
    cb.find('select:eq(6)')[0].selectedIndex = s6 || 0;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var setupExamples = function () {
    $('#example1').click(function () {
        setOptionsBlock(1, 3);
        setOptionsBlock(2);
        setOptionsBlock(3);
        setOptionsBlock(4);
        refreshBoards();
    });
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var setupShowToggles = function () {
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
    if(!dataStore.getOption('showOptions')) {$('#options-div').hide();}

    
    // Add the summary table
    var st = $(createTableHtml('summary-table',
                      ['', '1', '2', '3', '4'],
                      ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Total']
                     ))
        .appendTo(container);
    if(!dataStore.getOption('showSummary')) {st.hide();}

    
    // Add in the legend block
    var le = $('<div id="legend-div"></div>');
    container.append(le);
    if(!dataStore.getOption('showLegend')) {le.hide();}

    /*var ex = $('<div id="examplesDiv" class="well well-sm"></div>')
        .appendTo(container)
        .load('site/examples.html', function () {
            setupExamples();
        });
    if(!dataStore.getOption('showExamples')) {ex.hide();}*/

    
    //Add the Help DIV
    var he = $('<div id="helpDiv" class="well well-sm"></div>')
        .appendTo(container)
        .load('site/help.html');
    if(!dataStore.getOption('showHelp')) {he.hide();}

    
    // Add in the Final Jeopardy DIV
    var fj = $('<div id="final-div"></div>');
    container.append(fj);
    if(!dataStore.getOption('showFinalJeopardy')) {fj.hide();}

    
    // Add in the Board Detail DIV
    var bo = $(createTableHtml('boardTable',
                      ['', 'Row Total', 'Cat 1', 'Cat 2', 'Cat 3', 'Cat 4', 'Cat 5', 'Cat 6'],
                      ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600', '$1000/$2000', 'Total']))
        .appendTo(container);
    if(!dataStore.getOption('showGameBoard')) {bo.hide();}

    
    // Add in the Chart DIV
    var gr = $('<div id="graph-div"></div>');
    container.append(gr);
    if(!dataStore.getOption('showGraph')) {gr.hide();}

};