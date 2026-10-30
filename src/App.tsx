import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ScorePanel } from './components/ScorePanel';
import { GameContainer } from './components/GameContainer';
import { GameOverModal } from './components/GameOverModal';
import { ImpactCard } from './components/ImpactCard';
import { HowToPlayModal } from './components/HowToPlayModal';
import { DropItem, SplashEffect, Difficulty } from './types';
import { soundManager } from './utils/audio';
import {
  GAME_DURATION_SECONDS,
  DIFFICULTIES,
  WINNING_MESSAGES,
  TRY_AGAIN_MESSAGES,
} from './utils/constants';

export const App: React.FC = () => {
  // Difficulty State
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  // Game State
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_DURATION_SECONDS);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cw_water_drop_highscore_medium') || localStorage.getItem('cw_water_drop_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });

  // Active items
  const [drops, setDrops] = useState<DropItem[]>([]);
  const [splashes, setSplashes] = useState<SplashEffect[]>([]);

  // Statistics
  const [goodCaught, setGoodCaught] = useState<number>(0);
  const [badClicked, setBadClicked] = useState<number>(0);
  const [goldenCaught, setGoldenCaught] = useState<number>(0);
  const [sludgeClicked, setSludgeClicked] = useState<number>(0);

  // Modals & Messages
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(false);
  const [endMessage, setEndMessage] = useState<string>('');
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Layout measurements
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Refs for timers and current values during callbacks
  const dropIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef<number>(score);
  scoreRef.current = score;
  const highScoreRef = useRef<number>(highScore);
  highScoreRef.current = highScore;

  // Cleanup helper
  const clearGameIntervals = useCallback(() => {
    if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current);
      dropIntervalRef.current = null;
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  // End Game Handler
  const endGame = useCallback(() => {
    clearGameIntervals();
    setGameRunning(false);
    setDrops([]);

    const cfg = DIFFICULTIES[difficulty];
    const finalScore = scoreRef.current;
    if (finalScore > highScoreRef.current) {
      setIsNewHighScore(true);
      setHighScore(finalScore);
      localStorage.setItem(`cw_water_drop_highscore_${difficulty}`, finalScore.toString());
      localStorage.setItem('cw_water_drop_highscore', finalScore.toString());
    } else {
      setIsNewHighScore(false);
    }

    // Pick random message from winning or try-again array based on difficulty target requirement
    if (finalScore >= cfg.target) {
      const randomIndex = Math.floor(Math.random() * WINNING_MESSAGES.length);
      setEndMessage(WINNING_MESSAGES[randomIndex]);
      soundManager.playWin();
    } else {
      const randomIndex = Math.floor(Math.random() * TRY_AGAIN_MESSAGES.length);
      setEndMessage(TRY_AGAIN_MESSAGES[randomIndex]);
      soundManager.playTryAgain();
    }

    setIsGameOverModalOpen(true);
  }, [clearGameIntervals, difficulty]);

  // Drop Spawner
  const spawnDrop = useCallback(() => {
    const width = containerWidth || 800;
    const cfg = DIFFICULTIES[difficulty];

    // Drop type weighting: 68% good, 14% bad, 10% large sludge (-5), 8% golden (+3)
    const rand = Math.random();
    let type: DropItem['type'] = 'good';
    if (rand > 0.92) {
      type = 'golden';
    } else if (rand > 0.82) {
      type = 'sludge';
    } else if (rand > 0.68) {
      type = 'bad';
    }

    // Size calculation: large sludge drops are 85px to 110px
    let size: number;
    if (type === 'sludge') {
      const initialSize = 85;
      const sizeMultiplier = Math.random() * 0.3 + 1.0;
      size = initialSize * sizeMultiplier;
    } else {
      const initialSize = 60;
      const sizeMultiplier = Math.random() * 0.8 + 0.5;
      size = initialSize * sizeMultiplier;
    }

    // Random X position inside game width (subtracting size so it stays fully inside container)
    const maxX = Math.max(10, width - size - 10);
    const xPosition = Math.floor(Math.random() * maxX);

    // Fall duration: drops fall faster based on selected difficulty
    let duration: number;
    if (type === 'sludge') {
      duration = +(cfg.sludgeDurationMin + Math.random() * (cfg.sludgeDurationMax - cfg.sludgeDurationMin)).toFixed(2);
    } else {
      duration = +(cfg.fallDurationMin + Math.random() * (cfg.fallDurationMax - cfg.fallDurationMin)).toFixed(2);
    }

    const newDrop: DropItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      x: xPosition,
      size,
      duration,
      type,
      createdAt: Date.now(),
    };

    setDrops((prev) => [...prev, newDrop]);
  }, [containerWidth, difficulty]);

  // Start / Restart Game Handler
  const startGame = useCallback(() => {
    const cfg = DIFFICULTIES[difficulty];
    clearGameIntervals();
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setGoodCaught(0);
    setBadClicked(0);
    setGoldenCaught(0);
    setSludgeClicked(0);
    setDrops([]);
    setSplashes([]);
    setIsGameOverModalOpen(false);
    setIsNewHighScore(false);
    setGameRunning(true);

    // Initial drop right away
    spawnDrop();

    // Spawning interval: based on difficulty spawn rate
    dropIntervalRef.current = setInterval(() => {
      spawnDrop();
    }, cfg.spawnRate);

    // Countdown timer interval
    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearGameIntervals, spawnDrop, endGame, difficulty]);

  // Handle clicking a drop
  const handleDropClick = useCallback(
    (drop: DropItem, e: React.MouseEvent) => {
      if (!gameRunning) return;

      // Container coordinates for splash ripple
      const containerRect = document.getElementById('game-container')?.getBoundingClientRect();
      const splashX = containerRect ? e.clientX - containerRect.left : drop.x + drop.size / 2;
      const splashY = containerRect ? e.clientY - containerRect.top : 200;

      let pointsChange = 1;
      let text = '+1';

      if (drop.type === 'good') {
        pointsChange = 1;
        text = '+1';
        setGoodCaught((c) => c + 1);
        soundManager.playGoodDrop();
      } else if (drop.type === 'bad') {
        pointsChange = -1;
        text = '-1';
        setBadClicked((c) => c + 1);
        soundManager.playBadDrop();
      } else if (drop.type === 'sludge') {
        pointsChange = -5;
        text = '-5';
        setSludgeClicked((c) => c + 1);
        soundManager.playBadDrop();
      } else if (drop.type === 'golden') {
        pointsChange = 3;
        text = '+3!';
        setGoldenCaught((c) => c + 1);
        soundManager.playGoldenDrop();
      }

      setScore((prev) => Math.max(0, prev + pointsChange));

      // Remove drop immediately
      setDrops((prev) => prev.filter((d) => d.id !== drop.id));

      // Add visual splash effect
      const splashId = `${Date.now()}-${Math.random()}`;
      setSplashes((prev) => [
        ...prev,
        {
          id: splashId,
          x: splashX,
          y: splashY,
          type: drop.type,
          pointsText: text,
        },
      ]);

      // Remove splash after 500ms
      setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s.id !== splashId));
      }, 500);
    },
    [gameRunning]
  );

  // Drop animation end (reached bottom without being clicked)
  const handleAnimationEnd = useCallback((id: string) => {
    setDrops((prev) => prev.filter((d) => d.id !== id));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearGameIntervals();
    };
  }, [clearGameIntervals]);

  // Reset Game Handler
  const resetGame = useCallback(() => {
    clearGameIntervals();
    setGameRunning(false);
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setGoodCaught(0);
    setBadClicked(0);
    setGoldenCaught(0);
    setSludgeClicked(0);
    setDrops([]);
    setSplashes([]);
    setIsGameOverModalOpen(false);
  }, [clearGameIntervals]);

  const cfg = DIFFICULTIES[difficulty];

  const handleSelectDifficulty = useCallback(
    (newDiff: Difficulty) => {
      setDifficulty(newDiff);
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`cw_water_drop_highscore_${newDiff}`);
        setHighScore(saved ? parseInt(saved, 10) || 0 : 0);
      }
      resetGame();
    },
    [resetGame]
  );

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col items-center justify-between p-3 sm:p-6 text-[#131313]">
      <div className="w-full flex flex-col items-center gap-4 sm:gap-5 max-w-[800px]">
        {/* Header with charity: water branding & controls */}
        <Header
          isMuted={isMuted}
          onToggleMute={() => setIsMuted(!isMuted)}
          onOpenHelp={() => setIsHelpOpen(true)}
        />

        {/* Score Panel: Score, Timer, Start/Reset Button, Difficulty Selector */}
        <ScorePanel
          score={score}
          timeLeft={timeLeft}
          highScore={highScore}
          target={cfg.target}
          difficulty={difficulty}
          onSelectDifficulty={handleSelectDifficulty}
          gameRunning={gameRunning}
          onStartGame={startGame}
          onRestartGame={resetGame}
        />

        {/* Main 800x600 Game Container */}
        <GameContainer
          drops={drops}
          splashes={splashes}
          gameRunning={gameRunning}
          onDropClick={handleDropClick}
          onAnimationEnd={handleAnimationEnd}
          onStartGame={startGame}
          onContainerResize={setContainerWidth}
        />

        {/* Charity: water Mission & Did You Know Facts Card */}
        <ImpactCard />
      </div>

      {/* Footer credits & charity water motto */}
      <footer className="mt-6 text-center text-xs text-slate-500 pb-2">
        <span>charity: water — 100% of public donations fund clean water projects</span>
      </footer>

      {/* Game Over Modal with required win/try-again message arrays */}
      <GameOverModal
        isOpen={isGameOverModalOpen}
        score={score}
        highScore={highScore}
        target={cfg.target}
        difficultyName={cfg.name}
        goodCaught={goodCaught}
        badClicked={badClicked}
        goldenCaught={goldenCaught}
        sludgeClicked={sludgeClicked}
        endMessage={endMessage}
        isNewHighScore={isNewHighScore}
        onPlayAgain={startGame}
        onClose={() => setIsGameOverModalOpen(false)}
      />

      {/* How to Play Modal */}
      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
