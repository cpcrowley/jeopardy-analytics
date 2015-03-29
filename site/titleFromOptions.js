//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function (options) {
    "use strict"; 
    var title = '';
    switch (options.percentSelect) {
        case "cell":
            title += "%";
            break;
        case "row":
            title += "% (based on row)";
            break;
        case "column":
            title += "% (based on column)";
            break;
        case "board":
            title += "% (board on whole board)";
            break;
    }
    title += ' ';
    switch (options.totalToShow) {
        case "none":
            title += "None";
            break;
        case "total":
            title += "Total";
            break;
        case "1-any":
            title += "Answered correctly";
            break;
        case "1-0":
            title += "Answered correctly (none wrong)";
            break;
        case "1-1":
            title += "Answered correctly (+1 wrong)";
            break;
        case "1-2":
            title += "Answered correctly (+2 wrong)";
            break;
        case "0-any":
            title += "No correct answer";
            break;
        case "0-0":
            title += "No answers at all";
            break;
        case "0-1":
            title += "1 wrong answer";
            break;
        case "0-2":
            title += "2 wrong answers";
            break;
        case "03":
            title += "3 wrong answers";
            break;
    }
    title += ', ';
    switch (options.whichRounds) {
        case "both":
            title += "includes both rounds";
            break;
        case "single":
            title += "Jeopardy round ONLY";
            break;
        case "double":
            title += "Double Jeopardy round ONLY";
            break;
    }
    switch (options.includeDailyDoubles) {
        case "include":
            title += "";
            break;
        case "exclude":
            title += ", excluding Daily Doubles";
            break;
        case "only":
            title += ", Daily Doubles ONLY";
            break;
    }
    switch (options.includeOutOfOrder) {
        case "include":
            title += "";
            break;
        case "first-only":
            title += ", first out-of-order answers ONLY";
            break;
        case "any-only":
            title += ", out-of-order answers ONLY";
            break;
    }
    return title;
};

