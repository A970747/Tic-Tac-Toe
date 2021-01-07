"use strict";

let game = {};
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
const goButton = $('button[type="submit"]')
const boardButtons = document.querySelectorAll('#gameBoard > button');

$('.skip').addEventListener('click', setPlayerChoiceButtons)
goButton.addEventListener('click', function setPlayerNames(event) {
  event.preventDefault();
  game.player1.name = $('#player1').value || 'player1'
  game.player2.name = $('#player2').value || 'player2'
  setPlayerChoiceButtons();
})

gameBoard.addEventListener('click', handlePlayerChoice);

function handlePlayerChoice({target}) {
  if(target.getAttribute('class').includes('unplayed')) {
    playTurn(target);
  } else {
    displayErrorMessage(target);
  }
}

function playTurn(target) {
  console.log(target.value,target.getAttribute('class'));
  target.setAttribute('class', `${game[game.activePlayer].color}`);
  target.setAttribute('aria-pressed', 'true');
  target.setAttribute('aria-label', `${game[game.activePlayer].color}`);
  game[game.activePlayer].squares.push(parseInt(target.value));
  game[game.activePlayer].squares.sort();
  console.log(game.activePlayer, game[game.activePlayer].squares);
  game.moves.push([game[game.activePlayer].color, target.value]);
  (checkIfPlayerWon())
    ? endCurrentGame()
    : game.activePlayer = (game.activePlayer == 'player1') ? 'player2' : 'player1';
}

function displayErrorMessage(target) {
  if (target.name) {
    $('.messageToUser').innerHTML = `${target.name} already played for ${target.getAttribute('class')}`
    $('.messageToUser').classList.toggle('hide');
    console.log($('.messageToUser').innerHTML);
    setTimeout(function() {
      $('.messageToUser').innerHTML = ``;
      $('.messageToUser').classList.toggle('hide');
    }, 5000)
  };
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
      return true;
    }
  };
  return false;
}

function endCurrentGame() {
  console.log('game over');
  game.winner = game.activePlayer;
  boardButtons.forEach((element) => element.disabled = true);
  const div = document.createElement('div');
  div.classList.add('winnerOverlay');
  gameBoard.prepend(div);
  gameBoard.removeEventListener('click', handlePlayerChoice);
  const h3 = document.createElement('h3');
  h3.classList.add('winnerMessage');
  h3.innerHTML = `${game.winner} wins!`;
  $('.winnerOverlay').append(h3)
  const button = document.createElement('button');
  button.classList.add('playAgain');
  button.innerHTML = `play again`;
  $('.winnerOverlay').append(button)
  button.addEventListener('click', playAgain)
}

function playAgain() {
  game.player1.squares = [];
  game.player2.squares = [];
  $('.winnerOverlay').remove();
  boardButtons.forEach((element) => {
    element.setAttribute('aria-pressed', false);
    element.setAttribute('class', 'unplayed');
    element.disabled = false;
  });
  gameBoard.addEventListener('click', handlePlayerChoice);
}

function setPlayerChoiceButtons() {
  $('.player1').innerHTML = game.player1.name;
  $('.player2').innerHTML = game.player2.name;
  playerNames.classList.toggle('hide');
  choosePlayer.classList.toggle('hide');
}

choosePlayer.addEventListener('click', function setActivePlayer({target}) {
  console.log(target.getAttribute('class'));
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
  choosePlayer.classList.toggle('hide');
  gameBoard.classList.toggle('hide');
  gameBoard.classList.add('gameBoard');
})

document.addEventListener("DOMContentLoaded", function() {

})
