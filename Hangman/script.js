let data = [];

// Load the words.json file
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

// Translations object
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
    }
};

// Function to update the text content dynamically based on selected language
function updateTextContent() {
    const languageText = translations[language];
    
    // Update static texts
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
}

// Function to show the MP4 video when the player wins/loses
function showVideo(resultType) {
    const videoOverlay = document.getElementById("video-overlay");
    const resultVideo = document.getElementById("result-video");

    // Set the correct video file
    if (resultType === "win") {
        resultVideo.src = "videos/win.mp4"; 
    } else {
        resultVideo.src = "videos/lost.mp4"; 
    }

    videoOverlay.style.display = "flex"; 
    resultVideo.play(); 

    // Hide overlay when video ends and restart the game
    resultVideo.onended = () => {
        videoOverlay.style.display = "none";
        startGame(); // Restart the game
    };
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
    word = getWord(language, difficulty);
    init(); // Initialize the game
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

    // Update text content dynamically based on selected language
    updateTextContent();
}

// Handle language selection
function language_selection() {
    language = document.getElementById("language").value;
    word = getWord(language, difficulty);
    init(); // Reset game with new word
    updateTextContent(); // Update the text content to the selected language
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

    // Validate letter input
    if (letter.length !== 1 || !/^[a-zA-Zа-яА-Я]$/.test(letter)) {
        document.getElementById("error").innerHTML = translations[language].alreadyTried;
        letterInput.value = "";
        return;
    }

    let correctGuess = false;

    // Check if the letter is already tried
    if (result.includes(letter) || wrong_letters.includes(letter)) {
        document.getElementById("error").innerHTML = translations[language].alreadyTried;
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
        document.getElementById("hangman-image").src = `images/hangman-${imageIndex}.png`;
    }

    // Update the game status
    letterInput.value = "";
    document.getElementById("word_length").innerHTML = result.join(" ");
    document.getElementById("wrong_letters").innerHTML = translations[language].wrongLetters + wrong_letters.join(", ");
    document.getElementById("lives").innerHTML = life > 0 ? translations[language].lives.replace("{lives}", life) : "You lost!";

    // Check win or lose conditions
    if (life <= 0) {
        gameInProgress = false;
        showVideo("lose");
    }

    if (!result.includes("_ ")) {
        gameInProgress = false;
        showVideo("win");
    }
}

// Event listeners
document.getElementById("language").addEventListener("change", language_selection);
document.getElementById("difficulty").addEventListener("change", difficulty_selection);
document.getElementById("letter-form").addEventListener("submit", letter_submit);
