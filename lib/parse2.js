"use strict";
var osmosis = require('osmosis');
var fs = require('fs'); // to write the html to a file

var gameId = 2000;
var filenameBase = 'g' + gameId;
var htmlGameDirectoryName = '../jeopardyData/gamesHTML/';
var htmlPath = htmlGameDirectoryName + filenameBase + '.html';
var gameHtml = fs.readFileSync(htmlPath/*'../jeopardyData/gamesHTML/g2000.html'*/, 'utf-8');

var clues = [];

var dumpClues = function(){
    console.log('clues', clues);
};

osmosis
    .parse(gameHtml)
    .find('td.clue_text')
    .set('text')
    .data(function(item) {
        //console.log('Found ',item);
        clues.push(item);
    });
setTimeout(dumpClues, 3000);
