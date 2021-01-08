describe('Blog App', function() {
  beforeEach(function() {
    cy.visit('http://127.0.0.1:5500/');
  });

  it('front page can be opened', function() {
    cy.contains('Tic-Tac-Toe');
  });

  it('user can set player names', function() {
    cy.get('#player1')
      .type('testing1')
      cy.get('#player2')
      .type('testing2')
    cy.get('button[type=submit]')
      .click();

    cy.contains('testing1');
    cy.contains('testing2');

    cy.get('.player1')
    .click();

    cy.contains('mode: normal');
  });

  it('user can skip seting player names', function() {
    cy.get('.skip')
      .click();

    cy.contains('player1');
    cy.contains('player2');
  });

  it('user get to game board', function() {
    cy.get('.skip')
      .click();

      cy.get('.random')
      .click();

    cy.contains('mode: normal');
    cy.get('.gameBoard');
  });

  it('undo button renders', function() {
    cy.get('.skip')
      .click();

      cy.get('.random')
      .click();

    cy.contains('undo last');
    cy.get('button.undo');
  });

  it('change mode button renders', function() {
    cy.get('.skip')
      .click();

      cy.get('.random')
      .click();

    cy.contains('change mode');
    cy.get('button.changeMode');
  });

  it('normal rules show', function() {
    cy.get('.skip')
      .click();

      cy.get('.random')
      .click();

    cy.contains('After selecting the starting player');
    cy.get('.normalRules');
  });

  it('player1 can win', function() {
    cy.get('.skip')
      .click();

      cy.get('.player1')
      .click();

    cy.get('button[value=1]')
      .click();

    cy.get('button[value=4]')
    .click();

    cy.get('button[value=2]')
    .click();

    cy.get('button[value=5]')
    .click();

    cy.get('button[value=3]')
    .click();

    cy.contains('player1 wins');
  });

  it('player2 can win', function() {
    cy.get('.skip')
      .click();

      cy.get('.player2')
      .click();

    cy.get('button[value=3]')
      .click();

    cy.get('button[value=1]')
    .click();

    cy.get('button[value=5]')
    .click();

    cy.get('button[value=8]')
    .click();

    cy.get('button[value=7]')
    .click();

    cy.contains('player2 wins');
  });

  it('mode can be set to random', function() {
    cy.get('.skip')
      .click();

    cy.get('.player1')
      .click();

    cy.get('.changeMode')
      .click();

    cy.contains('In random mode,');
    cy.contains('mode: random');
    cy.get('.randomRules');
  });
});