const data = require('./words.json');

function getWord(language, difficulty)
{
    const info = data.filter(item => item.language === language && item.difficulty === difficulty)

    let rand = Math.floor(Math.random() * info.length)
    return info[rand].word
}

let word = getWord("en", "easy");
let result = [];
let life = 6;
let wrong_letters = [];
let gameInProgress = true;

//Initial state of the game
function init() {
    for (let i = 0; i < word.length; i++) {
        result[i] = "_ ";
    }

    document.getElementById("word_length").innerHTML = result.join(" ");
    document.getElementById("wrong_letters").innerHTML = "Wrong letters: ";
    document.getElementById("lives").innerHTML = "You have " + life + " lives!";
    document.getElementById("error").innerHTML = " ";
    document.getElementById("hangman-image").src = `images/hangman-1.png`;
}

window.onload = init;

//Choice of language
function language_selection() {
    let language = document.getElementById('language').value;
    word = getWord(language, difficulty);
}

//Choice of difficulty
function difficulty_selection() {
    let difficulty = document.getElementById('difficulty').value;
    word = getWord(language, difficulty);
}

//Receive letters
function letter_submit(event) {
    if (!gameInProgress) return;
    event.preventDefault();
    let letterInput = document.getElementById('letter');
    let letter = letterInput.value.trim().toLowerCase();

    if (letter.length !== 1 || !/^[a-zA-Z]$/.test(letter)) {
        document.getElementById("error").innerHTML = "Please enter a valid single letter!";
        letterInput.value = '';
        return;
    }

    let counter = 0;

    for (let i = 0; i < word.length; i++) {
        //If letter has been tried
        if (letter === result[i]) {
            document.getElementById("error").innerHTML = "You have already tried this letter!";
            counter++;
            break;
        }

        //If letter exists in word
        if (letter === word[i]) {
            document.getElementById("error").innerHTML = " ";
            result[i] = letter;
            counter++;
        }
    }

    for (let i = 0; i < wrong_letters.length; i++) {
        //If wrong letter has been tried
        if (letter === wrong_letters[i]) {
            document.getElementById("error").innerHTML = "You have already tried this letter!";
            counter++;
            break;
        }
    }

    //Letter not guessed
    if (counter === 0) {
        document.getElementById("error").innerHTML = " ";
        life--;
        wrong_letters.push(letter);
        let imageIndex = 7 - life;
        document.getElementById("hangman-image").src = `images/hangman-${imageIndex}.png`;
    }

    letterInput.value = '';

    //Actions based on input
    document.getElementById("word_length").innerHTML = result.join(" ");
    document.getElementById("wrong_letters").innerHTML = "Wrong letters: " + wrong_letters.join(", ");
    if (life > 0) {
        document.getElementById("lives").innerHTML = "You have " + life + " lives!";
    } else {
        document.getElementById("lives").innerHTML = "You lost!";
        gameInProgress = false;
        alert("You lost! To restart a game enter a letter!");
    }

    //Win condition
    if (!result.includes("_ ")) {
        document.getElementById("lives").innerHTML = "You won!";
        gameInProgress = false;
        alert("Congratulations! You won! To restart a game enter a letter!");
    }
}
