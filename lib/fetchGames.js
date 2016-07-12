/* jshint node:true */
"use strict";

//------------------------------------------------------------------------------
// This node.js program fetches all the game pages at j-archive.com and
// stores them in html form in folder "games".
// See the following URLs for more information:
//------------------------------------------------------------------------------

/********
http://www.j-archive.com/showgame.php?game_id=1789
try ids from 0 to 4731

http://j-archive.com/showseason.php?season=24
seasons from 1-32 + trebekpilots + superjeopardy

http://scotch.io/tutorials/javascript/scraping-the-web-with-node-js
How to use npm to install node.js stuff
*****/

//------------------------------------------------------------------------------
// Load the modules we will need
//------------------------------------------------------------------------------
var fs      = require('fs');            // to write the html to a file
var request = require('request');       // to make http requests
var cheerio = require('cheerio');       // to parse html
var _       = require('underscore');    // functional JavaScript library
var library = require('./library.js');  // my library functions

//------------------------------------------------------------------------------
// Get the list of games already fetched
//------------------------------------------------------------------------------
var htmlGameDirectoryName = library.bigDataDir() + 'gamesHTML/';
var gameFileNames = fs.readdirSync(htmlGameDirectoryName);
if (gameFileNames === null || gameFileNames.length === 0) {
  console.log('***** ERROR: could not read directory ' + htmlGameDirectoryName);
  return;
}

console.log('Fetching games as HTML files from j-archive into ' + htmlGameDirectoryName);
console.log(gameFileNames.length + ' files already in ' + htmlGameDirectoryName);
console.log('Only games on j-archive but not already in ' + htmlGameDirectoryName +
' will be fetched\n');

var numberOfSeasons = 32;
var seasonsProcessed = 0;
var allGames = [];
var seasons = [1, 2, 3, 4, 5, 6, 'superjeopardy', 7, 8, 9, 10, 11, 12, 13, 14,
15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]

seasons.forEach(function(seasonNumber) {
  var seasonUrl = 'http://www.j-archive.com/showseason.php?season=' + seasonNumber;

  // Get the summary page for each season.
  request(seasonUrl, function (seasonError, seasonResponse, seasonHtml) {
    if (seasonError) {
      console.log('***** ERROR: fetched season page, url=' + seasonUrl +
      ' error' + seasonError + ' response' + seasonResponse);
      return;
    }

    var gameRecords = parseSeasonPage(seasonHtml, seasonNumber);

    allGames = allGames.concat(gameRecords);

    // See if we have gotten every season summary page.
    seasonsProcessed += 1;
    if (seasonsProcessed >= numberOfSeasons) {
      // If so write out the JSON file of all the games.
      library.writeJSONFile(allGames, library.dataDir() + 'gameData.json', 1);
    }

    // Check for games whose HTML has not been fetched, and fetch it.
    var fetchedGames = 0;
    gameRecords.forEach(function(gameRecord) {
      var gameId = gameRecord.gameId;
      var filename = 'g' + gameId + '.html';
      // Only fetch the games if it does not already exist.
      if (gameFileNames.indexOf(filename) < 0) {
        var pathname = htmlGameDirectoryName + filename;
        var gameUrl = 'http://www.j-archive.com/showgame.php?game_id=' + gameId;
        ++fetchedGames;

        request(gameUrl, function (error, response, gameHtml) {
          if (error) {
            console.log('ERROR: url=' + gameUrl + ' error=' + error +
            ' [' + seasonNumber + ']');
            return;
          }
          fs.writeFile(pathname, gameHtml, function (err) {
            if (err) {console.log(pathname+' write error: ' + err);}
            else {console.log('Fetched and wrote new HTML file ' + pathname);}
          });
        });
      }
    });
    if (fetchedGames > 0) {
      console.log(`Processed season ${seasonNumber}: ${gameRecords.length} games, fetching ${fetchedGames} games`);
    }
  });
});

//------------------------------------------------------------------------------
// Parse a season page to get the game id of all the games in that season
//------------------------------------------------------------------------------
var parseSeasonPage = function (html, seasonNumber) {
  var $ = cheerio.load(html);

  var gameRecords = [];

  $('tr').filter(function () {
    var aElement = $(this).children().first().find('a');
    if(aElement.length === 0) {
      console.log('*****ERROR: cannot find a element in', $(this));
      return;
    }
    var parts = aElement.text().split(' ');
    var gameUrl = aElement.attr('href');
    var n4 = gameUrl.indexOf('=');
    var gameId = gameUrl.substring(n4 + 1);
    var sharpInPart0At = parts[0].indexOf('#');
    gameRecords.push({
      seasonNumber: seasonNumber,
      gameId: gameId,
      gameNumber: parseInt(parts[0].substring(sharpInPart0At+1)),
      gameDate: parts[1].substring(6)
    });
  });

  return gameRecords;
};
