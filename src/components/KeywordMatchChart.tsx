import React from "react";
import { motion } from "motion/react";

interface KeywordMatchChartProps {
  matchedCount: number;
  totalCount: number;
  overallMatchPct: number;
}

export default function KeywordMatchChart({ matchedCount, totalCount, overallMatchPct }: KeywordMatchChartProps) {
  // If we have 0 count, put some safe fallbacks so there are never blank boxes
  const safeMatched = matchedCount || 0;
  const safeTotal = totalCount || 1;
  const safePct = overallMatchPct || Math.round((safeMatched / safeTotal) * 100);

  return (
    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-2xl group">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#A855F7]/5 to-transparent pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Semantic Mapping</span>
          <h4 className="text-sm font-semibold text-white font-display mt-0.5">Keyword Match Rate</h4>
        </div>
        <span className="text-xs font-mono text-[#A855F7] font-bold">
          {safeMatched} / {safeTotal} Found
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="38"
              className="stroke-zinc-900"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Foreground progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="38"
              stroke="url(#purpleGradient)"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 38}
              initial={{ strokeDashoffset: 2 * Math.PI * 38 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 38 - (safePct / 100) * 2 * Math.PI * 38 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
            />
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-display font-extrabold text-white tracking-tight">{safePct}%</span>
            <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">Match</span>
          </div>
        </div>

        <div className="flex-1 space-y-3 font-mono text-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 block">DENSITY CRITERIA</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-white font-semibold">Matched: {safeMatched} core JD items</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-zinc-500 block">RECOMMENDED TARGET</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span className="text-white font-semibold">Add {Math.max(1, safeTotal - safeMatched)} missing keywords</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export { KeywordMatchChart };
