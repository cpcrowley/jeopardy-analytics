"use strict";

var dataStore = require('./dataStore.js');

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function (options) {
    "use strict";
    var title = '';
    switch (options.percentSelect) {
        case 'cell':
            title += '%';
            break;
        case 'row':
            title += '% (based on row)';
            break;
        case 'column':
            title += '% (based on column)';
            break;
        case 'board':
            title += '% (board on whole board)';
            break;
    }
    title += ' ';
    switch (options.numberRight) {
        case 'any':
            title += '# right: 0 or 1';
            break;
        case '0':
            title += '# right: 0';
            break;
        case '1':
            title += '# right: 1';
            break;
    }
    title += ', ';
    switch (options.numberWrong) {
        case 'any':
            title += '# wrong: 0-3';
            break;
        case '1-3':
            title += '# wrong: 1-3';
            break;
        case '0':
            title += '# wrong: 0';
            break;
        case '1':
            title += '# wrong: 1';
            break;
        case '2':
            title += '# wrong: 2)';
            break;
        case '3':
            title += '# wrong: 3';
            break;
    }
    title += ', ';
    switch (options.whichRounds) {
        case 'dontcare':
            title += 'includes both rounds';
            break;
        case 'single':
            title += 'Jeopardy round ONLY';
            break;
        case 'double':
            title += 'Double Jeopardy round ONLY';
            break;
    }
    switch (options.includeDailyDoubles) {
        case 'dontcare':
            title += '';
            break;
        case 'exclude':
            title += ', excluding Daily Doubles';
            break;
        case 'only':
            title += ', Daily Doubles ONLY';
            break;
    }
    switch (options.includeOutOfOrder) {
        case 'dontcare':
            title += '';
            break;
        case 'first-only':
            title += ', first out-of-order answers ONLY';
            break;
        case 'any-only':
            title += ', out-of-order answers ONLY';
            break;
    }
    return title;
};

