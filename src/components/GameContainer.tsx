import React, { useRef, useEffect } from 'react';
import { DropItem, SplashEffect } from '../types';
import { WaterDropItem } from './WaterDropItem';
import { Play, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

interface GameContainerProps {
  drops: DropItem[];
  splashes: SplashEffect[];
  gameRunning: boolean;
  onDropClick: (drop: DropItem, e: React.MouseEvent) => void;
  onAnimationEnd: (id: string, type: DropItem['type']) => void;
  onStartGame: () => void;
  onContainerResize: (width: number) => void;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  drops,
  splashes,
  gameRunning,
  onDropClick,
  onAnimationEnd,
  onStartGame,
  onContainerResize,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        onContainerResize(containerRef.current.offsetWidth);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [onContainerResize]);

  return (
    <div
      id="game-container"
      ref={containerRef}
      className="relative w-full max-w-[800px] h-[550px] sm:h-[600px] bg-[#e6f7ff] border-2 border-[#333] rounded-xl overflow-hidden shadow-inner select-none transition-all"
    >
      {/* Background Decor: clean subtle clouds and water basin */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-4 left-6 w-24 h-8 bg-white/70 rounded-full blur-xs" />
        <div className="absolute top-10 right-10 w-36 h-10 bg-white/60 rounded-full blur-xs" />
        <div className="absolute top-24 left-1/3 w-28 h-7 bg-white/50 rounded-full blur-xs" />
      </div>

      {/* Clean water reservoir at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#2E9DF7]/40 via-[#8BD1CB]/30 to-transparent pointer-events-none border-t border-blue-200/50 flex items-end justify-center pb-1">
        <span className="text-[11px] font-semibold text-blue-800/60 uppercase tracking-widest">
          Clean Water Reservoir
        </span>
      </div>

      {/* Active Falling Drops */}
      {gameRunning &&
        drops.map((drop) => (
          <WaterDropItem
            key={drop.id}
            drop={drop}
            onClick={onDropClick}
            onAnimationEnd={onAnimationEnd}
          />
        ))}

      {/* Splash & Points Popups */}
      {splashes.map((splash) => (
        <div
          key={splash.id}
          className="absolute pointer-events-none z-30"
          style={{ left: `${splash.x}px`, top: `${splash.y}px` }}
        >
          {/* Ripple rings */}
          <div
            className={`w-12 h-12 rounded-full border-2 animate-splash absolute -top-6 -left-6 ${
              splash.type === 'good'
                ? 'border-[#4FCB53] bg-[#4FCB53]/20'
                : splash.type === 'bad'
                ? 'border-[#F5402C] bg-[#F5402C]/20'
                : splash.type === 'sludge'
                ? 'border-[#6b3e1b] bg-[#6b3e1b]/35 border-4'
                : 'border-[#FFC907] bg-[#FFC907]/30'
            }`}
          />

          {/* Floating score text */}
          <div
            className={`text-sm sm:text-base font-black px-1.5 py-0.5 rounded drop-shadow -translate-x-1/2 -translate-y-8 animate-bounce ${
              splash.type === 'good'
                ? 'text-[#159A48]'
                : splash.type === 'bad'
                ? 'text-red-600'
                : splash.type === 'sludge'
                ? 'text-[#50270a] text-lg font-black'
                : 'text-amber-600 font-extrabold'
            }`}
          >
            {splash.pointsText}
          </div>
        </div>
      ))}

      {/* Welcome / Idle Overlay when game is not running and modal isn't open */}
      {!gameRunning && (
        <div className="absolute inset-0 bg-[#e6f7ff]/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-25">
          <div className="w-20 h-20 bg-white rounded-full p-3 shadow-md border-2 border-amber-300 mb-4 flex items-center justify-center animate-bounce">
            <img
              src="/img/water-can-transparent.png"
              alt="charity: water jerry can"
              className="w-14 h-14 object-contain"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#131313] mb-2">
            Ready to Catch Clean Water?
          </h2>

          <p className="max-w-md text-slate-600 text-sm sm:text-base mb-6 leading-relaxed">
            Click as many clean blue drops as you can within <strong>30 seconds</strong>. Reach{' '}
            <strong>20 points</strong> to bring clean water to communities in need!
          </p>

          {/* Legend guide */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 w-full max-w-xl">
            <div className="bg-white/80 p-2 rounded-lg border border-blue-200 flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-full bg-[#0099ff] flex items-center justify-center text-white shrink-0 shadow-xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Clean Water</div>
                <div className="text-[11px] font-semibold text-[#0099ff]">+1 Point</div>
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-lg border border-red-200 flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-full bg-[#ff4444] flex items-center justify-center text-white shrink-0 shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Bad Drop</div>
                <div className="text-[11px] font-semibold text-red-600">-1 Point</div>
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-lg border border-amber-900/30 flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-full bg-[#6b3e1b] flex items-center justify-center text-red-200 shrink-0 shadow-xs">
                <span className="text-xs font-black">-5</span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Large Murky</div>
                <div className="text-[11px] font-semibold text-[#6b3e1b]">-5 Points</div>
              </div>
            </div>

            <div className="bg-white/80 p-2 rounded-lg border border-amber-200 flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded-full bg-[#FFC907] flex items-center justify-center text-amber-900 shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800">Golden Can</div>
                <div className="text-[11px] font-semibold text-amber-600">+3 Points</div>
              </div>
            </div>
          </div>

          <button
            onClick={onStartGame}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#4CAF50] hover:bg-[#45a049] active:scale-95 text-white font-bold text-lg rounded-xl shadow-lg transition-transform cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Play Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
