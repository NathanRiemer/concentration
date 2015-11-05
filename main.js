//Need to keep track of stuff for the current game, let's make that an object with a constructor

var $board = $('.board');

var turn = [];

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
	var card = this;
	this.$div.on('click', function() {
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
	//
};



var newGame = new Game(6);
newGame.getCards();
newGame.deal();