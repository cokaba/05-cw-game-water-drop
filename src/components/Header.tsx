import React from 'react';
import { Volume2, VolumeX, Droplets, Info } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isMuted, onToggleMute, onOpenHelp }) => {
  return (
    <header className="w-full max-w-[800px] flex flex-col items-center">
      {/* Top Branding Row */}
      <div className="w-full flex items-center justify-between pb-2 px-1">
        <div className="flex items-center gap-3">
          <img
            src="/img/cw_logo-horizontal.png"
            alt="charity: water logo"
            className="h-7 sm:h-9 object-contain"
            onError={(e) => {
              // Fallback to vertical cw_logo if needed
              (e.target as HTMLImageElement).src = '/img/cw_logo.png';
            }}
          />
          <span className="hidden sm:inline-block text-xs uppercase tracking-wider font-semibold text-slate-500 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
            Water is Life
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHelp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors cursor-pointer"
            title="How to play"
            aria-label="How to play instructions"
          >
            <Info className="w-4 h-4 text-[#2E9DF7]" />
            <span className="hidden sm:inline">How to Play</span>
          </button>

          <button
            onClick={() => {
              soundManager.isMuted = !isMuted;
              onToggleMute();
            }}
            className="p-2 rounded-full text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-colors cursor-pointer"
            title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            aria-label={isMuted ? 'Unmute game audio' : 'Mute game audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#2E9DF7]" />
            )}
          </button>
        </div>
      </div>

      {/* Main Title and Tagline matching original styles.css .game-title and .game-tagline */}
      <div className="text-center mt-2 relative">
        <div className="inline-flex items-center justify-center gap-2">
          <img
            src="/img/water-can-transparent.png"
            alt="Water Can"
            className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm animate-float"
          />
          <h1 className="text-4xl sm:text-5xl font-black text-[#131313] tracking-tight">
            Water Drop
          </h1>
          <Droplets className="w-7 h-7 text-[#2E9DF7] hidden sm:block" />
        </div>
        <p className="text-[#666] text-base sm:text-lg font-medium mt-1">
          Catch the good drops, avoid the bad ones!
        </p>
      </div>
    </header>
  );
};
