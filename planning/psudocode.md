### psudocode

- when you start game, render a blank score card and a blank scoreboard
  - blank scorecard has 12 different "boxes" to fill out over the course of 12 turns
  - blank scoreboard shows all 12 of these boxes along with totals for 6 rounds
  - create Card class with properties for each box (1s,2s,3s...) - starts with null? properties
  - each new round will create a new instance of the Card class
  - might not show scoreboard as option (in mobile) until round is finished

- each game has 6 rounds, each round has 12 turns, each turn has up to 3 rolls (need counters for both)

- roll
  - initial roll has 5 blank dice 
  - roll will require up to 5 random numbers from 1-6
  - need logic to 'freeze' dice (either adding/removing listeners or if statements on dice properties?). if 3 are frozen, roll the other 2
  - maybe an animation but want game to be snappy
  - each roll will need to reduce a roll counter

- after each roll, option to record score by clicking box (event listener)
  - i'm thinking click once to show potential score (will need to calculate score for that box based on showing dice) and click 2nd time to record. either that or show faded potential scores for all available boxes and click to record.
  - will need logic to disable boxes that have been picked already
  - update property in Card object with recorded score
  - render new score in its box

- after recording score, reset dice and set counters for next turn
  - clear the dice for new turn
  - reset roll counter to 3
  - reduce turn counter by 1

- after 12 turns, board will be filled out
  - render round in scoreboard
  - reset scorecard and start again

### BEING AMBITIOUS

- could implement multiple players

### UI Condiderations

- want the game to be snappy and move quickly
- boxes and buttons need to be big enough to click on mobile

