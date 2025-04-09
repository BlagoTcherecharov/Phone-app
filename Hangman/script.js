let data = [];
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
        wrongAlphabet: "Please enter a Latin (A-Z) letter!",
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
        wrongAlphabet: "Моля, въведете буква на кирилица.",
    }
};

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("language").addEventListener("change", language_selection);
    document.getElementById("difficulty").addEventListener("change", difficulty_selection);
    document.getElementById("letter-form").addEventListener("submit", letter_submit);
    document.getElementById("letter").addEventListener("input", () => {
        document.getElementById("error").textContent = "";
    });

    // Load words
    fetch("./words.json")
        .then(res => res.json())
        .then(jsonData => {
            data = jsonData;
            startGame();
        })
        .catch(err => console.error("Error loading word data:", err));
});

// Get a random word based on selected language and difficulty
function getWord(language, difficulty) {
    const filtered = data.filter(item => item.language === language && item.difficulty === difficulty);
    if (filtered.length === 0) return "error";
    return filtered[Math.floor(Math.random() * filtered.length)].word;
}

// Start new game
function startGame() {
    word = getWord(language, difficulty);
    init();
}

// Initialize game state
function init() {
    result = Array(word.length).fill("_");
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

// Update visible language-based UI text
function updateTextContent() {
    const langText = translations[language];

    for (let key in langText) {
        const elements = document.querySelectorAll(`[data-text="${key}"]`);
        elements.forEach(el => {
            if (key === "lives") {
                el.textContent = langText[key].replace("{lives}", life);
            } else {
                el.textContent = langText[key];
            }
        });
    }

    document.querySelector('#language option[value="en"]').textContent = langText.languageOptions.en;
    document.querySelector('#language option[value="bg"]').textContent = langText.languageOptions.bg;
    document.querySelector('#difficulty option[value="easy"]').textContent = langText.difficultyOptions.easy;
    document.querySelector('#difficulty option[value="medium"]').textContent = langText.difficultyOptions.medium;
    document.querySelector('#difficulty option[value="hard"]').textContent = langText.difficultyOptions.hard;
}

// Change language handler
function language_selection() {
    language = document.getElementById("language").value;
    word = getWord(language, difficulty);
    init();
}

// Change difficulty handler
function difficulty_selection() {
    difficulty = document.getElementById("difficulty").value;
    word = getWord(language, difficulty);
    init();
}

// Handle letter submission
function letter_submit(event) {
    event.preventDefault();
    if (!gameInProgress) return;

    const letterInput = document.getElementById("letter");
    const letter = letterInput.value.trim().toLowerCase();

    const isLatin = /^[a-zA-Z]$/.test(letter);
    const isCyrillic = /^[а-яА-ЯёЁ]$/.test(letter);

    const isValid = language === "en" ? isLatin : isCyrillic;

    if (letter.length !== 1 || !isValid) {
        const message = language === "en"
            ? (!isLatin ? translations.en.wrongAlphabet : translations.en.alreadyTried)
            : (!isCyrillic ? translations.bg.wrongAlphabet : translations.bg.alreadyTried);

        document.getElementById("error").innerHTML = message;
        letterInput.value = "";
        return;
    }

    if (result.includes(letter) || wrong_letters.includes(letter)) {
        document.getElementById("error").innerHTML = translations[language].alreadyTried;
        letterInput.value = "";
        return;
    }

    let correct = false;
    word.split("").forEach((char, i) => {
        if (char === letter) {
            result[i] = letter;
            correct = true;
        }
    });

    if (!correct) {
        life--;
        wrong_letters.push(letter);
        document.getElementById("hangman-image").src = `images/hangman-${7 - life}.png`;
    }

    document.getElementById("word_length").innerHTML = result.join(" ");
    document.getElementById("wrong_letters").innerHTML = translations[language].wrongLetters + wrong_letters.join(", ");
    document.getElementById("lives").innerHTML = translations[language].lives.replace("{lives}", life);
    letterInput.value = "";

    if (life <= 0) {
        gameInProgress = false;
        showEndVideo("lose");
    } else if (!result.includes("_")) {
        gameInProgress = false;
        showEndVideo("win");
    }
}

// Show win/lose video
function showEndVideo(type) {
    const overlay = document.getElementById("video-overlay");
    const video = document.getElementById("result-video");
    const source = video.querySelector("source");

    source.src = type === "win" ? "videos/win.mp4" : "videos/lost.mp4";
    video.load();
    overlay.style.display = "flex";
    video.play();

    video.onended = () => {
        overlay.style.display = "none";
        startGame(); 
    };
}
