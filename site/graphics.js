/*global google */
/*jshint -W083 */

"use strict";
var dataStore = require('./dataStore.js');
var _ = require('lodash');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var chartFinal = function (rightWrongData, title) {
    var vizData = new google.visualization.DataTable();
    vizData.addColumn('string', 'year');
    vizData.addColumn('number', '% right');
    vizData.addRows(rightWrongData);

    var options = {
        title: title,
        width: 1200,
        height: 600
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-div'));

    chart.draw(vizData, options);
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var chartBy4 = function (boards, title) {
    var vizData = new google.visualization.DataTable();
    vizData.addColumn('string', 'Option');
    vizData.addColumn('number', '1');
    vizData.addColumn('number', '2');
    vizData.addColumn('number', '3');
    vizData.addColumn('number', '4');

    var dataIn = [];

    for (var row = 1; row < 6; ++row) {
        var label = '$' + (2*row) + '00/$' + (4*row) + '00';
        var dataArray = [label];
        _.each(dataStore.boardRange, function (boardNumber) {
            var board = boards[boardNumber];
            if (board.options.totalToShow === 'none') {
                dataArray.push(0);
            } else {
                var totalOfRowData = board.board1[row][0];
                var count = totalOfRowData[1];
                var total = totalOfRowData[0];
                if (total === 0) {
                    total = 1;
                }
                dataArray.push(Math.round(100 * count / total));
            }
        });
        dataIn.push(dataArray);
    }

    vizData.addRows(dataIn);

    var options = {
        title: title,
        width: 1200,
        height: 600
        //legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-div'));

    chart.draw(vizData, options);
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var chartByYear = function (boardsByYear, title) {
    var vizData = new google.visualization.DataTable();
    vizData.addColumn('string', 'Year');
    vizData.addColumn('number', '$200/$400');
    vizData.addColumn('number', '$400/$800');
    vizData.addColumn('number', '$600/$1200');
    vizData.addColumn('number', '$800/$1600');
    vizData.addColumn('number', '$1000/$2000');

    var dataIn = [];

    _.each(dataStore.yearRange, function (year) {
        var board = boardsByYear[year];
        var dataArray = [year.toString()];
        for (var row = 1; row < 6; ++row) {
            var totalOfRowData = board[row][0];
            var count = totalOfRowData[1];
            var total = totalOfRowData[0];
            if (total === 0) {
                total = 1;
            }
            dataArray.push(Math.round(100 * count / total));
        }
        dataIn.push(dataArray);
    });

    vizData.addRows(dataIn);

    var options = {
        title: title,
        width: 1200,
        height: 600
        //legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-div'));
    chart.draw(vizData, options);
};

module.exports = function(chartType, boards, title) {
    switch(chartType) {
        case 'chartByYear': chartByYear(boards, title); break;
        case 'chartBy4': chartBy4(boards, title); break;
        case 'chartFinal': chartFinal(boards, title); break;
    }
};
