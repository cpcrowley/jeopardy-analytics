/*global  _, $, yearRange, boardRange, boardTable */
/*jshint node:true, -W083 */
"use strict";
//------------------------------------------------------------------------------
// This takes the four board structures and fills in the data in the display table.
//------------------------------------------------------------------------------
var showBoards = function (boards) {
    var boardNumber, row, col;
    var showPercent = $('#percent-select option:selected').val();
    
    //console.log('boardTable', boardTable);
    //console.log('boardTable[0]', boardTable[0]);

    boardTable.find('tbody').find('tr').each(function (row) {
        // Adjust row to match where we put the totals
        if (row === 5) row = 0;
        else row += 1;
        $(this).find('td').each(function (col) {
            var html = '';
            var addSeperator = false;
            _.each(boardRange, function (boardNumber) {
                var board = boards[boardNumber];
                var board1 = board.board1;
                var options = board.options;

                if (options.totalToShow === 'none') {
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
            $(this).html(html);
        });
    });
};

//if(module) { module.exports = showBoards; }