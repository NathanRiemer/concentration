# TO DO:

## Appearance:
-  [] Image files
  -  [] Resize files
  -  [] Optimize for squareness
  -  [] Determine if any of the images are too close in appearance
-  [] Improve general appearance
  -  [x] Borders
  -  [x] Coloring
  -  [x] Size
  -  [x] Position
  -  [x] Font
  -  [x] Layout
-  [x] Animation?
-  [] Improve gallery:
  -  [x] Add x (close) button to gallery
  -  [x] Improve positioning
  -  [] Improve new score highlighting

## Content
-  [x] Add landing page (probably just expand instructions)

## Behavior
-  [] Display high scores in order of number of pairs?
-  [] Could the number of pairs available depend on the category input?
-  [x] Is the delay after an incorrect pair the right length? Do I need to do more to prevent people from having multiple pairs of cards turned over at once? (I think this is okay as-is)
-  [x] Clicking the buttons in the action bar automatically hides any other action bar galleries (to prevent things not appearing due to being underneath another thing)
-  [] Dry up those event listeners for the action buttons!
-  [x] Cards resize to accomodate resized board at new game.

## Backstage Code improvements
-  [] Wrap pertinent code in document ready function

## To ask Sung
-  [x] Could I make a function that automatically grabbed all the files in a directory (based on input from the user) and put those files / their names in an array? -- not until server stuff
-  [x] If not, how do I include other files (for the image array)? -- yes, just include above in html
-  [] Passing the calling object using this to another class' method -- kosher? (see Game.prototype.startTimer for an example) --bind
-  [x] Thoughts about the program's complexity? I did my best to separate out objects and methods in a way that makes sense. The code has gotten long-ish, but I think that's okay considering all the functionality. -- move Card out of Game
-  [x] Copyright issue? -- meh
-  [x] Better way to do timer? -- meh
-  [] Way to smartly implement closing a div by clicking anywhere but the div? -- outer div covering game board z-index, 

## Project Requirements
- [x] Add link to playable app
- [] Make sure to merge gh-pages branch up to master before final submission deadline!
- [] Write description of app -- add thinking to code
- [] Style 
  -  [] Update file names to use snake_case
  -  [] Make sure other things are named appropriately
- [] Prepare for lightning talk