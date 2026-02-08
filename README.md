# Sudoku
A sudoku web app that uses a sudoku api to provide puzzles and solutions.

## How it works
1) Player clicks button to load a puzzle
2) Request sent to api which returns puzzle and solution
3) These are set to variables
4) Sudoku table is set/built according to puzzle data - could the cell id have the solution for easy checking?
5) Timer will start 
6) Player enters numbers into the puzzle
7) When a number is entered, the game auto checks the cell
8) Cell will turn red if incorrect number in it.
9) The typing event that leads to incorrect number will deduct points from player
10) Game ends once all cells filled and none are incorrect.
11) The game will show the players final score
12) Player will need go click the load puzzle button again to start another game

## Things to Implement 
1) ...

## Structure
- One HTML page to host entire game
- In main section of body will have: Game name, help button - opens div/alert with instructions, sudoku grid, Final score section (see considerations)


## Considerations
1) Can players delete numbers already set? maybe disable cells that have already been filled or use another element type to hold (might mean checking solution requires more code)
2) Can player check the board at any time? Does the table need to be completed to check? maybe have a check button and then a submit button. how would this affect scoring
3)  Consider a 3 strikes rule - check 3 times and still get it wrong and you will trigger game over
4)  Auto checking may be easier to code but harder for players to
5)  Final score section: maybe be best to keep it on the page under the grid but hidden. it will show once player has won. Think of it like a read more section or a wiki section on mobile.
6)  Can have both local and global leader board - can send a REST request to VPS when storing and getting global data. will work for neocities. local storage will work gor local board
7)  If implementing a leaderboard. you'll need to ask player for name after winning 

## Stretch goals
1) leader board on sidebar
2) allow user to choose difficulty
3) phone comparability?
