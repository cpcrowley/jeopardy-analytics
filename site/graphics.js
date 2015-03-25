/*global  _, yearRange, google, document */
/*jshint node:true */

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var showChart = function (boardsByYear) {
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
    //console.log('dataIn', dataIn);

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

module.exports = showChart;