// Setting Game Name
const gameName = "Guess The Number";
document.title = gameName;
document.querySelector("h1").textContent = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By <span>Moataz Ahmed</span>`;

// Setting Game Options
const numbersOfTries = 6;
let currentTry = 1;
let numToGuess = getRandomNumber();
const messageArea = document.querySelector(".message");

// Manage Number
function getRandomNumber() {
    let num;
    do {
        num = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    } while (!noDuplicates(num));
    return num.toString(); 
}

function noDuplicates(num) {
    const numArray = Array.from(String(num), Number);
    return numArray.length === new Set(numArray).size;
}

// Generate Inputs
function generateInput() {
    const inputsContainer = document.querySelector(".inputs");
    inputsContainer.innerHTML = ""; 

    for (let i = 1; i <= numbersOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        if (i !== 1) tryDiv.classList.add("disabled-inputs");

        for (let j = 1; j <= 4; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.maxLength = 1;
            input.addEventListener("input", () => {
                if (input.nextElementSibling) input.nextElementSibling.focus();
            });
            input.addEventListener("keydown", (event) => handleArrowKeys(event, input));
            tryDiv.appendChild(input);
        }
        inputsContainer.appendChild(tryDiv);
    }
    // Focus on the first input of the first try and disable others
    inputsContainer.children[0].children[0].focus();
    toggleInputs(1);
}

// Handle Arrow Key Navigation
function handleArrowKeys(event, input) {
    const inputs = document.querySelectorAll("input");
    const currentIndex = Array.from(inputs).indexOf(input);
    if (event.key === "ArrowRight" && currentIndex < inputs.length - 1) {
        inputs[currentIndex + 1].focus();
    } else if (event.key === "ArrowLeft" && currentIndex > 0) {
        inputs[currentIndex - 1].focus();
    }else if (event.key === "Backspace" && input.value === "") {
        // Move focus to the previous input if the current one is empty
        if (currentIndex > 0) {
            inputs[currentIndex - 1].focus();
        }
    }
}

// Toggle Input States
function toggleInputs(tryNumber) {
    document.querySelectorAll(".inputs > div").forEach((div, index) => {
        const inputs = div.querySelectorAll("input");
        div.classList.toggle("disabled-inputs", index !== tryNumber - 1);
        inputs.forEach(input => input.disabled = index !== tryNumber - 1);
    });
}

// Fireworks Animation
function triggerFireworks() {
    const container = document.querySelector('.fireworks-container');
    for (let i = 0; i < 50; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * window.innerWidth + 'px';
        firework.style.top = Math.random() * window.innerHeight + 'px';
        firework.style.background = getRandomColor();
        container.appendChild(firework);
        firework.addEventListener('animationend', () => firework.remove());
    }
}

function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

// Show Play Again Button When Game Ends
function showPlayAgainButton() {
    const playAgainButton = document.querySelector(".play-again");
    playAgainButton.style.display = "block";
    playAgainButton.addEventListener("click", resetGame);
}
console.log(numToGuess);
// Reset the Game
function resetGame() {
    currentTry = 1;
    numToGuess = getRandomNumber();
    messageArea.innerHTML = "";
    generateInput();
    console.log(numToGuess); 
    toggleInputs(currentTry);
    guessButton.disabled = false;
    document.querySelector(".play-again").style.display = "none";
}

// Initialize Game
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);
document.addEventListener("keydown", event => {
    if (event.key === "Enter") guessButton.click();
});

// Handle Guesses Function
function handleGuesses() {
    let successGuess = true;
    const inputs = Array.from(document.querySelectorAll(`.try-${currentTry} input`));

    inputs.forEach((input, index) => {
        const letter = input.value.toLowerCase();
        const actualLetter = numToGuess[index];

        if (letter === actualLetter) {
            input.classList.add("yes-in-place");
        } else if (numToGuess.includes(letter) && letter !== "") {
            input.classList.add("not-in-place");
            successGuess = false;
        } else {
            input.classList.add("no");
            successGuess = false;
        }
    });

    if (successGuess) {
        triggerFireworks();
        messageArea.innerHTML = `Congratulations! The Number is <span>${numToGuess}</span><h2>You got it in ${currentTry} ${(currentTry === 1) ? "try" : "tries"}</h2>`;
        toggleInputs(currentTry);
        guessButton.disabled = true;
        showPlayAgainButton();
    } else {
        toggleInputs(currentTry + 1);
        if (currentTry < numbersOfTries) {
            currentTry++;
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            document.querySelector(`.try-${currentTry} input`).focus();
        } else {
            messageArea.innerHTML = `You Lose! The Number was <span>${numToGuess}</span>`;
            guessButton.disabled = true;
            showPlayAgainButton();
        }
    }
}
// Generate Inputs on Window Load
window.onload = generateInput();
