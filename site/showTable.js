"use strict";

var dataStore = require('./dataStore.js');
var titleFromOptions = require('./titleFromOptions.js');
var _ = require('lodash');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var fillTD = function (td, row, col, boards) {
    var html = '';
    var addSeperator = false;
    _.each(dataStore.boardRange, function (boardNumber) {
        var board = boards[boardNumber];
        var board1 = board.board1;
        var options = board.options;

        if (options.numberRight === 'doNotShow') {
            return; 
        }

        html += '<span class="stats-color-' + boardNumber + '">';
        var count = board1[row][col][1];
        var divisor = 0;
        switch (options.percentSelect) {
            case 'cell':
                divisor = board1[row][col][0];
                break;
            case 'row':
                divisor = board1[row][0][0];
                break;
            case 'column':
                divisor = board1[0][col][0];
                break;
            case 'board':
                divisor = board1[0][0][0];
                break;
        }

        // Avoid zero divide and NaN values.
        if (divisor === 0) {
            divisor = 1;
        }

        if (addSeperator) {
            addSeperator = false;
            html += '<br/>';
        }

        html += Math.round(100 * count / divisor).toString() + '%';
        switch (options.showCounts) {
            case 'none':
                break;
            case 'count':
                html += ' (' + count + ')';
                break;
            case 'fraction':
                html += ' (' + count + '/' + divisor + ')';
                break;
        }

        html += '</span>';
        addSeperator = true;
    });
    $(td).html(html);
};

//------------------------------------------------------------------------------
// This takes the four board structures and fills in the data in the display table.
//------------------------------------------------------------------------------
module.exports = function () {
    var boards = dataStore.boards();

    $('#summaryTable').find('tbody').find('tr').each(function () {
        $(this).find('td').each(function (col) {
            // Note col is really row since this table is on its side.
            // Adjust row to match where we put the totals
            if (col === 5) col = 0; else col += 1;
            fillTD (this, col, 0, boards);
        });
    });
    
    var legendDiv = $('#legend-div').empty();
    _.each(dataStore.boardRange, function(boardNumber) {
        legendDiv.append('<div class="stats-color-'+boardNumber+'">'+
                         titleFromOptions(boards[boardNumber].options)+'</div>');
    });
    

    $('#boardTable').find('tbody').find('tr').each(function (row) {
        // Adjust row to match where we put the totals
        if (row === 5) row = 0;
        else row += 1;
        $(this).find('td').each(function (col) {
            fillTD (this, row, col, boards);
        });
    });
};