import React, { useState, useEffect } from 'react';
import { DID_YOU_KNOW_FACTS } from '../utils/constants';
import { Heart, Sparkles, ExternalLink } from 'lucide-react';

export const ImpactCard: React.FC = () => {
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % DID_YOU_KNOW_FACTS.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[800px] bg-white rounded-xl shadow-xs border border-slate-200/80 p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
          <img
            src="/img/water-can-transparent.png"
            alt="Jerry Can"
            className="w-8 h-8 object-contain"
          />
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC907]" />
            <span>Why Water Matters</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium transition-opacity duration-300">
            {DID_YOU_KNOW_FACTS[factIndex]}
          </p>
          <div className="mt-2 flex justify-center sm:justify-start">
            <a
              href="https://www.charitywater.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E9DF7] hover:text-[#0284c7] hover:underline transition-colors"
            >
              <span>Visit charitywater.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>100% Model</span>
        </div>
      </div>
    </div>
  );
};
