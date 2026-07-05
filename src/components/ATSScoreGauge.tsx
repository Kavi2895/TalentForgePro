import React from "react";
import { motion } from "motion/react";

interface ATSScoreGaugeProps {
  score: number;
}

export default function ATSScoreGauge({ score }: ATSScoreGaugeProps) {
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "#22C55E"; // Success
    if (s >= 65) return "#3B82F6"; // Primary (Blue Accent)
    if (s >= 50) return "#F59E0B"; // Warning
    return "#EF4444"; // Danger
  };

  const scoreColor = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-[#18181B] rounded-2xl border border-white/5 relative overflow-hidden group shadow-2xl">
      {/* Background glow */}
      <div 
        className="absolute inset-0 opacity-10 blur-3xl transition-all duration-500 group-hover:opacity-20"
        style={{
          background: `radial-gradient(circle, ${scoreColor} 0%, transparent 70%)`
        }}
      ></div>

      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
          {/* Track Circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="stroke-zinc-800/60"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          
          {/* Progress Circle with dynamic gradient & animation */}
          <motion.circle
            cx="80"
            cy="80"
            r={radius}
            stroke={scoreColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: `drop-shadow(0 0 8px ${scoreColor}40)`
            }}
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-4xl font-display font-extrabold text-white tracking-tight"
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold mt-1">
            ATS Score
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <span 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
          style={{
            color: scoreColor,
            borderColor: `${scoreColor}30`,
            backgroundColor: `${scoreColor}08`
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: scoreColor }}></span>
          {score >= 80 ? "SaaS Verified: Excellent" : score >= 65 ? "Solid: Pass Potential" : "Critical: Needs Redesign"}
        </span>
      </div>
    </div>
  );
}
export { ATSScoreGauge };
