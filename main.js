var $board = $('.board');
var $turnCounter = $('#turns');
var $matchesLeft = $('#matches-left');
var $display = $('.display');
var $newGameBtn = $('.new-game.button');
var $timer = $('#timer');
var $pauseBtn = $('.button.pause');

//Action Bar
var $highScoreBtn = $('.button.highscore');
var $highscoreGallery = $('.highscore.gallery');

var $optionsBtn = $('.button.options');
var $optionsGallery = $('.options.gallery');

var $aboutBtn = $('.button.about');
var $aboutGallery = $('.about.gallery');

var scoreboard = {
	turns: {},
	seconds: {}
};

// Game object constructor and methods //
var Game = function(numPairs, imageFolder) {
	this.numPairs = numPairs;
	this.numTurns = 0;
	this.cards = [];
	this.numMatchesLeft = numPairs;
	this.turnPicks = [];
	this.imageFolder = imageFolder;
	this.imageArray = images[this.imageFolder];
	this.shuffle(this.imageArray);
	this.urlBase = 'url(\'./img/' + this.imageFolder + '/';
	this.seconds = 0;
	this.timerId;
	this.cardBack = this.urlBase + this.imageFolder + '.png\')';
}; //end of Game constructor

//Game setup methods
Game.prototype.getCards = function() {
	this.setCardDimensions();
	for (var i = 0; i < this.numPairs; i++) {
		this.cards.push(new Card(i, this));
		this.cards.push(new Card(i, this));
	}
};

Game.prototype.setCardDimensions = function() {
	var dimension;
	dimension = Math.sqrt(($board.width() * $board.height()) / (this.numPairs * 2)) * 0.72;
	var $style = $('<style type="text/css">').appendTo('head');
	var css = '.sized { height: ' + dimension + 'px; width: ' + dimension + 'px;}';
	$style.html(css);
};

Game.prototype.deal = function() {
	this.cards.forEach(function(card) {
		card.place();
	});
};

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
	$('li').removeClass('new');
	$highscoreGallery.addClass('hidden');
	this.startTimer();
};

//Game turn methods
Game.prototype.evaluateTurn = function() {
	this.numTurns++;
	$turnCounter.text(this.numTurns);
	if (this.turnPicks[0].value === this.turnPicks[1].value) {
		this.updateDisplay('MATCH');
		this.numMatchesLeft--;
		$matchesLeft.text(this.numMatchesLeft);
		this.turnPicks[0].$div.addClass('inactive');
		this.turnPicks[1].$div.addClass('inactive');
		if (!this.numMatchesLeft) {
			this.updateDisplay('VICTORY');
			this.won();
		}
	} else {
		this.updateDisplay('NOPE');
		this.turnPicks.forEach(function(card) {
			window.setTimeout(function() {
				card.reset();
			}, 1000);
		}); // end of forEach
	} // end of else
	this.turnPicks = [];
};

Game.prototype.updateDisplay = function(message) {
	$display.text(message);
	message = message.toLowerCase() + ' display section';
	$display.attr('class', message);
};

//Game timer methods
Game.prototype.startTimer = function() {
	$('.card').removeClass('hidden');
	$pauseBtn.text('Pause Game');
	$pauseBtn.removeClass('inactive');
	this.timerId = setInterval(this.tick, 1000, this);
	$pauseBtn.one('click', function(event) {
		this.pauseTimer();
	}.bind(this));
};

Game.prototype.tick = function(game) {
	$timer.text(++game.seconds);
};

Game.prototype.stopTimer = function() {
	window.clearInterval(this.timerId);
	$pauseBtn.text('Game Over');
	$pauseBtn.off();
	$pauseBtn.addClass('inactive');
};

Game.prototype.pauseTimer = function() {
	window.clearInterval(this.timerId);
	$pauseBtn.text('Resume Game');
	$('.card').addClass('hidden');
	$pauseBtn.one('click', function(event) {
		this.startTimer();
	}.bind(this));
};

//Game end-of-game methods
Game.prototype.won = function() {
	this.stopTimer();
	this.checkForHighScore();
};

Game.prototype.checkForHighScore = function() {
	if (scoreboard.seconds[this.numPairs]) {
		if (scoreboard.seconds[this.numPairs][0] > this.seconds) {
			this.addHighScore(true, 'seconds', this.seconds);
		}

		if (scoreboard.turns[this.numPairs][0] > this.numTurns) {
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
	$scoreLog.addClass('new');
	var logLine =  this.numPairs + ' Pairs: Completed in ' + value + ' ' + category;
	$scoreLog.text(logLine);
	$scoreLog.appendTo($('ul.'+category));
	scoreboard[category][this.numPairs] = [value, $scoreLog];
	$highscoreGallery.removeClass('hidden');
};

Game.prototype.clearBoard = function() {
	$('.back').off();
	$board.empty();
	$('style').remove();
	this.stopTimer();
	$timer.text('0');
};

// Card object constructor and methods //

var Card = function(value, game) {
	this.game = game;
	this.value = value;
	this.$div = $('<div>');
	this.urlString = game.urlBase + game.imageArray[value] + '\')';
	this.$div.addClass('card sized animated flipInX');
	this.showBack();
};

Card.prototype.showFront = function() {
	this.$div.removeClass('back');
	this.$div.css('background-image', this.urlString);
};

Card.prototype.showBack = function() {
	this.$div.removeClass('front');
	this.$div.css('background-image', this.game.cardBack);
	this.$div.addClass('back');
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
	this.showFront();
	this.game.turnPicks.push(this);
	if (this.game.turnPicks.length > 1) {
		this.game.evaluateTurn();
	}
};

Card.prototype.reset = function() {
	this.showBack();
	this.activate();
};

//Getting down to business

var currentGame = new Game(6, 'dcSuperHeroLogos');
currentGame.startGame();

$newGameBtn.on('click', function() {
	currentGame.clearBoard();
	currentGame = new Game($('#pair-number').val(), $('select').val());
	currentGame.startGame();
	$('.gallery').addClass('hidden');
});

$highScoreBtn.on('click', function() {
	$highscoreGallery.toggleClass('hidden');
	$optionsGallery.addClass('hidden');
	$aboutGallery.addClass('hidden');
});

$optionsBtn.on('click', function() {
	$optionsGallery.toggleClass('hidden');
	$highscoreGallery.addClass('hidden');
	$aboutGallery.addClass('hidden');
});

$aboutBtn.on('click', function() {
	$aboutGallery.toggleClass('hidden');
	$optionsGallery.addClass('hidden');
	$highscoreGallery.addClass('hidden');
});

$('.closer').on('click', function() {
	$('.gallery').addClass('hidden');
});

$(window).resize(function() {
	$('style').remove();
	currentGame.setCardDimensions();
});