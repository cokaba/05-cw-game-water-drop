import React from 'react';
import { X, CheckCircle2, AlertTriangle, Sparkles, Target } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <img
              src="/img/water-can-transparent.png"
              alt="Water Can"
              className="w-5 h-5 object-contain"
            />
            <h3 className="text-base font-bold text-slate-900">How to Play</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4 text-sm text-slate-700">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0099ff] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Catch the Clean Water Drops</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Click or tap falling blue drops before they touch the ground to earn <strong>+1 point</strong> each.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Avoid Contaminated Drops</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Red drops carry contaminants! Clicking one penalizes you <strong>-1 point</strong>. Let them fall!
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-950/20 text-[#6b3e1b] flex items-center justify-center shrink-0 mt-0.5 font-black text-sm">
              -5
            </div>
            <div>
              <div className="font-bold text-slate-900">Beware Large Murky Sludge</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Large brown murky drops severely pollute the water! Clicking one penalizes you a massive <strong>-5 points</strong>!
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Catch Rare Golden Drops</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Golden drops award a hefty <strong>+3 bonus points</strong>! Don't let them slip away!
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Reach 20 Points in 30s</div>
              <p className="text-xs text-slate-600 mt-0.5">
                Score <strong>20 or more</strong> to unlock the winning celebration and bring clean water to communities!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-[#2E9DF7] hover:bg-[#2587d4] text-white font-bold rounded-xl transition-colors cursor-pointer text-sm"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
