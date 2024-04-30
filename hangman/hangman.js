/*
Source: https://github.com/simonjsuh/Vanilla-Javascript-Hangman-Game
*/

const possibleAnswers = [
	"python",
	"javascript",
	"mongodb",
	"json",
	"java",
	"html",
	"css",
	"c",
	"csharp",
	"golang",
	"kotlin",
	"php",
	"sql",
	"ruby"
]

let answer = "";
const maxWrong = 6;
let mistakes = 0;
let guessed = [];
let inputWord = "";

// Select a random word from the list of programming languages
function setRandomAnswer() {
    answer = possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)];
}

function generateButtons() {
    let buttonsHTML = "abcdefghijklmnopqrstuvwxyz".split("").map(letter =>
        `
          <button
            id='` + letter + `'
            onClick='handleGuess("` + letter + `")'
          >
            ` + letter + `
          </button>
        `).join("");

    document.getElementById("keyboard").innerHTML = buttonsHTML;
}

function handleGuess(chosenLetter) {
    if (inputWord == answer || mistakes >= maxWrong)
        return;

    // See if the letter has already been guessed, if it hasn"t
    // mark it as guessed
    guessed.indexOf(chosenLetter) === -1 ? guessed.push(chosenLetter) : null;

    // Disable the letter
    document.getElementById(chosenLetter).classList.add("disabled");

    if (answer.indexOf(chosenLetter) >= 0) {
        // When the guessed letter is in the answer,
        updateInputWord();
        checkIfGameWon();
    }
    else if (answer.indexOf(chosenLetter) === -1) {
        // If the word wasn"t in the answer, add to
        // the mistakes and update the visuals accordingly
        mistakes++;
        updateMistakes();
        checkIfGameLost();
        updateHangmanPicture();
    }
}

function updateHangmanPicture() {
  document.getElementById("pic").src = mistakes + ".png";
}

function checkIfGameWon() {
    if (inputWord === answer) {
        document.getElementById("word-spotlight").innerHTML = answer + " is correct!";
    }
}

function checkIfGameLost() {
    if (mistakes === maxWrong) {
        document.getElementById("word-spotlight").innerHTML = "Sorry, answer was " + answer;
    }
}

function updateInputWord() {
    // Take each letter of the answer that the user has guessed
    // and put it in the inputWord. Any letter that hasn"t been
    // guessed yet becomes an _
    inputWord = answer.split("").map(letter => (guessed.indexOf(letter) >= 0 ? letter : " _ ")).join("");
    document.getElementById("word-spotlight").innerHTML = inputWord;
}

function updateMistakes() {
    document.getElementById("mistakes").innerHTML = mistakes;
}

function reset() {
    mistakes = 0;
    guessed = [];
    document.getElementById("pic").src = "0.png";

    setRandomAnswer();
    updateInputWord();
    updateMistakes();
    generateButtons();
}

window.addEventListener("load", function() {
    document.getElementById("max-wrong").innerHTML = maxWrong;
    setRandomAnswer();
    generateButtons();
    updateInputWord();
})