# Lightning Talk

## Demo the application
-Features:
  -  Number of turns taken
  -  Number of matches remaining
  -  Display which indicates MATCH, NOPE (no match) and VICTORY
  -  Timer with pause button
  -  New Game button
  -  Options
    -  Change number of pairs (1-21)
    -  Change card contents (DC and Marvel Superhero logos, Dogs)
  -  About section
  -  High Score gallery
  -  Options, About, and High Score can be closed via X button or by clicking their button again. When one section is open and a second button is clicked the first one is closed.

-  Gameplay:
  -  Flip
  -  Turn
    -  Match (cards remain face up and become more transparent)
    -  No Match (cards are flipped back over)
  -  Win
  -  High Scores
    -  Seconds
    -  Turns

## Explain the technical details
-  Two objects with constructors and methods, `Card` and `Game`:
  -  `Card`:
    -  A new card is created with a value and a pointer to the parent Game.
    -  The Card constructor creates a div to represent the card in the DOM.
    -  The card's `value` is used to construct the url string for the card front's background-image. (It's also used to compare whether two cards are a match).
    -  The card has methods to show its front and back (`showFront`, `showBack`).
    -  The card has a method to add it to the board (`place`), which calls a method to activate it (`activate`), which adds a one-time event listener to the card's div.
    -  The event listener calls the card's `choose` method, which shows the card's front and adds the card to the Game's `turnPicks` array.
    -  If the array has two items in it, the turn is evaluated (more on that in the Game rundown).
    -  The card also has a `reset` method (which is used when the two selected cards don't match). This method calls the `showBack` and `activate` methods.
  -  `Game`:
    -  A new game object is created with a number of pairs (`numPairs`) and card contents (`cardContents`) to use.
    -  The game uses the `cardContents` parameter in conjunction with the `images` object (defined in the `image_directory.js` file). The `images` object contains keys which match the values associated with the content options. Each directory also contains a jpg file with the same name as the directory, which is used as the background-image for the card backs.
    -  The game has a method which creates the appropriate number of card objects (`getCards`).
    -  There is a method to properly size the cards based on the dimensions of the board (`setCardDimensions`).
      -  This method is invoked whenever the window is resized, so the cards will change size if the window is resized.
      -  `setCardDimensions` works by creating and appending to the DOM a new `<style>` tag which defines a new class which is applied to the cards. I think it is a super-cool way to define a class that is responsive to not only the size of the board but also the contents of the board.
    -  The game has a `shuffle` method which is used to shuffle the game's cards array. It's also used to shuffle the array holding the image names, so that each new game will use different images. (Otherwise a 6 pair game would always use the same 6 images, which would be less fun).
    -  The game has a `deal` method, which calls the cards' `place` method.
    -  The `startGame` method calls `getCards`, `shuffle`, `deal`, and `startTimer`. It also resets the turn and matches counters' text on the page.
    -  The game's `evaluateTurn` method increments the turn counter (`numTurns`) and compares the values of the card objects in the `turnPicks` array.
      -  If they match, the divs associated with the card objects are classed as `inactive`, and `numMatchesLeft` is decremented.
        -  If `numMatchesLeft` reaches 0 the game's `won` function is called.
      -  If the cards don't match their `reset` method is called after a 1 second delay.
      -  Finally, the `turnPicks` array is emptied.
    -  The `updateDisplay` method updates the MATCH/NOPE/VICTORY display. The text displayed is also used as a class to change the background-color.
  -  The game object has a number of methods used for the Timer: `startTimer`, `tick`, `stopTimer`, and `pauseTimer`.
  -  The game has a `won` method which stops the timer and calls the `checkForHighScore` method.
  -  `checkForHighScore` checks the `scoreboard` object:
    -  The`scoreboard` object has two keys: seconds and turns. These keys each have a value which is another object which has keys which correspond to the number of pairs. The pair keys have values that are arrays which contain the relevant score (number of turns or seconds) and the <li> which was added to the High Score Gallery. 
  -  `addHighScore`:
    -  If a highscore was achieved (or this is the first time playing this number of pairs) new <li>(s) is/are appended to the relevant High Score ul. New high score li's are classed as new, which highlights them. This class is removed when a new game is started. If there was an existing entry for the number of pairs it is removed from the DOM.
  -  Finally, the Game object has a `clearBoard` method which removes any remaining card event listeners, removes all the card divs from the board div, removes the card sizing style, stops the timer and reset's the timer's displayed text.

-  There are also a number of event listeners on the buttons, which open and close the relevant div 'galleries' via adding and removing the `hidden` class.


## Explain the technical challenges

## Explain possible improvements
-  
