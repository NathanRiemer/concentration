//Need to keep track of stuff for the current game, let's make that an object with a constructor

var Game = function(numPairs) {
	this.numPairs = numPairs;
	this.turns = 0;
};