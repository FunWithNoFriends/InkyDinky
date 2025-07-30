// script.js

// Game state variables
let guessedWords = [];
let current = {};
let word1 = '', word2 = '';
let word1Guessed = false;
let word2Guessed = false;
let wrongGuesses = 0;
const maxGuesses = 3;
let gameOver = false;

const successModal = document.getElementById('success-modal');
const playAgainBtn = document.getElementById('play-again-btn');
const shareBtn = document.getElementById('share-btn');
const shareMsg = document.getElementById('share-msg');

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
    document.getElementById('feedback').textContent = `You've played all available puzzles. Thanks for playing!`;
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
  const word1Display = word1Guessed
    ? `<span class="neon-purple">${word1}</span>`
    : `<span class="purple-underline">${'_'.repeat(word1.length)}</span>`;
  const word2Display = word2Guessed
    ? `<span class="neon-blue">${word2}</span>`
    : `<span class="blue-underline">${'_'.repeat(word2.length)}</span>`;

  document.getElementById('progress').innerHTML = `${word1Display} ${word2Display}`;
  document.getElementById('clue').textContent = `"${current.description}"`;
  document.getElementById('attempts').textContent = 'X'.repeat(wrongGuesses);
  document.getElementById('feedback').textContent = message;
  document.getElementById('guess').value = '';
  document.getElementById('guess').focus();

  document.getElementById('guess').disabled = gameOver;
  document.getElementById('submit').disabled = gameOver;
}

function showSuccessModal() {
  successModal.classList.remove('hidden');
}

function hideSuccessModal() {
  successModal.classList.add('hidden');
}

function getShareableLink() {
  const baseUrl = window.location.href.split('?')[0];
  const phrase = encodeURIComponent(current.answer);
  return `${baseUrl}?phrase=${phrase}`;
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((res, rej) => {
      document.execCommand('copy') ? res() : rej();
      textArea.remove();
    });
  }
}

function processGuess() {
  if (gameOver) return;

  const input = document.getElementById('guess').value.trim().toLowerCase();
  if (!/^[a-z\s]+$/.test(input) || input.length < 3) {
    updateUI("Woops.");
    return;
  }

  const inputWords = input.split(/\s+/);
  const answerWords = current.answer.toLowerCase().split(/\s+/);

  if (
    inputWords.length === 2 &&
    ((inputWords[0] === answerWords[0] && inputWords[1] === answerWords[1]) ||
     (inputWords[0] === answerWords[1] && inputWords[1] === answerWords[0]))
  ) {
    word1Guessed = word2Guessed = true;
    updateUI(`Amazing!`);
    gameOver = true;
    showSuccessModal();
    return;
  }

  if (input === word1 && !word1Guessed) {
    word1Guessed =
