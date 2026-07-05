import React from "react";

interface ProgressBarProps {
  percentage: number;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function ProgressBar({ percentage, showText = true, size = "md" }: ProgressBarProps) {
  // Bound percentage between 0 and 100
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  
  // Calculate block representation
  const totalBlocks = 10;
  const activeBlocksCount = Math.round(clamped / 10);
  const inactiveBlocksCount = totalBlocks - activeBlocksCount;
  
  const activeString = "█".repeat(activeBlocksCount);
  const inactiveString = "░".repeat(inactiveBlocksCount);
  const blockTextBar = `${activeString}${inactiveString} ${clamped}%`;

  const getBarColorClass = () => {
    if (clamped >= 80) return "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-emerald-500/10";
    if (clamped >= 65) return "bg-gradient-to-r from-purple-600 to-violet-500 shadow-purple-500/10";
    if (clamped >= 50) return "bg-gradient-to-r from-amber-500 to-orange-400 shadow-amber-500/10";
    return "bg-gradient-to-r from-rose-500 to-red-400 shadow-rose-500/10";
  };

  const getBadgeColorClass = () => {
    if (clamped >= 80) return "text-emerald-400 bg-emerald-500/5 border-emerald-500/10";
    if (clamped >= 65) return "text-violet-400 bg-violet-500/5 border-violet-500/10";
    if (clamped >= 50) return "text-amber-400 bg-amber-500/5 border-amber-500/10";
    return "text-rose-400 bg-rose-500/5 border-rose-500/10";
  };

  const getStatusText = () => {
    if (clamped >= 80) return "Excellent";
    if (clamped >= 65) return "Good";
    if (clamped >= 50) return "Needs Improvement";
    return "Critical";
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center text-xs">
        {showText && (
          <span className="font-mono text-zinc-400 tracking-wider">
            {blockTextBar}
          </span>
        )}
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getBadgeColorClass()}`}>
          {getStatusText()}
        </span>
      </div>
      
      {/* Visual CSS Progress Bar */}
      <div className={`w-full bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 ${size === "sm" ? "h-1.5" : size === "md" ? "h-2.5" : "h-3.5"}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out shadow-lg ${getBarColorClass()}`}
          style={{ width: `${clamped}%` }}
        ></div>
      </div>
    </div>
  );
}
export { ProgressBar };
