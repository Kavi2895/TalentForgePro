import React from "react";
import { motion } from "motion/react";

interface RadarChartProps {
  scores: {
    ats: number;
    recruiter: number;
    hiringManager: number;
    experience: number;
    projects: number;
  };
}

export default function RadarChart({ scores }: RadarChartProps) {
  // 5 vertices for 5 dimensions
  const dimensions = [
    { name: "ATS Match", score: scores.ats, key: "ats" },
    { name: "Recruiter Appeal", score: scores.recruiter, key: "recruiter" },
    { name: "Hiring Mgr Spec", score: scores.hiringManager, key: "hiringManager" },
    { name: "Exp Progression", score: scores.experience, key: "experience" },
    { name: "Project Depth", score: scores.projects, key: "projects" },
  ];

  const size = 300;
  const center = size / 2;
  const rMax = 100; // max radius

  // Angles for pentagon (72 degrees each)
  const angleStep = (2 * Math.PI) / 5;

  // Calculate coordinates for vertices given a radius
  const getCoordinates = (index: number, radius: number) => {
    const angle = index * angleStep - Math.PI / 2; // Offset by -90 deg to point up
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return { x, y };
  };

  // Concentric background grid lines (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Coordinates for the data shape
  const points = dimensions.map((d, i) => {
    const r = (d.score / 100) * rMax;
    return getCoordinates(i, r);
  });

  const pointsString = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl group">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/5 to-transparent pointer-events-none"></div>
      
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider font-semibold">Engine Analysis</span>
        <span className="text-xs font-semibold text-purple-400">Radar Mapping</span>
      </div>

      <div className="relative w-[320px] h-[300px]">
        <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
          {/* Concentric grid lines */}
          {gridLevels.map((level, gridIdx) => {
            const levelPoints = Array.from({ length: 5 }).map((_, i) => getCoordinates(i, rMax * level));
            const pathString = levelPoints.map((p) => `${p.x},${p.y}`).join(" ");
            return (
              <polygon
                key={gridIdx}
                points={pathString}
                className="fill-none stroke-zinc-800/60"
                strokeWidth="1"
              />
            );
          })}

          {/* Grid web axis spokes */}
          {Array.from({ length: 5 }).map((_, i) => {
            const outer = getCoordinates(i, rMax);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={outer.x}
                y2={outer.y}
                className="stroke-zinc-800/40"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Glowing Target Data Polygon */}
          <motion.polygon
            points={pointsString}
            className="fill-[#7C3AED]/20 stroke-[#7C3AED]"
            strokeWidth="2.5"
            strokeLinejoin="round"
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          {/* Data Vertex Dots */}
          {points.map((p, i) => (
            <motion.circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4.5"
              className="fill-zinc-950 stroke-purple-400"
              strokeWidth="2.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            />
          ))}

          {/* Labels */}
          {dimensions.map((d, i) => {
            const outer = getCoordinates(i, rMax + 18);
            let textAnchor = "middle";
            if (outer.x < center - 10) textAnchor = "end";
            if (outer.x > center + 10) textAnchor = "start";

            return (
              <text
                key={i}
                x={outer.x}
                y={outer.y + 4}
                textAnchor={textAnchor}
                className="fill-zinc-400 font-mono text-[9px] uppercase font-semibold tracking-wider"
              >
                {d.name}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="w-full grid grid-cols-5 gap-1 mt-2 text-center text-[10px] font-mono divide-x divide-white/5">
        {dimensions.map((d, i) => (
          <div key={i} className="first:pl-0 pl-1">
            <div className="text-zinc-500 leading-none mb-1 truncate">{d.name.split(" ")[0]}</div>
            <div className="text-white font-bold">{d.score}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export { RadarChart };
