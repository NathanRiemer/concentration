# concentration
Project One

User Stories:
-  At start of game:
  -  User is presented with X by Y grid of face down cards
  -  The cards' positions within the grid are random (ie the position of a given value changes game to game)
  -  Perhaps there is a number that shows the number of remaining matches
  -  Stretch goal: User is able to choose size of grid (aka number of pairs / difficulty)
  -  Stretch goal: User can customize the cards
  -  Stretch goal: There's a timer
-  Game Play:
  -  The game consists of turns:
    -  During a turn, the user selects a first card, which turns over (reveals its value)
    -  The player then selects a second card
      -  If the first and second card match, the cards remain revealed
        -  Perhaps the player is alerted if they get a match
        -  Number of remaining matches 
    	-  If the cards don't match, they are turned back over
    -  A turn counter is incremented
  -  Turns continue until the player has found all the matches, at which point the game is over.
-  At end of game:
	-  The player's score (number of turns) is displayed, and they are told if they've achieved a high score.
	-  The player is given the choice to start at a new game 
		-  Stretch: with the current settings, or select different settings


Front-End Wireframes:
(Attach images)

List of technologies used:
-  HTML
-  CSS
-  Javascript
-  jQuery

I adapted my shuffle method (copied below) from http://www.frankmitchell.org/2015/01/fisher-yates/ which is an implementation of the Fisher-Yates Shuffle. I only did so after I was confident that I understood how the Fisher-Yates algorith works.

```
Game.prototype.shuffle = function() {
	for (var i=this.cards.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i+1));
		var temp = this.cards[i];
		this.cards[i] = this.cards[j];
		this.cards[j] = temp;
	}
};
```

I adapted my setCardDimensions method from http://stackoverflow.com/questions/7125453/modifying-css-class-property-values-on-the-fly-with-javascript-jquery -- how cool is this! Adding a new class to the css via a style tag added to via jQuery... super rad!
```
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
```


Description of app:

Link to playable app:
