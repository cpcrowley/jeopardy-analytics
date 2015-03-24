/* jshint node:true */
"use strict";

var fs = require('fs'); // to write to a file
var _ = require('underscore');

var bigDataDir = function () {
    return '../jeopardyData/';
};
var dataDir = function () {
    return 'data/';
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var writeJSONFile = function (data, path, spacing, errorMsgOnly) {
    var json = JSON.stringify(data, null, spacing);
    var writeJsonStart = new Date().getTime();
    fs.writeFile(path, json, function (err) {
        if (err) throw err;
        var elapsedTime = new Date().getTime() - writeJsonStart;
        if (!errorMsgOnly) {
            console.log('Wrote ' + (json.length / 1000000).toFixed(1) +
                        ' MB of JSON to ' + path +
                        ' in ' + (elapsedTime / 1000).toFixed(1) + ' sec');
        }
    });
};

//------------------------------------------------------------------------------
// Utility function to remove non-digits from a string.
//------------------------------------------------------------------------------
var stripNonDigits = function (s) {
    return s.replace(/[^0-9]/g, '');
};

//------------------------------------------------------------------------------
// row = Array(); a row in a round, with seven columns right/wrong
//       [0/0, 0/1, 0/2, 0/3, 1/0, 1/1, 1/2]
//------------------------------------------------------------------------------
var createZeroedRow = function (numItems) {
    var array = [];
    for (var i = 0; i < numItems; ++i) array.push(0);
    return array;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createZeroedMatrix = function (rows, cols) {
    var round = [];
    for (var i = 0; i < rows; ++i) round[i] = createZeroedRow(cols);
    return round;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var addMatrixToMatrix = function (m1, m2) {
    for (var row = 0; row < 5; ++row) {
        for (var col = 0; col < 7; ++col) m1[row][col] += m2[row][col];
    }
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var addStats = function (stats, gameSummary) {
    _.each([0, 1], function (round) {
        _.each(['oo', 'oodd', 'all', 'alldd'], function (sub) {
            addMatrixToMatrix(stats[round][sub], gameSummary.rounds[round][sub]);
        });
    });
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createZeroedRoundStats = function () {
    return {
        // The 7 columns in a row: right/wrong [0/0, 0/1, 0/2, 0/3, 1/0, 1/1, 1/2]
        'oo': createZeroedMatrix(5, 7), // out of order clues
        'oodd': createZeroedMatrix(5, 7), // out of order clues, daily double
        'all': createZeroedMatrix(5, 7), // all clues
        'alldd': createZeroedMatrix(5, 7) // all clues, daily double
    };
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var createZeroedStats = function () {
    // 0=jeooardy, 1=double jeopardy
    return [createZeroedRoundStats(), createZeroedRoundStats()];
};


exports.bigDataDir = bigDataDir;
exports.dataDir = dataDir;
exports.writeJSONFile = writeJSONFile;
exports.stripNonDigits = stripNonDigits;
exports.createZeroedMatrix = createZeroedMatrix;
exports.createZeroedStats = createZeroedStats;
exports.addMatrixToMatrix = addMatrixToMatrix;
exports.addStats = addStats;