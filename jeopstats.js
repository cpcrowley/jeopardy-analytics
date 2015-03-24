//------------------------------------------------------------------------------
// This is the main program for the Jeopady stats site.
// % node jeopstats.js
//------------------------------------------------------------------------------
"use strict";

//------------------------------------------------------------------------------
// Connect to required modules
//------------------------------------------------------------------------------
var express = require('express');
var app = express();
var fs = require('fs');
var analyze = require('./lib/analyze.js');
var format = require('./lib/format.js');

//------------------------------------------------------------------------------
// Read in the database in JSON and convert it to internal data.
//------------------------------------------------------------------------------
var gameSummariesFileName = 'data/gameSummaries.json';
var allGamesFileName = 'data/allGames.json';

//console.log('Start reading '+gameSummariesFileName+' and '+allGamesFileName);
var gameSummaries = null;
var yearSummaries = null;
var games = null;
var numRead = 0;

fs.readFile(gameSummariesFileName, "utf-8", function(err,data){
    if(err) throw err;
    gameSummaries = JSON.parse(data);
    yearSummaries = analyze.createYearSummaries(gameSummaries);
    if(++numRead > 1) console.log('Data loaded');
});

fs.readFile(allGamesFileName, "utf-8", function(err,data){
    if(err) throw err;
    games = JSON.parse(data);
    if(++numRead > 1) console.log('Data loaded');
});

//------------------------------------------------------------------------------
// constants
//------------------------------------------------------------------------------
var daterange = 10;
var jdj = 0;


//------------------------------------------------------------------------------
// Handle the view engine
//------------------------------------------------------------------------------
//var handlebars = require('express-handlebars') .create({ defaultLayout:'main' });
//app.engine('handlebars', handlebars.engine);
//app.set('view engine', 'handlebars');


//------------------------------------------------------------------------------
// set up node.js server
//------------------------------------------------------------------------------
//var host = 'thechar.com';
var host = 'localhost';
app.set('port', process.env.port || 8081);

// Get static files from the public folder.
app.use(express.static('public'));

//------------------------------------------------------------------------------
// This serves the initial page.
//------------------------------------------------------------------------------
app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

//------------------------------------------------------------------------------
// Search route
//------------------------------------------------------------------------------
app.get('/search', function(req, res){
    if(games===null) {
        console.log('Still reading data. Try again in a few seconds.');
        return;
    };
    var html = analyze.findInClues(req.query.searchstring, games);
    res.send(html+'<hr>')
});

//------------------------------------------------------------------------------
// Basic stats route
//------------------------------------------------------------------------------
app.get('/table', function(req, res){
    console.log('table route: query:', req.query);
    if(gameSummaries===null) {
        console.log('Still reading data. Try again in a few seconds.');
        return;
    };
    // Set the global value here.
    jdj = parseInt(req.query.jdj);
    var html = format.numberCorrect(yearSummaries,
        parseInt(req.query.daterange), jdj, parseInt(req.query.dd));
    res.send(html+'<hr>')
});

//------------------------------------------------------------------------------
// Player analysis route
//------------------------------------------------------------------------------
app.get('/player', function(req, res, next){
    if(games===null) {
        console.log('Still reading data. Try again in a few seconds.');
        return;
    };
    var answers = analyze.playerResults(req.query.player, games, byround);
    var html = format.playerResults(answers);
    res.send(html+'<hr>')
});

//------------------------------------------------------------------------------
// Custom 404 page
//------------------------------------------------------------------------------
app.use(function(req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

//------------------------------------------------------------------------------
// Custom 500 page
//------------------------------------------------------------------------------
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

//------------------------------------------------------------------------------
// Listen on the port
//------------------------------------------------------------------------------
app.listen(app.get('port'), function() {
    console.log('Started on http://'+host+':'+app.get('port'));
});
