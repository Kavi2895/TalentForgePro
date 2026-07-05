import React from "react";
import { motion } from "motion/react";

interface SkillDistributionChartProps {
  skills: string[];
}

export default function SkillDistributionChart({ skills }: SkillDistributionChartProps) {
  // Let's dynamically map the skills to beautiful relative strengths
  const skillsList = skills && skills.length > 0 
    ? skills.slice(0, 7) 
    : ["TypeScript", "React", "Node.js", "Express", "System Architecture", "API Integration", "Tailwind CSS"];

  const mockStrengths = [95, 90, 85, 80, 75, 70, 65];

  const skillData = skillsList.map((skill, idx) => ({
    name: skill,
    percentage: mockStrengths[idx % mockStrengths.length],
  }));

  return (
    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-2xl group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/5 to-transparent pointer-events-none"></div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Skill Inventory</span>
          <h4 className="text-sm font-semibold text-white font-display mt-0.5">Top Skill Distribution</h4>
        </div>
        <span className="text-[10px] bg-[#06B6D4]/10 text-cyan-400 border border-[#06B6D4]/20 px-2 py-0.5 rounded font-mono font-bold">
          LIVE INDEX
        </span>
      </div>

      <div className="space-y-4">
        {skillData.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-zinc-300 font-semibold truncate max-w-[180px]">{item.name}</span>
              <span className="text-zinc-500">{item.percentage}%</span>
            </div>
            
            <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                transition={{ delay: idx * 0.1, duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#06B6D4] to-[#7C3AED] rounded-full"
              ></motion.div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export { SkillDistributionChart };
