let data = [];

// Load words.json file
fetch("./words.json")
    .then((response) => response.json())
    .then((jsonData) => {
        data = jsonData;
        startGame();
    })
    .catch((error) => console.error("Error loading word data:", error));

let language = "en";
let difficulty = "easy";
let word = "";
let result = [];
let life = 6;
let wrong_letters = [];
let gameInProgress = true;

// Translations
const translations = {
    en: {
        chooseLanguage: "Choose Language",
        chooseLanguageLabel: "Choose language",
        chooseDifficulty: "Choose Difficulty",
        chooseDifficultyLabel: "Choose difficulty",
        enterLetter: "Enter a letter:",
        submit: "Submit",
        alreadyTried: "You have already tried this letter!",
        wrongLetters: "Wrong letters: ",
        lives: "You have {lives} lives!",
        languageOptions: { en: "English", bg: "Bulgarian" },
        difficultyOptions: { easy: "Easy", medium: "Medium", hard: "Hard" },
    },
    bg: {
        chooseLanguage: "Изберете език",
        chooseLanguageLabel: "Изберете език",
        chooseDifficulty: "Изберете трудност",
        chooseDifficultyLabel: "Изберете трудност",
        enterLetter: "Въведете буква:",
        submit: "Изпрати",
        alreadyTried: "Вече сте опитвали тази буква!",
        wrongLetters: "Неправилни букви: ",
        lives: "Имате {lives} живота!",
        languageOptions: { en: "Английски", bg: "Български" },
        difficultyOptions: { easy: "Лесно", medium: "Средно", hard: "Трудно" },
    }
};

// Update text content dynamically
function updateTextContent() {
    const languageText = translations[language];

    for (let key in languageText) {
        const elements = document.querySelectorAll(`[data-text="${key}"]`);
        elements.forEach((element) => {
            if (key === "lives") {
                element.textContent = languageText[key].replace("{lives}", life);
            } else {
                element.textContent = languageText[key];
            }
        });
    }

    // Update dropdown options
    document.querySelector('#language option[value="en"]').textContent = languageText.languageOptions.en;
    document.querySelector('#language option[value="bg"]').textContent = languageText.languageOptions.bg;

    document.querySelector('#difficulty option[value="easy"]').textContent = languageText.difficultyOptions.easy;
    document.querySelector('#difficulty option[value="medium"]').textContent = languageText.difficultyOptions.medium;
    document.querySelector('#difficulty option[value="hard"]').textContent = languageText.difficultyOptions.hard;
}

// Get word from JSON
function getWord(language, difficulty) {
    const filteredWords = data.filter((item) => item.language === language && item.difficulty === difficulty);
    if (filteredWords.length === 0) return "error";
    return filteredWords[Math.floor(Math.random() * filteredWords.length)].word;
}

// Start game
function startGame() {
    word = getWord(language, difficulty);
    init();
}

// Initialize game
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

    updateTextContent();
}

// Change language
function language_selection() {
    language = document.getElementById("language").value;
    word = getWord(language, difficulty);
    init();
}

// Change difficulty
function difficulty_selection() {
    difficulty = document.getElementById("difficulty").value;
    word = getWord(language, difficulty);
    init();
}

// Handle letter submission
function letter_submit(event) {
    if (!gameInProgress) return;

    event.preventDefault();
    let letterInput = document.getElementById("letter");
    let letter = letterInput.value.trim().toLowerCase();

    if (letter.length !== 1 || !/^[a-zA-Zа-яА-Я]$/.test(letter)) {
        document.getElementById("error").innerHTML = translations[language].alreadyTried;
        letterInput.value = "";
        return;
    }

    if (result.includes(letter) || wrong_letters.includes(letter)) {
        document.getElementById("error").innerHTML = translations[language].alreadyTried;
        letterInput.value = "";
        return;
    }

    let correctGuess = word.includes(letter);
    if (!correctGuess) {
        life--;
        wrong_letters.push(letter);
    } else {
        word.split("").forEach((char, i) => {
            if (char === letter) result[i] = letter;
        });
    }

    document.getElementById("word_length").innerHTML = result.join(" ");
    document.getElementById("wrong_letters").innerHTML = translations[language].wrongLetters + wrong_letters.join(", ");
    document.getElementById("lives").innerHTML = translations[language].lives.replace("{lives}", life);

    if (life <= 0) gameInProgress = false;
    if (!result.includes("_ ")) gameInProgress = false;
}

// Event Listeners
document.getElementById("language").addEventListener("change", language_selection);
document.getElementById("difficulty").addEventListener("change", difficulty_selection);
document.getElementById("letter-form").addEventListener("submit", letter_submit);
