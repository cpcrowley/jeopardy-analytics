/*global  _, $, JPS, document, window, console, alert */
/* jshint node:true */
"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.recontructOneClue = function (clueArray) {
    var clue = {
        rightAnswer: clueArray[0],
        wrongAnswers: clueArray[1],
        round: clueArray[2],
        col: clueArray[3],
        row: clueArray[4],
        isDD: (clueArray[5]===1),
        value: clueArray[6],
        outOfOrder: clueArray[7],
        order: clueArray[8]
    };
    return clue;
};
JPS.recontructClues = function (cluesArray) {
    var clues = [];
    _.each(cluesArray, function (clueArray) {
        clues.push(JPS.recontructOneClue(clueArray));
    });
    return clues;
};
JPS.recontructRound = function (cluesArray) {
    var round = {
        clues: JPS.recontructClues(cluesArray)
    };
    return round;
};
JPS.recontructGames = function (data) {
    var rgames = [];
    _.each(data, function(item){
        rgames.push({
            seasonNumber: item[0],
            gameId: item[1],
            gameNumber: item[2],
            gameDate: item[3],
            errorCount: 0,
            round1: JPS.recontructRound(item[4]),
            round2: JPS.recontructRound(item[5])
        });
    });
    return rgames;
};


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.createZeroedRow = function () {
    var row = [];
    for(var i=0; i<7; ++i) { row[i] = [0,0]; }
    return row;
};
JPS.createZeroedBoard = function () {
    var board = [];
    for(var i=0; i<6; ++i) { board[i] = JPS.createZeroedRow(); }
    return board;
};


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.setupHelp = function () {
    var $helpDiv = $('#helpDiv'),
        $helpToggle = $('#helpToggle');

    // Set up the help
    $helpDiv.hide().click(function () {
        $helpToggle.click();
    });
    $helpToggle.click(function () {
        var newLinkText;
        if ($helpDiv.is(':visible')) {
            $helpDiv.hide('normal');
            newLinkText = 'Show Help';
        } else {
            $helpDiv.show('normal');
            newLinkText = 'Hide Help';
        }
        $helpToggle.text(newLinkText);
    });
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.createBoardTableHtml = function () {
    var topTitles = ['', 'Totals', 'Category 1', 'Category 2', 'Category 3',
                     'Category 4', 'Category 5', 'Category 6'];
    var leftTitles = ['$200/$400', '$400/$800', '$600/$1200', '$800/$1600',
                      '$1000/$2000', 'Totals'];
    
    var numCols = topTitles.length;
    var row, col;
    var html = '<table class="table table-bordered">';
    html += '<thead><tr>';
    for(col=0; col<numCols; ++col) {
        html += '<th>' + topTitles[col] + '</th>';
    }
    html += '</tr></thead>';
    
    html += '<tbody>';
    var numRows = leftTitles.length;
    for(row=0; row<numRows; ++row) {
        html += '<tr>';
        html += '<th>' + leftTitles[row] + '</th>';
        for(col=1; col<numCols; ++col) {
            html += '<td></td>';
        }
        html += '</tr>';
    }
    html += '</tbody>';

    html += '</table>';
    return html;
};
