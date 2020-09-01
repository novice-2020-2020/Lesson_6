const readline = require('readline-sync');
const cards = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  A: [1, 11],
  J: 10,
  K: 10,
  Q: 10
};
const BLACKJACK = 21;
const DEALERLIMIT = 17;
const VALIDHITORSTAYS = ['hit', 'h', 'stay', 's'];
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
    for (let index = 0; index < 4; index++) {
      deck.push(card);
    }
  });
  return deck;
}

function dealCards(deck, arr, scoreArr) {
  let card = deck.splice(Math.floor(Math.random() * deck.length), 1).toString();
  let score = scoreArr.reduce((accum, num) => accum + num, 0);
  if (score <= 10 && card === 'A') {
    arr.push(card);
    scoreArr.push(11);
  } else if (score > 10 && card === 'A') {
    arr.push(card);
    scoreArr.push(1);
  } else {
    arr.push(card);
    scoreArr.push(Number(cards[card]));
  }
}

function firstMove(deck, arr, scoreArr) {
  for (let index = 0; index < 2; index++) {
    dealCards(deck, arr, scoreArr);
  }
}


function calcScore(scoreArr) {
  return scoreArr.reduce((accum, num) => accum + num, 0);
}

function isBust(scoreArr) {
  return scoreArr.reduce((accum, num) => accum + num, 0) > BLACKJACK;
}

function isBlackJack(scoreArr) {
  let score = scoreArr.reduce((sum, num) => sum + num, 0);
  return score === BLACKJACK;
}

function displayInformation(cardsArr, scores, counter, currentChance = 'Player') {
  if (counter === 0 && currentChance === 'Player') {
    console.log(`The Player's deck is (${cardsArr.join(", ")}) and the score is ${calcScore(scores)}`);
  } else if (counter === 0 && currentChance === 'Dealer') {
    console.log('The Dealer\'s deck is (' + (cardsArr[0] + ', ' + 'X)'));
  } else {
    console.log(`The ${currentChance}'s deck is (${cardsArr.join(", ")}) and the score is ${calcScore(scores)}`);
  }
}

function playerHitOrStay() {
  let decision = readline.question("\nWould you like to Hit or Stay: ").toLowerCase().trim();
  while (true) {
    if (VALIDHITORSTAYS.includes(decision)) {
      if (decision[0] === 'h' || decision[0] === 's') return decision;
    } else {

      decision = readline.question("\nNot a valid response, would you like to Hit or Stay: ").toLowerCase().trim();
    }
  }
}

function playerPlays(deck, playerCards, playerScores, playerCounter) {
  playerCounter += 1;
  while (true) {
    if (isBlackJack(playerScores)) {
      displayInformation(playerCards, playerScores);
      console.log(`${currentChance} hit BlackJack`);
      break;
    } else if (isBust(playerScores)) {
      console.log('Player is bust');
      break;
    } else if (playerHitOrStay() === 's') {
      // displayInformation(playerCards, playerScores);
      console.log(`\nPlayer stayed the game. The Player's deck is (${playerCards.join(", ")}) and the score is ${calcScore(playerScores)}\n`);
      break;
    } else {
      dealCards(deck, playerCards, playerScores, playerCounter);
      displayInformation(playerCards, playerScores);
    }
  }
  currentChance = 'Dealer';
}

function dealerHitOrStay(deck, dealerScores) {
  while (calcScore(dealerScores) <= DEALERLIMIT) {
    dealCards(deck, dealerCards, dealerScores, dealerCounter);
    calcScore(dealerScores);
  }
}

function dealerPlays(deck, dealerCards, dealerScores) {
  dealerCounter += 1;
  while (calcScore(dealerScores) <= DEALERLIMIT || !isBust(dealerScores) || !isBlackJack(dealerScores)) {
    dealerHitOrStay(deck, dealerScores);
    displayInformation(dealerCards, dealerScores, dealerCounter, 'Dealer');
    if (isBust(dealerScores)) {
      console.log('Dealer bust');
      break;
    } else if (isBlackJack(dealerScores)) {
      console.log('Dealer hit BlackJack');
      break;
    }
    break;
  }
}

function result(playerScores, dealerScores) {
  if (isBust(playerScores)) {
    return `Dealer Wins`;
  } else if (isBust(dealerScores) && !isBust(playerScores)) {
    return `Player Wins`;
  } else if (isBlackJack(dealerScores) && !isBlackJack(playerScores)) {
    return `Dealer Wins`;
  } else if (!isBlackJack(dealerScores) && isBlackJack(playerScores)) {
    return `Player Wins`;
  } else if (calcScore(playerScores) > calcScore(dealerScores)) {
    return `Player Wins`;
  } else if (calcScore(playerScores) < calcScore(dealerScores)) {
    return `Dealer Wins`;
  } else {
    return `Tie!`;
  }
}

function playTwentyOne() {
  console.clear();
  let deck = initializeDeck();
  firstMove(deck, playerCards, playerScores);
  displayInformation(playerCards, playerScores, playerCounter);
  firstMove(deck, dealerCards, dealerScores);
  displayInformation(dealerCards, dealerScores, dealerCounter, 'Dealer');
  playerPlays(deck, playerCards, playerScores, playerCounter);
  if (isBust(playerScores)) {
    return 'Dealer Wins!';
  }
  dealerPlays(deck, dealerCards, dealerScores);
  return (result(playerScores, dealerScores));
}

playTwentyOne();
