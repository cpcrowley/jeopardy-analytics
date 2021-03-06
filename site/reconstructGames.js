"use strict";

var _ = require('lodash');

//------------------------------------------------------------------------------
// allGamesCompact.json is written as arrays to have space.
// This reconstructs it in objet form with meaningful field names
// replacing array subscripts.
//------------------------------------------------------------------------------
var reconstructOneClue = function (clueArray) {
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
var reconstructClues = function (cluesArray) {
    var clues = [];
    _.each(cluesArray, function (clueArray) {
        clues.push(reconstructOneClue(clueArray));
    });
    return clues;
};
var reconstructRound = function (cluesArray) {
    var round = {
        clues: reconstructClues(cluesArray)
    };
    return round;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
module.exports = function (jsonData) {
    var rgames = [];
    _.each(jsonData, function(item){
        var seasonNumber = item[0];
        if(typeof seasonNumber !== "number") {
            seasonNumber = 0;
        }
        rgames.push({
            seasonNumber: seasonNumber,
            gameId: item[1],
            gameNumber: item[2],
            gameDate: item[3],
            players: item[4],
            errorCount: 0,
            round1: reconstructRound(item[5]),
            round2: reconstructRound(item[6]),
            finalData: { rights: item[7][0], wrongs: item[7][1] }
        });
    });
    return rgames;
};
