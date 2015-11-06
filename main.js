//Need to keep track of stuff for the current game, let's make that an object with a constructor

//TOP PRIORITIES:
//NEW GAME BUTTON (WITH SIZE SELECTOR)
//IMAGES INSTEAD OF NUMBERS
//HIGH SCORE GALLERY
//TIMER

var $board = $('.board');

var $turnCounter = $('#turns');
var $matchesLeft = $('#matches-left');
var $display = $('.display');

var Game = function(numPairs) {
	this.numPairs = numPairs;
	this.numTurns = 0;
	this.cards = [];
	this.numMatchesLeft = numPairs;
	this.turnPicks = [];
	var game = this;

	this.Card = function(value) {
		this.value = value;
		this.$div = $('<div>');
		this.$div.addClass('card back');
		//Eventually this will get changed to set an image value
		this.$div.text(this.value);
	};

	this.Card.prototype.flip = function() {
		this.$div.toggleClass('back');
		this.$div.toggleClass('front');
	};

	this.Card.prototype.place = function() {
		$board.append(this.$div);
		this.activate();
	};

	this.Card.prototype.activate = function() {
		var card = this;
		this.$div.one('click', function() {
			card.choose();
		});
	};

	this.Card.prototype.choose = function() {
		this.flip();
		game.turnPicks.push(this);
		if (game.turnPicks.length > 1) {
			game.evaluateTurn();
		}
	};

	this.Card.prototype.reset = function() {
		this.flip();
		this.activate();
	};
};

Game.prototype.getCards = function() {
	for (var i=0; i < this.numPairs; i++) {
		this.cards.push(new this.Card(i));
		this.cards.push(new this.Card(i));
	}
};

Game.prototype.deal = function() {
	this.cards.forEach(function(card) {
		card.place();
	});
};

Game.prototype.shuffle = function() {
	for (var i=this.cards.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i+1));
		var temp = this.cards[i];
		this.cards[i] = this.cards[j];
		this.cards[j] = temp;
	}
};

Game.prototype.startGame = function() {
	this.getCards();
	this.shuffle();
	this.deal();
	$turnCounter.text(this.numTurns);
	$matchesLeft.text(this.numMatchesLeft);
};

Game.prototype.evaluateTurn = function() {
	if (this.turnPicks[0].value === this.turnPicks[1].value) {
		this.updateDisplay('MATCH');
		this.numMatchesLeft--;
		$matchesLeft.text(this.numMatchesLeft);
		//TODO: if numMatchesLeft === 0, end game!
		if (!this.numMatchesLeft) {
			this.updateDisplay('VICTORY');
		}
	} else {
		this.updateDisplay('NOPE');
		this.turnPicks.forEach(function(card) {
			window.setTimeout(function() {
				card.reset();
			}, 2000);
		}); // end of forEach
	} // end of else
	this.numTurns++;
	$turnCounter.text(this.numTurns);
	this.turnPicks = [];
};

Game.prototype.updateDisplay = function(message) {
	$display.text(message);
	message = message.toLowerCase() + ' display';
	$display.attr('class', message);
};





//TODO: New Game button

var currentGame = new Game(6);
currentGame.startGame();
// currentGame.getCards();
// currentGame.deal();