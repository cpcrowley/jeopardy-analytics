/*global  _, $, document, console */
/*jshint node:true */
"use strict";

//------------------------------------------------------------------------------
// allGamesCompact.json is written as arrays to have space.
// This reconstructs it in objet form with meaningful field names
// replacing array subscripts.
//------------------------------------------------------------------------------
var recontructOneClue = function (clueArray) {
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
var recontructClues = function (cluesArray) {
    var clues = [];
    _.each(cluesArray, function (clueArray) {
        clues.push(recontructOneClue(clueArray));
    });
    return clues;
};
var recontructRound = function (cluesArray) {
    var round = {
        clues: recontructClues(cluesArray)
    };
    return round;
};
var recontructGames = function (data) {
    var rgames = [];
    _.each(data, function(item){
        rgames.push({
            seasonNumber: item[0],
            gameId: item[1],
            gameNumber: item[2],
            gameDate: item[3],
            errorCount: 0,
            round1: recontructRound(item[4]),
            round2: recontructRound(item[5]),
            finalData: { rights: item[6][0], wrongs: item[6][1] }
        });
    });
    return rgames;
};

//exports.recontructGames = recontructGames;