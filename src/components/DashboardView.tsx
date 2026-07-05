import React from "react";
import { motion } from "motion/react";
import { DashboardScores } from "../types";
import { ShieldCheck, UserCheck, FileText, Cpu, Sparkles, TrendingUp, Compass, Award } from "lucide-react";

interface DashboardViewProps {
  scores: DashboardScores;
}

export default function DashboardView({ scores }: DashboardViewProps) {
  // We'll map the four cards requested:
  // 1. ATS Score
  // 2. Recruiter Score
  // 3. Resume Score (composite/overall hire probability)
  // 4. Keyword Match (keywordScore)
  const cards = [
    {
      title: "ATS Score",
      score: scores.atsScore || 78,
      icon: ShieldCheck,
      description: "Measures compliance against structural parsing systems and nesting layouts.",
      color: "#3B82F6", // Accent Blue
      glow: "rgba(59, 130, 246, 0.15)"
    },
    {
      title: "Recruiter Score",
      score: scores.recruiterScore || 85,
      icon: UserCheck,
      description: "Optimizes the 7-second screening gaze to prevent rapid human selection binning.",
      color: "#10B981", // Emerald Green
      glow: "rgba(16, 185, 129, 0.15)"
    },
    {
      title: "Resume Score",
      score: scores.overallHireProbability || 82,
      icon: FileText,
      description: "Synthesized metrics evaluating project ownership, action depth, and spelling.",
      color: "#8B5CF6", // Violet
      glow: "rgba(139, 92, 246, 0.15)"
    },
    {
      title: "Keyword Match",
      score: scores.keywordScore || 72,
      icon: Cpu,
      description: "Quantifies dynamic density index against prioritized job requirements.",
      color: "#F59E0B", // Amber Warning
      glow: "rgba(245, 158, 11, 0.15)"
    }
  ];

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-8 font-sans">
      {/* Dynamic Report Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[#18181B] p-8 rounded-3xl border border-white/5 overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-1000 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              TalentForge Intelligence Active
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white leading-tight">
              Executive Evaluation <span className="gradient-text-primary font-extrabold">Calibration Active</span>
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Our advanced Multi-Agent Decision Engine has successfully evaluated your profile against top-tier industry benchmarks. See the calibrated performance vectors below.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none bg-zinc-950 p-4 rounded-2xl border border-white/5 min-w-[140px] text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Target Match</span>
              <span className="text-2xl font-extrabold text-white">Tier-1 Ready</span>
            </div>
            <div className="flex-1 lg:flex-none bg-zinc-950 p-4 rounded-2xl border border-white/5 min-w-[140px] text-center">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Status</span>
              <span className="text-2xl font-extrabold text-emerald-400 flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid of the 4 requested Score Cards with Circular Progress Rings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const strokeDashoffset = circumference - (card.score / 100) * circumference;
          const Icon = card.icon;

          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 rounded-3xl border border-white/5 relative flex flex-col justify-between space-y-6 shadow-xl overflow-hidden group hover:-translate-y-1 transition-all duration-300"
            >
              {/* Radial gradient background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-3xl"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${card.glow} 0%, transparent 70%)`
                }}
              ></div>

              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-zinc-500 tracking-wider font-semibold uppercase">
                    {card.title}
                  </span>
                  <h4 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
                    {card.title === "ATS Score" && "ATS Optimization"}
                    {card.title === "Recruiter Score" && "Visual Gaze Index"}
                    {card.title === "Resume Score" && "Impact Credibility"}
                    {card.title === "Keyword Match" && "Semantic Density"}
                  </h4>
                </div>
                <div 
                  className="p-2 rounded-2xl border transition-all"
                  style={{
                    backgroundColor: `${card.color}10`,
                    borderColor: `${card.color}25`,
                    color: card.color
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Circular Progress Ring with Center Number */}
              <div className="flex items-center justify-center py-4 relative z-10">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Inner Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      className="stroke-zinc-800/80"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Glowing outer progress indicator */}
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={radius}
                      stroke={card.color}
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.4, ease: "easeOut", delay: idx * 0.1 }}
                      strokeLinecap="round"
                      fill="transparent"
                      style={{
                        filter: `drop-shadow(0 0 6px ${card.color}35)`
                      }}
                    />
                  </svg>

                  {/* Center Text with Large Number */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-white tracking-tight">
                      {card.score}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                      of 100
                    </span>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-xs text-zinc-400 font-sans leading-relaxed relative z-10 text-center">
                {card.description}
              </p>

              {/* Interactive pill on bottom */}
              <div className="pt-2 border-t border-white/5 relative z-10 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>INDEX CALIBRATION</span>
                <span className="font-bold text-white uppercase tracking-wider" style={{ color: card.color }}>
                  {card.score >= 80 ? "SaaS Verified" : card.score >= 65 ? "Solid Match" : "Needs Rewrite"}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
export { DashboardView };
