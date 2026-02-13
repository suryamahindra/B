const holes = [...document.querySelectorAll('.hole')];
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const bestEl = document.getElementById('best');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start-btn');

const ROUND_SECONDS = 30;
const POP_INTERVAL_MS = 650;

let score = 0;
let timeLeft = ROUND_SECONDS;
let activeIndex = -1;
let gameTimer = null;
let popTimer = null;
let playing = false;

const BEST_KEY = 'whak-a-akku-best';
const savedBest = Number(localStorage.getItem(BEST_KEY)) || 0;
bestEl.textContent = String(savedBest);

function clearActive() {
  if (activeIndex >= 0) {
    holes[activeIndex].classList.remove('active');
    holes[activeIndex].textContent = '';
    activeIndex = -1;
  }
}

function popAkku() {
  clearActive();
  activeIndex = Math.floor(Math.random() * holes.length);
  holes[activeIndex].classList.add('active');
  holes[activeIndex].textContent = '🔋';
}

function stopGame() {
  playing = false;
  clearInterval(gameTimer);
  clearInterval(popTimer);
  clearActive();

  startBtn.disabled = false;
  startBtn.textContent = 'Play Again';

  const best = Math.max(Number(bestEl.textContent), score);
  bestEl.textContent = String(best);
  localStorage.setItem(BEST_KEY, String(best));

  statusEl.textContent = `Time! Final score: ${score}.`;
}

function tick() {
  timeLeft -= 1;
  timeEl.textContent = String(timeLeft);

  if (timeLeft <= 0) {
    stopGame();
  }
}

function startGame() {
  score = 0;
  timeLeft = ROUND_SECONDS;
  playing = true;

  scoreEl.textContent = '0';
  timeEl.textContent = String(ROUND_SECONDS);
  statusEl.textContent = 'Go! Whak every Akku you can!';
  startBtn.disabled = true;

  popAkku();
  gameTimer = setInterval(tick, 1000);
  popTimer = setInterval(popAkku, POP_INTERVAL_MS);
}

holes.forEach((hole) => {
  hole.addEventListener('click', () => {
    if (!playing || !hole.classList.contains('active')) {
      return;
    }

    score += 1;
    scoreEl.textContent = String(score);
    hole.classList.remove('active');
    hole.classList.add('hit');
    hole.textContent = '⚡';
    statusEl.textContent = 'Nice whak!';

    setTimeout(() => hole.classList.remove('hit'), 160);
    activeIndex = -1;
  });
});

startBtn.addEventListener('click', startGame);
