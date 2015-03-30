# Jeopardy

## The Jeopardy Board

The Jeopardy board has five *rows* and six *columns*.
Each square on the board will be called a *cell*.
Each column is a *category* but in this analysis we will only not be
concerned with the actual content of the clues and responses so
we will just use the word *column*.

A Jeopardy game consists of two rounds, Jeopardy and Double Jeopardy.
The dollar value of the answers is doubled in Double Jeopardy.

The board has five rows which we will number one to five.
Going to higher numbered rows will be called *going down the rows*.
In the Jeopardy round the dollar values of the five rows are:
$200, $400, $600, $800, and $1000.
In the Double Jeopardy round the dollar values of the five rows are:
$400, $800, $1200, $1600, and $2000.

A Jeopardy game has three *contestants*.

The words written on a board cell are called the *clue*.
When a contestant answers they give a *response*.

## Correct responses

### How often are correct responces made?

The correct response percentage is:

* Both rounds: 85%
* Jeopardy round: 88%
* Double Jeopardy round: 82%

So it is true that Double Jeopardy is harder but the difference is not large.


### How much harder do the clues get as you move down the rows?

Here is the percent correct responses by row:

1. 95%
2. 91%
3. 86%
4. 80%
5. 71%

The clues do get harder as you go down the row, the percentage drops about 4% a row.
Row 5 is especially hard, from 80% to 71% correct going from row 4 to row 5.

Here are the percent of correct responses by row and by round: Jeopardy / Double Jeopardy

1. 96% / 95%
2. 93% / 89%
3. 89% / 83%
4. 84% / 76%
5. 76% / 66%

So the Double Jeopardy round has harder questions both overall and by row.


### Does clue hardness vary by columns?

Not by much, the middle four columns are indistinguishable
but the left-hand column is consistently a litle harder (2% less) than the rest
and the right-hand column is consistently a little easier (2% more) than the rest.


### How does the number wrong vary by rows?

Here is the percent wrong responses by row:

1. 8%
2. 10%
3. 13%
4. 15%
5. 16%

So as the clues get harder down the row the number of wrong responses increases but not by a lot.


## Daily Double Analysis

### Are Daily Doubles harder than other clues?

The above figures combine regular clues with Daily Doubles.
In this section we will separate these and compute the percentages separately.

Here is the percent answered correctly for regular clues / daily doubles:

* Both rounds: 86% / 65%
* Jeopardy round: 89% / 67%
* Double Jeopardy round: 83% / 64%

The Daily Double clues are considerably harder than the regular clues.
Note that the percent correct for regular clues is a bit up from the
percentages for all clues in above sections.

These figures are misleading though since they include all five rows.
The rows get harder as you go down and there are more daily doubles
in the lower rows so these results need breaking out.

### Are Daily Doubles harder than other clues by row?

Here are the percent answered correctly by row, regular clues / Daily Doubles (both rounds):

1. 96% / 56%
2. 92% / 73%
3. 87% / 68%
4. 82% / 64%
5. 72% / 60%

The daily double clues in each row are considerably harder than the regular clues in that row,
roughly 20% fewer correct answers down the board.
Like the regular clues, the daily doubles also get harder as we go down the board,
with roughly the same drops per row (about 4-5% per row).
The main difference is that, for regular clues, there is a large difference between
rows 4 and 5, with a 10% drop in percent correct (double the drops between other rows).

You can safely ignore the results for row 1 since there are so few data points that
the statistics mean little.
In 31 seasons and almost 5000 games a Daily Double has been in row 1 only 16 times.
Compare that with over 5000 times in row 4.


## Final Jeopardy

Anyone watching Jeopardy knows that the Final Jeopardy questions can get very hard.
It is not uncommon for all three players to miss the Final Jeopardy question.
Overall players get 49% correct on final jeopardy questions.

As we saw above, 85% of the clues in the game are answered correctly.
Even the hardest game questions, row 5 Daily Doubles, are answered correctly 60% of the time.



## Variations over the years

TODO



## Daily Double Hunting

Typically the contestants picks the clues in a row from top to bottom, row 1 to row 5.
But the daily doubles are most commonly found in rows 4, then row 3, then row 5.
A contestant gets a big advantage getting a daily double since they can bet as much
as they want and they don't have to compete with the other contestants for the answer.
As a consequence, contestents often jump into columns in row 3 or 4.
We call this *Daily Double hunting*.

The home viewer tend not to like this since they don't get to see the category unfold
by seeing the easier questions first.

Once question is whether this affects the contestants, that is, do they do better or worse on
clues found during hunting?

First let's look at all cases where clues are chosen out of the usual row 1 to row 5 order.
We will distinguish between *first-time out of order* where the first clue chosen in a column
is not in row 1 and *any out of order* where a clue is chosen in a column when there are
still unchosen clues in an eariler row.
We will exclude clues out of order that turn out to be daily doubles.
Here is the number of correct responses in three cases:
all clues in or out of order / clues out of order / clues first out of order:

1. 96% / --- / ---
2. 92% / 92% / 89%
3. 87% / 87% / 87%
4. 82% / 82% / 82%
5. 72% / 72% / 72%


NOTE TO SELF: actually row 1, any out of order is not zero, look into that and see what is wrong.


So there is no difference in the percent of correct responses when clues are taken out of order.
One might think that not seeing how the category works would affect the rate but it seems not.

Now we will look at the same statistics but for daily doubles only:

1. 56% / --- / ---
2. 73% / 73% / 88%
3. 68% / 68% / 72%
4. 64% / 65% / 66%
5. 60% / 59% / 71%

In all cases the percentage correct is greater on out-of-order daily doubles than in order daily doubles.
in the cases of rows 2 and 5 the difference is quite large.
Going out of order would seem to be a disadvantage but the correct response percentage is higher
for out of order cases.
One possible explanation for this is that out of order daily doubles are most commonly found
by contestants who are hunting for daily double and therefor using a more sophisticated
Jeopardy strategy than the contestants who encounter daily doubles in order of going down a column.
These contestants might alos have studied for or just be better player and so they get a higher
percentage correct.






### Daily Double Analytics

#### Where are the daily doubles?

Anyone who watches Jeopardy for a while notices that daily doubles rarely occur in the first row.
It is even unusual to find them in the second row.
The third and fourth rows are where they seem to occur the most.
The sign that a player is "hunting" for a Daily Double is that the player chooses the to start
a column in the third or fourth row.

Here is where the daily doubles are most often found by row:
1. 0%
2. 9%
3. 27%
4. 39%
5. 26%

This is way serious Daily Double hunters start in the fourth row.
After the fourth row they usually go to the third row since the clues are
easier there than in the fifth row (see the next section).

#### Do daily doubles vary by column?

A little but not by much.

SHOW GRAPH



The [Flowing Date](http://flowingdata.com/2015/03/03/where-to-find-jeopardy-daily-doubles)
site has an entertaining interactive graphic of where daily doubles are found.







The appearance of Arthur Chu on Jeopardy in 2014 caused a lot of internet comment.
A lot of the commentary was his use of "game theory" to win.
What he had done was to look at web sites and books that discussed best strategies
for Jeopardy, added some of his own, and developed a distictive playing stategy.
The most obvious feature was his tendency to "jump around", that is, not to go
down the board in a category from the easiest to hardest questions but to jump
into the middle of categories and jump between categories.

The main advantage of this strategy is that it increases your chance of finding the Daily Doubles.
Finding a Daily Double is an advantage to the player for several reasons.
First the player can wager a large amount of money (up to as much as the player has) on the clue.
This allows a player to win a lot of money quicky and either catch up to a leading
player or take a commanding lead which discourages the other players.
Second the player does not have to compete with any other players to answer the question.
The player can take the time to think about the answer and answer carefully.
Third the plater deprives the other player from getting the advantages of a Daily Double.
So play who is a ways ahead can find the Daily Doubles and prevent another player from quickly catching up.

Another advantage of jumping around is that it can rattle the other player.
The choosing player knows which category is next but the other players do not whoch gives
the choosing player a slight time advantage.








## Jeopardy Analysis

Articles can analyze Jeopardy from two points of view: playing strategy and clue content.

### Category, Clue and Answer Content

Some articles look at the clues and categories themselves:
how often is there a geography category,
how often is a state the answer to a clue,
how often are English kings mentioned,
etc.

This information is useful for players preparing for the game in that is gives pointers
and what to study and how much time to spend on different topics.

This information is also interesting to viewers.


### Playing Stategies

More common are articles on playing strategies:
how much should you bet on Daily Doubles,
should you "hunt" for Daily Doubles,
what is the best wagering strategy for Final Jeopardy,
etc.

There is pretty much universal agreement that it is advantageous to hunt for Daily Doubles.
The problem is that this strategy is unpopular with viewers.





## Data from tht J! Archive

278,640 clues and counting!

List of tournaments and special play prizes
[http://www.j-archive.com/listprizes.php]

### For each season (no overall statistics)

#### Daily double statistics: For each season
* when it is found
* by which podium
* how much people risked
* true daily doubles, and wagers below the clue's value
* high, low, average wagers
* number and percent correct by row and overall
* ================== check with my stats, add ability to look at one season only.

#### Final Jeopardy statistics
* correct distribution responces
* Shore's conjecture, lots of final jeopardy wagering strategy
* List of all final jeopardy questions and categories

#### Miscellaneous statistics
* scores, number correct, etc etc

### For each game:
* contestants
* all clues, all answers
* Alex's comments
* order clues were picked
* right and wrong answers
* daily doubles, with bet and outcome
* scores at each break
* final jeopardy clue, answer, right, wrong, bets


## Web articles

### Data Analysis

The J! Archive
[http://www.j-archive.com/]

n-grams, most popular clues
[http://time.com/42984/jeopardy-interactive/]

Most valuable state
[http://www.slate.com/articles/arts/culturebox/2014/05/jeopardy_map_the_dollar_value_of_american_locales_as_determined_by_alex.html]

Where the daily double are, nice interactive graphic
TODO: check out this page and see how they do the graphic
[http://flowingdata.com/2015/03/03/where-to-find-jeopardy-daily-doubles/]

Final Wager blog
[http://thefinalwager.co/]

### Stategy

Jeopardy game theory
[http://bgr.com/2015/03/18/final-jeopardy-betting-strategy/]


### Commentary

Jeopary Fails
[http://www.salon.com/2014/02/05/the_seven_biggest_jeopardy_fails_ever/]

Video clips, awkward moments
[http://mashable.com/2014/04/04/alex-trebek-suit-jeopardy/]


### Archur Chu

Profile, months later
[http://www.theawl.com/2015/02/the-ombudsnerd]

Game thoery, lots of good comments
[http://www.metafilter.com/136347/The-Prisoners-Dilemma-For-100-Alex]

Arthur Chu, game theory
[http://www.thewire.com/entertainment/2014/01/jeopardys-newest-star-proves-optimal-strategy-really-unfriendly/357609/]

Arthur Chu interview, stragies
[http://mentalfloss.com/article/54853/our-interview-jeopardy-champion-arthur-chu]

Arthur Chu, Salon
[http://www.salon.com/2014/02/04/in_praise_of_arthur_chu_the_game_theory_nerd_who_broke_jeopardy/]

Arthur Chu, Mashable
[http://mashable.com/2014/02/05/jeopardy-arthur-chu/]

Arthur Chu, videos
[http://kotaku.com/meet-the-man-who-hacked-jeopardy-1516792430]

Ken Jennings on Arthur Chu
[http://www.slate.com/articles/arts/culturebox/2014/02/ken_jennings_on_jeopardy_champion_arthur_chu_and_daily_double_hunting.html]


### Julia Collins

Julia Collins, gender, lots of comments
[http://www.metafilter.com/139490/Gender-and-Jeopardy]

Julia Collins, stragies
[http://www.washingtonpost.com/blogs/wonkblog/wp/2014/05/29/how-to-dominate-jeopardy-like-julia-collins/]

Julia Collins
[http://mashable.com/2014/06/02/julia-collins-jeopardy-over/]

Julia Collins, reintroduce the five-game linmit
[http://www.salon.com/2014/06/02/julia_collinss_legendary_jeopardy_run_proves_we_need_a_five_win_limit/]
