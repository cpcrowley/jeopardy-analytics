/*globals google */
"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createTable = function (columns, rows, options, divId) {
    var data = new google.visualization.DataTable();
    var icol, irow;
    for (icol = 0; icol < columns.length; ++icol) {
        data.addColumn('string', columns[icol]);
    }
    // Change numbers to strings
    for (irow=0; irow<rows.length; ++irow) {
        var row = rows[irow];
        for (icol=1; icol<row.length; ++icol) {
            var value = row[icol];
            row[icol] = value.toString() + '%';
        }
    }
    data.addRows(rows);
    var table = new google.visualization.Table(document.getElementById(divId));
    options.cssClassNames = { tableCell: 'center-td'};
    table.draw(data, options);
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
/*var createChart = function (columns, rows, options, divId) {
    var data = new google.visualization.DataTable();
    var i;
    for (i = 0; i < columns.length; ++i) {
        data.addColumn(i===0?'string':'number', columns[i]);
    }
    data.addRows(rows);
    var chart = new google.visualization.LineChart(document.getElementById(divId));
    chart.draw(data, options);
};*/

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createCharts = function () {
    var rows, cols, options;

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Round', 'Percent correct'];
    cols = [
        ['Both', 85],
        ['Jeopardy', 88],
        ['Double Jeopardy', 82]
    ];
    options = {
        height: 100
    };
    createTable(rows, cols, options, 'overall-correct-by-round');

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Row', 'Percent correct'];
    cols = [
        ['1', 95],
        ['2', 91],
        ['3', 86],
        ['4', 80],
        ['5', 71]
    ];
    options = {
        height: 150
    };
    createTable(rows, cols, options, 'correct-by-row');

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Row', 'Jeopardy', 'Double Jeopardy'];
    cols = [
        ['1', 96, 95],
        ['2', 93, 89],
        ['3', 89, 83],
        ['4', 84, 76],
        ['5', 76, 66]
    ];
    options = {
        height: 150
    };
    createTable(rows, cols, options, 'correct-by-row-and-round');
    /*options = {
        height: 250
    };
    createChart(rows, cols, options, 'correct-by-row-and-round-chart');
    cols.push(['0',0,0]);
    options = {
        height: 250
    };
    createChart(rows, cols, options, 'correct-by-row-and-round-chart0');*/

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Row', 'Percent wrong'];
    cols = [
        ['1', 8],
        ['2', 10],
        ['3', 13],
        ['4', 15],
        ['5', 16]
    ];
    options = {
        height: 150
    };
    createTable(rows, cols, options, 'wrong-by-row');

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Round', 'Regular clues', 'Daily doubles'];
    cols = [
        ['Both', 86, 65],
        ['Jeopardy', 89, 67],
        ['Double Jeopardy', 83, 64]
    ];
    options = {
        height: 100
    };
    createTable(rows, cols, options, 'regular-dd-correct-by-round');
    /*options = {
        height: 250
    };
    createChart(rows, cols, options, 'regular-dd-correct-by-round-chart');
    cols.push(['0',0,0]);
    options = {
        height: 250
    };
    createChart(rows, cols, options, 'regular-dd-correct-by-round-chart0');*/

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Row', 'Regular clues', 'Daily doubles'];
    cols = [
        ['1', 96, 56],
        ['2', 92, 73],
        ['3', 87, 68],
        ['4', 82, 64],
        ['5', 72, 60]
    ];
    options = {
        height: 150
    };
    createTable(rows, cols, options, 'regular-dd-correct-by-row');
    /*options = {
        height: 250
    };
    createChart(rows, cols, options, 'regular-dd-correct-by-row-chart');
    cols.push(['0',0,0]);
    options = {
        height: 250
    };
    createChart(rows, cols, options, 'regular-dd-correct-by-row-chart0');*/

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Row', 'All clues', 'Out of order', 'First out of order'];
    cols = [
        ['1', 96, 0, 0],
        ['2', 92, 92, 89],
        ['3', 87, 87, 87],
        ['4', 82, 82, 82],
        ['5', 72, 72, 72]
    ];
    options = {
        height: 150
    };
    createTable(rows, cols, options, 'overall-correct-by-row-oo');
    /*options = {
        height: 250
    };
    createChart(rows, cols, options, 'overall-correct-by-row-oo-chart');*/

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Row', 'Daily doubles', 'Out of order', 'First out of order'];
    cols = [
        ['1', 56, 0, 0],
        ['2', 73, 73, 88],
        ['3', 68, 68, 72],
        ['4', 64, 65, 66],
        ['5', 60, 59, 71]
    ];
    options = {
        height: 150
    };
    createTable(rows, cols, options, 'dd-correct-by-row-oo');
    /*options = {
        height: 250
    };
    createChart(rows, cols, options, 'dd-correct-by-row-oo-chart');*/

    //------------------------------------------------------------------------------
    //------------------------------------------------------------------------------
    rows = ['Row', 'Percent daily doubles'];
    cols = [
        ['1', 0],
        ['2', 9],
        ['3', 27],
        ['4', 39],
        ['5', 26]
    ];
    options = {
        height: 150
    };
    createTable(rows, cols, options, 'dd-occur-by-row');
};

/*
        <div id="regular-dd-correct-by-round"></div>

*/
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).ready(function () {
    createCharts();
});