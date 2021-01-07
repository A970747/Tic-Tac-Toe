"use strict";

let game = {};
game.moves = [];
game.startingPlayer = '';
game.haveWinner = false;

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
]

game.playGame = function play() {
}

const $ = document.querySelector.bind(document);

const skip = $('.skip')
const playerNames = $('.playerNames');
const choosePlayer = $('.choosePlayer');
const goButton = $('button[type="submit"]')

goButton.addEventListener('click', function hide(event) {
  event.preventDefault();
  console.log('yayayay');
})

skip.addEventListener('click', function hide() {
  playerNames.classList.toggle('hide');
  choosePlayer.classList.toggle('hide');
})

const gameBoard = document.querySelector('.gameBoard');
gameBoard.addEventListener('click', function setSquareState(event) {
  console.log(event.target.value);
})

document.addEventListener("DOMContentLoaded", function() {
  game.playGame();
})
