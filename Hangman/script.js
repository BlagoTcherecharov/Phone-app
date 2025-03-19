/*const APP_ID = 'dictionary-rmsrt';
const ATLAS_SERVICE = 'mongodb-atlas';
const DATABASE_NAME = 'dictionary';
const COLLECTION_NAME = 'data';

async function getDictionary(language) {
    var app = new Realm.App({id: APP_ID});
    try {
        let credentials = Realm.Credentials.anonymous();
        let user = await app.logIn(credentials);
        let client = app.currentUser.mongoClient(ATLAS_SERVICE);
        let collection = client.db(DATABASE_NAME).collection(COLLECTION_NAME);
        let result = await collection.find(
            { "language": language },
            { "projection": { "_id": 0, "language": 0 } }
        );
        if (result.length !== 0) {
            dictionary = result[0].words;
            console.log(dictionary);
        }
    } 
    catch (error) {
        showWarning("Error in database!");
    }
}*/

let word = "next";
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
    alert(language);
}

//Choice of difficulty
function difficulty_selection() {
    let difficulty = document.getElementById('difficulty').value;
    alert(difficulty);
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
