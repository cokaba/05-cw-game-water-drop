// charity: water – Water Drop Game Logic

// Difficulty Settings:
// - Easy:   Slow fall speed (4.2s-5.0s), Target: 15 pts
// - Medium: Normal fall speed (3.0s-3.8s), Target: 25 pts
// - Hard:   Fast fall speed (1.8s-2.4s), Target: 35 pts
const DIFFICULTY_CONFIG = {
  easy: {
    name: "Easy",
    target: 15,
    fallDurationMin: 4.2,
    fallDurationMax: 5.0,
    sludgeDurationMin: 3.6,
    sludgeDurationMax: 4.4,
    spawnRate: 950,
    speedTag: "Slow Drops • 15 pts Target",
    color: "#159A48"
  },
  medium: {
    name: "Medium",
    target: 25,
    fallDurationMin: 3.0,
    fallDurationMax: 3.8,
    sludgeDurationMin: 2.5,
    sludgeDurationMax: 3.2,
    spawnRate: 800,
    speedTag: "Normal Speed • 25 pts Target",
    color: "#2E9DF7"
  },
  hard: {
    name: "Hard",
    target: 50,
    fallDurationMin: 1.8,
    fallDurationMax: 2.4,
    sludgeDurationMin: 1.4,
    sludgeDurationMax: 1.9,
    spawnRate: 400,
    speedTag: "⚡ Rapid Drops • 50 pts Target",
    color: "#F5402C"
  }
};

let currentDifficulty = "medium";

// Variables to control game state
let gameRunning = false;     // Keeps track of whether game is active or not
let dropMaker = null;        // Will store our timer that creates drops regularly
let timerInterval = null;    // Stores countdown timer interval
let score = 0;               // Player score
let time = 30;               // 30-second countdown timer
let soundEnabled = true;     // Audio toggle
let highScore = 0;           // Highest score achieved for current difficulty

// Gameplay counters
let goodDropsCaught = 0;
let badDropsClicked = 0;
let goldenDropsCaught = 0;
let sludgeDropsClicked = 0;

// High score management per difficulty
function getHighScore(diff = currentDifficulty) {
  try {
    const val = localStorage.getItem(`cw_water_drop_highscore_${diff}`);
    if (val !== null) return parseInt(val, 10) || 0;
    if (diff === "medium") {
      const legacy = localStorage.getItem("cw_water_drop_highscore");
      if (legacy !== null) return parseInt(legacy, 10) || 0;
    }
  } catch (e) {}
  return 0;
}

function saveHighScore(scoreVal, diff = currentDifficulty) {
  try {
    localStorage.setItem(`cw_water_drop_highscore_${diff}`, scoreVal.toString());
    localStorage.setItem("cw_water_drop_highscore", scoreVal.toString());
  } catch (e) {}
}

highScore = getHighScore(currentDifficulty);

// Required by assignment: Array of winning messages
const winningMessages = [
  "Incredible work! You collected enough clean water to change lives!",
  "You're a clean water hero! Every single drop counts for communities around the world!",
  "Amazing reflexes! You hit the target and brought clean drinking water home!",
  "Fantastic victory! Your speed and precision keep clean water flowing!",
  "Pure excellence! You conquered the Water Drop challenge!",
  "Brilliant job! Clean water changes everything, and you just proved it!"
];

// Required by assignment: Array of try-again messages
const losingMessages = [
  "Almost there! Every drop matters — give it another shot!",
  "Good effort! Tap faster to reach the target and bring clean water home!",
  "Don't give up! Dodge those murky drops and catch the clean blue ones!",
  "Close call! With a little more practice, you'll reach the target score!",
  "Keep going! Clear waters are within reach — click Start to try again!",
  "You've got this! Quick fingers will help you win next round!"
];

// Wait for button clicks to control the game
const startBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const soundBtn = document.getElementById("sound-btn");
const diffButtons = document.querySelectorAll(".diff-btn");

function setDifficulty(diff) {
  if (!DIFFICULTY_CONFIG[diff]) return;
  currentDifficulty = diff;
  const cfg = DIFFICULTY_CONFIG[diff];

  // Update button active state
  diffButtons.forEach((btn) => {
    if (btn.getAttribute("data-diff") === diff) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Update target display in score panel
  const targetDisplay = document.getElementById("target-display");
  if (targetDisplay) targetDisplay.textContent = `${cfg.target} pts`;

  // Update speed tag in difficulty bar
  const speedTag = document.getElementById("diff-speed-tag");
  if (speedTag) speedTag.textContent = cfg.speedTag;

  // Update idle screen target text and difficulty name
  const idleTarget = document.getElementById("idle-target");
  if (idleTarget) idleTarget.textContent = `${cfg.target} points`;

  const idleDiffName = document.getElementById("idle-diff-name");
  if (idleDiffName) {
    idleDiffName.textContent = cfg.name;
    idleDiffName.style.color = cfg.color;
  }

  // Update current high score for this difficulty
  highScore = getHighScore(diff);

  // If game is currently running, reset it so new settings apply
  if (gameRunning) {
    resetGame();
  }
}

diffButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const diff = btn.getAttribute("data-diff");
    setDifficulty(diff);
  });
});

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

  // Create new drops regularly based on difficulty speed
  const cfg = DIFFICULTY_CONFIG[currentDifficulty];
  dropMaker = setInterval(createDrop, cfg.spawnRate);

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

  // Make drops fall faster based on selected difficulty
  const cfg = DIFFICULTY_CONFIG[currentDifficulty];
  let fallDuration;
  if (dropType === "sludge") {
    fallDuration = (cfg.sludgeDurationMin + Math.random() * (cfg.sludgeDurationMax - cfg.sludgeDurationMin)).toFixed(2);
  } else {
    fallDuration = (cfg.fallDurationMin + Math.random() * (cfg.fallDurationMax - cfg.fallDurationMin)).toFixed(2);
  }
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

  const cfg = DIFFICULTY_CONFIG[currentDifficulty];

  // Check and update high score for current difficulty
  if (score > highScore) {
    highScore = score;
    saveHighScore(highScore, currentDifficulty);
  }

  // Determine win or loss based on current difficulty target
  const isWin = score >= cfg.target;
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

  const cfg = DIFFICULTY_CONFIG[currentDifficulty];

  if (modalHeader) {
    modalHeader.className = `modal-header ${isWin ? "win" : "try-again"}`;
  }
  if (modalTitle) modalTitle.textContent = isWin ? "Goal Achieved!" : "Time Is Up!";
  if (modalSubtitle) {
    modalSubtitle.textContent = isWin
      ? `${cfg.target}+ Drops on ${cfg.name} Mode!`
      : `Target: ${cfg.target} Drops (${cfg.name} Mode)`;
  }
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
