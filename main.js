//Need to keep track of stuff for the current game, let's make that an object with a constructor

var $board = $('.board');

var turn = [];

var currentGame;

var $turnCounter = $('#turns');

var Game = function(numPairs) {
	this.numPairs = numPairs;
	this.turns = 0;
	this.cards = [];
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
	turn.push(this);
	if (turn.length > 1) {
		evaluateTurn();
	}
};

var evaluateTurn = function() {
	if (turn[0].value === turn[1].value) {
		console.log('MATCH!');
		//TODO: flash a message in the match display div instead
	} else {
		// I THINK I NEED A CLOSURE HEEEEEERE
		// window.setTimeout(function() {
		turn[0].flip();
		turn[0].activate();
		turn[1].flip();
		turn[1].activate();
		// }, 2000);
	}
	currentGame.turns++;
	$turnCounter.text(currentGame.turns);
	turn = [];
};



currentGame = new Game(6);
currentGame.getCards();
currentGame.deal();