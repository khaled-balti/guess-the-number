// DOM Elements
const signUpForm = document.getElementById("signUpForm");
const loginForm = document.getElementById("loginForm");
const gameContainer = document.getElementById("gameContainer");
const player1Input = document.getElementById("player1Input");
const startGameButton = document.getElementById("startGameButton");
const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const resetButton = document.getElementById("resetButton");
const feedback = document.getElementById("feedback");
const goToLogin = document.getElementById("goToLogin");
const goToSignUp = document.getElementById("goToSignUp");

// Variables for Game State
let secretNumber = null;
let attemptsLeft = 6;
let currentPlayer = null; // Stores logged-in user data

goToLogin.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default anchor link behavior
  signUpForm.style.display = "none";  // Hide sign-up form
  loginForm.style.display = "block";  // Show login form
});

// Event listener for switching from Login form to Sign Up form (clicking "Sign up here")
goToSignUp.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default anchor link behavior
  loginForm.style.display = "none";  // Hide login form
  signUpForm.style.display = "block";  // Show sign-up form
});

// Sign Up AJAX Request
signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    full_name: document.getElementById("fullName").value,
    username: document.getElementById("usernameSignUp").value,
    password: document.getElementById("passwordSignUp").value,
  };

  fetch("signup.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      alert(response.message);
      if (response.success) {
        signUpForm.reset();
        signUpForm.style.display = "none";
        loginForm.style.display = "block";  // Toggle to login form after successful signup
      }
    })
    .catch((error) => console.error("Error:", error));
});

// Login AJAX Request
loginForm.addEventListener("submit", (e) => {  // Ensure the login form has its own listener
  e.preventDefault();

  const data = {
    username: document.getElementById("usernameLogin").value,
    password: document.getElementById("passwordLogin").value,
  };

  fetch("http://127.0.0.1:8000/login.php", { // URL for the login request
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to login.");
      return res.json();
    })
    .then((response) => {
      alert(response.message);
      if (response.success) {
        loginForm.reset();
        loginForm.style.display = "none";
        gameContainer.style.display = "block";  // Show the game container after successful login
      }
    })
    .catch((error) => console.error("Error:", error));
});

// Save Game History AJAX Request
function saveGameResult(winnerId, loserId) {
  const data = { winner_id: winnerId, loser_id: loserId };

  fetch("save_game.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      console.log(response.message);
    })
    .catch((error) => console.error("Error:", error));
}

// Game Logic
function startGame() {
  const inputNumber = parseInt(player1Input.value);

  if (isNaN(inputNumber) || inputNumber < 1 || inputNumber > 100) {
    feedback.textContent = "Please enter a valid number between 1 and 100.";
    return;
  }

  secretNumber = inputNumber;
  attemptsLeft = 6;
  feedback.textContent = "Game started! Player 2, make your first guess.";
  player1Input.disabled = true;
  startGameButton.disabled = true;
  guessInput.disabled = false;
  guessButton.disabled = false;
}

function checkGuess() {
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = "Please enter a valid number between 1 and 100.";
    return;
  }

  attemptsLeft--;

  if (guess === secretNumber) {
    feedback.textContent = `Congratulations, you guessed it right!`;
    // Save game result: current player as winner, dummy player as loser
    saveGameResult(currentPlayer.id, -1); // Replace -1 with actual opponent's ID if available
    endGame();
  } else if (attemptsLeft > 0) {
    feedback.textContent =
      guess < secretNumber
        ? `Too low! Attempts left: ${attemptsLeft}`
        : `Too high! Attempts left: ${attemptsLeft}`;
  } else {
    feedback.textContent = "Game over! You've used all your attempts.";
    // Save game result: dummy player as winner, current player as loser
    saveGameResult(-1, currentPlayer.id); // Replace -1 with actual opponent's ID if available
    endGame();
  }
}

function endGame() {
  guessInput.disabled = true;
  guessButton.disabled = true;
  resetButton.disabled = false;
}

function resetGame() {
  secretNumber = null;
  attemptsLeft = 6;
  feedback.textContent = "";
  player1Input.value = "";
  player1Input.disabled = false;
  startGameButton.disabled = false;
  guessInput.value = "";
  guessInput.disabled = true;
  guessButton.disabled = true;
  resetButton.disabled = true;
}

// Event Listeners
startGameButton.addEventListener("click", startGame);
guessButton.addEventListener("click", checkGuess);
resetButton.addEventListener("click", resetGame);
