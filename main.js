//Need to keep track of stuff for the current game, let's make that an object with a constructor

//TOP PRIORITIES:
//TIMER: PAUSE/UNPAUSE
//MAKE THIS THING LOOK GOOD
	//Sizing
	//Better MATCH/NOPE/VICTORY THING
	//LAYOUT AND SPACING
		//CONSIDER UPDATING WIDTHS OF THINGS
	//ANIMATION
		//Flipping!
		//Dealing?!
//IMAGES
	//Fill out superHeroLogos
	//Add new imagesets?
		//colors?
		//numbers?

var $board = $('.board');

var $turnCounter = $('#turns');
var $matchesLeft = $('#matches-left');
var $display = $('.display');
var $newGameBtn = $('.new.button');
var $timer = $('#timer');

//TO ASK SUNG: Is it possible to use JS to access the files in a directory instead of manually listing them all? That'd be cool. Can't find anything online.
//Also if that's not possible I should get rid of the ./img/FOLDER and just add that when I build the url string. Or add the url() part to the arrays, so I don't need to build the string.

		// './img/dogs/labrador-retriever.jpg',

//TODO: Ask Sung if it makes sense to have this inside the Game object. In favor: the Game object makes changes to it. Against: it exists outside the scope of an individual game. Okay, I'm pretty sure it should stay outside. Hmm. Maybe it should be a separate file? Ask Sung about that. 

//OOOH I should look into making the range of pairs available dependent on the number of images in a given folder.
var images = {
	superHeroLogos: [
		'superman.jpg',
		'batman.jpg',
		'wonderwoman.jpg',
		'flash.png',
		'gl.jpg',
		'aquaman.jpg',
		'cyborg.jpg',
		'firestorm.jpg'
	],

	dogs: [
		'bassethound.jpg',
		'cockerspaniel.jpg',
		'dachsund.jpg',
		'dalmatian.jpg',
		'french-bulldog.jpg',
		'german-shepherd.jpg',
		'malamute.jpg',
		'corgi.jpg',
		'english-sheepdog.jpg',
		'gold-retriever.jpg',
		'great-dane.jpg',
		'greyhound.jpg',
		'afghan-hound.jpg',
		'newfie.jpg',
		'poodle.jpg',
		'pug.jpg',
		'puli.jpg',
		'saint-bernard.jpg',
		'shiba-inu.jpg',
		'weimaraner.jpg',
		'chihuahua.jpg'
	]
};

var scoreboard = {
	turns: {},
	seconds: {}
};


var Game = function(numPairs) {
	this.numPairs = numPairs;
	this.numTurns = 0;
	this.cards = [];
	this.numMatchesLeft = numPairs;
	this.turnPicks = [];
	this.imageFolder = $('select').val();
	this.imageArray = images[this.imageFolder];
	this.shuffle(this.imageArray);
	this.urlBase = 'url(\'./img/' + this.imageFolder + '/';
	this.seconds = 0;
	this.timerId = this.startTimer();
	var game = this;

	this.Card = function(value) {
		this.value = value;
		this.$div = $('<div>');
		this.urlString = game.urlBase + game.imageArray[value] + '\')';
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

}; //end of Game constructor

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

//this.cards
Game.prototype.shuffle = function(array) {
	for (var i=array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i+1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
};

Game.prototype.startGame = function() {
	this.getCards();
	this.shuffle(this.cards);
	this.deal();
	$turnCounter.text(this.numTurns);
	$matchesLeft.text(this.numMatchesLeft);
};

Game.prototype.evaluateTurn = function() {
	this.numTurns++;
	$turnCounter.text(this.numTurns);
	if (this.turnPicks[0].value === this.turnPicks[1].value) {
		this.updateDisplay('MATCH');
		this.numMatchesLeft--;
		$matchesLeft.text(this.numMatchesLeft);
		//TODO: if numMatchesLeft === 0, end game!
		if (!this.numMatchesLeft) {
			this.updateDisplay('VICTORY');
			this.won();
		}
	} else {
		this.updateDisplay('NOPE');
		this.turnPicks.forEach(function(card) {
			window.setTimeout(function() {
				card.reset();
			}, 2000);
		}); // end of forEach
	} // end of else
	this.turnPicks = [];
};

Game.prototype.updateDisplay = function(message) {
	$display.text(message);
	message = message.toLowerCase() + ' display';
	$display.attr('class', message);
};

Game.prototype.startTimer = function() {
	var id =  setInterval(this.tick, 1000, this);
	return id;
};

Game.prototype.tick = function(game) {
	$timer.text(game.seconds++);
};

Game.prototype.stopTimer = function() {
	window.clearInterval(this.timerId);
};

Game.prototype.won = function() {
	this.stopTimer();
	this.checkForHighScore();
};

Game.prototype.clearBoard = function() {
	$('.back').off();
	$board.empty();
	$('style').remove();
	this.stopTimer();
};

Game.prototype.checkForHighScore = function() {
	if (scoreboard['seconds'][this.numPairs]) {
		if (scoreboard['seconds'][this.numPairs][0] > this.seconds) {
			this.addHighScore(true, 'seconds', this.seconds);
		}
		if (scoreboard['turns'][this.numPairs][0] > this.numTurns) {
			this.addHighScore(true, 'turns', this.numTurns);
		}
	} else {
		this.addHighScore(false, 'turns', this.numTurns);
		this.addHighScore(false, 'seconds', this.seconds);
	}

};

Game.prototype.addHighScore = function(replaceRequired, category, value) {
	if (replaceRequired) {
		scoreboard[category][this.numPairs][1].remove();
	}
	var $scoreLog = $('<li>');
	var logLine =  this.numPairs + ' Pairs: Completed in ' + value + ' ' + category;
	$scoreLog.text(logLine);
	$scoreLog.appendTo($('ul.'+category));
	console.log($scoreLog);
	scoreboard[category][this.numPairs] = [value, $scoreLog];
};

var currentGame = new Game(6);
currentGame.startGame();

$newGameBtn.on('click', function() {
	currentGame.clearBoard();
	currentGame = new Game($('#pair-number').val());
	currentGame.startGame();
});