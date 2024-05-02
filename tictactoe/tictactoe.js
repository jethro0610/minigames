// Game state
const board = ["", "", "", "", "", "", "", "", ""];
const cells = document.getElementsByClassName("tic-tac-toe-cell");
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
let winner = "";
let turn = "X";

function setStatus(status) {
    document.getElementById("status").innerHTML = status;
}

function reset() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = "";
    }

    for (let i = 0; i < board.length; i++)
        board[i] = "";

    winner = "";
    turn = "X"
    setStatus("Player's turn...");
}

function queueCPUMove() {
    let cpuMoveIndex = -1;

    // If there's a move for the CPU to win
    // take that move...
    const cpuWinningCell = findWinningCell("O"); 
    if (cpuWinningCell != -1)
        cpuMoveIndex = cpuWinningCell;

    // ...or if there's a move for the player
    // to win block it...
    const playerWinningCell = findWinningCell("X");
    if (playerWinningCell != -1 && cpuMoveIndex == -1)
        cpuMoveIndex = playerWinningCell;

    // ...otherwise just take a random move
    if (cpuMoveIndex == -1) {
        const validCells = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "")
                validCells.push(i);
        }
        if (validCells.length < 0)
            return false;

        cpuMoveIndex = validCells[Math.floor(Math.random() * validCells.length)]
    }

    // Delay the move to simulate the CPU thinking
    setTimeout(() => {
        doMove(cpuMoveIndex, "O");
    }, 1000);
}

function doMove(index, character) {
    // Don't allow moves when there's
    // already a winner...
    if (winner != "")
        return false;
    // ... or the selected cell already
    // has a move on it...
    if (board[index] != "")
        return false;     
    // ... or if it's not the character's
    // turn
    if (turn != character)
        return false;

    board[index] = character; 

    // Insert the character symbol on the board
    const cellText = document.createElement("div");
    cellText.innerHTML = character;
    cellText.className = "cell-text-" + character;
    cells[index].append(cellText); 

    if (isBoardWinning(character))
        winner = character;

    if (turn == "X") {
        turn = "O";
        setStatus("CPU's turn...");
    }
    else {
        turn = "X";
        setStatus("Player's turn...");
    }

    if (isBoardWinning("X"))
        setStatus("Player wins!");

    if (isBoardWinning("O"))
        setStatus("CPU wins!");

    if (isTie()) 
        setStatus("Tie!");

    return true;
}


function isBoardWinning(character) {
    function boardMatchesWinCondition(winCondition) {
        let matchesCondition = true
        winCondition.forEach((cell) => {
            if (board[cell] != character) {
                matchesCondition = false;
                return;
            }
        })
        return matchesCondition;
    }

    let win = false;
    winConditions.forEach((winCondition) => {
        if (boardMatchesWinCondition(winCondition)) {
            win = true;
            return;
        }
    });

    return win;
}

function isTie() {
    if (winner != "")
        return false;

    // If the board is full with no winner,
    // it's a tie
    let full = true;
    for (let i = 0; i < board.length; i++) {
        if (board[i] == "") {
            full = false;
            break;
        }
    }

    return full;
}

function findWinningCell(character) {
    let winningCell = -1;
    winConditions.forEach((winCondition) => {
        let lastEmptyCell = -1;    
        let numEmptyCells = 0;
        let matchesCharacter = true;

        winCondition.forEach((cell) => {
            // Get the number of empty cells
            // and keep track of the last one
            // we passed...
            if (board[cell] == "") {
                lastEmptyCell = cell;
                numEmptyCells++;
            }
            else if (board[cell] != character) {
                matchesCharacter = false;
                return;
            }
        });

        // ...and if the win condition has only
        // 1 move to victory, take that cell
        if (numEmptyCells == 1 && matchesCharacter) {
            winningCell = lastEmptyCell;
            return;
        }
    });

    return winningCell;
}

function setupTicTacToe() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].addEventListener("click", () => {
            const playerDidValidMove = doMove(i, "X");
            if (playerDidValidMove) {
                queueCPUMove();
            }
        })
    }

    document.getElementById("restart-button").addEventListener("click", () => {
        reset();
    })
}

window.addEventListener('load', function() {
    setupTicTacToe();
})
