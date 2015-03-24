/*global  _, $, document, console, setupHelp, google */
/* jshint node:true, -W083 */
"use strict";

var JPS = {};

JPS.numBoards = 4;

JPS.games = null;
JPS.boardTable = null;
JPS.boards = [null, null, null, null, null];
// boards[0] is never used, its simpler to use the 1, 2, 3, 4 indices.
JPS.boardOptions = [null, null, null, null, null];

JPS.boardsByYear = null;

JPS.googleLibLoaded = false;

JPS.computeBoardTotals = function (board) {
    if(board === null) {
        console.log('ERROR: computeBoardTotals, board is null');
        return;
    }

    var colTotals = [[0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0], [0,0]];

    for(var row=1; row<6; ++row) {
        var total0 = 0;
        var total1 = 0;
        for(col=1; col<7; ++col) {
            var n0 =  board[row][col][0];
            total0 += n0;
            colTotals[col][0] += n0;
            var n1 =  board[row][col][1];
            total1 += n1;
            colTotals[col][1] += n1;
        }
        board[row][0][0] = total0;
        colTotals[0][0] += total0;
        board[row][0][1] = total1;
        colTotals[0][1] += total1;
    }

    for(var col=0; col<7; ++col) {
        board[0][col][0] = colTotals[col][0];
        board[0][col][1] = colTotals[col][1];
    }
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.showBoards = function () {
    var boardNumber, row, col;
    var showPercent = $('#percent-select option:selected').val();
    
    // Compute board totals
    for(boardNumber=1; boardNumber<=JPS.numBoards; ++boardNumber) {
        var board = JPS.boards[boardNumber];
        if(board === null) { continue; }
        JPS.computeBoardTotals(board);
    }
    
    JPS.boardTable.find('tbody').find('tr').each(function(row){
        // Adjust row to match where we put the totals
        if(row === 5) row = 0;
        else row += 1;
        $(this).find('td').each(function(col){
            var html = '';
            var addSeperator = false;
            for(boardNumber=1; boardNumber<=JPS.numBoards; ++boardNumber) {
                var options = JPS.boardOptions[boardNumber];
                var board = JPS.boards[boardNumber];
                if(board === null) { continue; }
                
                html += '<span class="stats-color-'+boardNumber+'">';
                var count = board[row][col][1];
                var divisor = 0;
                switch(options.percentSelect) {
                    case 'cell': divisor = board[row][col][0]; break;
                    case 'row': divisor = board[row][0][0]; break;
                    case 'column': divisor = board[0][col][0]; break;
                    case 'board': divisor = board[0][0][0]; break;
                }

                // Avoid zero divide and NaN values.
                if(divisor === 0) { divisor = 1; }
                
                if(addSeperator) {
                    addSeperator = false;
                    html += '<br/>';
                }

                html += Math.round(100*count/divisor).toString() + '%';
                switch(options.showCounts) {
                    case 'none': break;
                    case 'count': html += ' (' + count + ')'; break;
                    case 'fraction': html += ' (' + count + '/' + divisor + ')'; break;
                }
                
                html += '</span>';
                addSeperator = true;
            }
            $(this).html(html);
        });
    });
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.fillRound = function (roundNumber, boardNumber, gameData) {
    var clues = gameData['round'+roundNumber].clues;
    var board = JPS.boards[boardNumber];
    

    var board2 = null;
    if(boardNumber === 1) {
        var year = parseInt(gameData.gameDate.substring(0,4),10);
        board2 = JPS.boardsByYear[year];
    }

    
    _.each(clues, function(clue) {
        
        // Get the cell values array to use.
        var cell =  board[clue.row][clue.col];
        var cell2 = null;
        if(board2 !== null) { cell2 = board2[clue.row][clue.col]; }
        var options = JPS.boardOptions[boardNumber];
        
        var increment_count = 1;
        var increment_total = 1;

        // Check the daily double conditions
        if(clue.isDD) {
            switch(options.includeDailyDoubles) {
                case 'include': break;
                case 'exclude': increment_count = 0; increment_total = 0; break;
                case 'only': break;
            }
        } else {
            switch(options.includeDailyDoubles) {
                case 'include': break;
                case 'exclude': break;
                case 'only': increment_count = 0; increment_total = 0; break;
            }
        }
        
        // Check the total to show conditions.
        if(increment_count===1) {
            increment_count = 0;
            switch(options.totalToShow) {
                case '1-any': if(clue.rightAnswer===1) increment_count = 1; break;
                case '1-0': if(clue.rightAnswer===1 && clue.wrongAnswers===0) increment_count = 1; break;
                case '1-1': if(clue.rightAnswer===1 && clue.wrongAnswers===1) increment_count = 1; break;
                case '1-2': if(clue.rightAnswer===1 && clue.wrongAnswers===2) increment_count = 1; break;
                    
                case '0-any': if(clue.rightAnswer===0) increment_count = 1; break;
                case '0-0': if(clue.rightAnswer===0 && clue.wrongAnswers===0) increment_count = 1; break;
                case '0-1': if(clue.rightAnswer===0 && clue.wrongAnswers===1) increment_count = 1; break;
                case '0-2': if(clue.rightAnswer===0 && clue.wrongAnswers===2) increment_count = 1; break;
                case '0-3': if(clue.rightAnswer===0 && clue.wrongAnswers===3) increment_count = 1; break;
            }
        }

        if (increment_count) {
            cell[1] += 1;
            if(cell2) {cell2[1] += 1;}
        }
        if (increment_total) {
            cell[0] += 1;
            if(cell2) {cell2[0] += 1;}
        }
    });
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.fillBoards = function () {
    for(var boardNumber=1; boardNumber<=JPS.numBoards; ++boardNumber) {
        
        var tts = document.getElementById('total-to-show-'+boardNumber);
        var totalToShow = tts.options[tts.selectedIndex].value;

        if(totalToShow === 'none') {
            JPS.boards[boardNumber] = null;
            return;
        }

        JPS.boards[boardNumber] = JPS.createZeroedBoard();
        
        if(boardNumber === 1) {
            JPS.boardsByYear = {};
            for(var year=1983; year<2016; ++year) {
                JPS.boardsByYear[year] = JPS.createZeroedBoard();
            }
        }

        var idd = document.getElementById('include-daily-doubles-'+boardNumber);
        var wr = document.getElementById('which-rounds-'+boardNumber);
        var whichRounds = wr.options[wr.selectedIndex].value;
        var ps = document.getElementById('percent-select-'+boardNumber);
        var sc = document.getElementById('show-counts-'+boardNumber);

        JPS.boardOptions[boardNumber] = {
            totalToShow: totalToShow,
            includeDailyDoubles: idd.options[idd.selectedIndex].value,
            whichRounds: whichRounds,
            percentSelect: ps.options[ps.selectedIndex].value,
            showCounts: sc.options[sc.selectedIndex].value
        };

        _.each(JPS.games, function(gameData) {
            if(whichRounds !== 'double') {
                JPS.fillRound(1, boardNumber, gameData);
            }
            if(whichRounds !== 'single') {
                JPS.fillRound(2, boardNumber, gameData);
            }
        });
    }
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.refreshBoards = function () {
    JPS.fillBoards();
    JPS.showBoards(); 
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.makeOptionList = function (items) {
    var s = '';
    _.each(items, function(item) {
        s += '<option value="' + item[0] + '">' + item[1] + '</option>';
    });
    return s;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.makeSelectControlsBlock = function (bId, label, options) {
    var s =
        '<div class="controls-block">'+
        '<label for="' + bId + '-<%= cbId %>">' + label + '</label>'+
        '<select id="' + bId + '-<%= cbId %>" class="form-control">'+
        options+
        '</select>'+
        '</div>';
    return s;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.showChart = function () {    
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Year');
    data.addColumn('number', '$200/$400');
    data.addColumn('number', '$400/$800');
    data.addColumn('number', '$600/$1200');
    data.addColumn('number', '$800/$1600');
    data.addColumn('number', '$1000/$2000');
    
    var dataIn = [];
    
    for(var year=1984; year<2016; ++year) {
        var board = JPS.boardsByYear[year];
        JPS.computeBoardTotals(board);
        var dataArray = [year.toString()];
        for(var row=1; row<6; ++row) {
            var totalOfRowData = board[row][0];
            var count = totalOfRowData[1];
            var total = totalOfRowData[0];
            if(total === 0) {total = 1;}
            dataArray.push(Math.round(100*count/total));
        }
        dataIn.push(dataArray);
    }
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

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
JPS.setupUI = function () {
    JPS.setupHelp();

    var controlBlock = _.template(
        '<div class="controls-div stats-color-<%= cbId %>">'+
        '<span class="controls-title"><%= cbId %>:</span>'+
        JPS.makeSelectControlsBlock('total-to-show', 'Show', JPS.makeOptionList([
            ["none", "None"],
            ["1-any", "right:1 wrong:any"],
            ["1-0", "right:1 wrong:0"],
            ["1-1", "right:1 wrong:1"],
            ["1-2", "right:1 wrong:2"],
            ["0-any", "right:0 wrong:any"],
            ["0-0", "right:0 wrong:0"],
            ["0-1", "right:0 wrong:1"],
            ["0-2", "right:0 wrong:2"],
            ["0-3", "right:0 wrong:3"]]))+
        JPS.makeSelectControlsBlock('include-daily-doubles', 'Daily doubles', JPS.makeOptionList([
            ["include", "Include"],
            ["exclude", "Exclude"],
            ["only", "Only"]]))+
        JPS.makeSelectControlsBlock('which-rounds', 'Rounds', JPS.makeOptionList([
            ["both", "Both"],
            ["single", "Jeopardy only"],
            ["double", "Double only"]]))+
        JPS.makeSelectControlsBlock('percent-select', 'Percentages', JPS.makeOptionList([
            ["cell", "By cell"],
            ["row", "By row"],
            ["column", "By column"],
            ["board", "By board"]]))+
        JPS.makeSelectControlsBlock('show-counts', 'Show counts', JPS.makeOptionList([
            ["none", "None"],
            ["count", "count only"],
            ["fraction", "count/total"]]))+
        '</div>');
    
    var refreshButton = $('<button type="button" id="refresh-button"'+
                          ' class="btn btn-primary space-right">Refresh</button>')
    .on('click', JPS.refreshBoards);
    
    var chartButton = $('<button type="button" id="refresh-button"'+
                        ' class="btn btn-primary space-right">Graph by Year</button>')
    .on('click', JPS.showChart);

    var cb1 = $(controlBlock({cbId: '1'}));
    cb1.find('select:eq(0)')[0].selectedIndex = 1;
    cb1.find('select:eq(1)')[0].selectedIndex = 1;

    var cb2 = $(controlBlock({cbId: '2'}));
    cb2.find('select:eq(0)')[0].selectedIndex = 1;
    cb2.find('select:eq(1)')[0].selectedIndex = 0;

    var cb3 = $(controlBlock({cbId: '3'}));
    cb3.find('select:eq(0)')[0].selectedIndex = 1;
    cb3.find('select:eq(1)')[0].selectedIndex = 2;

    var cb4 = $(controlBlock({cbId: '4'}));
    
    $('#options-div').append(cb1, cb2, cb3, cb4, refreshButton, chartButton);
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
$(document).ready(function () {
    var html = JPS.createBoardTableHtml();
    JPS.boardTable = $(html);
    $('#table-div').append(JPS.boardTable);
    JPS.setupUI();
    
    $.getJSON('data/allGamesCompact.json', function(data) {
        JPS.games = JPS.recontructGames(data);
        
        console.log('games.slice(0,10)', JPS.games.slice(0,10));
        
        JPS.refreshBoards();
    });
});


