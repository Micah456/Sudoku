const loadPuzzleBtnEl = document.getElementById("load-puzzle-btn")
const sudokuGridEl = document.getElementById("sudoku-grid")
let data = null
let puzzleGridSections = []
let solutionGridSections = []
let selectedCell

loadPuzzleBtnEl.addEventListener('click', loadPuzzle)
document.addEventListener('keydown', (e) => {
    console.log("Key down!")
    const value = Number(e.key)
    if(!isNaN(value) &&  value > 0 && selectedCell){
        console.log(value)
        updateCellValue(value)
    }

})

function removeAllChildElements(element){
    while(element.firstChild){
        element.removeChild(element.lastChild)
    }
}

/**
 * Loads the puzzles from the API and stores it in the puzzle variable
 */
function loadPuzzle(){
    fetch("https://sudoku-api.vercel.app/api/dosuku", {
        method: "GET",
    })
    .then(resp => resp.json())
    .then(rawData => {
        data = rawData['newboard']['grids']['0'] //Contains: difficulty, solution, and value
        console.log(data)
        puzzleGridSections = convertPuzzleToGridSections(data['value'])
        solutionGridSections = convertPuzzleToGridSections(data['solution'])
        setSudokuGrid(puzzleGridSections)
        startTimer()
    })
}

/**
 * Creates a cell element (p) for the sudoku grid
 * @param {Number} value 
 * @returns The cell (p element) with the value
 */
function createSudokuCell(value){
    const p = document.createElement('p')
    if(value > 0){//Cell not blank
        p.textContent = value
        //No event listener - disabled

    }else{//Cell is blank
        p.style.color = "rgb(57, 255, 189)"
        p.style.border = "white solid"
        p.textContent = ""
        //Add event listener
        p.addEventListener('click', () => {
            toggleCell(p)
        })
    }
    return p
}

/**
 * Allows you to select or deselect a cell
 * @param {*} cell 
 */
function toggleCell(cell){
    //If selected
    if(cell.classList.contains("cell-selected")){//Selected
        //Deselect cell
        cell.classList.remove("cell-selected")
        //Set selected cell to null
        selectedCell = null
    }
    else{//Not selected
        if(selectedCell){//If another cell selected
            //Deselect old cell
            selectedCell.classList.remove("cell-selected")
        }
        
        //Select cell
        cell.classList.add("cell-selected")
        //Set selected cell to cell
        selectedCell = cell
    }
}

/**
 * Creates a section (square) of the sudoku grid
 * @param {Array} values 
 * @returns sudoku section as a div element
 */
function createSudokuSection(values){
    const div = document.createElement('div')
    div.className = "sudoku-section"
    values.forEach(value => {
        div.appendChild(createSudokuCell(value))
    })
    return div
}

/**
 * Sorts the arrays from rows into sections.
 * @param {Array[]} rowArray an array of subrows (arrays)
 * @returns {Array[]} array of section arrays
 */
function convertRowIntoSections(rowArray){
    const sec1 = []
    const sec2 = []
    const sec3 = []
    //For each subrow array in rowObj
    rowArray.forEach(array => {
        for(let i = 0; i < 9; i++){
            switch(true){
                case(i<3):
                    sec1.push(array[i])
                    break;
                case(i>=3 && i < 6):
                    sec2.push(array[i])
                    
                    break;
                case(i>=6):
                    sec3.push(array[i])
                    break;
            }
        }
    })
    return [sec1, sec2, sec3]
}

/**
 * Converts the puzzle array into an array of sections
 * @param {Array[]} puzzle puzzle to convert
 * @returns {Array} an array of sections
 */
function convertPuzzleToGridSections(puzzle){
    console.log(puzzle)
    //split into 3 rows - a row is an object containing an array of subrows (type array)
    const row1 = [puzzle[0], puzzle[1], puzzle[2]]
    const row2 = [puzzle[3], puzzle[4], puzzle[5]]
    const row3 = [puzzle[6], puzzle[7], puzzle[8]]
    //Convert each row  into sections
    const row1Sections = convertRowIntoSections(row1)
    const row2Sections = convertRowIntoSections(row2)
    const row3Sections = convertRowIntoSections(row3)
    //Add all sections to a single array of section arrays
    const gridSections = [row1Sections, row2Sections, row3Sections].flat(1)
    return gridSections
}

/**
 * Sets the sudoku grid from the gridSections data
 * @param {Array[]} puzzle
 */
function setSudokuGrid(gridSections){
    //Remove all childElements in sudoku grid
    removeAllChildElements(sudokuGridEl)
    //Create sections and add to sudoku grid
    gridSections.forEach(section => {
        sudokuGridEl.appendChild(createSudokuSection(section))
    })
}

function startTimer(){
    console.log("Starting timer...")
}

/**
 * Updates value in the selected cell to a specific value
 * @param {Number} value 
 */
function updateCellValue(value){
    selectedCell.textContent = value
    toggleCell(selectedCell)
}