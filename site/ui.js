/*global  _, $, refreshBoards, chartByYear, chartBy4 */
/*jshint node:true */
"use strict";

//------------------------------------------------------------------------------
// Do the linking to show and hide the help
//------------------------------------------------------------------------------
var setupHelp = function () {
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
var makeOptionList = function (items) {
    var s = '';
    _.each(items, function (item) {
        s += '<option value="' + item[0] + '">' + item[1] + '</option>';
    });
    return s;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeSelectControlsBlock = function (bId, label, options) {
    var s =
        '<div class="controls-block">' +
        '<label for="' + bId + '-<%= cbId %>">' + label + '</label>' +
        '<select id="' + bId + '-<%= cbId %>" class="form-control">' +
        options +
        '</select>' +
        '</div>';
    return s;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var setupUI = function (boards) {
    setupHelp();

    var controlBlock = _.template(
        '<div class="controls-div stats-color-<%= cbId %>">' +
        '<button type="button" class="btn btn-primary graph-button">Graph by Year</button>' +
        '<span class="controls-title"><%= cbId %>:</span>' +
        makeSelectControlsBlock('total-to-show', 'Show', makeOptionList([
            ["none", "None"],
            ["1-any", "right:1 wrong:any"],
            ["1-0", "right:1 wrong:0"],
            ["1-1", "right:1 wrong:1"],
            ["1-2", "right:1 wrong:2"],
            ["0-any", "right:0 wrong:any"],
            ["0-0", "right:0 wrong:0"],
            ["0-1", "right:0 wrong:1"],
            ["0-2", "right:0 wrong:2"],
            ["0-3", "right:0 wrong:3"]])) +
        makeSelectControlsBlock('include-daily-doubles', 'Daily doubles', makeOptionList([
            ["include", "Include"],
            ["exclude", "Exclude"],
            ["only", "Only"]])) +
        makeSelectControlsBlock('include-out-of-order', 'Out of order', makeOptionList([
            ["include", "Include"],
            ["first-only", "First OO only"],
            ["any-only", "Any OO only"]])) +
        makeSelectControlsBlock('which-rounds', 'Rounds', makeOptionList([
            ["both", "Both"],
            ["single", "Jeopardy only"],
            ["double", "Double only"]])) +
        makeSelectControlsBlock('percent-select', '%', makeOptionList([
            ["cell", "By cell"],
            ["row", "By row"],
            ["column", "By column"],
            ["board", "By board"]])) +
        makeSelectControlsBlock('show-counts', 'Counts', makeOptionList([
            ["none", "None"],
            ["count", "count only"],
            ["fraction", "count/total"]])) +
        '</div>');

    var refreshButton = $('#refresh-button').on('click', refreshBoards);

    var cb1 = $(controlBlock({
        cbId: '1'
    }));
    cb1.find('select:eq(0)')[0].selectedIndex = 1;
    cb1.find('select:eq(1)')[0].selectedIndex = 0;
    cb1.find('select:eq(2)')[0].selectedIndex = 0;
    cb1.find('.graph-button').on('click', function () {
        chartByYear(boards[1].boardsByYear);
    });

    var cb2 = $(controlBlock({
        cbId: '2'
    }));
    cb2.find('select:eq(0)')[0].selectedIndex = 1;
    cb2.find('select:eq(1)')[0].selectedIndex = 1;
    cb2.find('select:eq(2)')[0].selectedIndex = 0;
    cb2.find('.graph-button').on('click', function () {
        chartByYear(boards[2].boardsByYear);
    });

    var cb3 = $(controlBlock({
        cbId: '3'
    }));
    cb3.find('select:eq(0)')[0].selectedIndex = 1;
    cb3.find('select:eq(1)')[0].selectedIndex = 2;
    cb3.find('select:eq(2)')[0].selectedIndex = 0;
    cb3.find('.graph-button').on('click', function () {
        chartByYear(boards[3].boardsByYear);
    });

    var cb4 = $(controlBlock({
        cbId: '4'
    }));
    cb4.find('.graph-button').on('click', function () {
        chartByYear(boards[4].boardsByYear);
    });
    cb4.find('select:eq(0)')[0].selectedIndex = 1;
    cb4.find('select:eq(2)')[0].selectedIndex = 0;
    cb4.find('select:eq(2)')[0].selectedIndex = 2;
    cb4.find('.graph-button').on('click', function () {
        chartByYear(boards[4].boardsByYear);
    });

    $('#options-div').append(cb1, cb2, cb3, cb4);
};

module.exports = setupUI;