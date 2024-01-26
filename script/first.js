// import {wordList} from './wordList'
// const wordList = require('./word-list.js');

import { wordList } from "./wordList.js";

const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".world-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again");


let currentWord, correctLetters = [], wrongGuessCount; 
const maxGuesses = 6;

const resetGame = () => {
    // resetting all game variable and ul elements
    correctLetters = [];
    wrongGuessCount = 0; 
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled =false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    //selecting a random word and hint from the word list   
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // after 600ms of game complete.. showing modal with relevant details
    setTimeout(() => {
        const modalText = isVictory ? `Tou found the word:` : `The correct word was:`;
        gameModal.querySelector("img").src =`images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText =`${isVictory ? 'congrats!' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML =`${modalText} <b>${currentWord}</b>`;
        gameModal.classList.add("show");
    }, 300);
}

const initGame = (button, clickedLetter) => {
    //checking if clickLetter is exist on the currenWord
    if(currentWord.includes(clickedLetter)){ 
        //showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter){
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    }else{
        // if clicked letter doesnt exited then update the wrong guessesCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // calling gameOver function if any of these condition meets
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

//creating keyboard buttons and adding events
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i);
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}
getRandomWord ();
playAgainBtn.addEventListener("click", getRandomWord);
