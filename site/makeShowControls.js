"use strict";

var dataStore = require('./dataStore.js');
var refreshBoards = require('./refreshBoards.js');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var getFinalJeopardyDiv = function () {
    var fjDiv = $('#final-div');
    if (fjDiv.text().length === 0) {
        var rights = 0,
            wrongs = 0;
        var rightWrongByYear = {};
        _.each(dataStore.yearRange, function (year) {
            rightWrongByYear[year] = [0, 0];
        });

        _.each(dataStore.games(), function (gameData) {
            var finalData = gameData.finalData;
            var year = parseInt(gameData.gameDate.substring(0, 4), 10);
            rights += finalData.rights;
            wrongs += finalData.wrongs;
            rightWrongByYear[year][0] += finalData.rights;
            rightWrongByYear[year][1] += finalData.wrongs;
        });

        var divisor = rights + wrongs;
        if (divisor === 0) divisor = 1;
        fjDiv.html('Final Jeopardy: right=' + rights + ', wrong=' + wrongs +
                   ' or <span class="stats-color-2">' + Math.round(100 * rights / divisor) +
                   '% right</span>');

        var rightWrongData = [];
        _.each(dataStore.yearRange, function (year) {
            var rw = rightWrongByYear[year];
            var ratio = 0;
            var divisor = rw[0] + rw[1];
            if (divisor !== 0) ratio = Math.round(100 * rw[0] / divisor);
            rightWrongData.push([year.toString(), ratio]);
        });
        charts('chartFinal', rightWrongData, 'Final Jeopardy correct answers by year');
    }

    return fjDiv;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeCheckboxBlock = function (elementId, label, clickHandler) {
    var cbb = $('<div class="controls-block-inline">' +
                '<input type="checkbox" id="' + elementId + '"/>' +
                '<label for="' + elementId + '">' + label + '</label>' +
                '</div>');
    cbb.find('input')
        .on('click', clickHandler)
        .prop('checked',  dataStore.getOption(elementId));
    return cbb;
};

//------------------------------------------------------------------------------showOptionsBlock1
//------------------------------------------------------------------------------
module.exports = function () {
    var animationDelay = dataStore.getOption('animationDelay');
    
    var showControlsDiv = $('<div id="controls-overall" class="stats-color-Reset"></div>');

    showControlsDiv.append('<span class="showBlockTitle">Filter sets: </span>');
    showControlsDiv.append(makeCheckboxBlock('showOptionsBlock1', 'Filter 1', function () {
        dataStore.setOption('showOptionsBlock1', this.checked);
        $('.controls-div-inline.stats-color-1')[this.checked ? 'show' : 'hide'](animationDelay);
        refreshBoards();
    }));
    showControlsDiv.append(makeCheckboxBlock('showOptionsBlock2', 'Filter 2', function () {
        dataStore.setOption('showOptionsBlock2', this.checked);
        $('.controls-div-inline.stats-color-2')[this.checked ? 'show' : 'hide'](animationDelay);
        refreshBoards();
    }));
    showControlsDiv.append(makeCheckboxBlock('showOptionsBlock3', 'Filter 3', function () {
        dataStore.setOption('showOptionsBlock3', this.checked);
        $('.controls-div-inline.stats-color-3')[this.checked ? 'show' : 'hide'](animationDelay);
        refreshBoards();
    }));
    showControlsDiv.append(makeCheckboxBlock('showOptionsBlock4', 'Filter 4', function () {
        dataStore.setOption('showOptionsBlock4', this.checked);
        $('.controls-div-inline.stats-color-4')[this.checked ? 'show' : 'hide'](animationDelay);
        refreshBoards();
    }));
    
    
    showControlsDiv.append('<br><span class="showBlockTitle">Show blocks: </span>');
    showControlsDiv.append(makeCheckboxBlock('showLegend', 'Legend', function () {
        $('#legend-div')[this.checked ? 'slideDown' : 'slideUp'](animationDelay);
        dataStore.setOption('showLegend', this.checked);
    }));
    showControlsDiv.append(makeCheckboxBlock('showGameBoard', 'Game Board', function () {
        $('#boardTable')[this.checked ? 'show' : 'hide'](animationDelay);
        dataStore.setOption('showGameBoard', this.checked);
    }));
    showControlsDiv.append(makeCheckboxBlock('showGraph', 'Graph', function () {
        $('#graph-div')[this.checked ? 'slideDown' : 'slideUp'](animationDelay);
        dataStore.setOption('showGraph', this.checked);
    }));
    showControlsDiv.append(makeCheckboxBlock('showFinalJeopardy', 'Final Jeopardy', function () {
        getFinalJeopardyDiv()[this.checked ? 'show' : 'hide'](animationDelay);
        dataStore.setOption('showFinalJeopardy', this.checked);
    }));
    showControlsDiv.append(makeCheckboxBlock('showHelp', 'Help', function () {
        $('#helpDiv')[this.checked ? 'slideDown' : 'slideUp'](animationDelay);
        dataStore.setOption('showHelp', this.checked);
    }));

    
    showControlsDiv.append('<br><span class="showBlockTitle">Show in each cell: </span>');
    showControlsDiv.append(makeCheckboxBlock('showCounts', 'Counts', function () {
        dataStore.setOption('showCounts', this.checked);
        refreshBoards();
    }));
    showControlsDiv.append(makeCheckboxBlock('showTotals', 'Totals', function () {
        dataStore.setOption('showTotals', this.checked);
        refreshBoards();
    }));
    
    
    return showControlsDiv;

};

