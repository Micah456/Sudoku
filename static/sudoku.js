const loadPuzzleBtnEl = document.getElementById("load-puzzle-btn")
const sudokuGridEl = document.getElementById("sudoku-grid")
const timerEl = document.getElementById("timer")
const scoreDivEl = document.getElementById("score-div")
let data = null
let puzzleGridSections = []
let solutionGridSections = []
let selectedCell
let errorCount = 0
let startTime
let timer = null

loadPuzzleBtnEl.addEventListener('click', loadPuzzle)
document.addEventListener('keydown', (e) => {
    console.log("Key down!")
    if(e.key == "Escape") {gameOver()} //FOR TESTING. DELETE AFTER
    const value = Number(e.key)
    if(!isNaN(value) &&  value > 0 && selectedCell){
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
    //If timer exists, stop it (if running), reset error count, and hide scorediv
    if(timer){ 
        stopTimer()
        errorCount = 0
        scoreDivEl.style.maxHeight = "0"
    }
    timerEl.textContent = "00:00:00"
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
 * @param {*} id id of the section
 * @param {Array} values values to populate the section
 * @returns sudoku section as a div element
 */
function createSudokuSection(id, values){
    const div = document.createElement('div')
    div.className = "sudoku-section"
    div.id = id
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
 * @param {Array[]} gridSections
 */
function setSudokuGrid(gridSections){
    //Remove all childElements in sudoku grid
    removeAllChildElements(sudokuGridEl)
    //Create sections and add to sudoku grid
    for(let i = 0; i < 9; i++){
        sudokuGridEl.appendChild(createSudokuSection(i, gridSections[i]))
    }
    /*gridSections.forEach(section => {
        sudokuGridEl.appendChild(createSudokuSection(section))
    })*/
}

function startTimer(){
    console.log("Starting timer...")
    startTime = new Date().getTime()
    timer = setInterval(() => {
        const now = new Date().getTime()
        const elapsed = now - startTime
        const hours = String(Math.floor(elapsed / (1000 * 60 * 60))).padStart(2, "0")
        const minutes = String(Math.floor((elapsed % (1000 * 60 * 60))/(1000 * 60 ))).padStart(2, "0")
        const seconds = String(Math.floor((elapsed % (1000 * 60)) / 1000)).padStart(2, "0")
        const timeElapsed = `${hours}:${minutes}:${seconds}`
        timerEl.textContent = timeElapsed
    }, 1000)
}

/**
 * Updates value in the selected cell to a specific value
 * @param {Number} value 
 */
function updateCellValue(value){
    selectedCell.textContent = value
    validateCell()
    toggleCell(selectedCell)
}

function validateCell(){
    //Check if cell is correct
    const isCorrect = cellIsCorrect(selectedCell)
    if(isCorrect == true){//Answer correct
        console.log("Right!")
        if(selectedCell.classList.contains("cell-incorrect")){// Was wrong before
            selectedCell.classList.remove("cell-incorrect")// Remove incorect mark
            selectedCell.style.color = "rgb(57, 255, 189)" //Reset the colour
        }
        validatePuzzle()
    }
    else{//Answer incorrect
        console.log("Wrong!")
        errorCount++
        if(!selectedCell.classList.contains("cell-incorrect")){// Wasn't wrong before
            selectedCell.classList.add("cell-incorrect") //Mark it wrong
            selectedCell.style.color = "red" //Change font colour to red
        }
    }
    console.log(`Error count: ${errorCount}`)
}

/**
 * Checks if cell has been filled with the correct value
 * @param {HTMLElement} cell cell to be checked
 * @returns {boolean} true if correct, false if incorrect
 */
function cellIsCorrect(cell){
    //Get position of selected cell
    //Get section number
    const section = cell.parentElement
    const sectionIndex = section.id
    //Get position in section
    const cellIndex = Array.prototype.indexOf.call(section.children, cell)
    console.log(`Checking: section: ${sectionIndex}, cell: ${cellIndex}`)
    //Get value on same position in solution
    const answerValue = solutionGridSections[sectionIndex][cellIndex]
    console.log(`User value: ${cell.textContent}, Solution value: ${answerValue}, Correct: ${cell.textContent == answerValue}`)
    return cell.textContent == answerValue
}

/**
 * Checks the puzzle is completed and correct. If so, triggers gameOver.
 */
function validatePuzzle(){
    console.log("Validating puzzle")
    //Get sections
    const sections = Array.from(sudokuGridEl.children)
    //For each section
    for(const section of sections){
        //Get cells
        const cells = Array.from(section.children)
        //Validate each cell
        for(const cell of cells){
            //If any incorrect
            if(!cellIsCorrect(cell)){
                //Break
                console.log("Puzzle not correct")
                return
            }
        }
    }
    //If all correct, call gameOver
    gameOver()
}

function stopTimer(){
    clearInterval(timer)
}

function gameOver(){
    stopTimer()
    console.log("Well done! Game over!")
    let totalScore = 1000 //1000 added for completion bonus
    //Generate time bonus
    const timeBonus = calculateTimeBonus()
    //Generate error penalties
    const errorPenalty = errorCount * -50    
    //Calculate total score
    totalScore = totalScore + timeBonus + errorPenalty
    //Fill score div
    const finalScoreHTML = 
        `
            <h3>Game Over!</h3>
            <p>Final Score:</p>
            <table>
                <tr>
                    <td>Completion:</td>
                    <td>1000</td>
                </tr>
                <tr>
                    <td>${errorCount} x Errors:</td>
                    <td>${errorPenalty}</td>
                </tr>
                <tr>
                    <td>Time Bonus:</td>
                    <td>${timeBonus}</td>
                </tr>
            </table>
            <p>Final Score: <b>${totalScore}</b></p>
        `
    scoreDivEl.innerHTML = finalScoreHTML
    //Show score div
    const y = scoreDivEl.getBoundingClientRect().top + window.scrollY;
    window.scroll({
        top: y,
        behavior: 'smooth'
    })
    scoreDivEl.style.maxHeight = scoreDivEl.scrollHeight + "px"
}

/**
 * Calculates the time bonus
 * @returns {Number} time bonus
 */
function calculateTimeBonus(){
    //Get time elapsed
    const timeElapsedString = timerEl.textContent
    //Get hours elapsed
    const hours = Number(timeElapsedString.substring(0,2))
    //If more than 0 hours, return a score of 0
    if(hours > 0) {return 0}
    //Get minutes elapsed
    const minutes = Number(timeElapsedString.substring(3,5))
    //Return score based on minutes and difficulty
    if(data['difficulty'] == "Medium"){ //Medium
        switch(true){
            case minutes < 10: //Excellent
                return 400
            case minutes >= 10 && minutes <15: //Very Good
                return 200
            case minutes >= 15 && minutes <20: //Good
                return 100
            case minutes >=20 && minutes <30: //Okay
                return 50
            default:
                return 0
        }
    }else{ //Hard
        switch(true){
            case minutes < 30: //Excellent
                return 400
            case minutes >= 30 && minutes <35: //Very Good
                return 200
            case minutes >= 35 && minutes <40: //Good
                return 100
            case minutes >=40 && minutes <50: //Okay
                return 50
            default:
                return 0
        }
    }
    
}