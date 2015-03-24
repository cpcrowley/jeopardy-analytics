/* jshint node:true */
"use strict";

var _ = require('underscore');
var roundMatrix = require('./library.js');

var exampleGameSummary =
{
    "title":"Show #4596 - Monday, September 6, 2004",
    "comments":"Ken Jennings game 39.\r\nFirst game of Season 21.  New title graphics.",
    "year":2004,
    "showNumber":4596,
    "gameId":0,
    "contestants":["J.D. Smith","Betsey Casman","Ken Jennings"],
    "rounds": // array of two objects, each object has foru keys: oo, oodd, all and alldd
    [

    {
        "oo":[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
        "oodd":[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
        "all":[[0,0,0,0,6,0,0],[0,0,0,0,6,0,0],[0,0,0,0,6,0,0],[1,0,0,0,3,2,0],[1,0,0,0,5,0,0]],
        "alldd":[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
    },

    {
        "oo":[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
        "oodd":[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]],
        "all":[[0,0,0,0,6,0,0],[0,1,0,0,4,1,0],[0,2,0,0,4,0,0],[1,1,0,0,4,0,0],[1,0,0,0,5,0,0]],
        "alldd":[[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,1,0,0,1,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
    }

    ]
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var numberCorrectInRound = function(matrix, amount, years, colorClass) {
    var html;

    html = '<tr class="'+colorClass+'"><td>'+years+'</td><td>'+amount+'</td>';

    for(var irow = 0; irow < 5; ++irow) {
        var totalWrong = 0,
            j;
        for(j=0; j<4; ++j) {totalWrong += matrix[irow][j];}

        var totalRight = 0;
        for(j=4; j<7; ++j) {totalRight += matrix[irow][j];}

        var total = totalWrong + totalRight;

        // Avoid NaN from zerodivide
        var percent = 0;
        if(total !== 0) percent = (100*totalRight)/total;

        html += '<td>'+percent.toFixed()+'%</td><td>'+total+'</td>';
    }
    html += '</tr>';

    return html;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var numberCorrectRow = function(yearSummaries, fromYear, toYear, jdj) {
    var year;
    var totals = [];
    for(var i=0; i < 4; ++i) totals[i] = roundMatrix.createZeroedMatrix(5, 7);

    for(year=fromYear; year<=toYear; ++year) {
        roundMatrix.addMatrixToMatrix(totals[0], yearSummaries[year][0].all);
        // Here is where we combine single and double jeopardy, if indicated
        roundMatrix.addMatrixToMatrix(totals[(jdj!==0)?0:1], yearSummaries[year][1].all);

        roundMatrix.addMatrixToMatrix(totals[2], yearSummaries[year][0].alldd);
        // Here is where we combine single and double jeopardy, if indicated
        roundMatrix.addMatrixToMatrix(totals[(jdj!==0)?2:3], yearSummaries[year][1].alldd);
    }

    var years = fromYear+'-'+toYear;
    if(fromYear === toYear) years = fromYear;

    var ret;

    if(jdj===0) {
        ret = [
            {"year" : fromYear, "dj" : 0, "dd" : 0, "html" : numberCorrectInRound(totals[0], 'J', years, "warning")},
            {"year" : fromYear, "dj" : 1, "dd" : 0, "html" : numberCorrectInRound(totals[1], 'DJ', years, "warning")},
            {"year" : fromYear, "dj" : 0, "dd" : 1, "html" : numberCorrectInRound(totals[2], 'DD: J', years, "info")},
            {"year" : fromYear, "dj" : 1, "dd" : 1, "html" : numberCorrectInRound(totals[3], 'DD: DJ', years, "info")}
        ];
    } else {
        ret = [
            {"year" : fromYear, "dj" : 0, "dd" : 0, "html" : numberCorrectInRound(totals[0], 'J & DJ', years, "warning")},
            {"year" : fromYear, "dj" : 0, "dd" : 1, "html" : numberCorrectInRound(totals[2], 'DD: J & DJ', years, "info")}
        ];
    }
    return ret;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createRowArray = function(yearSummaries, daterange, jdj) {
    var rowArray;
    var rows;
    switch(daterange) {
    case 1:
        rowArray = [];
        for(var i=1984; i<=2014; ++i) {
            rowArray = rowArray.concat(numberCorrectRow(yearSummaries,i,i,jdj));
        }
        break;
    case 5:
        rowArray = numberCorrectRow(yearSummaries,1984,1988,jdj).concat(
            numberCorrectRow(yearSummaries,1989,1993,jdj),
            numberCorrectRow(yearSummaries,1994,1999,jdj),
            numberCorrectRow(yearSummaries,2000,2004,jdj),
            numberCorrectRow(yearSummaries,2005,2009,jdj),
            numberCorrectRow(yearSummaries,2009,2014,jdj));
        break;
    case 10:
        rowArray = numberCorrectRow(yearSummaries,1984,1993,jdj).concat(
            numberCorrectRow(yearSummaries,1994,2003,jdj),
            numberCorrectRow(yearSummaries,2004,2014,jdj));
        break;
    default:
        rowArray = numberCorrectRow(yearSummaries,1984,2014,jdj);
        break;
    }
    //console.log('rowArray:', rowArray);
    return rowArray;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var numberCorrect = function(yearSummaries, daterange, jdj, dd) {
    var ddLast = (jdj === 'dyj') || (jdj === 'djy');
    var djLast = (jdj === 'djy') || (jdj === 'yjd');

    var html = '<div class="table-responsive"> <table class="table table-bordered">';

    html += '<tr class="active">';
    html += '<th>Year</th>';
    html += '<th>Round</th>';
    html += '<th colspan="2">$200/$400</th>';
    html += '<th colspan="2">$400/$800</th>';
    html += '<th colspan="2">$600/$1200</th>';
    html += '<th colspan="2">$800/$1600</th>';
    html += '<th colspan="2">$1000/$2000</th>';
    html += '</tr>';

    html += '<tr class="active">';
    html += '<th>&nbsp;</th>';
    html += '<th>&nbsp;</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '</tr>';

    // Sort rows
    var rows = createRowArray(yearSummaries, daterange, jdj);
    console.log('rows', rows);
    if(dd === 0) {
        rows.sort(function(a,b){return a.dd - b.dd;});
        console.log('rows after dd sort', rows);
    }
    if(jdj === 0) {
        rows.sort(function(a,b){return a.year - b.year;});
        console.log('rows after year sort', rows);
        rows.sort(function(a,b){return a.dj - b.dj;});
        console.log('rows after dj sort', rows);
    } else {
        rows.sort(function(a,b){return a.dj - b.dj;});
        console.log('rows after dj sort', rows);
        rows.sort(function(a,b){return a.year - b.year;});
        console.log('rows after year sort', rows);
    }

    // Add rows in order
    _.each(rows, function(rowInfo){
        // See if we should skip this line
        var showThisLine = true;
        // Are we showing the daily double lines?
        if((rowInfo.dd===1) && (dd===2)) showThisLine = false;
        // Are the single and double jeopardy lines combined,
        // then don't show the double jeopardy lines
        if((rowInfo.dj===1) && (jdj===2)) showThisLine = false;

        if(showThisLine) html += rowInfo.html;
    });

    html += '</table></div>';

    return html;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var playerResults = function(answers, playerName) {
    var html = '<h4>'+playerName + ' results for ' + numPlayerGames + ' games</h4>';
    html += '<div class="table-responsive"><table class="table table-bordered">';

    html += '<tr class="active">';
    html += '<th>Year</th>';
    html += '<th>Round</th>';
    html += '<th colspan="2">$200/$400</th>';
    html += '<th colspan="2">$400/$800</th>';
    html += '<th colspan="2">$600/$1200</th>';
    html += '<th colspan="2">$800/$1600</th>';
    html += '<th colspan="2">$1000/$2000</th>';
    html += '</tr>';

    html += '<tr class="active">';
    html += '<th>&nbsp;</th>';
    html += '<th>&nbsp;</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '<th>% correct</th><th>Total</th>';
    html += '</tr>';

    var ddhtml = '';
    html += formatTableRow(1984, 2014, jdj);
    html += ddhtml;
    html += '</table></div>';

    return html;
};

exports.numberCorrect = numberCorrect;
exports.playerResults = playerResults;
