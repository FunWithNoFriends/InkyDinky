const wordBank = [
  { answer: 'Witness Fitness', description: 'Someone observering – Physical training' },
  { answer: 'Atomic Comic', description: 'An immeasurably small – Professional joker' },
  { answer: 'Cricket Picket', description: 'Game with ball and bat – barriered by spaced uprights' },
  { answer: 'Locket Rocket', description: 'An ornamental accessory – Containing its own propellant' },
];

let current = {};
let word1 = '', word2 = '';
let word1Guessed = false;
let word2Guessed = false;
let wrongGuesses = 0;
const maxGuesses = 3;
let gameOver = false;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function nextRound() {
  if (wordBank.length === 0) {
    document.getElementById('progress').textContent = '';
    document.getElementById('clue').textContent = '';
    document.getElementById('attempts').textContent = '';
    document.getElementById('feedback').textContent = `🎉 You've played all available puzzles. Thanks for playing!`;
    document.getElementById('guess').disabled = true;
    document.getElementById('submit').disabled = true;
    return;
  }
  current = wordBank.pop();
  [word1, word2] = current.answer.toLowerCase().split(" ");
  word1Guessed = false;
  word2Guessed = false;
  wrongGuesses = 0;
  gameOver = false;
  document.getElementById('guess').disabled = false;
  document.getElementById('submit').disabled = false;
  updateUI();
}

function updateUI(message = "") {
  const progress = `${word1Guessed ? word1 : '_'.repeat(word1.length)} ${word2Guessed ? word2 : '_'.repeat(word2.length)}`;
  document.getElementById('progress').textContent = progress;
  document.getElementById('clue').textContent = `"${current.description}"`;
  document.getElementById('attempts').textContent = '❌'.repeat(wrongGuesses);
  document.getElementById('feedback').textContent = message;
  document.getElementById('guess').value = '';
  document.getElementById('guess').focus();

  document.getElementById('guess').disabled = gameOver;
  document.getElementById('submit').disabled = gameOver;
}

function processGuess() {
  if (gameOver) return;

  const input = document.getElementById('guess').value.trim().toLowerCase();
  if (!/^[a-z\s]+$/.test(input) || input === "") {
    updateUI("❗ Please enter letters only.");
    return;
  }

  if (input === current.answer.toLowerCase()) {
    word1Guessed = word2Guessed = true;
    updateUI(`🎉 Amazing! You guessed the full phrase: ${current.answer}`);
    gameOver = true;
    return;
  } else if (input === word1 && !word1Guessed) {
    word1Guessed = true;
    updateUI();
  } else if (input === word2 && !word2Guessed) {
    word2Guessed = true;
    updateUI();
  } else {
    wrongGuesses++;
    if (wrongGuesses >= maxGuesses) {
      updateUI(`💀 Game Over! The correct answer was: ${current.answer}`);
      gameOver = true;
      return;
    } else {
      updateUI();
    }
  }

  if (word1Guessed && word2Guessed) {
    updateUI(`🎉 Congratulations! You guessed both words: ${current.answer}`);
    gameOver = true;
  }
}

document.getElementById('submit').addEventListener('click', processGuess);
document.getElementById('guess').addEventListener('keydown', function(event) {
  if (event.key === "Enter") {
    processGuess();
  }
});

shuffle(wordBank);
nextRound();
