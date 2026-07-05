import React, { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Copy, Check, FileText, Send, User } from "lucide-react";

interface CoverLetterViewProps {
  candidateName: string;
  targetJobTitle: string;
  candidateSkills: string[];
  summary: string;
}

export default function CoverLetterView({ candidateName, targetJobTitle, candidateSkills, summary }: CoverLetterViewProps) {
  const [copied, setCopied] = useState(false);
  const [themeMode, setThemeMode] = useState<"standard" | "creative" | "bold">("standard");

  const skillsList = candidateSkills && candidateSkills.length > 0 ? candidateSkills.slice(0, 4).join(", ") : "TypeScript, React, & Node.js";
  const safeName = candidateName || "Alex Carter";
  const safeJob = targetJobTitle || "Senior Frontend Engineer";

  const getLetterBody = () => {
    if (themeMode === "creative") {
      return `Dear Hiring Team,

I have always believed that great engineering is not just about writing clean lines of code—it is about carving out elegant solutions that empower users and scale companies. When I saw the opening for ${safeJob}, I knew immediately that my skill set in ${skillsList} aligns perfectly with your engineering mission.

As summarized in my background, I specialize in crafting performant user experiences and architecting robust code paths. I approach problems with product-focused ownership, always seeking ways to bridge technical sophistication with business deliverables.

I would love to sync and discuss how we can build something incredible together.

Warm regards,
${safeName}`;
    }

    if (themeMode === "bold") {
      return `Dear Recruitment Director,

If you are seeking a highly driven, high-velocity engineer with proven experience in ${skillsList} to take ownership of your core technical stack, look no further. I am writing to express my strong candidacy for the ${safeJob} position.

In my professional career, I have consistently focused on engineering scalability, performance benchmarking, and design integrity. I do not just complete tickets; I build products that elevate technical benchmarks.

I look forward to discussing how I can deliver immediate technical and product impact to your organization.

Sincerely,
${safeName}`;
    }

    // Standard
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${safeJob} position. With a strong engineering background and hands-on expertise in ${skillsList}, I am confident in my ability to make an immediate impact on your technical team.

My career has been characterized by a deep focus on design precision, system scalability, and modular component architectures. I have a proven track record of optimizing application response times and delivering secure, high-traffic user experiences.

Thank you for your time and consideration. I welcome the opportunity to discuss my qualification further.

Best regards,

${safeName}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getLetterBody());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-gradient-to-r from-[#18181B] via-[#09090B] to-[#1E1B4B]/20 p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">AI Companion</span>
          <h3 className="text-lg font-bold text-white font-display">Targeted Cover Letter Builder</h3>
          <p className="text-zinc-400 text-xs">
            Generate and customize beautiful cover letters aligned with your parsed resume and your target job parameters.
          </p>
        </div>

        <div className="flex gap-2">
          {["standard", "creative", "bold"].map((mode) => (
            <button
              key={mode}
              onClick={() => setThemeMode(mode as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${
                themeMode === mode 
                  ? "bg-blue-500/10 text-blue-400 border-blue-500/30" 
                  : "bg-zinc-900 border-white/5 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase">ACTIVE DOCUMENT</span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Cover Letter"}
            </button>
          </div>

          <div className="bg-zinc-950 p-6 rounded-xl border border-white/5">
            <pre className="text-xs text-zinc-300 font-sans whitespace-pre-wrap leading-relaxed">
              {getLetterBody()}
            </pre>
          </div>
        </div>

        <div className="lg:col-span-4 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">Metadata Summary</h4>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] text-zinc-500 block">RECIPIENT SENDER</span>
                <span className="text-white font-bold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  {safeName}
                </span>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] text-zinc-500 block">TARGET ROLE</span>
                <span className="text-white font-bold flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  {safeJob}
                </span>
              </div>

              <div className="p-3 bg-zinc-950 rounded-xl border border-white/5 space-y-1">
                <span className="text-[9px] text-zinc-500 block">CORE ALIGNED SKILLS</span>
                <p className="text-zinc-400 leading-normal">{skillsList}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl space-y-2 mt-4">
            <h5 className="text-xs font-bold text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              SaaS Customization Tip
            </h5>
            <p className="text-[10px] text-zinc-400 leading-normal">
              Pair your Cover Letter with optimized STAR bullet modifications inside your CV for absolute maximum coherence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
