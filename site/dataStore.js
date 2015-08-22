"use strict";

var reconstructGames = require('./reconstructGames.js');
var refreshBoards = require('./refreshBoards.js');
var _ = require('lodash');

var games = null;
var boards = null;
var seasonRange = _.range(0, 32);
var boardRange = _.range(1, 5);
var optionsList = [
    {key:'finalJeopardyData', defaultValue: {}},
    {key:'gamesData', defaultValue: {}},
    {key:'showOptionsBlock1', defaultValue: true},
    {key:'showOptionsBlock2', defaultValue: true},
    {key:'showOptionsBlock3', defaultValue: false},
    {key:'showOptionsBlock4', defaultValue: false},
    {key:'animationDelay', defaultValue: 500},
    {key:'showCounts', defaultValue: false},
    {key:'showTotals', defaultValue: false},
    {key:'showGameBoard', defaultValue: false},
    {key:'showGraph', defaultValue: true},
    {key:'showFinalJeopardy', defaultValue: false},
    {key:'showExamples', defaultValue: false},
    {key:'showHelp', defaultValue: false}
];
var options = {};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var analyzeGamesData = function () {
    var rights = 0,
        wrongs = 0;
    var rightWrongBySeason = {};
    _.each(seasonRange, function (season) {
        rightWrongBySeason[season] = [0, 0];
    });
    
    var numberOfGames = 0;
    var numberOfRounds = 0;
    var numberOfClues = 0;

    var ddcol = [];
    var players = {};
    var numCols = 7;
    var icol;
    var colOfFirstDD;
    var clues;
    for(icol=0; icol<numCols; ++icol) {
        ddcol.push([0,0,0,0,0,0,0]);
    }

    // Go through all the games.
    _.each(games, function (gameData) {
        ++numberOfGames;
        if(gameData.round1) {
            ++numberOfRounds;
            clues = gameData.round1.clues;
            numberOfClues += clues.length;
        } else { console.log('Missing round1 in game on ' + gameData.gameDate); }
        if(gameData.round2) {
            ++numberOfRounds;
            clues = gameData.round2.clues;
            numberOfClues += clues.length;
            colOfFirstDD = -1;
            _.each(clues, function (clue) {
                if (clue.isDD) {
                    if (colOfFirstDD < 0) {
                        colOfFirstDD = clue.col;
                    } else {
                        ddcol[colOfFirstDD][clue.col] += 1;
                        ddcol[clue.col][colOfFirstDD] += 1;
                    }
                }
            });
        } else { console.log('Missing round2 in game on ' + gameData.gameDate); }
        
        _.each(gameData.players, function (playerName) {
            var playerRecord = players[playerName];
            if (!playerRecord) {
                playerRecord = { gamesPlayed: 0 };
                players[playerName] = playerRecord;
            }
            playerRecord.gamesPlayed += 1;
        });

        var finalData = gameData.finalData;
        var season = gameData.seasonNumber;
        rights += finalData.rights;
        wrongs += finalData.wrongs;
        rightWrongBySeason[season][0] += finalData.rights;
        rightWrongBySeason[season][1] += finalData.wrongs;
    });
    
    console.log('Games: '+numberOfGames);
    console.log('Rounds: '+numberOfRounds);
    console.log('Clues: '+numberOfClues);
    console.log('DDs in columns: ');
    for(icol=1; icol<numCols; ++icol) {
        console.log(icol+': '+ddcol[icol].slice(1));
    }
    
    // Analyze player data
    var totalPlayers = 0;
    var appearances1to5 = [0, 0, 0, 0, 0];
    var appearances6to10 = [[], [], [], [], []];
    //var appearancesOver10 = [];
    
    _.each(players, function (playerRecord, playerName) {
        ++totalPlayers;
        var gamesPlayed = playerRecord.gamesPlayed;
        if(gamesPlayed < 6) {
            appearances1to5[gamesPlayed-1] += 1;
        } else if(gamesPlayed < 11) {
            appearances6to10[gamesPlayed-6].push(playerName);
        } else {
            console.log(playerName + ': ' + gamesPlayed + ' games played');
        }
    });
    console.log('Total players: ' + totalPlayers);
    console.log('1 appearances: ' + appearances1to5[0]);
    console.log('2 appearances: ' + appearances1to5[1]);
    console.log('3 appearances: ' + appearances1to5[2]);
    console.log('4 appearances: ' + appearances1to5[3]);
    console.log('5 appearances: ' + appearances1to5[4]);
    console.log('6 appearances: ' + appearances6to10[0].length + ' ' + appearances6to10[0]);
    console.log('7 appearances: ' + appearances6to10[1].length + ' ' + appearances6to10[1]);
    console.log('8 appearances: ' + appearances6to10[2].length + ' ' + appearances6to10[2]);
    console.log('9 appearances: ' + appearances6to10[3].length + ' ' + appearances6to10[3]);
    console.log('10 appearances: ' + appearances6to10[4].length + ' ' + appearances6to10[4]);

    options.gamesData = {
        ddcol: ddcol,
        players: players,
        numberOfGames: numberOfGames,
        numberOfRounds: numberOfRounds,
        numberOfClues: numberOfClues
    };

    options.finalJeopardyData = {
        rights: rights,
        wrongs: wrongs,
        rightWrongBySeason: rightWrongBySeason
    };
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var getOption = function (optionName) {
    return options[optionName];
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var setOption = function (optionName, newValue) {
    // Convert "true"/"false" string values to boolean values
    if(newValue==='true') newValue = true;
    else if(newValue==='false') newValue = false;
    
    // Set the option and save it in localStorage
    options[optionName] = newValue;
    localStorage[optionName] = newValue;
    
    // For some options we need to take some actions when they are set
    var div;
    switch(optionName) {
        case 'showGraph':
            div = $('#graph-div');
            if(div.length > 0) {
                div[newValue ? 'slideDown' : 'slideUp'](options.animationDelay);
            }
            break;
        case 'showGameBoard':
            div = $('#boardTable');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
            }
            break;
        case 'showFinalJeopardy':
            div = $('#final-div');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
            }
            break;
        case 'showHelp':
            div = $('#helpDiv');
            if(div.length > 0) {
                div[newValue ? 'slideDown' : 'slideUp'](options.animationDelay);
            }
            break;
        case 'showOptionsBlock1':
            div = $('.controls-div-inline.stats-color-1');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
                refreshBoards();
            }
            break;
        case 'showOptionsBlock2':
            div = $('.controls-div-inline.stats-color-2');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
                refreshBoards();
            }
            break;
        case 'showOptionsBlock3':
            div = $('.controls-div-inline.stats-color-3');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
                refreshBoards();
            }
            break;
        case 'showOptionsBlock4':
            div = $('.controls-div-inline.stats-color-4');
            if(div.length > 0) {
                div[newValue ? 'show' : 'hide'](options.animationDelay);
                refreshBoards();
            }
            break;
    }
};


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var getOptionsFromLocalStorage = function () {
    _.each(optionsList, function (optionListItem) {
        var key = optionListItem.key;
        var savedValue = localStorage[key];
        if(_.isUndefined(savedValue)) {
            savedValue = optionListItem.defaultValue;
        }
        setOption(key, savedValue);
    });
};

//------------------------------------------------------------------------------
// This board holds basic infomation about a set of games.
// This creates initial zeroed-out versions of the boards.
//------------------------------------------------------------------------------
var createZeroedRow = function () {
    var row = [];
    for (var i = 0; i < 7; ++i) {
        row[i] = [0, 0];
    }
    return row;
};
var createZeroedBoard = function () {
    var board = [];
    for (var i = 0; i < 6; ++i) {
        board[i] = createZeroedRow();
    }
    return board;
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var init = function() {
    getOptionsFromLocalStorage();
    
    // Initialize boards to all zeros
    boards = [null]; // boards[0] is never used. Subscripts work out better that way.
    _.each(boardRange, function (boardNumber) {
        var board = {
            boardNumber: boardNumber,
            options: null,
            board1: createZeroedBoard()
        };
        var boardsBySeason = {};
        _.each(seasonRange, function (season) {
            boardsBySeason[season] = createZeroedBoard();
        });
        board.boardsBySeason = boardsBySeason;
        boards.push(board);
    });

    $.getJSON('data/allGamesCompact2.json', function (jsonData) {
        // It is recorded in JSON but compressed so we need to expand it.
        // compression consists of converting objects to arrays.
        // This saves all the fields name which are repeated for each object in an array.
        games = reconstructGames(jsonData);

        // Dump this in case I need to llok at the data representation.
        console.log('games.slice(0,10), games.slice(200,10)',
                    games.slice(0, 10), games.slice(1000, 1010));
        
        // Do some initial analysis on the data.
        analyzeGamesData();

        // Use the games data to fill the boards for display.
        refreshBoards();
    });
};


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
exports.init = init;
exports.getOption = getOption;
exports.setOption = setOption;
exports.games = function(){return games;};
exports.boards = function(){return boards;};
exports.seasonRange = seasonRange;
exports.boardRange = boardRange;

