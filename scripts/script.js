"use strict";

let game = {};
game.mode = 'normal';
game.availableSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9]
game.moves = [];
game.activePlayer = '';
game.player1 = {
  name: 'player1',
  color: 'blue',
  squares: [],
};
game.player2 = {
  name: 'player2',
  color: 'yellow',
  squares: [],
};
game.winningCombinations = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7]
]

const $ = document.querySelector.bind(document);

const playerNames = $('.playerNames');
const choosePlayer = $('.choosePlayer');
const gameBoard = $('#gameBoard');
const goButton = $('form > button[type="submit"]');
const skipButton = $('.skip');
const undo = $('.undoDiv');
const undoButton = $('.undo');
const mode = $('.mode');
const changeModeButton = $('.changeMode');
const boardButtons = document.querySelectorAll('#gameBoard > button');
const choosePlayerButtons = document.querySelectorAll('.choosePlayer > button')

goButton.addEventListener('click', setPlayerNames);
skipButton.addEventListener('click', setPlayFirstButtons)
gameBoard.addEventListener('click', handleChoice);
undoButton.addEventListener('click', undoLastTurn);
changeModeButton.addEventListener('click', switchMode);
choosePlayerButtons.forEach((element) => element.addEventListener('click', setStartingPlayer));

function setPlayerNames(event) {
  game.player1.name = $('#player1').value || 'player1'
  game.player2.name = $('#player2').value || 'player2'
  setPlayFirstButtons(event);
}

function setPlayFirstButtons(event) {
  event.preventDefault();
  $('.player1').innerHTML = game.player1.name;
  $('.player2').innerHTML = game.player2.name;
  playerNames.classList.toggle('hide');
  choosePlayer.classList.toggle('hide');
}

/**
 * Sets starting player based on user click. Sets game.mode to be displayed.
 * Reveals undo button. Shows gameboard, hides starting player choices.
 * @name setStartingPlayer
 *
 * @property {object} target - destructured event target used to get attribute of element.
 */
function setStartingPlayer({target}) {
  switch(target.getAttribute('class')) {
    case 'player1':
      game.activePlayer = 'player1';
      break;
    case 'player2':
      game.activePlayer = 'player2';
      break;
    default:
      (Math.random() > .5) 
        ? game.activePlayer = 'player1'
        : game.activePlayer = 'player2';
      break;
  };
  
  mode.innerHTML = `mode: ${game.mode}`;
  undo.classList.toggle('hide');
  choosePlayer.classList.toggle('hide');
  gameBoard.classList.toggle('hide');
  gameBoard.classList.add('gameBoard');
}

function handleChoice({target}) {
  if(target.getAttribute('class').includes('unplayed')) {
    playTurn(target);
  } else {
    displayErrorMessage(target);
  }
}

function playTurn(target) {
  $('.messageDiv').classList.add('hide');
  target.setAttribute('class', `${game[game.activePlayer].color}`);
  target.setAttribute('aria-pressed', 'true');
  target.setAttribute('aria-label', `${game[game.activePlayer].color}`);

  game.moves.push([game[game.activePlayer].color, target.value]);
  game[game.activePlayer].squares.push(parseInt(target.value));
  game[game.activePlayer].squares.sort();
  
  (checkIfPlayerWon() || game.moves.length == 9)
    ? endCurrentGame()
    : game.activePlayer = (game.activePlayer == 'player1') ? 'player2' : 'player1';
}

function checkIfPlayerWon() {
  for (const set of game.winningCombinations) {
    const check = set.reduce((bool, number) => {
      if (bool === false) { 
        return false 
      } else {
        return (game[game.activePlayer].squares.includes(number))
      }
    }, true)
    
    if (check) {
      game.winner = game.activePlayer;
      return true;
    }
  };
  return false;
}

function endCurrentGame() {
  boardButtons.forEach((element) => element.disabled = true);
  gameBoard.removeEventListener('click', generateChoice);
  gameBoard.removeEventListener('click', handleChoice);
  undoButton.disabled = true;

  createElementAndAppend('div', 'winnerOverlay', '', gameBoard);
  const winnerOverlay = $('.winnerOverlay')

  if(game.moves.length == 9 && !game.winner) {
    createElementAndAppend('h3', 'winnerMessage', `It's a tie!`, winnerOverlay)
    $('.winnerMessage').classList.add('white');
  } else {
    game.winner = game.activePlayer;
    createElementAndAppend('h3', 'winnerMessage', `${game.winner} wins!`, winnerOverlay)
    $('.winnerMessage').classList.add(`${game[game.activePlayer].color}`);
  }

  createElementAndAppend('button', 'playAgain', 'play again', winnerOverlay);
  $('.playAgain').addEventListener('click', playAgain)
}

function playAgain() {
  game.activePlayer = (game.winner == 'player1') ? 'player2' : 'player1'
  game.player1.squares = [];
  game.player2.squares = [];
  game.moves = [];
  game.winner = '';

  $('.winnerOverlay').remove();

  boardButtons.forEach((element) => {
    element.setAttribute('aria-pressed', false);
    element.setAttribute('class', 'unplayed');
    element.disabled = false;
  });

  if(game.mode == 'random') {
    game.availableSquares = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    gameBoard.addEventListener('click', generateChoice);
  } else {
    gameBoard.addEventListener('click', handleChoice);
  }
  undoButton.disabled = false;
}

function switchMode() {
  game.mode = (game.mode == 'normal') ? 'random' : 'normal'
  if(game.mode == 'random') {
    if(game.moves.length > 0) {
      const playedMoves = game.moves.map((move) => parseInt(move[1]))
      game.availableSquares = game.availableSquares.filter((number) => (!playedMoves.includes(number)) ? true : false);
    }

    mode.innerHTML = `mode: ${game.mode}`;
    gameBoard.removeEventListener('click', handleChoice);
    gameBoard.addEventListener('click', generateChoice);
  } else {
    mode.innerHTML = `mode: ${game.mode}`;
    gameBoard.removeEventListener('click', generateChoice);
    gameBoard.addEventListener('click', handleChoice);
  }

  $('.normalRules').classList.toggle('hide');
  $('.randomRules').classList.toggle('hide');
}

function generateChoice() {
  const choice = Math.floor(Math.random() * game.availableSquares.length)
  const target = $(`button[value='${game.availableSquares[choice]}']`)
  game.availableSquares = game.availableSquares.filter((number) => (number != game.availableSquares[choice]) ? true : false);
  playTurn(target);
}


function undoLastTurn() {
  if (game.moves.length > 0 ) {
    const lastValue = game.moves.pop();
    game.activePlayer = (game.activePlayer == 'player1') ? 'player2' : 'player1';
    game[game.activePlayer].squares = game[game.activePlayer].squares.filter((number) => number !== parseInt(lastValue[1]))
    $(`button[value='${lastValue[1]}']`).setAttribute('class', 'unplayed');

    if(game.mode == 'random') {
      game.availableSquares.push(parseInt(lastValue[1]));
      game.availableSquares.sort();
    }
  }
}

function createElementAndAppend(element, className, text = '', appendTo) {
  const newElement = document.createElement(`${element}`);
  newElement.classList.add(`${className}`);
  newElement.innerHTML = `${text}`;
  appendTo.append(newElement);
}

function displayErrorMessage(target) {
  if (target.name) {
    $('.messageToUser').innerHTML = `${target.name} already played for ${target.getAttribute('class')}`
    $('.messageDiv').classList.remove('hide');
  };
}

document.addEventListener("DOMContentLoaded", function() {

})