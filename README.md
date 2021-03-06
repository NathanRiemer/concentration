# concentration
#Project One

##User Stories:
-  [x] At start of game:
  -  [x] User is presented with X by Y grid of face down cards
  -  [x] The cards' positions within the grid are random (ie the position of a given value changes game to game)
  -  [x] Perhaps there is a number that shows the number of remaining matches
  -  [x] Stretch goal: User is able to choose size of grid (aka number of pairs / difficulty)
  -  [x] Stretch goal: User can customize the cards
  -  [x] Stretch goal: There's a timer
-  [x] Game Play:
  -  [x] The game consists of turns:
    -  [x] During a turn, the user selects a first card, which turns over (reveals its value)
    -  [x] The player then selects a second card
      -  [x] If the first and second card match, the cards remain revealed
        -  [x] Perhaps the player is alerted if they get a match
        -  [x] Number of remaining matches is decrimented 
    	-  [x] If the cards don't match, they are turned back over
    -  [x] A turn counter is incremented
  -  [x] Turns continue until the player has found all the matches, at which point the game is over.
-  At end of game:
	-  [x] The player's score (number of turns) is displayed, and they are told if they've achieved a high score. (Update: since turn count is fairly prominent, no additional display is needed, same applies to New Game)
	-  [x] The player is given the choice to start at a new game 
		-  [x] Stretch: with the current settings, or select different settings


##Front-End Wireframes:
![Image of Wireframe-Page]
(./img/wireframe-page.jpg)

![Image of Wireframe-Bars]
(./img/wireframe-bars.jpg)

##List of technologies used:
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
I used Daniel Eden's Animate.css from https://daneden.github.io/animate.css/ .

I used http://paletton.com/ for help developing my color scheme.

The DC/Marvel Superhero logos were culled from various places on the internet, via Google Image Search.
All the dog photographs were taken from http://dogtime.com/dog-breeds/profiles

##Description of app:

See [here](./lightning.md) for complete rundown of this project.

Gameplay: Click a card to turn it over.
A turn consists of two card flips.
If the cards match they remain face up, otherwise they are returned to the face down position.
Use the Options button to adjust the number of pairs and card contents that will be used the next time you click the New Game button.
Currently you can select between 1 and 21 pairs, and three card styles: DC Super Hero Logos, Marvel Super Hero Logos, and Dogs. 
The highest score (both lowest number of turns and fastest) is tracked for each number of pairs.

##Link to playable app:
[Playable App](http://nathanriemer.github.io/concentration/)

