/*global  _, yearRange, boardRange, google, document */
/*jshint node:true, -W083 */

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var chartFinal = function (rightWrongData) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'year');
    data.addColumn('number', '% right');
    data.addRows(rightWrongData);

    var options = {
        title: 'Final Jeopardy % answered correctly (by year)',
        width: 1200,
        height: 600
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-div'));

    chart.draw(data, options);
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var chartBy4 = function (boards) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Option');
    data.addColumn('number', '1');
    data.addColumn('number', '2');
    data.addColumn('number', '3');
    data.addColumn('number', '4');

    var dataIn = [];

    for (var row = 1; row < 6; ++row) {
        var label = '$' + (2*row) + '00/$' + (4*row) + '00';
        var dataArray = [label];
        _.each(boardRange, function (boardNumber) {
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

    data.addRows(dataIn);

    var options = {
        title: 'Chart of the four cases above',
        width: 1200,
        height: 600
        //legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-div'));

    chart.draw(data, options);
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var chartByYear = function (boardsByYear) {
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Year');
    data.addColumn('number', '$200/$400');
    data.addColumn('number', '$400/$800');
    data.addColumn('number', '$600/$1200');
    data.addColumn('number', '$800/$1600');
    data.addColumn('number', '$1000/$2000');

    var dataIn = [];

    _.each(yearRange, function (year) {
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

    data.addRows(dataIn);

    var options = {
        title: '% answered correctly (by year)',
        width: 1200,
        height: 600
        //legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('graph-div'));

    chart.draw(data, options);
};

//exports.chartByYear = chartByYear; // browserify
//exports.chartBy4 = chartBy4; // browserify
//exports.chartFinal = chartFinal; // browserify