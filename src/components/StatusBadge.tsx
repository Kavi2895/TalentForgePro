import React from "react";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  
  if (normalized.includes("excellent") || normalized.includes("🟢") || normalized.includes("yes")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Excellent
      </span>
    );
  } else if (normalized.includes("good") || normalized.includes("🔵")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
        Good
      </span>
    );
  } else if (normalized.includes("needs improvement") || normalized.includes("improve") || normalized.includes("🟡") || normalized.includes("warning")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        Needs Improvement
      </span>
    );
  } else if (normalized.includes("weak") || normalized.includes("🟠")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
        Weak
      </span>
    );
  } else if (normalized.includes("critical") || normalized.includes("no") || normalized.includes("🔴") || normalized.includes("found")) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
        Critical
      </span>
    );
  }
  
  // Fallback
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
      {status}
    </span>
  );
}
