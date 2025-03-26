let data = [];

// Load the words.json file
fetch("./words.json")
    .then((response) => response.json())
    .then((jsonData) => {
        data = jsonData;
        startGame(); // Ensure the game starts only after data loads
    })
    .catch((error) => console.error("Error loading word data:", error));

// Global variables
let language = "en";
let difficulty = "easy";
let word = "";
let result = [];
let life = 6;
let wrong_letters = [];
let gameInProgress = true;

const translations = {
    en: {
        chooseLanguage: "Choose Language",
        chooseDifficulty: "Choose Difficulty",
        enterLetter: "Enter a letter:",
        wrongLetters: "Wrong letters:",
        lives: "You have {lives} lives!",
        lost: "You lost! To restart the game, pick a new language or difficulty.",
        won: "Congratulations! You won! Pick a new language or difficulty to play again.",
        invalidLetter: "Please enter a valid single letter!",
        alreadyTried: "You have already tried this letter!"
    },
    bg: {
        chooseLanguage: "Избери език",
        chooseDifficulty: "Избери трудност",
        enterLetter: "Въведете буква:",
        wrongLetters: "Грешни букви:",
        lives: "Имате {lives} живота!",
        lost: "Загубихте! За да рестартирате играта, изберете нов език или трудност.",
        won: "Поздравления! Вие спечелихте! Изберете нов език или трудност, за да играете отново.",
        invalidLetter: "Моля, въведете валидна единична буква!",
        alreadyTried: "Вече сте пробвали тази буква!"
    }
};

// Function to translate UI elements
function translateUI() {
    const t = translations[language];
    document.querySelector("h2:nth-of-type(1)").textContent = t.chooseLanguage;
    document.querySelector("h2:nth-of-type(2)").textContent = t.chooseDifficulty;
    document.querySelector("label[for='language']").textContent = t.chooseLanguage;
    document.querySelector("label[for='difficulty']").textContent = t.chooseDifficulty;
    document.querySelector("label[for='letter']").textContent = t.enterLetter;
}

// Function to get a random word based on language and difficulty
function getWord(language, difficulty) {
    const filteredWords = data.filter(
        (item) => item.language === language && item.difficulty === difficulty
    );

    if (filteredWords.length === 0) return "error";

    let rand = Math.floor(Math.random() * filteredWords.length);
    return filteredWords[rand].word;
}

// Start the game after data loads
function startGame() {
    translateUI();
    word = getWord(language, difficulty);
    init();
}

// Initialize the game
function init() {
    result = Array(word.length).fill("_ ");
    wrong_letters = [];
    life = 6;
    gameInProgress = true;

    document.getElementById("word_length").innerHTML = result.join(" ");
    document.getElementById("wrong_letters").innerHTML = translations[language].wrongLetters;
    document.getElementById("lives").innerHTML = translations[language].lives.replace("{lives}", life);
    document.getElementById("error").innerHTML = "";
    document.getElementById("hangman-image").src = `images/hangman-1.png`;
}

// Handle language selection
function language_selection() {
    language = document.getElementById("language").value;
    translateUI();
    word = getWord(language, difficulty);
    init(); // Reset game with new word
}

// Handle difficulty selection
function difficulty_selection() {
    difficulty = document.getElementById("difficulty").value;
    word = getWord(language, difficulty);
    init(); // Reset game with new word
}

// Handle letter submission
function letter_submit(event) {
    if (!gameInProgress) return;

    event.preventDefault();
    let letterInput = document.getElementById("letter");
    let letter = letterInput.value.trim().toLowerCase();

    const t = translations[language];

    // Validate letter input
    if (letter.length !== 1 || !/^[a-zA-Zа-яА-Я]$/.test(letter)) {
        document.getElementById("error").innerHTML = t.invalidLetter;
        letterInput.value = "";
        return;
    }

    let correctGuess = false;

    // Check if the letter is already tried
    if (result.includes(letter) || wrong_letters.includes(letter)) {
        document.getElementById("error").innerHTML = t.alreadyTried;
        letterInput.value = "";
        return;
    }

    // Check if the letter is in the word
    for (let i = 0; i < word.length; i++) {
        if (letter === word[i]) {
            result[i] = letter;
            correctGuess = true;
        }
    }

    // Handle incorrect guesses
    if (!correctGuess) {
        life--;
        wrong_letters.push(letter);
        let imageIndex = 7 - life;
        document.getElementById(
            "hangman-image"
        ).src = `images/hangman-${imageIndex}.png`;
    }

    // Update the game status
    letterInput.value = "";
    document.getElementById("word_length").innerHTML = result.join(" ");
    document.getElementById("wrong_letters").innerHTML = t.wrongLetters + " " + wrong_letters.join(", ");
    document.getElementById("lives").innerHTML =
        life > 0 ? t.lives.replace("{lives}", life) : t.lost;

    // Check win or lose conditions
    if (life <= 0) {
        gameInProgress = false;
        alert(t.lost);
    }

    if (!result.includes("_ ")) {
        gameInProgress = false;
        document.getElementById("lives").innerHTML = t.won;
        alert(t.won);
    }
}

// Event listeners setup
document.getElementById("language").addEventListener("change", language_selection);
document.getElementById("difficulty").addEventListener("change", difficulty_selection);
document.getElementById("letter-form").addEventListener("submit", letter_submit);