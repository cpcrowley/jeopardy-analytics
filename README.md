# Jeopardy Analytics

NOTE: this code is still being developed. I change it often and it doesn't always work.

## Steps to recreate and use data

1. RUN: `node lib/fetchGames.js`

    + WHEN: you want to get the new games recently added to j-archive.com
    + INPUT/OUTPUT: `../jeopardyData/gamesHTML` copies of j-archive.com HTML game pages
    + OUTPUT: `data/allGames.json` which has an object for every game
    + TIMING: updates take 2-10 seconds, the first run may take 20-30 minutes
    + FORMAT: `data/allGames.json`: an array of records. Each record has these fields:
        - `seasonNumber`: 1 to 32 or `superjeopardy`
        - `gameId`: used to fetch the game on j-archive.com
        - `gameNumber`: the game number Jeopardy! gives the game, different from gameId
        - `gameDate`: the data the game was first aired, in this format: `2012-09-17`
    + NOTES
        - `data/allGames.json` and the HTML files are input to the next step
        - j-archive.com site game pages --> local HTML files
        - this step insures that all the game pages on the j-archive.com have a local copy
        - this step only fetches games that do not already exist in `../jeopardyData/games`

2. RUN: `node lib/parseGames.js`

    + WHEN: you want to add the games fetched to the database
    + INPUT: `data/allGames.json` which has an object for every game
    + INPUT: `../jeopardyData/gamesHTML` copies of all j-archive HTML game pages
    + INPUT/OUTPUT: `../jeopardyData/gamesJSON` some HTML pages parsed and recorded in JSON
    + OUTPUT: `../jeopardyData/allGames.json` array of game descriptions
    + OUTPUT: `../jeopardyData/allGamesHuman.json` array of game descriptions with newlines
    + OUTPUT: `data/allGamesCompact.json` array of game compact descriptions
    + TIMING: updates to about 5 seconds, the first time takes 1-2 minutes
    + FORMAT: `../jeopardyData/allGames.json`: An array of records with these fields:
        - `seasonNumber`: 1 to 31 or `superjeopardy`
        - `gameId`: used to fetch the game on j-archive.com
        - `gameNumber`: the game number Jeopardy! gives the game, different from gameId
        - `gameDate`: the data the game was first aired, in this format: `2012-09-17`
        - `comment`: misc info about the game recorded on the web page
        - `contestants`: an array of contestants names
        - `round1`: a record of the first round, see below for the format
        - `round2`: a record of the first round, see below for the format
    + FORMAT: `round`:
        - `categories`: an array of six category names
        - `clues`: an array of clue records, see below for the format
    + FORMAT: `clue`:
        - `clueText`: string, the clue
        - `answer`: string, the answer
        - `rightAnswerBy`: string, first name of the contestant giving the correct answer, an empty string if no contestant answered correctly
        - `wrongAnswersBy`: an array of the names of the conestants who gave an incorrect answer, a zero-length array of no contestants answered incorrectly.
        - `round`: ' J' or 'DJ', the Jeopardy or Double Jeopardy round
        - `col`: the column of the clue, use this an as index into the categories array to get the category for this clue
        - `row`: 1, 2, 3, 4, or 5, the row the clue is in where 1 is the top row and 5 is the bottom row
        - `isDD`: 1 if this clue was a Daily Double otherwise 0
        - `value`: usually 200-1000 in the Jeopardy round, 400-1000 in the double jeopardy round depending on the row, BUT is this is a daily double then it is the amount the contestant bet
        - "outOfOrder`: true if this clue was picked out of "top to bottom in a column" order, that is, true if there was a clue above it in the column that had not been picked when this clue was picked
        - `order`: 1 to 30, the order this clue was picked
    + FORMAT: `data/allGamesCompact.json`: An array of records with most of the same fields as allGames.json except some or shortened and some are missing. The goal is to make this file as compact as possible and still contain the information needed for game analysis. Here are the differences:
        - `comments` field is missing
        - `contestants` field is missing
        - `categories` field is missing from a round
        - `round` is an array of clues, there is not `round` object
        - `rightAnswerBy`: 1 or 0 depending on whether the clue was answered correctly
        - `wrongAnswersBy`: 1 or 0 depending on whether the clue was answered incorrectly at least once
        - `isDD`: 1 or 0 rather than true or false
        - clue `clueText`: field is missing
        - clue `answer`: field is missing
    + NOTES
        - parses the HTML of each game in `../jeopardyData/gamesHTML`, converts it to JSON, and writes it in `../jeopardyData/gamesJSON`
        - reports the various errors
        - TODO: eight game HTML files only have one round
        - NOTE: 187 games are missed, the HTML does not record the game.
    + LATER: make a second file of clues and answers and put the index into the allGamesCompact file.
    + FIX THIS: the clue answers are not being parsed correctly.

3. RUN: `node lib/analyzeGames.js`

    + WHEN: after step 2 has produced `data/allGames.json`
    + INPUT: `../jeopardyData/allGames.json` data on all games
    + OUTPUT: `../jeopardyData/gameSummaries.json` game answers suumarized
    + OUTPUT: `../jeopardyData/gameSummariesHuman.json` summaries with newlines
    + TIMING: xxx
    + FORMAT: `data/gameSummaries.json`: any array of records with these fields:
        - "xxx`: xxx
    + NOTES
        - xxx

4. `analyze.js`

    + WHEN: xxxx
    + INPUT: `../jeopardyData/xxx` xxxx
    + OUTPUT: `../jeopardyData/xxx` xxxx
    + OUTPUT: `data/xxx.json` xxx
    + TIMING: xxx
    + FORMAT: `data/xxx.json`: x. Each record has these fields:
        - "xxx`: xxx
    + NOTES
        - xxx

5. `jeopstats.js`

    + WHEN: xxxx
    + INPUT: `../jeopardyData/xxx` xxxx
    + OUTPUT: `../jeopardyData/xxx` xxxx
    + OUTPUT: `data/xxx.json` xxx
    + TIMING: xxx
    + FORMAT: `data/xxx.json`: x. Each record has these fields:
        - "xxx`: xxx
    + NOTES
        - xxx
