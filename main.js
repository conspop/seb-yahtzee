// CONSTANTS
//-----------

//class defining properties of a fresh card
class Card {
  constructor () {
    this.ones = null;
    this.twos = null;
    this.threes = null;
    this.fours = null;
    this.fives = null;
    this.sixes = null;
    this.bonus = null;
    this.top = null;
    this.smallStraight = null;
    this.largeStraight = null;
    this.fullHouse = null;
    this.threeOfAKind = null;
    this.fourOfAKind = null;
    this.yahtzee = null;
    this.chance = null;
    this.bottom
    this.total
  }

  calculateTotals() {
    // toggle bonus if top >= 63
    if (
      this.ones +
      this.twos +
      this.threes +
      this.fours +
      this.fives +
      this.sixes >=63 ) {
        this.bonus = 35;
    };
    // calculate total for top
    this.top = 
      this.ones +
      this.twos +
      this.threes +
      this.fours +
      this.fives +
      this.sixes +
      this.bonus;
    //calculate total for bottom
    this.bottom = 
      this.smallStraight +
      this.largeStraight +
      this.fullHouse +
      this.threeOfAKind +
      this.fourOfAKind +
      this.yahtzee +
      this.chance;
    //calculate total
    this.total = this.top + this.bottom;
  }
}

//class defining properties of dice
class Die {
  constructor () {
    this.value = null;
    this.frozen = false;
  }

  roll() {
    let random = Math.floor(Math.random() * 6) + 1
    this.value = random
  }

  clear() {
    this.value = "";
    this.frozen = false;
  }
}

let diceImgs = {
  '1':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/U%2B2680.svg/120px-U%2B2680.svg.png',
  '2':'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/U%2B2681.svg/120px-U%2B2681.svg.png',
  '3':'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/U%2B2682.svg/120px-U%2B2682.svg.png',
  '4':'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/U%2B2683.svg/120px-U%2B2683.svg.png',
  '5':'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/U%2B2684.svg/120px-U%2B2684.svg.png',
  '6':'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/U%2B2685.svg/120px-U%2B2685.svg.png'
}

// STATE VARIABLES
//------------------

//array containing all of the players cards
let cards = [];

//counter for 6 rounds in a game
let round = 1

//counter for 12 turns in each round
let turn = 1

//counter for 3 rolls in a turn
let roll = 1

//array of 5 dice objects
let diceArr = []

//variables for high score and past scores(used in average)
let highScore;
let pastScores = [];

//CACHED ELEMENT REFERENCES
//--------------------------

//cache dice row
let diceRowEl = document.querySelector('.dice-row');

//cache boxes container
let boxesEl = document.querySelector('.boxes');

//cache element for roll button
let rollButtonEl = document.querySelector('button');

//cache all dice elements
let allDice = document.querySelectorAll('.dice')

//cache total elements
let bonusEl = document.getElementById('bonus-score');
let topEl = document.getElementById('top-score');
let bottomEl = document.getElementById('bottom-score');
let totalEl = document.getElementById('total-score');

//EVENT LISTENERS
//----------------

//toggle frozen dice when clicked
diceRowEl.addEventListener('click',toggleFrozen)

//roll dice when roll button is clicked
rollButtonEl.addEventListener('click',rollUnfrozenDice);

//record score when box is clicked
boxesEl.addEventListener('click',recordScore);

//roll dice when space bar is clicked
document.addEventListener('keyup', function(e) {
  if (e.code === 'Space') {
    rollUnfrozenDice()
  }
})

// FUNCTIONS
//-----------

//initialize app
function init() {
  //create objects for all 5 dice at the beginning of the game
  for (let i = 1; i<=5; i++) {
    diceArr.push(new Die());
  }

  //create first card
  cards.push(new Card());

  //pulls high score and past scores, calculates average score
  highScore = localStorage.getItem('high-score')
  pastScores = JSON.parse(localStorage.getItem('past-scores'))
  if (pastScores) {
    let avgScore = pastScores.reduce((sum,score) => sum + score) / pastScores.length
    document.getElementById('avg-score-score').textContent = avgScore.toFixed(0);
  }
  if (highScore) {
    document.getElementById('high-score-score').textContent = highScore;
  }
  if (pastScores === null) pastScores = []
  if (highScore === null) highScore = 0
  pastScores.push(0);
}

//rolls all of the unfrozen dice 
function rollUnfrozenDice() {
  //roll all unfrozen dice
  if (roll <= 3) {
    diceArr.forEach((die,i) => {
      if (!die.frozen) {
        die.roll();
        document.getElementById(i).style.backgroundImage = 'none'
        document.getElementById(i).style.backgroundImage = `url(${diceImgs[diceArr[i].value.toString()]})`
      }
    })
    roll += 1
  } 
  //update the number of rolls left message
  if (roll = 3) {
    rollButtonEl.textContent = `1 ROLL LEFT`
  } else if(roll <= 2) {
    rollButtonEl.textContent = `${4 - roll} ROLLS LEFT` 
  } else {
    rollButtonEl.textContent = `RECORD A SCORE`
    rollButtonEl.style.backgroundColor = 'orange'
  }
}

//reset everything after a score is recorded
function resetTurn() {
  // clears all dice, makes background white and renders them
  document.querySelectorAll('.dice').forEach(die => die.style.backgroundImage = 'url(dice/empty.png)')
  rollButtonEl.style.backgroundColor = 'green'
  document.querySelectorAll('.dice').forEach(die => die.style.backgroundColor = 'white')
  diceArr.forEach (die => die.clear())
  renderTotals();
  // resets roll counter and updates turn counter
  roll = 1
  rollButtonEl.textContent = `${4 - roll} ROLLS LEFT` 
  turn += 1
  //if 13 turns have elapsed, move to endgame function
  if (turn > 13) endGame();
  //pushes the updated score to localStorage
  pastScores[pastScores.length - 1] = cards[round - 1].total
  localStorage.setItem('past-scores',JSON.stringify(pastScores))
}

// after your last turn, prompts you for new game
function endGame() {
  rollButtonEl.style.backgroundColor = 'blue'
  rollButtonEl.textContent = 'NEW GAME'
  rollButtonEl.removeEventListener('click',rollUnfrozenDice)
  rollButtonEl.addEventListener('click',newGame);
  pastScores[pastScores.length - 1] = cards[round - 1].total
  localStorage.setItem('past-scores',JSON.stringify(pastScores))
  let avgScore = pastScores.reduce((sum,score) => sum + score) / pastScores.length
  if(cards[round - 1].total > highScore) {
    highScore = cards[round - 1].total
    localStorage.setItem('high-score',highScore)
  }
  document.getElementById('high-score-score').textContent = highScore;
  document.getElementById('avg-score-score').textContent = avgScore.toFixed(0);
}

//resets everything for new game
function newGame() {
  cards[0] = new Card
  document.getElementById('ones-score').textContent = '';
  document.getElementById('twos-score').textContent = '';
  document.getElementById('threes-score').textContent = '';
  document.getElementById('fours-score').textContent = '';
  document.getElementById('fives-score').textContent = '';
  document.getElementById('sixes-score').textContent = '';
  document.getElementById('bonus-score').textContent = '';
  document.getElementById('small-straight-score').textContent = '';
  document.getElementById('large-straight-score').textContent = '';
  document.getElementById('full-house-score').textContent = '';
  document.getElementById('three-of-a-kind-score').textContent = '';
  document.getElementById('four-of-a-kind-score').textContent = '';
  document.getElementById('yahtzee-score').textContent = '';
  document.getElementById('chance-score').textContent = '';
  document.getElementById('top-score').textContent = '';
  document.getElementById('bottom-score').textContent = '';
  document.getElementById('total-score').textContent = '';
  round = 1
  turn = 1
  roll = 1
  diceArr = []
  for (let i = 1; i<=5; i++) {
    diceArr.push(new Die());
  }
  rollButtonEl.style.backgroundColor = 'green'
  rollButtonEl.textContent = 'ROLL #1'
  rollButtonEl.removeEventListener('click',newGame)
  rollButtonEl.addEventListener('click',rollUnfrozenDice);
  pastScores.push(0)
}

//calculates and renders totals
function renderTotals() {
  cards[round - 1].calculateTotals()
  bonusEl.innerText = cards[round - 1].bonus;
  topEl.innerText = cards[round - 1].top;
  bottomEl.innerText = cards[round - 1].bottom;
  totalEl.innerText = cards[round - 1].total;
}

//freezes die when it is clicked
function toggleFrozen(e) {
  if (roll >= 2 && roll <= 3) {
    diceArr[e.target.id].frozen = !diceArr[e.target.id].frozen;
    if (diceArr[e.target.id].frozen) {
      e.target.style.backgroundColor = "green";
    } else {
      e.target.style.backgroundColor = "white";
    }
  }
}

//creates array with the values of the dice
function diceValues() {
  let diceValueArr =[]
  diceArr.forEach(die => diceValueArr.push(die.value))
  return diceValueArr;
}

//when player clicks on a box, record score based on the dice showing
function recordScore(e) {
  if (roll > 1 && roll <=4) {
    //store the id of the clicked box in variable clickedBox
    let clickedBox = e.target.id.toString();
    let clickedParent = e.target.parentNode.id.toString();

    //ones
    if (clickedBox === 'ones' || clickedParent === 'ones') {
      if (!cards[round - 1].ones && cards[round - 1].ones != 0) {
        let onesValue = diceValues().reduce((score, dieValue) => {
          if (dieValue === 1) {
            return score + dieValue;
          } else {
            return score
          };
        },0);
        cards[round - 1].ones = onesValue;
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#ones-score').textContent = onesValue;
        resetTurn();
      } 
    }

    //twos
    if (clickedBox === 'twos' || clickedParent === 'twos') {
      if (!cards[round - 1].twos && cards[round - 1].twos != 0) {
        let twosValue = diceValues().reduce((score, dieValue) => {
          if (dieValue === 2) {
            return score + dieValue;
          } else {
            return score
          };
        },0);
        cards[round - 1].twos = twosValue;
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#twos-score').textContent = twosValue;
        resetTurn();
      };
    }

    //threes
    if (clickedBox === 'threes' || clickedParent === 'threes') {
      if (!cards[round - 1].threes && cards[round - 1].threes != 0) {
        let threesValue = diceValues().reduce((score, dieValue) => {
          if (dieValue === 3) {
            return score + dieValue;
          } else {
            return score
          };
        },0);
        cards[round - 1].threes = threesValue;
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#threes-score').textContent = threesValue;
        resetTurn();
      };
    }

    //fours
    if (clickedBox === 'fours' || clickedParent === 'fours') {
      if (!cards[round - 1].fours && cards[round - 1].fours != 0) {
        let foursValue = diceValues().reduce((score, dieValue) => {
          if (dieValue === 4) {
            return score + dieValue;
          } else {
            return score
          };
        },0);
        cards[round - 1].fours = foursValue;
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#fours-score').textContent = foursValue;
        resetTurn();
      };
    }

    //fives
    if (clickedBox === 'fives' || clickedParent === 'fives') {
      if (!cards[round - 1].fives && cards[round - 1].fives != 0) {
        let fivesValue = diceValues().reduce((score, dieValue) => {
          if (dieValue === 5) {
            return score + dieValue;
          } else {
            return score
          };
        },0);
        cards[round - 1].fives = fivesValue;
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#fives-score').textContent = fivesValue;
        resetTurn();
      };
    }

    //sixes
    if (clickedBox === 'sixes' || clickedParent === 'sixes') {
      if (!cards[round - 1].sixes && cards[round - 1].sixes != 0) {
        let sixesValue = diceValues().reduce((score, dieValue) => {
          if (dieValue === 6) {
            return score + dieValue;
          } else {
            return score
          };
        },0);
        cards[round - 1].sixes = sixesValue;
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#sixes-score').textContent = sixesValue;
        resetTurn();
      };
    }

    //small straight
    if (clickedBox === 'small-straight' || clickedParent === 'small-straight') {
      if (!cards[round - 1].smallStraight && cards[round - 1].smallStraight != 0) {
        //small straight is either 1,2,3,4  2,3,4,5 or 3,4,5,6
        let smallStraight1 = [1,2,3,4]
        let smallStraight2 = [2,3,4,5]
        let smallStraight3 = [3,4,5,6]
        let diceValuesArr = diceValues();

        //if dice includes all of either of these small straights, record 30 points for small straight
        if (
          smallStraight1.every(die => diceValuesArr.includes(die)) ||
          smallStraight2.every(die => diceValuesArr.includes(die)) ||
          smallStraight3.every(die => diceValuesArr.includes(die)) 
        ) {
          cards[round - 1].smallStraight = 30;
        } else {
          cards[round - 1].smallStraight = 0;
        }
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].smallStraight = 30;
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#small-straight-score').textContent = cards[round - 1].smallStraight;
        resetTurn();
      };
    }

    //large straight
    if (clickedBox === 'large-straight' || clickedParent === 'large-straight') {
      if (!cards[round - 1].largeStraight && cards[round - 1].largeStraight != 0) {
        //large straight is either 1,2,3,4,5 or 2,3,4,56
        let largeStraight1 = [1,2,3,4,5]
        let largeStraight2 = [2,3,4,5,6]
        let diceValuesArr = diceValues();

        //if dice includes all of either of these small straights, record 30 points for small straight
        if (
          largeStraight1.every(die => diceValuesArr.includes(die)) ||
          largeStraight2.every(die => diceValuesArr.includes(die)) 
        ) {
          cards[round - 1].largeStraight = 40;
        } else {
          cards[round - 1].largeStraight = 0;
        }
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].largeStraight = 40;
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#large-straight-score').textContent = cards[round - 1].largeStraight;
        resetTurn();
      };
    }

    //full house
    if (clickedBox === 'full-house' || clickedParent === 'full-house') {
      if (!cards[round - 1].fullHouse && cards[round - 1].fullHouse != 0) {
        //get an array of the dice values
        let diceValuesArr = diceValues();
        let isFullHouse = false;

        let diceGroupsObj = diceValuesArr.reduce(function(group,die) {
          if (group[die.toString()]) {
            group[die.toString()] += 1
          } else {
            group[die.toString()] = 1
          }
          return group;
        },{})

        //create array of values from diceGroupsObj
        diceGroupsArr = Object.values(diceGroupsObj);

        //if only 1 group, full house, if 2 groups, full house if the first array item is 2 or 3
        if (diceGroupsArr.length === 1) {
          isFullHouse = true;
        } else if (diceGroupsArr.length === 2) {
          if (diceGroupsArr[0] === 2 || diceGroupsArr[0] === 3) {
            isFullHouse = true;
          }
        }

        //if isFullHouse is true, record 25 points 
        if (isFullHouse) {
          cards[round - 1].fullHouse = 25;
        } else {
          cards[round - 1].fullHouse = 0;
        }
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].fullHouse = 25;
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#full-house-score').textContent = cards[round - 1].fullHouse;
        resetTurn();
      };
    }

    //3 of a Kind
    if (clickedBox === 'three-of-a-kind' || clickedParent === 'three-of-a-kind') {
      if (!cards[round - 1].threeOfAKind && cards[round - 1].threeOfAKind != 0) {
        //get an array of the dice values
        let diceValuesArr = diceValues();
        let isThreeOfAKind = false;

        let diceGroupsObj = diceValuesArr.reduce(function(group,die) {
          if (group[die.toString()]) {
            group[die.toString()] += 1
          } else {
            group[die.toString()] = 1
          }
          return group;
        },{})

        //create array of values from diceGroupsObj
        diceGroupsArr = Object.values(diceGroupsObj);

        //if one of the groups is 3 or great, 3 of a kind
        diceGroupsArr.forEach(function(group) {
          if (group >= 3) isThreeOfAKind = true;
        })

        //if isThreeOfAKind is true, record total value of dice
        if (isThreeOfAKind) {
          cards[round - 1].threeOfAKind = diceValuesArr.reduce((sum,die) => sum + die);
        } else {
          cards[round - 1].threeOfAKind = 0;
        }
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#three-of-a-kind-score').textContent = cards[round - 1].threeOfAKind;
        resetTurn();
      };
    }

    //4 of a Kind
    if (clickedBox === 'four-of-a-kind' || clickedParent === 'four-of-a-kind') {
      if (!cards[round - 1].fourOfAKind && cards[round - 1].fourOfAKind != 0) {
        //get an array of the dice values
        let diceValuesArr = diceValues();
        let isFourOfAKind = false;

        let diceGroupsObj = diceValuesArr.reduce(function(group,die) {
          if (group[die.toString()]) {
            group[die.toString()] += 1
          } else {
            group[die.toString()] = 1
          }
          return group;
        },{})

        //create array of values from diceGroupsObj
        diceGroupsArr = Object.values(diceGroupsObj);

        //if one of the groups is 4 or great, 4 of a kind
        diceGroupsArr.forEach(function(group) {
          if (group >= 4) isFourOfAKind = true;
        })

        //if isFourOfAKind is true, record total value of dice
        if (isFourOfAKind) {
          cards[round - 1].fourOfAKind = diceValuesArr.reduce((sum,die) => sum + die);
        } else {
          cards[round - 1].fourOfAKind = 0;
        }
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#four-of-a-kind-score').textContent = cards[round - 1].fourOfAKind;
        resetTurn();
      };
    }

    //Yahtzee
    if (clickedBox === 'yahtzee' || clickedParent === 'yahtzee') {
      if (!cards[round - 1].yahtzee && cards[round - 1].yahtzee != 0 && diceArr[0].value > 0) {
        //get an array of the dice values
        let diceValuesArr = diceValues();
        let isYahtzee = false;

        let diceGroupsObj = diceValuesArr.reduce(function(group,die) {
          if (group[die.toString()]) {
            group[die.toString()] += 1
          } else {
            group[die.toString()] = 1
          }
          return group;
        },{})

        //create array of values from diceGroupsObj
        diceGroupsArr = Object.values(diceGroupsObj);

        //if there is a group with 5, yahtzee
        diceGroupsArr.forEach(function(group) {
          if (group === 5) isYahtzee = true;
        })

        //if isYahtzee is true, record 50
        if (isYahtzee) {
          cards[round - 1].yahtzee = 50;
        } else {
          cards[round - 1].yahtzee = 0;
        }
        document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
        resetTurn();
      };
    }

    //Chance
    if (clickedBox === 'chance' || clickedParent === 'chance') {
      if (!cards[round - 1].chance && cards[round - 1].chance != 0) {
        //get an array of the dice values
        let diceValuesArr = diceValues();
        //
        cards[round - 1].chance = diceValuesArr.reduce((sum,die) => sum + die);
        
        //if yahtzee and already have a yahtzee, add yahtzee bonus in addition to adding score
        if (cards[round - 1].yahtzee >= 50) {
          if (diceValues().every(die => die === diceValues()[0])) {
            cards[round - 1].yahtzee += 100;
            document.querySelector('#yahtzee-score').textContent = cards[round - 1].yahtzee;
          }
        }
        document.querySelector('#chance-score').textContent = cards[round - 1].chance;
        resetTurn();
      };
    }
  }
}

init();