import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RefreshCw, AlertCircle, Award, X } from 'lucide-react';
import { WINNING_SCORE_THRESHOLD } from '../utils/constants';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  goodCaught: number;
  badClicked: number;
  goldenCaught: number;
  sludgeClicked?: number;
  endMessage: string;
  isNewHighScore: boolean;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  goodCaught,
  badClicked,
  goldenCaught,
  sludgeClicked = 0,
  endMessage,
  isNewHighScore,
  onPlayAgain,
  onClose,
}) => {
  const isWin = score >= WINNING_SCORE_THRESHOLD;

  useEffect(() => {
    if (isOpen && isWin) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFC907', '#2E9DF7', '#4FCB53', '#8BD1CB'],
        });
      } catch {
        // Confetti failsafe
      }
    }
  }, [isOpen, isWin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-slate-100 overflow-hidden transform transition-all">
        {/* Header Banner */}
        <div
          className={`p-6 text-white text-center relative ${
            isWin
              ? 'bg-gradient-to-r from-[#2E9DF7] to-[#159A48]'
              : 'bg-gradient-to-r from-slate-700 to-slate-800'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center border-2 border-white/40 shadow-inner">
            {isWin ? (
              <Trophy className="w-9 h-9 text-[#FFC907] drop-shadow-md" />
            ) : (
              <AlertCircle className="w-9 h-9 text-amber-300 drop-shadow-md" />
            )}
          </div>

          <h3 className="text-2xl font-black tracking-tight">
            {isWin ? 'Goal Achieved!' : 'Time Is Up!'}
          </h3>
          <p className="text-white/90 text-sm mt-1 font-medium">
            {isWin ? '20+ Drops Collected!' : 'Target: 20 Drops'}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Main Message from randomly chosen array item */}
          <div
            className={`p-4 rounded-xl border mb-5 text-center font-semibold text-sm sm:text-base leading-snug ${
              isWin
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-amber-50 text-amber-900 border-amber-200'
            }`}
          >
            "{endMessage}"
          </div>

          {/* Scores Overview */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Final Score
              </span>
              <div className="text-3xl font-black text-slate-900 mt-0.5">{score}</div>
              {isNewHighScore && (
                <span className="inline-block mt-1 text-[10px] font-bold bg-[#FFC907] text-amber-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  New High Score!
                </span>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                Best Record
              </span>
              <div className="text-3xl font-black text-amber-600 mt-0.5 flex items-center justify-center gap-1">
                <Award className="w-6 h-6 text-[#FFC907]" />
                <span>{highScore}</span>
              </div>
              <span className="inline-block mt-1 text-[11px] font-medium text-slate-500">
                Goal: 20 pts
              </span>
            </div>
          </div>

          {/* Detailed Statistics */}
          <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-2 mb-6 text-xs text-slate-700">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0099ff]" />
                Clean Drops Caught (+1):
              </span>
              <span className="font-bold text-slate-900">{goodCaught}</span>
            </div>
            {goldenCaught > 0 && (
              <div className="flex justify-between items-center text-amber-800">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFC907]" />
                  Golden Jerry Cans (+3):
                </span>
                <span className="font-bold text-amber-900">{goldenCaught}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-red-600">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff4444]" />
                Bad Drops Hit (-1):
              </span>
              <span className="font-bold">{badClicked}</span>
            </div>
            {sludgeClicked > 0 && (
              <div className="flex justify-between items-center text-[#50270a]">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6b3e1b]" />
                  Large Murky Drops Hit (-5):
                </span>
                <span className="font-bold">{sludgeClicked}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onPlayAgain}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#4CAF50] hover:bg-[#45a049] active:scale-95 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
