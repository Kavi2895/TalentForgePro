import React from "react";
import { motion } from "motion/react";
import { Milestone, Briefcase, Award, GraduationCap, ArrowUpRight, Cpu } from "lucide-react";

interface ResumeMappingViewProps {
  experience: Array<{ company: string; role: string; period: string; bullets: string[] }>;
  education: Array<{ school: string; degree: string; field: string; year: string }>;
  projects: Array<{ title: string; technologies: string; description: string; bullets: string[] }>;
}

export default function ResumeMappingView({ experience, education, projects }: ResumeMappingViewProps) {
  const safeExp = experience && experience.length > 0 ? experience : [
    { company: "TechCorp Inc.", role: "Software Engineer", period: "2024 - Present", bullets: ["Worked on core dashboards."] },
    { company: "WebSolutions LLC", role: "Web Developer", period: "2022 - 2024", bullets: ["Created websites."] }
  ];

  const safeEdu = education && education.length > 0 ? education : [
    { school: "State University", degree: "Bachelor of Science", field: "Computer Science", year: "2022" }
  ];

  const safeProj = projects && projects.length > 0 ? projects : [
    { title: "E-Commerce App", technologies: "React, Node.js", description: "Payment processing app", bullets: [] }
  ];

  return (
    <div className="space-y-8 font-sans">
      <div className="bg-gradient-to-r from-[#18181B] via-[#09090B] to-[#1E1B4B]/20 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">Trajectory Index</span>
          <h3 className="text-lg font-bold text-white font-display">Resume Trajectory & Career Mapping</h3>
          <p className="text-zinc-400 text-xs">
            An interactive visual blueprint of your career milestones, projects, and educational credentials.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Timeline: Experience Trajectory */}
        <div className="lg:col-span-8 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
          <h4 className="text-sm font-semibold font-display text-white flex items-center gap-2">
            <Milestone className="w-4 h-4 text-blue-500" />
            Interactive Career Progression Timeline
          </h4>

          <div className="relative border-l border-white/10 pl-6 ml-3 space-y-8">
            {safeExp.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative space-y-2 group"
              >
                {/* Timeline node */}
                <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-zinc-950 border-2 border-blue-500 flex items-center justify-center group-hover:bg-blue-500 transition-all duration-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-all"></span>
                </span>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h5 className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                      {exp.role}
                      <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                    </h5>
                    <span className="text-xs font-mono text-zinc-400 font-semibold">{exp.company}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-zinc-950 px-2.5 py-1 rounded border border-white/5 text-zinc-400">
                    {exp.period}
                  </span>
                </div>

                <ul className="text-xs text-zinc-400 list-disc pl-4 space-y-1">
                  {exp.bullets.slice(0, 3).map((bullet, i) => (
                    <li key={i} className="leading-relaxed">{bullet}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Panel: Education & Key Milestones */}
        <div className="lg:col-span-4 space-y-8">
          {/* Education Block */}
          <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              Academic Milestones
            </h4>

            <div className="space-y-4">
              {safeEdu.map((edu, idx) => (
                <div key={idx} className="p-3 bg-zinc-950 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-start text-xs">
                    <span className="text-white font-bold">{edu.degree}</span>
                    <span className="text-[9px] font-mono bg-zinc-900 px-2 py-0.5 rounded text-zinc-400">{edu.year}</span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-400">{edu.school} — {edu.field}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Project Milestones */}
          <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-semibold font-display text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-500" />
              Project Integration Points
            </h4>

            <div className="space-y-4">
              {safeProj.map((proj, idx) => (
                <div key={idx} className="p-3 bg-zinc-950 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 block font-semibold">{proj.technologies}</span>
                  <h5 className="text-xs font-bold text-white">{proj.title}</h5>
                  <p className="text-[11px] text-zinc-400 leading-normal">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
