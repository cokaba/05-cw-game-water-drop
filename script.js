// charity: water – Water Drop Game Logic

// Variables to control game state
let gameRunning = false;     // Keeps track of whether game is active or not
let dropMaker = null;        // Will store our timer that creates drops regularly
let timerInterval = null;    // Stores countdown timer interval
let score = 0;               // Player score
let time = 30;               // 30-second countdown timer
let soundEnabled = true;     // Audio toggle
let highScore = 0;           // Highest score achieved

// Gameplay counters
let goodDropsCaught = 0;
let badDropsClicked = 0;
let goldenDropsCaught = 0;
let sludgeDropsClicked = 0;

// Load saved high score from localStorage if available
try {
  const saved = localStorage.getItem("cw_water_drop_highscore");
  if (saved) highScore = parseInt(saved, 10) || 0;
} catch (e) {
  // Local storage failsafe
}

// Required by assignment: Array of winning messages when score is 20 or higher
const winningMessages = [
  "Incredible work! You collected enough clean water to change lives!",
  "You're a clean water hero! Every single drop counts for communities around the world!",
  "Amazing reflexes! You hit 20+ drops and brought clean drinking water home!",
  "Fantastic victory! Your speed and precision keep clean water flowing!",
  "Pure excellence! You reached the target and conquered the Water Drop challenge!",
  "Brilliant job! Clean water changes everything, and you just proved it!"
];

// Required by assignment: Array of try-again messages when score is less than 20
const losingMessages = [
  "Almost there! Every drop matters — give it another shot!",
  "Good effort! Tap faster to reach 20 drops and bring clean water home!",
  "Don't give up! Dodge those murky red drops and catch the clean blue ones!",
  "Close call! With a little more practice, you'll easily break 20 points!",
  "Keep going! Clear waters are within reach — click Start to try again!",
  "You've got this! Quick fingers will help you reach 20 points next round!"
];

// Wait for button clicks to control the game
const startBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const soundBtn = document.getElementById("sound-btn");

if (startBtn) {
  startBtn.addEventListener("click", () => {
    if (gameRunning) {
      resetGame();
    } else {
      startGame();
    }
  });
}
if (playAgainBtn) playAgainBtn.addEventListener("click", () => {
  hideGameOverModal();
  startGame();
});
if (soundBtn) soundBtn.addEventListener("click", toggleSound);

// Audio Synthesis using Web Audio API
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) audioCtx = new AudioContextClass();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type = "sine", duration = 0.15, gainVal = 0.2) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (type === "sine") {
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration * 0.5);
    }

    gain.gain.setValueAtTime(gainVal, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  } catch (err) {
    // Audio playback failsafe
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  if (soundBtn) {
    soundBtn.textContent = soundEnabled ? "🔊" : "🔇";
    soundBtn.title = soundEnabled ? "Mute Sound" : "Unmute Sound";
  }
}

// Start the game
function startGame() {
  // Prevent multiple games from running at once
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  time = 30;
  goodDropsCaught = 0;
  badDropsClicked = 0;
  goldenDropsCaught = 0;
  sludgeDropsClicked = 0;

  // Update UI values
  updateScoreDisplay();
  updateTimeDisplay();
  
  // Hide idle overlay and modal
  const idleScreen = document.getElementById("idle-screen");
  if (idleScreen) idleScreen.classList.add("hidden");
  hideGameOverModal();

  // Replace "Playing..." message with a functional Reset button
  if (startBtn) {
    startBtn.textContent = "Reset";
    startBtn.classList.add("reset-mode");
    startBtn.disabled = false;
  }

  // Create new drops regularly (every 850 milliseconds)
  dropMaker = setInterval(createDrop, 850);

  // Start 30-second countdown timer (decrements every 1 second)
  timerInterval = setInterval(() => {
    time--;
    updateTimeDisplay();

    if (time <= 0) {
      endGame();
    }
  }, 1000);
}

// Update the score displayed in the header
function updateScoreDisplay() {
  const scoreSpan = document.getElementById("score");
  if (scoreSpan) scoreSpan.textContent = score;
}

// Update the timer displayed in the header
function updateTimeDisplay() {
  const timeSpan = document.getElementById("time");
  if (timeSpan) {
    timeSpan.textContent = time;
    if (time <= 5) {
      timeSpan.parentElement.classList.add("low-time");
    } else {
      timeSpan.parentElement.classList.remove("low-time");
    }
  }
}

// Create a falling water drop
function createDrop() {
  if (!gameRunning) return;

  const gameContainer = document.getElementById("game-container");
  if (!gameContainer) return;

  // Create a new div element that will be our water drop
  const drop = document.createElement("div");
  drop.className = "water-drop";

  // Determine drop type: 68% clean drops, 14% bad drops, 10% large murky sludge drops (-5), 8% golden drops (+3)
  const randType = Math.random();
  let dropType = "good";
  if (randType > 0.92) {
    dropType = "golden";
    drop.classList.add("golden-drop");
  } else if (randType > 0.82) {
    dropType = "sludge";
    drop.classList.add("sludge-drop");
  } else if (randType > 0.68) {
    dropType = "bad";
    drop.classList.add("bad-drop");
  }

  // Make drops different sizes for visual variety
  // Large brown murky drops are noticeably larger (85px - 110px)
  let size;
  if (dropType === "sludge") {
    const initialSize = 85;
    const sizeMultiplier = Math.random() * 0.3 + 1.0;
    size = initialSize * sizeMultiplier;
  } else {
    const initialSize = 60;
    const sizeMultiplier = Math.random() * 0.8 + 0.5;
    size = initialSize * sizeMultiplier;
  }
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;

  // Position the drop randomly across the game width
  const gameWidth = gameContainer.offsetWidth;
  const maxX = Math.max(10, gameWidth - size - 10);
  const xPosition = Math.random() * maxX;
  drop.style.left = `${xPosition}px`;

  // Make drops fall for about 3.8 seconds (large sludge falls slightly heavier/faster)
  const fallDuration = dropType === "sludge"
    ? (3.0 + Math.random() * 0.5).toFixed(2)
    : (3.5 + Math.random() * 0.6).toFixed(2);
  drop.style.animationDuration = `${fallDuration}s`;

  // Add click handler to catch the drop
  drop.addEventListener("click", (e) => {
    if (!gameRunning) return;

    // Award or deduct points based on drop type
    let points = 1;
    let splashClass = "good";
    let splashText = "+1";

    if (dropType === "good") {
      points = 1;
      goodDropsCaught++;
      splashClass = "good";
      splashText = "+1";
      playTone(600, "sine", 0.12, 0.25);
    } else if (dropType === "bad") {
      points = -1;
      badDropsClicked++;
      splashClass = "bad";
      splashText = "-1";
      playTone(180, "sawtooth", 0.2, 0.25);
    } else if (dropType === "sludge") {
      points = -5;
      sludgeDropsClicked++;
      splashClass = "sludge";
      splashText = "-5";
      playTone(95, "sawtooth", 0.35, 0.35);
    } else if (dropType === "golden") {
      points = 3;
      goldenDropsCaught++;
      splashClass = "golden";
      splashText = "+3!";
      playTone(880, "triangle", 0.2, 0.3);
    }

    // Update score (prevent negative score)
    score = Math.max(0, score + points);
    updateScoreDisplay();

    // Spawn splash effect at drop position
    showSplash(xPosition + size / 2, e.clientY - gameContainer.getBoundingClientRect().top, splashClass, splashText);

    // Remove drop immediately on click
    drop.remove();
  });

  // Remove drops that reach the bottom (weren't clicked)
  drop.addEventListener("animationend", () => {
    drop.remove(); // Clean up drops that weren't caught
  });

  // Add the new drop to the game screen
  gameContainer.appendChild(drop);
}

// Show visual splash ripple & point pop-up
function showSplash(x, y, className, text) {
  const gameContainer = document.getElementById("game-container");
  if (!gameContainer) return;

  const splash = document.createElement("div");
  splash.className = "splash-effect";
  splash.style.left = `${x}px`;
  splash.style.top = `${y}px`;

  const ring = document.createElement("div");
  ring.className = `splash-ring ${className}`;

  const label = document.createElement("div");
  label.className = `splash-text ${className}`;
  label.textContent = text;

  splash.appendChild(ring);
  splash.appendChild(label);
  gameContainer.appendChild(splash);

  setTimeout(() => splash.remove(), 500);
}

// Reset the game back to the initial state
function resetGame() {
  gameRunning = false;

  // Clear timers
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  score = 0;
  time = 30;
  goodDropsCaught = 0;
  badDropsClicked = 0;
  goldenDropsCaught = 0;
  sludgeDropsClicked = 0;

  updateScoreDisplay();
  updateTimeDisplay();

  // Remove any active drops and splashes from the screen
  const drops = document.querySelectorAll(".water-drop");
  drops.forEach((d) => d.remove());

  const splashes = document.querySelectorAll(".splash-effect");
  splashes.forEach((s) => s.remove());

  // Show idle overlay again and hide game over modal if open
  const idleScreen = document.getElementById("idle-screen");
  if (idleScreen) idleScreen.classList.remove("hidden");
  hideGameOverModal();

  // Switch button back to "Start Game"
  if (startBtn) {
    startBtn.textContent = "Start Game";
    startBtn.classList.remove("reset-mode");
    startBtn.disabled = false;
  }
}

// End the game when the timer reaches 0
function endGame() {
  gameRunning = false;

  // Clear timers
  clearInterval(dropMaker);
  clearInterval(timerInterval);

  if (startBtn) {
    startBtn.textContent = "Start Game";
    startBtn.classList.remove("reset-mode");
    startBtn.disabled = false;
  }

  // Remove all active drops from screen
  const drops = document.querySelectorAll(".water-drop");
  drops.forEach((d) => d.remove());

  // Check and update high score
  if (score > highScore) {
    highScore = score;
    try {
      localStorage.setItem("cw_water_drop_highscore", highScore.toString());
    } catch (e) {
      // Local storage failsafe
    }
  }

  // Determine win or loss and select random message from corresponding array
  const isWin = score >= 20;
  let chosenMessage = "";

  if (isWin) {
    const randomIndex = Math.floor(Math.random() * winningMessages.length);
    chosenMessage = winningMessages[randomIndex];
    playTone(523.25, "sine", 0.4, 0.3);
  } else {
    const randomIndex = Math.floor(Math.random() * losingMessages.length);
    chosenMessage = losingMessages[randomIndex];
    playTone(293.66, "triangle", 0.35, 0.2);
  }

  // Display Game Over modal
  showGameOverModal(isWin, chosenMessage);
}

// Show the Game Over dialog
function showGameOverModal(isWin, message) {
  const modal = document.getElementById("game-over-modal");
  const modalHeader = document.getElementById("modal-header");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const endMessageEl = document.getElementById("end-message");
  const finalScoreEl = document.getElementById("final-score");
  const highScoreEl = document.getElementById("high-score");
  const statsGoodEl = document.getElementById("stats-good");
  const statsBadEl = document.getElementById("stats-bad");
  const statsSludgeEl = document.getElementById("stats-sludge");
  const statsGoldenEl = document.getElementById("stats-golden");

  if (!modal) return;

  if (modalHeader) {
    modalHeader.className = `modal-header ${isWin ? "win" : "try-again"}`;
  }
  if (modalTitle) modalTitle.textContent = isWin ? "Goal Achieved!" : "Time Is Up!";
  if (modalSubtitle) modalSubtitle.textContent = isWin ? "20+ Drops Collected!" : "Target: 20 Drops";
  if (endMessageEl) endMessageEl.textContent = `"${message}"`;
  if (finalScoreEl) finalScoreEl.textContent = score;
  if (highScoreEl) highScoreEl.textContent = highScore;
  if (statsGoodEl) statsGoodEl.textContent = goodDropsCaught;
  if (statsBadEl) statsBadEl.textContent = badDropsClicked;
  if (statsSludgeEl) statsSludgeEl.textContent = sludgeDropsClicked;
  if (statsGoldenEl) statsGoldenEl.textContent = goldenDropsCaught;

  modal.classList.remove("hidden");
}

function hideGameOverModal() {
  const modal = document.getElementById("game-over-modal");
  if (modal) modal.classList.add("hidden");
}
