# Sudoku
A sudoku web app that uses a sudoku api to provide puzzles and solutions.

## How it works
1) Player clicks button to load a puzzle
2) Request sent to api which returns puzzle and solution
3) These are set to variables
4) Sudoku table is set according to puzzle data
5) Player enters numbers into the puzzle
6) When ready, player can press validate to check accuracy
7) Incorrect fields are highlighted in red, blank fields. are annoyed
8) If none incorrect and no blanks, trigger game over.


## Considerations
1) Can players delete numbers already set? maybe disable cells that have already been filled or use another element type to hold (might mean checking solution requires more code)
2) Can player check the board at any time? Does the table need to be completed to check? maybe have a check button and then a submit button. how would this affect scoring
3)  Consider a 3 strikes rule - check 3 times and still get it wrong and you will trigger game over


## Stretch goals
