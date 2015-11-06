//Need to keep track of stuff for the current game, let's make that an object with a constructor

//TOP PRIORITIES:
//HIGH SCORE GALLERY
	//Should probably use a high score object
//TIMER
//MAKE THIS THING LOOK GOOD
	//Sizing
	//Better MATCH/NOPE/VICTORY THING
	//LAYOUT AND SPACING
		//CONSIDER UPDATING WIDTHS OF THINGS

var $board = $('.board');

var $turnCounter = $('#turns');
var $matchesLeft = $('#matches-left');
var $display = $('.display');
var $newGameBtn = $('.new.button');


//TO ASK SUNG: Is it possible to use JS to access the files in a directory instead of manually listing them all? That'd be cool. Can't find anything online.
//Also if that's not possible I should get rid of the ./img/FOLDER and just add that when I build the url string. Or add the url() part to the arrays, so I don't need to build the string.

		// './img/dogs/labrador-retriever.jpg',

var images = {
	superHeroLogos: [
		'./img/superHeroLogos/superman.jpg',
		'./img/superHeroLogos/batman.jpg',
		'./img/superHeroLogos/wonderwoman.jpg',
		'./img/superHeroLogos/flash.png',
		'./img/superHeroLogos/gl.jpg',
		'./img/superHeroLogos/aquaman.jpg',
		'./img/superHeroLogos/cyborg.jpg',
		'./img/superHeroLogos/firestorm.jpg'
	],

	dogs: [
		'./img/dogs/bassethound.jpg',
		'./img/dogs/cockerspaniel.jpg',
		'./img/dogs/dachsund.jpg',
		'./img/dogs/dalmatian.jpg',
		'./img/dogs/french-bulldog.jpg',
		'./img/dogs/german-shepherd.jpg',
		'./img/dogs/malamute.jpg',
		'./img/dogs/corgi.jpg',
		'./img/dogs/english-sheepdog.jpg',
		'./img/dogs/gold-retriever.jpg',
		'./img/dogs/great-dane.jpg',
		'./img/dogs/greyhound.jpg',
		'./img/dogs/afghan-hound.jpg',
		'./img/dogs/newfie.jpg',
		'./img/dogs/poodle.jpg',
		'./img/dogs/pug.jpg',
		'./img/dogs/puli.jpg',
		'./img/dogs/saint-bernard.jpg',
		'./img/dogs/shiba-inu.jpg',
		'./img/dogs/weimaraner.jpg',
		'./img/dogs/chihuahua.jpg'
	]
};

var Game = function(numPairs) {
	this.numPairs = numPairs;
	this.numTurns = 0;
	this.cards = [];
	this.numMatchesLeft = numPairs;
	this.turnPicks = [];
	this.imageArray = images[$('select').val()];
	var game = this;

	this.Card = function(value) {
		this.value = value;
		this.$div = $('<div>');
		this.urlString = 'url(' + game.imageArray[value] + ')';
		this.$div.addClass('card back sized');
		//Could also had just numbers as an option, would require some changes unless I use pictures of numbers which seems silly.
		// this.$div.text(this.value);
	};

	this.Card.prototype.showFace = function() {
		this.$div.removeClass('back');
		this.$div.css('background-image', this.urlString);
		this.$div.addClass('front');
	};

	this.Card.prototype.hideFace = function() {
		this.$div.css('background-image', 'none');
		this.$div.addClass('back');
	};


//Not currently in use
	// this.Card.prototype.flip = function() {
	// 	this.$div.toggleClass('back');
	// 	this.$div.toggleClass('front');
	// };

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
		// this.flip();
		this.showFace();
		game.turnPicks.push(this);
		if (game.turnPicks.length > 1) {
			game.evaluateTurn();
		}
	};

	this.Card.prototype.reset = function() {
		this.hideFace();
		this.activate();
	};
};

Game.prototype.getCards = function() {
	this.setCardDimensions();
	for (var i=0; i < this.numPairs; i++) {
		this.cards.push(new this.Card(i));
		this.cards.push(new this.Card(i));
	}
};

Game.prototype.setCardDimensions = function() {
	var dimension;
	if (this.numPairs < 9) {
		dimension = '120px';
	} else if (this.numPairs < 12) {
		dimension = '100px';
	} else if (this.numPairs < 18) {
		dimension = '80px';
	} else {
		dimension = '65px';
	}

	var $style = $('<style type="text/css">').appendTo('head');
	var css = '.sized { height: ' + dimension + '; width: ' + dimension + ';}';
	$style.html(css);
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

Game.prototype.clearBoard = function() {
	$('.back').off();
	$board.empty();
	$('style').remove();
};

var currentGame = new Game(6);
currentGame.startGame();

$newGameBtn.on('click', function() {
	currentGame.clearBoard();
	currentGame = new Game($('#pair-number').val());
	currentGame.startGame();
});