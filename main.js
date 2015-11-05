//Need to keep track of stuff for the current game, let's make that an object with a constructor

var $board = $('.board');

//The turn around should maybe be in the Game object, maybe rename to turnPicks
// var turn = [];

var currentGame;

var $turnCounter = $('#turns');
var $matchesLeft = $('#matches-left');

var Game = function(numPairs) {
	this.numPairs = numPairs;
	this.numTurns = 0;
	this.cards = [];
	this.numMatchesLeft = numPairs;
	this.turnPicks = [];
};

Game.prototype.getCards = function() {
	for (var i=0; i < this.numPairs; i++) {
		this.cards.push(new Card(i));
		this.cards.push(new Card(i));
	}
};

Game.prototype.deal = function() {
	this.cards.forEach(function(card) {
		card.place();
	});
};

Game.prototype.startGame = function() {
	this.getCards();
	//TODO: SHUFFLE!!!!
	//this.shuffle()
	this.deal();
	$turnCounter.text(this.numTurns);
	$matchesLeft.text(this.numMatchesLeft);
};

Game.prototype.evaluateTurn = function() {
	if (this.turnPicks[0].value === this.turnPicks[1].value) {
		//TODO: flash a message in the match display div instead
		console.log('MATCH!');
		this.numMatchesLeft--;
		$matchesLeft.text(this.numMatchesLeft);
		//TODO: if numMatchesLeft === 0, end game!
	} else {
		this.turnPicks.forEach(function(card) {
			window.setTimeout(function() {
				card.reset();
			}, 2000);
		});
	}
	this.numTurns++;
	$turnCounter.text(this.numTurns);
	this.turnPicks = [];
};


var Card = function(value) {
	this.value = value;
	this.$div = $('<div>');
	this.$div.addClass('card back');
	//Eventually this will get changed to set an image value
	this.$div.text(this.value);
};

Card.prototype.flip = function() {
	this.$div.toggleClass('back');
	this.$div.toggleClass('front');
};

Card.prototype.place = function() {
	$board.append(this.$div);
	this.activate();
};

Card.prototype.activate = function() {
	var card = this;
	this.$div.one('click', function() {
		card.choose();
	});
};

Card.prototype.choose = function() {
	this.flip();
	currentGame.turnPicks.push(this);
	if (currentGame.turnPicks.length > 1) {
		currentGame.evaluateTurn();
	}
};

Card.prototype.reset = function() {
	this.flip();
	this.activate();
};



//TODO: New Game button

currentGame = new Game(10);
currentGame.startGame();
// currentGame.getCards();
// currentGame.deal();