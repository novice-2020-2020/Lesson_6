const readline = require('readline-sync');
const cards = {
'2': 2, 
'3': 3, 
'4': 4, 
'5': 5, 
'6': 6, 
'7': 7, 
'8': 8, 
'9': 9, 
'10': 10, 
'A': [1, 11], 
'J': 10, 
'K': 10, 
'Q': 10
}

let playerCounter = 0;
let dealerCounter = 0;
let playerCards = [];
let playerScores = [];
let dealerCards = [];
let dealerScores = [];
let currentChance = 'Player';

function initializeDeck() {
  let deck = [];
  Object.keys(cards).forEach(card => {
    for (let index = 0; index < 4; index ++) {
      deck.push(card);
    }
  })
  return deck;
}

function cardSelection(deck, arr, scoreArr) {
  let card = deck.splice(Math.floor(Math.random() * deck.length),1).toString();

  let score = scoreArr.reduce((accum, num) => accum + num, 0);

  if (score <= 10 && card === 'A') {
    arr.push(card);
    scoreArr.push(11);
  }
  else if (score > 10 && card === 'A') {
    arr.push(card);
    scoreArr.push(1);
  }
  else {
    arr.push(card);
    scoreArr.push(Number(cards[card]));
  }
}

function dealCards(deck, arr, scoreArr, counter) {
  if (counter === 0) {
    for (let i = 0; i < 2; i++) {
      cardSelection(deck, arr, scoreArr);
    }} 
  else {
    cardSelection(deck, arr, scoreArr);
  }
}

function calcScore(scoreArr) {
  return scoreArr.reduce((accum, num) => accum + num, 0)
}

function isBust(scoreArr) {
  return scoreArr.reduce((accum, num) => accum + num, 0) > 21;
}

function isBlackJack(scoreArr) {
  let score = scoreArr.reduce((sum, num) => sum+num, 0);
  return score === 21;
}

function displayInformation(cardsArr, scores) {
  console.log(`The ${currentChance}'s deck is (${cardsArr.join(", ")}), and the score is ${scores.reduce((sum, num) => sum+num, 0)}`);
}

function playerHitOrStay() {
  let decision = readline.question("Hit or Stay: ").toLowerCase().trim();
  return decision[0] === 'h' ? 'h' : 's';
}

function playerPlays(deck, playerCards, playerScores, playerCounter) {
  dealCards(deck, playerCards, playerScores, playerCounter);
  playerCounter+=1;
  displayInformation(playerCards, playerScores);
  
  while (true) {
    if (isBlackJack(playerScores)) {
      displayInformation(playerCards, playerScores);
      console.log(`${currentChance} hit BlackJack`);
      break;}

    else if(isBust(playerScores)) {
      console.log(`${currentChance} is bust`);
      // displayInformation(playerCards, playerScores);
      break;
    }
    else {
      if (playerHitOrStay() === 's') {
        displayInformation(playerCards, playerScores);
        console.log( `you stayed`);
        break;
      }
      else {
        dealCards(deck, playerCards, playerScores, playerCounter);
        displayInformation(playerCards, playerScores);
      }
    }
  }
  currentChance = 'Dealer';
}

function dealerHitOrStay(deck, dealerScores) {
  // let score = calcScore(dealerScores);
  while (calcScore(dealerScores) <= 17) {
    dealCards(deck, dealerCards, dealerScores, dealerCounter);
    calcScore(dealerScores);
  } 
}

function dealerPlays(deck, dealerCards, dealerScores) {
  dealCards(deck, dealerCards, dealerScores, dealerCounter);
  // displayInformation(dealerCards, dealerScores);
  dealerCounter+=1;
  while(calcScore(dealerScores) <= 17 || !isBust(dealerScores) || !isBlackJack(dealerScores)) {
    dealerHitOrStay(deck, dealerScores);
    displayInformation(dealerCards, dealerScores);
    if(isBust(dealerScores)) {
      console.log('Dealer bust');
      break;
    }
    else if(isBlackJack(dealerScores)) {
      console.log('Dealer hit BlackJack');
      break;
    }break;}
    
}

function result(playerPlays, dealerPlays) {
  if(isBust(playerScores) && !isBust(dealerScores)) {
    return `Dealer Wins`;
  }
  else if(isBust(dealerScores) && !isBust(playerScores)) {
    return `Player Wins`;
  }
  else if (isBlackJack(dealerScores) && !isBlackJack(playerScores)) {
    return `Dealer Wins`;
  }
  else if (!isBlackJack(dealerScores) && isBlackJack(playerScores)) {
    return `Player Wins`;
  }
  else if (calcScore(playerScores) > calcScore(dealerScores)) {
    return `Player Wins`;
  }
  else if (calcScore(playerScores) < calcScore(dealerScores)) {
    return `Dealer Wins`;
  }
  else {
    return `Tie!`
  }
}
function playTwentyOne() {
  let deck = initializeDeck();
  playerPlays(deck, playerCards, playerScores, playerCounter);
  dealerPlays(deck, dealerCards, dealerScores, dealerCounter);
  console.log(result(playerPlays, dealerPlays));
}

playTwentyOne();