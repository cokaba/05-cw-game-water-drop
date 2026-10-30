import React from 'react';
import { Play, RotateCcw, Trophy, Clock, Target, Zap } from 'lucide-react';
import { Difficulty } from '../types';

interface ScorePanelProps {
  score: number;
  timeLeft: number;
  highScore: number;
  target: number;
  difficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;
  gameRunning: boolean;
  onStartGame: () => void;
  onRestartGame: () => void;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  score,
  timeLeft,
  highScore,
  target,
  difficulty,
  onSelectDifficulty,
  gameRunning,
  onStartGame,
  onRestartGame,
}) => {
  // Low time warning style
  const isTimeLow = timeLeft <= 5 && gameRunning;

  return (
    <div className="w-full max-w-[800px] flex flex-col gap-2">
      {/* Difficulty Selection Bar */}
      <div className="w-full bg-white rounded-xl shadow-xs border border-slate-200 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="font-bold text-slate-700 uppercase tracking-wider">Difficulty:</span>
          <div className="inline-flex bg-slate-100 p-1 rounded-lg gap-1">
            <button
              onClick={() => onSelectDifficulty('easy')}
              className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                difficulty === 'easy'
                  ? 'bg-[#159A48] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => onSelectDifficulty('medium')}
              className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                difficulty === 'medium'
                  ? 'bg-[#2E9DF7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Medium
            </button>
            <button
              onClick={() => onSelectDifficulty('hard')}
              className={`px-3 py-1 font-bold rounded-md transition-all cursor-pointer ${
                difficulty === 'hard'
                  ? 'bg-[#F5402C] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="text-slate-500 font-semibold text-[11px] bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-md">
          {difficulty === 'easy' && 'Slow Drops • Target: 15 pts'}
          {difficulty === 'medium' && 'Normal Speed • Target: 25 pts'}
          {difficulty === 'hard' && '⚡ Rapid Drops • Target: 50 pts'}
        </div>
      </div>

      {/* Main Score Panel */}
      <div className="w-full bg-white rounded-xl shadow-md border border-slate-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        {/* Score */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#2E9DF7] flex items-center justify-center font-bold">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Score</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
              {score}
            </div>
          </div>
        </div>

        {/* Target Goal & High Score pill */}
        <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#4FCB53]" />
            <span>Goal: <strong>{target} pts</strong></span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-1.5 text-amber-600">
            <Trophy className="w-3.5 h-3.5 text-[#FFC907]" />
            <span>Best: <strong>{highScore}</strong></span>
          </div>
        </div>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold transition-colors ${
            isTimeLow
              ? 'bg-red-100 text-red-600 animate-pulse'
              : 'bg-emerald-50 text-[#159A48]'
          }`}
        >
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Time</div>
          <div
            className={`text-2xl sm:text-3xl font-extrabold leading-none transition-colors ${
              isTimeLow ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* Action Button: Start Game / Restart */}
      <div className="w-full sm:w-auto flex justify-end">
        {!gameRunning ? (
          <button
            id="start-btn"
            onClick={onStartGame}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#4CAF50] hover:bg-[#45a049] active:scale-95 text-white font-bold rounded-lg shadow-sm transition-all text-base cursor-pointer hover:shadow-md"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Game</span>
          </button>
        ) : (
          <button
            id="start-btn"
            onClick={onRestartGame}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F5402C] hover:bg-red-600 active:scale-95 text-white font-bold rounded-lg shadow-sm transition-all text-base cursor-pointer hover:shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  </div>
  );
};
