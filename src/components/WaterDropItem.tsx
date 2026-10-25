import React from 'react';
import { DropItem } from '../types';
import { AlertTriangle, Sparkles, Skull } from 'lucide-react';

interface WaterDropItemProps {
  drop: DropItem;
  onClick: (drop: DropItem, e: React.MouseEvent) => void;
  onAnimationEnd: (id: string, type: DropItem['type']) => void;
}

export const WaterDropItem: React.FC<WaterDropItemProps> = ({
  drop,
  onClick,
  onAnimationEnd,
}) => {
  const isBad = drop.type === 'bad';
  const isGolden = drop.type === 'golden';
  const isSludge = drop.type === 'sludge';

  // Base background & droplet styling
  let bgClass = 'bg-[#0099ff] hover:bg-[#2E9DF7] shadow-lg shadow-blue-400/40';
  let reflectionClass = 'drop-reflection';

  if (isBad) {
    bgClass = 'bg-[#ff4444] hover:bg-[#F5402C] shadow-lg shadow-red-500/40 bad-drop';
    reflectionClass = 'murky-reflection';
  } else if (isSludge) {
    bgClass = 'bg-[#6b3e1b] hover:bg-[#50270a] shadow-xl shadow-stone-900/70 border-2 border-[#3e1a05]';
    reflectionClass = 'murky-reflection';
  } else if (isGolden) {
    bgClass = 'bg-[#FFC907] hover:bg-[#e0b005] shadow-lg shadow-amber-400/60 ring-2 ring-amber-300';
    reflectionClass = 'gold-reflection';
  }

  return (
    <div
      className="absolute cursor-pointer select-none group"
      style={{
        left: `${drop.x}px`,
        width: `${drop.size}px`,
        height: `${drop.size}px`,
        animation: `dropFall ${drop.duration}s linear forwards`,
        zIndex: isGolden ? 20 : isBad ? 15 : 10,
      }}
      onClick={(e) => onClick(drop, e)}
      onAnimationEnd={() => onAnimationEnd(drop.id, drop.type)}
    >
      {/* Hitbox padding for mobile & desktop easy tapping */}
      <div className="w-full h-full p-2 -m-2 flex items-center justify-center">
        <div
          className={`w-full h-full rounded-full transition-transform duration-100 ease-out group-hover:scale-110 active:scale-95 relative flex items-center justify-center overflow-hidden ${bgClass}`}
        >
          {/* Glossy water drop surface light reflection */}
          <div className={`absolute inset-0 rounded-full ${reflectionClass}`} />

          {/* Icon overlay for bad, sludge & golden drops */}
          {isBad && (
            <AlertTriangle
              className="text-white drop-shadow-sm animate-pulse z-10"
              style={{ width: `${Math.max(14, drop.size * 0.45)}px`, height: `${Math.max(14, drop.size * 0.45)}px` }}
            />
          )}

          {isSludge && (
            <div className="z-10 flex flex-col items-center justify-center text-red-200">
              <Skull
                className="text-red-200 drop-shadow-md"
                style={{ width: `${Math.max(18, drop.size * 0.35)}px`, height: `${Math.max(18, drop.size * 0.35)}px` }}
              />
              <span className="font-black text-xs sm:text-sm text-red-100 drop-shadow-md -mt-0.5">
                -5
              </span>
            </div>
          )}

          {isGolden && (
            <Sparkles
              className="text-amber-900 drop-shadow-xs z-10 animate-spin"
              style={{
                width: `${Math.max(14, drop.size * 0.45)}px`,
                height: `${Math.max(14, drop.size * 0.45)}px`,
                animationDuration: '6s',
              }}
            />
          )}

          {/* Subtle water teardrop top tip */}
          <div
            className="absolute -top-1 w-2 h-2 rounded-full opacity-60"
            style={{
              backgroundColor: isBad ? '#ff7777' : isGolden ? '#ffeaa7' : '#8BD1CB',
            }}
          />
        </div>
      </div>
    </div>
  );
};
