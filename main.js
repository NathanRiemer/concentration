var $board = $('.board');

var $turnCounter = $('#turns');
var $matchesLeft = $('#matches-left');
var $display = $('.display');
var $newGameBtn = $('.new-game.button');
var $timer = $('#timer');

var $highScoreBtn = $('.button.highscore');
var $pauseBtn = $('.button.pause');

var $highscoreGallery = $('.highscore.gallery');

var $optionsBtn = $('.button.options');
var $optionsGallery = $('.options.gallery');

var $aboutBtn = $('.button.about');
var $aboutGallery = $('.about.gallery');

var images = {
	dcSuperHeroLogos: [
		'superman.jpg',
		'batman.jpg',
		'wonderwoman.jpg',
		'flash.png',
		'gl.jpg',
		'aquaman.jpg',
		'cyborg.jpg',
		'firestorm.jpg',
		'robin.png',
		'shazam.jpg',
		'hawkman.jpg',
		'nightwing.png',
		'red-tornado.jpg',
		'booster-gold.jpg',
		'blue-beetle.jpg',
		'elongated-man.jpg',
		'green-arrow.png',
		'martian-manhunter.jpg',
		'black-lantern.png',
		'red-lantern.jpg',
		'orange-lantern.png',
		'yellow-lantern.png',
		'blue-lantern.png',
		'indigo-lantern.png',
		'star-sapphire.png',
		'white-lantern.png'
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
	], 
	marvelSuperHeroLogos: [
		'antman.png',
		'avengers.jpg',
		'black-widow.jpeg',
		'captain-america.jpg',
		'captain-marvel.png',
		'daredevil.png',
		'deadpool.jpg',
		'fantastic-four.jpg',
		'hawkeye.jpg',
		'hulk.jpg',
		'iron-fist.jpeg',
		'iron-man.png',
		'ms-marvel.jpg',
		'nova.jpg',
		'punisher.jpg',
		'quicksilver.jpg',
		'shield.jpg',
		'spider-man.jpg',
		'thor.jpg',
		'wolverine.png',
		'x-men.png'
	],
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
	this.timerId;
	this.cardBack = this.urlBase + this.imageFolder + '.png\')';

	this.Card = function(value, game) {
		this.game = game;
		this.value = value;
		this.$div = $('<div>');
		this.urlString = game.urlBase + game.imageArray[value] + '\')';
		this.$div.addClass('card sized');
		this.showBack();
	};

	this.Card.prototype.showFront = function() {
		this.$div.removeClass('back');
		this.$div.css('background-image', this.urlString);
	};

	this.Card.prototype.showBack = function() {
		this.$div.removeClass('front');
		this.$div.css('background-image', this.game.cardBack);
		this.$div.addClass('back');
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
		this.showFront();
		this.game.turnPicks.push(this);
		if (this.game.turnPicks.length > 1) {
			this.game.evaluateTurn();
		}
	};

	this.Card.prototype.reset = function() {
		this.showBack();
		this.activate();
	};

}; //end of Game constructor

Game.prototype.getCards = function() {
	this.setCardDimensions();
	for (var i=0; i < this.numPairs; i++) {
		this.cards.push(new this.Card(i, this));
		this.cards.push(new this.Card(i, this));
	}
};

Game.prototype.setCardDimensions = function() {
	var dimension;
	// if (this.numPairs < 5) {
	// 	// dimension = '150px';
	// 	// dimension = '25%';
	// 	dimension = $board.width() * .25;
	// } else if (this.numPairs < 9) {
	// 	// dimension = '120px';
	// 	// dimension = '20%'
	// 	dimension = $board.width() * .20;
	// } else if (this.numPairs < 13) {
	// 	// dimension = '100px';
	// 	dimension = '16%';
	// } else if (this.numPairs < 19) {
	// 	// dimension = '80px';
	// 	dimension = '13%';
	// } else {
	// 	// dimension = '65px';
	// 	dimension = '11%';
	// }

	dimension = Math.sqrt(($board.width() * $board.height()) / (this.numPairs * 2));

	dimension *= .72;
	console.log(dimension);

	var $style = $('<style type="text/css">').appendTo('head');
	// var css = '.sized { height: ' + dimension + '; width: ' + dimension + ';}';
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
	this.startTimer(this);
};

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

Game.prototype.startTimer = function(game) {
	$('.card').removeClass('hidden');
	$pauseBtn.text('Pause Game');
	$pauseBtn.removeClass('inactive');
	this.timerId = setInterval(this.tick, 1000, game);
	$pauseBtn.one('click', { value: game }, function(event) {
		event.data.value.pauseTimer(event.data.value);
	});
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

Game.prototype.pauseTimer = function(game) {
	window.clearInterval(this.timerId);
	$pauseBtn.text('Resume Game');
	$('.card').addClass('hidden');
	$pauseBtn.one('click', { value: game }, function(event) {
		event.data.value.startTimer(event.data.value);
	});
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
	$timer.text('0');
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

var currentGame = new Game(6);
currentGame.startGame();

$newGameBtn.on('click', function() {
	currentGame.clearBoard();
	currentGame = new Game($('#pair-number').val());
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

$('.gallery.about, .gallery.highscore').on('click', function() {
	$('.gallery').addClass('hidden');
});

// var clickOutside = function(activeGallery) {
// 	activeGallery.addClass('hidden');
// };

// $aboutBtn.one('click', function() {
// 	$aboutGallery.removeClass('hidden');
// 	$(window).one('click', function() {
// 		clickOutside($aboutGallery);
// 	});
// });