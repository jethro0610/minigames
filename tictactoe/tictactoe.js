const board = ["", "", "", "", "", "", "", "", ""];
const cells = document.getElementsByClassName("tic-tac-toe-cell");
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];
let winner = "";

function doCPUMove() {
    const cpuWinningCell = findWinningCell("O"); 
    if (cpuWinningCell != -1) {
        return doMove(cpuWinningCell, "O");
    }

    const playerWinningCell = findWinningCell("X");
    if (playerWinningCell != -1) {
        return doMove(playerWinningCell, "O");
    }

    const validCells = [];
    for (let i = 0; i < board.length; i++) {
        if (board[i] == "")
            validCells.push(i);
    }
    if (validCells.length < 0)
        return false;

    const cpuMoveIndex = validCells[Math.floor(Math.random() * validCells.length)]
    return doMove(cpuMoveIndex, "O");
}

function doMove(index, character) {
    if (winner != "")
        return false;
    if (board[index] != "")
        return false;     

    board[index] = character; 
    cells[index].innerHTML = character; 

    if (isBoardWinning(character))
        winner = character;

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

function findWinningCell(character) {
    let winningCell = -1;
    winConditions.forEach((winCondition) => {
        let lastEmptyCell = -1;    
        let numEmptyCells = 0;
        let matchesCharacter = true;

        winCondition.forEach((cell) => {
            if (board[cell] == "") {
                lastEmptyCell = cell;
                numEmptyCells++;
            }
            else if (board[cell] != character) {
                matchesCharacter = false;
                return;
            }
        });

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
                doCPUMove();
                if (isBoardWinning("X"))
                    console.log("X win");

                if (isBoardWinning("O"))
                    console.log("O win");
            }
        })
    }
}

window.addEventListener('load', function() {
    setupTicTacToe();
})
