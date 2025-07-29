let guessedWords = [];
  
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
    guessedWords = [];
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
  const word1Display = word1Guessed
    ? `<span class="neon-purple">${word1}</span>`
    : `<span class="purple-underline">${'_'.repeat(word1.length)}</span>`;
  const word2Display = word2Guessed
    ? `<span class="neon-blue">${word2}</span>`
    : `<span class="blue-underline">${'_'.repeat(word1.length)}</span>`;

  document.getElementById('progress').innerHTML = `${word1Display} ${word2Display}`;
  document.getElementById('clue').textContent = `"${current.description}"`;
  document.getElementById('attempts').textContent = 'X'.repeat(wrongGuesses);
  document.getElementById('feedback').textContent = message;
  document.getElementById('guess').value = '';
  document.getElementById('guess').focus();

  document.getElementById('guess').disabled = gameOver;
  document.getElementById('submit').disabled = gameOver;
}

function processGuess() {
  if (gameOver) return;

  const input = document.getElementById('guess').value.trim().toLowerCase();
  if (!/^[a-z\s]+$/.test(input) || input.length < 3) {
  updateUI("Woops.");
  return;
}

  if (input === current.answer.toLowerCase()) {
    word1Guessed = word2Guessed = true;
    updateUI(`Amazing!`);
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
      updateUI(`Oops. Looks like you beefed it! 
      The correct answer was: ${current.answer}`);
      gameOver = true;
      return;
    } else {
      updateUI();
    }
  }

  if (word1Guessed && word2Guessed) {
    updateUI(`Wonderful!`);
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


const helpIcon = document.getElementById('help-icon');
const helpModal = document.getElementById('help-modal');
const closeButton = document.querySelector('.close-button');

helpIcon.addEventListener('click', () => {
  helpModal.classList.remove('hidden');
});

closeButton.addEventListener('click', () => {
  helpModal.classList.add('hidden');
});

window.addEventListener('click', (event) => {
  if (event.target === helpModal) {
    helpModal.classList.add('hidden');
  }
});
