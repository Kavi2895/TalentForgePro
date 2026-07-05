import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Upload, Briefcase, Eye, Target, Search, BookOpen, 
  Settings, Award, RefreshCw, Copy, Check, Info, Users, Cpu,
  Sparkles, Terminal, Calendar, HelpCircle, ChevronRight, DollarSign,
  MapPin, CheckCircle, AlertTriangle, Play, HelpCircle as HelpIcon, Layers, Code, Star, CheckSquare,
  ChevronDown, ArrowRight, Share2, Download, Trash2, Shield
} from "lucide-react";
import { AnalysisReport } from "./types";
import DashboardView from "./components/DashboardView";
import StatusBadge from "./components/StatusBadge";
import ProgressBar from "./components/ProgressBar";

// Import custom premium charts and views
import ATSScoreGauge from "./components/ATSScoreGauge";
import RadarChart from "./components/RadarChart";
import SkillDistributionChart from "./components/SkillDistributionChart";
import KeywordMatchChart from "./components/KeywordMatchChart";
import KeywordGapView from "./components/KeywordGapView";
import CoverLetterView from "./components/CoverLetterView";
import ResumeMappingView from "./components/ResumeMappingView";

const DEMO_RESUME_TEXT = `Alex Carter
alex.carter@email.com | (555) 019-2834 | linkedin.com/in/alexcarter
github.com/alexcarterdev | alexcarter.dev
San Francisco, CA

Professional Summary:
Web developer with experience building applications. Skilled in React, JavaScript, Node, and CSS. Looking for a new role.

Skills:
React, Vue, Node.js, JavaScript, Express, HTML, CSS, SQL, Git, AWS, Webpack

Experience:
Software Engineer | TechCorp Inc. | 2024 - Present
- Worked on the front-end dashboard of our core application using React and Tailwind.
- Fixed bugs and helped improve page load times.
- Collaborated with product designers to implement new features.
- Attended daily stand-up meetings.

Web Developer | WebSolutions LLC | 2022 - 2024
- Created websites for various clients using Vue.js and Express.
- Managed databases with PostgreSQL and made sure things were fast.
- Wrote clean code and helped junior developers when they had questions.

Projects:
E-Commerce App
- Built a web app with React and Node.
- Used Stripe for handling payments.
- Added a cart feature.

Recipe Finder
- Made a simple React application that calls a third-party recipes API.
- Allowed users to search by ingredients.`;

const DEMO_JOB_TITLE = "Senior Frontend Engineer";
const DEMO_JOB_DESC = `We are seeking a Senior Frontend Engineer to lead the architecture of our high-traffic dashboard application.
Key Responsibilities:
- Optimize React application performance, reducing bundle sizes and improving web vitals (LCP, FID).
- Design reusable, accessible component libraries utilizing Tailwind CSS and TypeScript.
- Architect real-time data pipelines using WebSockets and state managers like Redux or Zustand.
- Mentor junior engineers and champion strong testing practices (Jest, React Testing Library).

Required Qualifications:
- 5+ years of experience building modern client-side applications.
- Strong proficiency in JavaScript/TypeScript, React, and browser rendering engines.
- Proven experience with state management, frontend build tools (Vite, Webpack), and REST/GraphQL APIs.
- Deep understanding of Web Accessibility (WCAG 2.1 AA) and performance benchmarking.`;

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; base64: string; mimeType: string } | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "parsed" | "ats" | "keywords" | "psychology" | "bullets" | "interview" | "coverletter" | "mapping" | "history" | "saved" | "settings"
  >("dashboard");

  // History & saved state
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [savedResumes, setSavedResumes] = useState<any[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history & saved from localStorage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("talentforge_history");
      if (storedHistory) {
        setHistoryList(JSON.parse(storedHistory));
      }
      const storedSaved = localStorage.getItem("talentforge_saved");
      if (storedSaved) {
        setSavedResumes(JSON.parse(storedSaved));
      }
    } catch (e) {
      console.error("Failed to read local storage", e);
    }
  }, []);

  const pipelineSteps = [
    { icon: Sparkles, text: "Initializing Executive Recruiter Core Engine..." },
    { icon: FileText, text: "Parsing Resume Headers and Structural Metadata..." },
    { icon: Cpu, text: "Running Multi-Agent Scoring Calibration..." },
    { icon: Eye, text: "Calibrating 7-Second Recruiter Visual Gaze..." },
    { icon: Search, text: "Performing Advanced Keyword Gap Comparison..." },
    { icon: Users, text: "Mining Psychological Alignment Indicators..." },
    { icon: Code, text: "Auditing Engineering Depth & Technical Credibility..." },
    { icon: RefreshCw, text: "Scanning for Quantified Performance Metrics..." },
    { icon: CheckSquare, text: "Rebuilding Bullet Points using STAR Framework..." },
    { icon: Target, text: "Constructing Competitive Percentile Matrix..." },
    { icon: Terminal, text: "Generating Curated ATS Keywords & Interview Deck..." },
    { icon: CheckCircle, text: "Finalizing Markdown Resume Synthesizer..." }
  ];

  const handleDemoLoad = () => {
    setResumeText(DEMO_RESUME_TEXT);
    setJobTitle(DEMO_JOB_TITLE);
    setJobDescription(DEMO_JOB_DESC);
    setUploadedFile(null);
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setUploadedFile({
        name: file.name,
        base64: base64String,
        mimeType: file.type
      });
      if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
        const textReader = new FileReader();
        textReader.onload = () => {
          setResumeText(textReader.result as string);
        };
        textReader.readAsText(file);
      } else {
        setResumeText(`[Attached document: ${file.name}]`);
      }
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    if (!resumeText && !uploadedFile) {
      setError("Please provide a resume by pasting text or uploading a file.");
      return;
    }
    if (!jobTitle) {
      setError("Please input a target Job Title to calibrate the ATS and Recruiter scoring.");
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);
    setLoadingStep(0);

    // Step-by-step loading animation ticker
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < pipelineSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          fileBase64: uploadedFile?.base64,
          fileMimeType: uploadedFile?.mimeType,
          jobTitle,
          jobDescription
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze resume.");
      }

      const data: AnalysisReport = await response.json();
      clearInterval(interval);
      setReport(data);

      // Save to History List & LocalStorage
      const newHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        jobTitle: jobTitle,
        candidateName: data.parsedResume.name || "Alex Carter",
        atsScore: data.dashboard.atsScore,
        report: data
      };

      const updatedHistory = [newHistoryItem, ...historyList].slice(0, 15);
      setHistoryList(updatedHistory);
      localStorage.setItem("talentforge_history", JSON.stringify(updatedHistory));

      setActiveTab("dashboard");
    } catch (err: any) {
      clearInterval(interval);
      setError(err.message || "An unexpected network or model error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (historyItem: any) => {
    setReport(historyItem.report);
    setJobTitle(historyItem.jobTitle);
    setJobDescription(historyItem.report.jobDescription || "");
    setActiveTab("dashboard");
  };

  const handleSaveResume = () => {
    if (!report) return;
    const newSavedItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString(),
      jobTitle: jobTitle,
      candidateName: report.parsedResume.name || "Alex Carter",
      report: report
    };
    const updatedSaved = [newSavedItem, ...savedResumes];
    setSavedResumes(updatedSaved);
    localStorage.setItem("talentforge_saved", JSON.stringify(updatedSaved));
    alert("Resume saved successfully!");
  };

  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = historyList.filter((item) => item.id !== id);
    setHistoryList(updated);
    localStorage.setItem("talentforge_history", JSON.stringify(updated));
  };

  const handleDeleteSavedItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedResumes.filter((item) => item.id !== id);
    setSavedResumes(updated);
    localStorage.setItem("talentforge_saved", JSON.stringify(updated));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareReport = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 4000);
  };

  const handleExportReport = () => {
    if (!report) return;
    const content = `
# TALENTFORGE PRO - INTELLIGENCE CALIBRATION REPORT
Target Role: ${jobTitle}
Candidate: ${report.parsedResume.name}
Overall ATS Score: ${report.dashboard.atsScore}/100

## Score breakdown:
- Recruiter appeal score: ${report.dashboard.recruiterScore}/100
- Hiring manager score: ${report.dashboard.hiringManagerScore}/100
- Technical assessment score: ${report.dashboard.technicalScore}/100
- Skill Match Index: ${report.jdMatch.skillMatchPct}%
- Competitive Percentile: ${report.competitivePositioning.percentile}

## Executive Summary:
${report.executiveSummary.summary}

## Top recommendations:
${report.executiveSummary.fiveStrategicImprovements.map((imp, idx) => `${idx + 1}. ${imp}`).join("\n")}
`;
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `TalentForge_Report_${report.parsedResume.name.replace(/\s+/g, "_")}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-white">
      
      {/* Top Header / Navbar */}
      <header className="border-b border-white/5 bg-[#09090B]/90 backdrop-blur-xl sticky top-0 z-50 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 rounded-xl text-white shadow-lg shadow-blue-500/10 flex items-center justify-center">
              <Shield className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-lg font-display font-black tracking-tight text-white flex items-center gap-2">
                TALENTFORGE PRO <span className="text-[9px] bg-gradient-to-r from-blue-600 to-cyan-400 text-white px-2 py-0.5 rounded-full font-mono font-bold">V2.0</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
                PREMIUM AI RESUME OPTIMIZATION ENGINE
              </p>
            </div>
          </div>

          {/* Nav items requested in instruction 6 */}
          {report && (
            <div className="flex flex-wrap items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
              {[
                { id: "ats", label: "ATS Audit" },
                { id: "psychology", label: "Recruiter Audit" },
                { id: "keywords", label: "Keyword Gap" },
                { id: "bullets", label: "Resume Rewrite" },
                { id: "coverletter", label: "Cover Letter" },
                { id: "mapping", label: "Resume Mapping" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === item.id 
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg" 
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {report ? (
              <>
                <button
                  onClick={handleExportReport}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  Export Report
                </button>
                <button
                  onClick={handleShareReport}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-600 to-blue-500 text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/25"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share Report
                </button>
              </>
            ) : (
              <button
                onClick={handleDemoLoad}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#18181B] border border-white/5 hover:bg-zinc-800 text-zinc-300 transition-all flex items-center gap-2 shadow-2xl"
              >
                <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                Load Demo Resume
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout containing Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Instruction 7 Sidebar component */}
        <aside className="w-full md:w-64 bg-[#111827] border-r border-white/5 p-6 flex flex-col gap-6 shrink-0">
          <div>
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block mb-3 font-bold">NAVIGATION</span>
            <div className="space-y-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: Target },
                { id: "parsed", label: "Resume Analysis", icon: FileText },
                { id: "keywords", label: "Job Matching", icon: Search },
                { id: "bullets", label: "AI Tools", icon: Cpu },
                { id: "coverletter", label: "Reports", icon: BookOpen },
                { id: "history", label: "History", icon: Calendar },
                { id: "saved", label: "Saved Resumes", icon: Star },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === "settings") {
                        setShowSettingsModal(true);
                      } else {
                        setActiveTab(item.id as any);
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                      isActive 
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold shadow-md" 
                        : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-zinc-500"}`} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block mb-3 font-bold">CALIBRATION ENGINE</span>
            <div className="bg-[#18181B] p-4 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>Model Depth:</span>
                <span className="text-emerald-400 font-bold">Tier 1</span>
              </div>
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>ATS Engine:</span>
                <span className="text-cyan-400 font-bold">V2.4 Active</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Primary Workspace Panel */}
        <main className="flex-1 p-6 space-y-8 overflow-y-auto">

          {/* Share Toast Notification */}
          <AnimatePresence>
            {showShareToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-emerald-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold fixed top-20 right-6 z-50 border border-emerald-400"
              >
                <CheckCircle className="w-4 h-4" />
                TalentForge Report URL Copied to Clipboard! Ready to Share.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resume and Job parameter configurations inputs */}
          {!report && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
               {/* Left Column: Resume Input */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-mono tracking-wider text-zinc-400 flex items-center gap-2 uppercase font-bold">
                      <FileText className="w-4 h-4 text-blue-400" />
                      1. Attach Resume Profile
                    </h3>
                    {uploadedFile && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        File Attached
                      </span>
                    )}
                  </div>

                  {/* Drag-n-drop File Upload */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group cursor-pointer border border-dashed border-white/10 hover:border-blue-500/40 bg-zinc-950/50 p-8 rounded-xl text-center space-y-3 transition-all duration-300"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                    />
                    <div className="mx-auto w-12 h-12 rounded-full bg-zinc-900 group-hover:bg-blue-500/10 group-hover:text-blue-400 text-zinc-400 flex items-center justify-center transition-all duration-300">
                      <Upload className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-200 font-bold">
                        {uploadedFile ? uploadedFile.name : "Upload PDF, DOCX, or Plain Text Resume"}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                        Drag & drop file here or click to browse files
                      </p>
                    </div>
                  </div>

                  {/* Plain text area */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-zinc-400">
                        Or Paste Resume Content directly below
                      </label>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {resumeText.length} characters
                      </span>
                    </div>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="PASTE THE COMPLETE TEXT OF YOUR RESUME HERE..."
                      className="w-full h-80 bg-zinc-950 border border-white/5 rounded-xl p-4 font-mono text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none placeholder:text-zinc-700 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Targeting & Calibration */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-5 shadow-2xl">
                  <h3 className="text-xs font-mono tracking-wider text-zinc-400 flex items-center gap-2 uppercase font-bold">
                    <Target className="w-4 h-4 text-cyan-400" />
                    2. Role Calibration Details
                  </h3>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      Target Job Title *
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. Senior Frontend Engineer"
                        className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-3.5 text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        Target Job Description
                      </label>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {jobDescription.length} chars
                      </span>
                    </div>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="PASTE THE TARGET JOB DESCRIPTION HERE TO GENERATE IN-DEPTH GAP COMPARISONS..."
                      className="w-full h-64 bg-zinc-950 border border-white/5 rounded-xl p-4 font-mono text-xs text-zinc-300 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none placeholder:text-zinc-700 leading-relaxed"
                    />
                  </div>

                  {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-rose-400 text-xs">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    onClick={startAnalysis}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:opacity-95 text-white rounded-xl font-bold text-xs transition-all shadow-xl shadow-blue-500/15 flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    INITIATE TALENTFORGE CALIBRATION
                  </button>
                </div>

                {/* Guidance Tip card */}
                <div className="bg-gradient-to-r from-[#18181B] to-transparent p-5 rounded-2xl border border-white/5 flex gap-4">
                  <div className="p-2.5 bg-white/5 rounded-xl text-cyan-400 h-fit">
                    <Info className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-zinc-200">Executive Engine Diagnostics</h4>
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                      Our system calibrates deep semantic structures matching advanced technical screening frameworks.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Dynamic Pipeline Loading Screen */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-2xl mx-auto bg-[#18181B] border border-white/5 rounded-2xl p-8 shadow-2xl space-y-8 my-12"
              >
                <div className="text-center space-y-3">
                  <div className="inline-flex p-3 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20 animate-spin">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-white">Calibrating TalentForge Engine</h3>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    Scanning credentials and aligning experience vectors against targeted role matrices.
                  </p>
                </div>

                {/* Progress Tracker */}
                <div className="space-y-2 bg-zinc-950 p-6 rounded-xl border border-white/5 font-mono text-xs max-h-80 overflow-y-auto">
                  {pipelineSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isCompleted = idx < loadingStep;
                    const isActive = idx === loadingStep;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-3 transition-colors duration-300 ${isCompleted ? "text-emerald-400 font-semibold" : isActive ? "text-blue-400 font-semibold" : "text-zinc-600"}`}
                      >
                        <span className="w-4 flex justify-center">
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : isActive ? (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></span>
                          ) : (
                            <span className="text-[10px]">{idx + 1}</span>
                          )}
                        </span>
                        <StepIcon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{step.text}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Micro bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                    <span>Engine Calibration:</span>
                    <span className="text-white font-bold">{Math.round(((loadingStep + 1) / pipelineSteps.length) * 100)}%</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
                      style={{ width: `${((loadingStep + 1) / pipelineSteps.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Results Display */}
          {report && !loading && (
            <div className="space-y-8">
              
              {/* Top Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#18181B] p-6 rounded-2xl border border-white/5 shadow-2xl">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono tracking-wider text-blue-400 font-bold uppercase">CALIBRATION SUCCESSFULLY COMPLETED</span>
                  <h2 className="text-base font-semibold text-white font-display">
                    Scanned Resume for "{report.parsedResume.name}" → Target: <span className="gradient-text-primary font-bold">{jobTitle}</span>
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveResume}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-xl text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5 text-[#F59E0B]" />
                    Save Resume
                  </button>
                  <button
                    onClick={() => {
                      setReport(null);
                      setUploadedFile(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-500/15"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Scan New Resume
                  </button>
                </div>
              </div>

              {/* Dynamic Content Panel rendering tabs */}
              <div className="space-y-8">
                
                {/* Tab 1: Dashboard View */}
                {activeTab === "dashboard" && (
                  <div className="space-y-8">
                    
                    {/* Visual Charts section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <ATSScoreGauge score={report.dashboard.atsScore} />
                      <KeywordMatchChart 
                        matchedCount={report.keywordGap.matchedKeywords?.length || 12} 
                        totalCount={(report.keywordGap.matchedKeywords?.length || 12) + (report.keywordGap.missingKeywords?.length || 5)} 
                        overallMatchPct={report.jdMatch.overallMatchPct} 
                      />
                      <RadarChart scores={{
                        ats: report.dashboard.atsScore,
                        recruiter: report.dashboard.recruiterScore,
                        hiringManager: report.dashboard.hiringManagerScore,
                        experience: report.dashboard.experienceScore,
                        projects: report.dashboard.projectScore
                      }} />
                      <SkillDistributionChart skills={report.parsedResume.skills} />
                    </div>

                    <DashboardView scores={report.dashboard} />

                    {/* Scorecard Table & Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Executive Summary Card */}
                      <div className="lg:col-span-8 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <Info className="w-4.5 h-4.5 text-blue-400" />
                          Executive Summary & Placement Target
                        </h3>

                        <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 space-y-2">
                          <span className="text-[10px] font-mono text-zinc-500 font-bold block">EXECUTIVE STRATEGIC SUMMARY</span>
                          <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                            {report.executiveSummary.summary}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4" />
                              Biggest Strength
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {report.executiveSummary.biggestStrength}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                              <AlertTriangle className="w-4 h-4" />
                              Biggest Weakness
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {report.executiveSummary.biggestWeakness}
                            </p>
                          </div>
                        </div>

                        {/* Red Flags & Hidden Advantages */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
                          <div className="space-y-2">
                            <h4 className="text-xs font-mono text-rose-400 uppercase tracking-widest font-bold">
                              🚨 Red Flags / Warnings
                            </h4>
                            <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside">
                              {report.executiveSummary.redFlags && report.executiveSummary.redFlags.length > 0 ? (
                                report.executiveSummary.redFlags.map((flag, i) => (
                                  <li key={i}>{flag}</li>
                                ))
                              ) : (
                                <li className="text-zinc-500">No major red flags detected!</li>
                              )}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold">
                              💎 Hidden Advantages
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                              {report.executiveSummary.hiddenAdvantages}
                            </p>
                          </div>
                        </div>

                        {/* Expected Target Placement */}
                        <div className="pt-4 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-zinc-500 block font-bold">SALARY POSITIONING</span>
                            <p className="text-sm font-semibold text-white flex items-center gap-1">
                              <DollarSign className="w-4.5 h-4.5 text-emerald-400" />
                              {report.executiveSummary.salaryPositioning}
                            </p>
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono text-zinc-500 block font-bold">COMPANIES TO TARGET</span>
                            <div className="flex flex-wrap gap-1.5">
                              {report.executiveSummary.companiesToTarget && report.executiveSummary.companiesToTarget.length > 0 ? (
                                report.executiveSummary.companiesToTarget.map((company, i) => (
                                  <span key={i} className="text-[10px] bg-zinc-950 px-2.5 py-1 rounded-lg text-zinc-300 font-mono border border-white/5">
                                    {company}
                                  </span>
                                ))
                              ) : (
                                <span className="text-zinc-500 text-[10px] italic">No targets defined</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scorecard Table Category card */}
                      <div className="lg:col-span-4 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between shadow-2xl">
                        <div>
                          <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase mb-4">
                            <Award className="w-4.5 h-4.5 text-[#06B6D4]" />
                            ATS Scorecard Matrix
                          </h3>

                          {/* Category Score table */}
                          <div className="overflow-hidden rounded-xl border border-white/5 bg-zinc-950 font-mono text-xs">
                            <table className="w-full text-left">
                              <thead className="bg-zinc-900 text-[9px] tracking-wider text-zinc-500 border-b border-white/5">
                                <tr>
                                  <th className="p-3">Category</th>
                                  <th className="p-3 text-right">Score</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-white/5">
                                {[
                                  { label: "ATS Check", score: report.scorecard.ats },
                                  { label: "Recruiter screening", score: report.scorecard.recruiter },
                                  { label: "Hiring Manager target", score: report.scorecard.hiringManager },
                                  { label: "Experience metrics", score: report.scorecard.experience },
                                  { label: "Technical depth", score: report.scorecard.projects },
                                  { label: "Skills keywords", score: report.scorecard.skills },
                                  { label: "Education validation", score: report.scorecard.education },
                                  { label: "Grammar & structure", score: report.scorecard.grammar },
                                  { label: "Layout & format", score: report.scorecard.formatting },
                                  { label: "Density index", score: report.scorecard.keywords },
                                ].map((row, i) => (
                                  <tr key={i} className="hover:bg-white/[0.01]">
                                    <td className="p-2.5 text-zinc-400 font-semibold">{row.label}</td>
                                    <td className="p-2.5 text-right font-bold text-white">{row.score}%</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl space-y-2">
                          <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-widest block">
                            ★ Final Recommendation
                          </span>
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                            {report.executiveSummary.finalRecommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* 5 Strategic Improvements block */}
                    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                      <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                        <Calendar className="w-4.5 h-4.5 text-[#06B6D4]" />
                        📅 Five Strategic Improvements
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {report.executiveSummary.fiveStrategicImprovements && report.executiveSummary.fiveStrategicImprovements.length > 0 ? (
                           report.executiveSummary.fiveStrategicImprovements.map((imp, idx) => (
                            <div key={idx} className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-3 flex flex-col justify-between hover:border-blue-500/30 transition-all">
                              <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold flex items-center justify-center">
                                0{idx + 1}
                              </span>
                              <p className="text-xs text-zinc-300 leading-relaxed font-bold">
                                {imp}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="text-zinc-500 italic text-xs p-4 col-span-5 text-center">No recommendations loaded.</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Parsed Resume */}
                {activeTab === "parsed" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Details and Contact bar */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-xs font-mono text-zinc-500 tracking-wider uppercase font-bold">
                          Candidate Metadata
                        </h3>
                        <div className="space-y-4 font-mono text-xs">
                          <div className="space-y-1">
                            <span className="text-zinc-500 text-[9px] font-bold">NAME</span>
                            <p className="text-white font-extrabold text-sm">{report.parsedResume.name}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 text-[9px] font-bold">EMAIL</span>
                            <p className="text-white font-semibold">{report.parsedResume.email}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 text-[9px] font-bold">PHONE</span>
                            <p className="text-white font-semibold">{report.parsedResume.phone}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 text-[9px] font-bold">LINKEDIN</span>
                            <p className="text-blue-400 truncate hover:underline font-bold">
                              {report.parsedResume.linkedin !== "🔴 Not Found" ? (
                                <a href={report.parsedResume.linkedin} target="_blank" rel="noreferrer">
                                  {report.parsedResume.linkedin}
                                </a>
                              ) : (
                                <span className="text-rose-400">🔴 Not Found</span>
                              )}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 text-[9px] font-bold">GITHUB</span>
                            <p className="text-blue-400 truncate hover:underline font-bold">
                              {report.parsedResume.github !== "🔴 Not Found" ? (
                                <a href={report.parsedResume.github} target="_blank" rel="noreferrer">
                                  {report.parsedResume.github}
                                </a>
                              ) : (
                                <span className="text-rose-400">🔴 Not Found</span>
                              )}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-zinc-500 text-[9px] font-bold">PORTFOLIO</span>
                            <p className="text-blue-400 truncate hover:underline font-bold">
                              {report.parsedResume.portfolio !== "🔴 Not Found" ? (
                                <a href={report.parsedResume.portfolio} target="_blank" rel="noreferrer">
                                  {report.parsedResume.portfolio}
                                </a>
                              ) : (
                                <span className="text-rose-400">🔴 Not Found</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-xs font-mono text-zinc-500 tracking-wider uppercase font-bold">
                          Technical Skillset Tags
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {report.parsedResume.skills && report.parsedResume.skills.length > 0 ? (
                            report.parsedResume.skills.map((skill, i) => (
                              <span key={i} className="px-2.5 py-1 bg-zinc-950 rounded-lg text-xs text-zinc-300 font-mono border border-white/5">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-500 text-xs italic">No skills extracted</span>
                          )}
                        </div>
                      </div>

                      {report.parsedResume.certifications && report.parsedResume.certifications.length > 0 && (
                        <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                          <h3 className="text-xs font-mono text-zinc-500 tracking-wider uppercase font-bold">
                            Certifications
                          </h3>
                          <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside font-semibold">
                            {report.parsedResume.certifications.map((cert, i) => (
                              <li key={i}>{cert}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Experience and details right panel */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-xs font-mono text-zinc-500 tracking-wider uppercase flex items-center gap-2 font-bold">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          Professional Summary
                        </h3>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                          {report.parsedResume.summary}
                        </p>
                      </div>

                      <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                        <h3 className="text-xs font-mono text-zinc-500 tracking-wider uppercase flex items-center gap-2 font-bold">
                          <Briefcase className="w-4 h-4 text-cyan-400" />
                          Experience Profile
                        </h3>
                        <div className="space-y-6 divide-y divide-white/5">
                          {report.parsedResume.experience && report.parsedResume.experience.length > 0 ? (
                            report.parsedResume.experience.map((exp, i) => (
                              <div key={i} className={`pt-4 first:pt-0 space-y-3`}>
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-xs font-bold text-white">{exp.role}</h4>
                                    <p className="text-[11px] font-mono text-zinc-400 font-semibold">{exp.company}</p>
                                  </div>
                                  <span className="text-[10px] font-mono bg-zinc-950 px-2.5 py-1 rounded-lg text-zinc-400 border border-white/5">
                                    {exp.period}
                                  </span>
                                </div>
                                <ul className="space-y-1.5 list-disc list-inside text-xs text-zinc-400 pl-2">
                                  {exp.bullets.map((bullet, idx) => (
                                    <li key={idx} className="leading-relaxed font-sans">{bullet}</li>
                                  ))}
                                </ul>
                              </div>
                            ))
                          ) : (
                            <div className="text-zinc-500 text-xs italic">No experience data found.</div>
                          )}
                        </div>
                      </div>

                      {report.parsedResume.projects && report.parsedResume.projects.length > 0 && (
                        <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                          <h3 className="text-xs font-mono text-zinc-500 tracking-wider uppercase flex items-center gap-2 font-bold">
                            <Cpu className="w-4 h-4 text-blue-400" />
                            Key Projects
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {report.parsedResume.projects.map((proj, i) => (
                              <div key={i} className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-3">
                                <div>
                                  <h4 className="text-xs font-bold text-white">{proj.title}</h4>
                                  <span className="text-[10px] font-mono text-cyan-400 font-bold">{proj.technologies}</span>
                                </div>
                                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                                  {proj.description}
                                </p>
                                <ul className="text-[11px] text-zinc-400 list-disc pl-3 space-y-1">
                                  {proj.bullets && proj.bullets.map((b, idx) => (
                                    <li key={idx} className="font-sans">{b}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Tab 3: ATS & Formatting */}
                {activeTab === "ats" && (
                  <div className="space-y-8">
                    {/* First 7 seconds Visual scan card */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-4 bg-[#18181B] p-6 rounded-2xl border border-white/5 flex flex-col justify-between shadow-2xl">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Screening Simulation</span>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${report.firstImpression.continueReading ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                              RECRUITER SELECTION: {report.firstImpression.decision}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white font-display flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-blue-400 animate-pulse" />
                            7-Second Recruiter Visual Gaze
                          </h3>
                          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                            Does the candidate make an immediate impression that prevents a swift discard during the typical initial 7-second resume pass?
                          </p>
                        </div>

                        <div className="mt-6 p-4 bg-zinc-950 rounded-xl border border-white/5 font-mono text-xs">
                          <span className="text-[10px] text-zinc-500 font-bold block mb-1">DECISION REASONING:</span>
                          <p className="text-zinc-300 leading-relaxed">
                            {report.firstImpression.reason}
                          </p>
                        </div>
                      </div>

                      {/* Detailed parsing analysis with StatusBadges */}
                      <div className="lg:col-span-8 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <Cpu className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
                          ATS Optimizations Checklist
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {[
                            { title: "AI Parsing Compatibility", value: report.atsOptimization.parsingStatus, details: report.atsOptimization.parsingDetails },
                            { title: "Header Semantics Structure", value: report.atsOptimization.headersStatus, details: report.atsOptimization.headersDetails },
                            { title: "Tables & Floating Elements", value: report.atsOptimization.tablesStatus, details: report.atsOptimization.tablesDetails },
                            { title: "Font Families & Accessibility", value: report.atsOptimization.fontsStatus, details: report.atsOptimization.fontsDetails },
                            { title: "Layout Splits & Columns", value: report.atsOptimization.columnsStatus, details: report.atsOptimization.columnsDetails },
                            { title: "Graphical Symbols & Clutter", value: report.atsOptimization.iconsStatus, details: report.atsOptimization.iconsDetails },
                            { title: "Section Ordering Hierarchy", value: report.atsOptimization.fileStructureStatus, details: report.atsOptimization.fileStructureDetails },
                            { title: "Contact Details Layout", value: report.atsOptimization.contactDetailsStatus, details: report.atsOptimization.contactDetailsDetails },
                            { title: "Keyword Target Density", value: report.atsOptimization.keywordDensityStatus, details: report.atsOptimization.keywordDensityDetails },
                            { title: "Resume Page Length", value: report.atsOptimization.resumeLengthStatus, details: report.atsOptimization.resumeLengthDetails },
                          ].map((chk, i) => (
                            <div key={i} className="p-4 bg-zinc-950 rounded-xl border border-white/5 space-y-2 hover:border-blue-500/20 transition-all">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xs font-bold text-white">{chk.title}</h4>
                                <StatusBadge status={chk.value} />
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                                {chk.details}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Resume Layout Design metrics */}
                    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                      <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                        <Info className="w-4.5 h-4.5 text-[#06B6D4]" />
                        Visual & Layout Quality Audits
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { name: "Whitespace Balancing", val: report.resumeDesign.whitespace },
                          { name: "Margins & Padding", val: report.resumeDesign.margins },
                          { name: "Spacings", val: report.resumeDesign.spacing },
                          { name: "Typography choices", val: report.resumeDesign.fonts },
                          { name: "Bullet point structures", val: report.resumeDesign.bulletPoints },
                          { name: "Alignment", val: report.resumeDesign.alignment },
                          { name: "Ordering Hierarchy", val: report.resumeDesign.sectionOrder },
                          { name: "Length Suitability", val: report.resumeDesign.length },
                          { name: "General Readability", val: report.resumeDesign.readability },
                          { name: "WCAG Accessibility", val: report.resumeDesign.accessibility },
                        ].map((item, i) => (
                          <div key={i} className="bg-zinc-950 p-4 rounded-xl border border-white/5 space-y-1.5 hover:border-blue-500/20 transition-all">
                            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block font-bold">{item.name}</span>
                            <p className="text-xs text-zinc-300 leading-relaxed font-bold font-sans">{item.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 4: Keyword & JD Gaps */}
                {activeTab === "keywords" && (
                  <KeywordGapView keywordGap={report.keywordGap} jdMatch={report.jdMatch} />
                )}

                {/* Tab 5: Psychology & Professional evaluation */}
                {activeTab === "psychology" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Recruiter profile */}
                      <div className="lg:col-span-6 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-white/5 pb-3">
                          <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                            <Users className="w-4.5 h-4.5 text-blue-400" />
                            Recruiter Psychological Profile
                          </h3>
                          <span className="px-2.5 py-1 text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono font-black rounded-full">
                            SHORTLIST PROBABILITY: {report.recruiterPsychology.wouldShortlist}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] font-mono text-emerald-400 block font-bold uppercase">🟢 WHAT ATTRACTS THE SCREENER</span>
                            <ul className="text-xs text-zinc-400 list-disc pl-3.5 space-y-2 font-sans leading-relaxed">
                              {report.recruiterPsychology.whatAttracts && report.recruiterPsychology.whatAttracts.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2 bg-zinc-950 p-4 rounded-xl border border-white/5">
                            <span className="text-[10px] font-mono text-rose-400 block font-bold uppercase">🔴 REJECTION TRIGGERS</span>
                            <ul className="text-xs text-zinc-400 list-disc pl-3.5 space-y-2 font-sans leading-relaxed">
                              {report.recruiterPsychology.whatCausesRejection && report.recruiterPsychology.whatCausesRejection.map((item, i) => (
                                <li key={i}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl space-y-1.5 font-mono text-xs">
                          <span className="text-[10px] text-zinc-500 font-bold block">RECRUITER RATIONALE ANALYSIS:</span>
                          <p className="text-zinc-300 leading-relaxed font-sans">{report.recruiterPsychology.explanation}</p>
                        </div>
                      </div>

                      {/* Hiring Manager perspective */}
                      <div className="lg:col-span-6 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase border-b border-white/5 pb-3">
                          <Award className="w-4.5 h-4.5 text-cyan-400" />
                          Hiring Manager Engineering Evaluation
                        </h3>

                        <div className="space-y-4">
                          {[
                            { title: "Technical Depth", val: report.hiringManagerPerspective.technicalDepth },
                            { title: "Business Value Delivery", val: report.hiringManagerPerspective.businessValue },
                            { title: "Ownership & Leadership Core", val: report.hiringManagerPerspective.leadership },
                            { title: "Problem Solving Capacity", val: report.hiringManagerPerspective.problemSolving },
                            { title: "Quantifiable Impact Index", val: report.hiringManagerPerspective.impact },
                          ].map((hm, idx) => (
                            <div key={idx} className="p-4 bg-zinc-950 rounded-xl border border-white/5 space-y-1 hover:border-blue-500/20 transition-all">
                              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{hm.title}</h4>
                              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{hm.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Technical Credibility review block */}
                    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                      <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                        <Code className="w-4.5 h-4.5 text-[#06B6D4]" />
                        Technical Credibility & Architect Matrix
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          { title: "Experience Credibility", details: report.technicalCredibility.experienceEval },
                          { title: "Software Architecture & Scalability", details: report.technicalCredibility.architecture },
                          { title: "Scalability Benchmarking", details: report.technicalCredibility.scalability },
                          { title: "Deployment & Infrastructure", details: report.technicalCredibility.deployment },
                          { title: "Product Thinking & Innovation", details: report.technicalCredibility.innovation },
                          { title: "Open Source / GitHub Audit", details: `${report.technicalCredibility.githubStatus} | ${report.technicalCredibility.openSourceStatus}` },
                        ].map((cred, i) => (
                          <div key={i} className="p-4 bg-zinc-950 rounded-xl border border-white/5 space-y-2 hover:border-blue-500/20 transition-all">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest">{cred.title}</h4>
                            <p className="text-xs text-zinc-400 leading-relaxed font-sans">{cred.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Career Story & Competitive positioning */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <BookOpen className="w-4.5 h-4.5 text-blue-400" />
                          Career Story Narrative
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { title: "Career Progression", val: report.careerStory.progression },
                            { title: "Tenure Stability & Consistency", val: report.careerStory.consistency },
                            { title: "Professional Growth Vectors", val: report.careerStory.growth },
                            { title: "Rapid Learning Curve", val: report.careerStory.learningCurve },
                          ].map((story, i) => (
                            <div key={i} className="p-4 bg-zinc-950 rounded-xl border border-white/5 space-y-1 hover:border-blue-500/20 transition-all">
                              <h4 className="text-xs font-bold text-zinc-300">{story.title}</h4>
                              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{story.val}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="lg:col-span-4 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <Target className="w-4.5 h-4.5 text-blue-400" />
                          Competitive Standings
                        </h3>

                        <div className="bg-zinc-950 p-6 rounded-xl border border-white/5 text-center space-y-3">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">PREDICTED BENCHMARK PERCENTILE</span>
                          <p className="text-3xl font-display font-extrabold text-blue-400">{report.competitivePositioning.percentile}</p>
                          <p className="text-xs text-zinc-500 max-w-xs mx-auto font-sans leading-relaxed">
                            Standing relative to global candidates applying for typical role pools at Tier 1 technical targets.
                          </p>
                        </div>

                        <div className="p-4 bg-zinc-950 rounded-xl border border-white/5 text-xs text-zinc-400 space-y-2">
                          <span className="text-[9px] font-mono text-zinc-500 font-bold block">REASONS FOR STANDING:</span>
                          <ul className="list-disc pl-4 space-y-1 font-sans leading-relaxed">
                            {report.competitivePositioning.reasons && report.competitivePositioning.reasons.map((r, i) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 6: Bullet Optimization & STAR Rewrite */}
                {activeTab === "bullets" && (
                  <div className="space-y-8">
                    {/* Detailed original vs. rewritten bullet-by-bullet list */}
                    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                      <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                        <CheckSquare className="w-4.5 h-4.5 text-blue-400 animate-pulse" />
                        Detailed Bullet-by-Bullet Strategic Analysis
                      </h3>

                      <div className="space-y-6">
                        {report.bulletPointReview && report.bulletPointReview.map((item, i) => (
                          <div key={i} className="bg-zinc-950 p-6 rounded-xl border border-white/5 space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <span className="text-[9px] font-mono text-rose-400 font-bold tracking-widest block uppercase">Original Weak Bullet</span>
                                <p className="text-xs text-zinc-400 font-mono bg-zinc-900/30 p-3 rounded-lg border border-white/5 leading-relaxed">
                                  {item.original}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <span className="text-[9px] font-mono text-emerald-400 font-bold tracking-widest block uppercase">Optimized STAR Bullet</span>
                                <p className="text-xs text-white font-bold bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20 leading-relaxed font-sans">
                                  {item.rewrite}
                                </p>
                              </div>
                            </div>

                            <div className="p-3.5 bg-zinc-900/60 rounded-xl border border-white/5 text-xs text-zinc-300 leading-relaxed flex gap-3 font-sans">
                              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-zinc-200">The "So What?" Recruiter Filter: </span>
                                {item.soWhat}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quantitative achievements rewrite list */}
                    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                      <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                        <RefreshCw className="w-4.5 h-4.5 text-[#06B6D4] animate-pulse" />
                        Strategic Metric & Quantification Injectors
                      </h3>

                      <div className="space-y-6">
                        {report.achievementQuantification && report.achievementQuantification.map((ach, idx) => (
                          <div key={idx} className="bg-zinc-950 p-6 rounded-xl border border-white/5 space-y-4">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b border-white/5 pb-2">
                              <span className="text-[9px] font-mono text-blue-400 font-bold">QUANTIFIABLE INJECTION POINT #{idx + 1}</span>
                              <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full font-mono border border-white/5">STAR Format Optimized</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans">
                              <div className="space-y-2">
                                <span className="text-[9px] text-zinc-500 font-bold block uppercase font-mono">Current Content</span>
                                <p className="text-zinc-400 italic bg-zinc-900/20 p-3 rounded-lg border border-white/5">{ach.original}</p>
                              </div>
                              <div className="space-y-2">
                                <span className="text-[9px] text-emerald-400 font-bold block uppercase font-mono">Recommended Quantified Version</span>
                                <p className="text-white font-bold bg-emerald-500/5 p-3 rounded-lg border border-emerald-500/20">{ach.improved}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs font-sans">
                              <div className="space-y-1">
                                <span className="text-[9px] text-rose-400 font-bold block uppercase font-mono">🔍 THE ISSUE</span>
                                <p className="text-zinc-400 leading-relaxed">{ach.issue}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] text-amber-400 font-bold block uppercase font-mono">⚡ REJECT IMPACT</span>
                                <p className="text-zinc-400 leading-relaxed">{ach.impact}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] text-emerald-400 font-bold block uppercase font-mono">🏆 THE METRIC FIX</span>
                                <p className="text-zinc-400 leading-relaxed">{ach.solution}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bullet Lists & Reference materials */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-6 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <CheckSquare className="w-4.5 h-4.5 text-blue-400" />
                          10 Pre-Quantified High-Impact Bullet Examples
                        </h3>
                        <ul className="text-xs text-zinc-300 space-y-3 pl-4 list-decimal leading-relaxed font-sans">
                          {report.lists.quantifiedBulletExamples && report.lists.quantifiedBulletExamples.map((ex, i) => <li key={i}>{ex}</li>)}
                        </ul>
                      </div>

                      <div className="lg:col-span-6 bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <CheckSquare className="w-4.5 h-4.5 text-[#06B6D4]" />
                          10 STAR Method Core Bullet Examples
                        </h3>
                        <ul className="text-xs text-zinc-300 space-y-3 pl-4 list-decimal leading-relaxed font-sans">
                          {report.lists.starBulletExamples && report.lists.starBulletExamples.map((ex, i) => <li key={i}>{ex}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* Comprehensive Master Rewrite Document view with Copy Code button */}
                    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                      <div className="flex justify-between items-center border-b border-white/5 pb-4">
                        <div>
                          <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                            <Terminal className="w-4.5 h-4.5 text-[#06B6D4] animate-pulse" />
                            ★ COMPLETE MASTER REWRITTEN RESUME (MARKDOWN)
                          </h3>
                          <p className="text-xs text-zinc-500 mt-1 font-sans">
                            Copy the text below into your favorite markdown editor or Word processing tool to save your final polished resume!
                          </p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(report.rewrittenResume.content)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-95 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-500/15"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              Copy Resume Content
                            </>
                          )}
                        </button>
                      </div>

                      <div className="bg-zinc-950 p-6 rounded-xl border border-white/5 overflow-x-auto max-h-[800px] overflow-y-auto">
                        <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                          {report.rewrittenResume.content}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 7: Tailored Interview prep Questions */}
                {activeTab === "interview" && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <Terminal className="w-4.5 h-4.5 text-[#06B6D4]" />
                          10 Technical & System Architecture Questions
                        </h3>
                        <ul className="text-xs text-zinc-300 space-y-3 pl-4 list-decimal leading-relaxed font-sans">
                          {report.lists.technicalQuestions && report.lists.technicalQuestions.map((q, i) => <li key={i} className="font-bold">{q}</li>)}
                        </ul>
                      </div>

                      <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <Users className="w-4.5 h-4.5 text-blue-400" />
                          10 Behavioral (STAR Method) Questions
                        </h3>
                        <ul className="text-xs text-zinc-300 space-y-3 pl-4 list-decimal leading-relaxed font-sans">
                          {report.lists.behavioralQuestions && report.lists.behavioralQuestions.map((q, i) => <li key={i} className="font-bold">{q}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <Info className="w-4.5 h-4.5 text-blue-400" />
                          10 HR & Recruiter Selection Screening Questions
                        </h3>
                        <ul className="text-xs text-zinc-300 space-y-3 pl-4 list-decimal leading-relaxed font-sans">
                          {report.lists.hrQuestions && report.lists.hrQuestions.map((q, i) => <li key={i} className="font-bold">{q}</li>)}
                        </ul>
                      </div>

                      <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                        <h3 className="text-sm font-semibold font-display text-white flex items-center gap-2 uppercase">
                          <HelpCircle className="w-4.5 h-4.5 text-cyan-400" />
                          10 Role-Calibrated Executive Interview Prep Questions
                        </h3>
                        <ul className="text-xs text-zinc-300 space-y-3 pl-4 list-decimal leading-relaxed font-sans">
                          {report.lists.interviewQuestions && report.lists.interviewQuestions.map((q, i) => <li key={i} className="font-bold">{q}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-4 shadow-2xl">
                      <h3 className="text-xs font-mono text-zinc-500 tracking-wider uppercase font-bold">
                        10 Selected Action Verbs for High Impact Output
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {report.lists.actionVerbs && report.lists.actionVerbs.map((verb, idx) => (
                          <span key={idx} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black rounded-lg font-mono">
                            ★ {verb}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Cover Letter View Tab */}
                {activeTab === "coverletter" && (
                  <CoverLetterView 
                    candidateName={report.parsedResume.name} 
                    targetJobTitle={jobTitle} 
                    candidateSkills={report.parsedResume.skills} 
                    summary={report.parsedResume.summary} 
                  />
                )}

                {/* Resume Trajectory Mapping View Tab */}
                {activeTab === "mapping" && (
                  <ResumeMappingView 
                    experience={report.parsedResume.experience} 
                    education={report.parsedResume.education} 
                    projects={report.parsedResume.projects} 
                  />
                )}

              </div>

              {/* Bottom TalentForge Report representation requested in UI */}
              <div className="bg-[#18181B] p-8 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
                <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap leading-relaxed max-w-lg mx-auto bg-zinc-950 p-6 rounded-xl border border-white/5">
{`╔════════════════════════════════════╗
        TALENTFORGE PRO REPORT
╠════════════════════════════════════╣
📊 ATS Score:             ${report.dashboard.atsScore}/100
📈 Recruiter Score:       ${report.dashboard.recruiterScore}/100
💼 Hiring Manager Score:  ${report.dashboard.hiringManagerScore}/100
🚀 Hire Probability:      ${report.dashboard.overallHireProbability}%
🛠 Skill Match:            ${report.jdMatch.skillMatchPct}%
🎯 JD Match:              ${report.jdMatch.overallMatchPct}%
⭐ Resume Rating:         ${report.dashboard.atsScore >= 80 ? "🟢 Excellent" : report.dashboard.atsScore >= 65 ? "🔵 Good" : "🟡 Needs Improvement"}
🏆 Final Recommendation:   Active Calibration
╚════════════════════════════════════╝`}
                </pre>
              </div>

            </div>
          )}

          {/* Tab: History View */}
          {activeTab === "history" && (
            <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-semibold font-display text-white">Your Evaluation History</h3>
                <p className="text-xs text-zinc-500 mt-1">Access past calibrations and resume optimization reports quickly.</p>
              </div>

              {historyList.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <Calendar className="w-12 h-12 text-zinc-600 mx-auto animate-pulse" />
                  <h4 className="text-sm font-bold text-white">No Calibration History Found</h4>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">Analyze a resume above to begin saving calibration history points securely inside your local storage.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {historyList.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectHistory(item)}
                      className="p-4 bg-zinc-950 rounded-xl border border-white/5 flex justify-between items-center hover:border-blue-500/40 transition-all cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-white group-hover:text-blue-400 transition-colors">{item.jobTitle}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">{item.candidateName} — {item.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-lg border border-blue-500/20">
                          ATS: {item.atsScore}%
                        </span>
                        <button 
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab: Saved Resumes */}
          {activeTab === "saved" && (
            <div className="bg-[#18181B] p-6 rounded-2xl border border-white/5 space-y-6 shadow-2xl">
              <div className="border-b border-white/5 pb-3">
                <h3 className="text-sm font-semibold font-display text-white">Saved Optimized Profiles</h3>
                <p className="text-xs text-zinc-500 mt-1">Review your saved candidate calibrations and customized drafts.</p>
              </div>

              {savedResumes.length === 0 ? (
                <div className="p-12 text-center space-y-4">
                  <Star className="w-12 h-12 text-zinc-600 mx-auto animate-pulse" />
                  <h4 className="text-sm font-bold text-white">No Saved Resumes Found</h4>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto">Click "Save Resume" on any calibrated report to save drafts securely in local storage.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {savedResumes.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectHistory(item)}
                      className="p-4 bg-zinc-950 rounded-xl border border-white/5 flex justify-between items-center hover:border-[#06B6D4]/40 transition-all cursor-pointer group"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-extrabold text-white group-hover:text-cyan-400 transition-colors">{item.jobTitle}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">{item.candidateName} — {item.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={(e) => handleDeleteSavedItem(item.id, e)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Settings Modal (Instruction 7 settings view) */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#09090B]/85 backdrop-blur-xl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#18181B] max-w-md w-full p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6 relative"
            >
              <div className="flex justify-between items-start border-b border-white/5 pb-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold font-display text-white">System Settings</h3>
                  <p className="text-[10px] text-zinc-500">Configure TalentForge Pro pipeline parameters.</p>
                </div>
                <button 
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-white/5"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="space-y-1.5">
                  <span className="text-[9px] text-zinc-500 block">AI CALIBRATION MODEL</span>
                  <select className="w-full bg-zinc-950 border border-white/5 p-2.5 rounded-lg text-white">
                    <option>Gemini 1.5 Flash (Tier-1 Standard)</option>
                    <option>Gemini 1.5 Pro (Deep Calibrator)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-zinc-500 block">ATS EXTRACTION STANDARD</span>
                  <select className="w-full bg-zinc-950 border border-white/5 p-2.5 rounded-lg text-white">
                    <option>FAANG Recruitment Standard 2026</option>
                    <option>Standard Corporate ATS</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] text-zinc-500 block">AUTO-SAVE SESSIONS</span>
                  <label className="flex items-center gap-2 text-zinc-400">
                    <input type="checkbox" defaultChecked className="rounded border-white/5 accent-blue-500" />
                    <span>Preserve history up to 15 entries</span>
                  </label>
                </div>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                Save Settings Configuration
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </div>
  );
}
