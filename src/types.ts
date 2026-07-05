export interface ParsedResume {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  skills: string[];
  education: Array<{ school: string; degree: string; field: string; year: string }>;
  experience: Array<{ company: string; role: string; period: string; bullets: string[] }>;
  projects: Array<{ title: string; technologies: string; description: string; bullets: string[] }>;
  certifications: string[];
  achievements: string[];
  languages: string[];
}

export interface DashboardScores {
  atsScore: number;
  recruiterScore: number;
  hiringManagerScore: number;
  technicalScore: number;
  keywordScore: number;
  formattingScore: number;
  grammarScore: number;
  experienceScore: number;
  projectScore: number;
  overallHireProbability: number;
}

export interface FirstImpression {
  continueReading: boolean;
  decision: string;
  reason: string;
}

export interface AtsOptimization {
  parsingStatus: string;
  parsingDetails: string;
  headersStatus: string;
  headersDetails: string;
  tablesStatus: string;
  tablesDetails: string;
  fontsStatus: string;
  fontsDetails: string;
  columnsStatus: string;
  columnsDetails: string;
  iconsStatus: string;
  iconsDetails: string;
  fileStructureStatus: string;
  fileStructureDetails: string;
  contactDetailsStatus: string;
  contactDetailsDetails: string;
  keywordDensityStatus: string;
  keywordDensityDetails: string;
  resumeLengthStatus: string;
  resumeLengthDetails: string;
}

export interface KeywordDensityItem {
  keyword: string;
  count: number;
  density: string;
}

export interface KeywordGap {
  matchedKeywords: string[];
  missingKeywords: string[];
  keywordDensity: KeywordDensityItem[];
  suggestions: string[];
  top20AtsKeywords: string[];
}

export interface RecruiterPsychology {
  whatAttracts: string[];
  whatCausesRejection: string[];
  wouldShortlist: string;
  explanation: string;
}

export interface HiringManagerPerspective {
  technicalDepth: string;
  businessValue: string;
  leadership: string;
  ownership: string;
  problemSolving: string;
  impact: string;
}

export interface TechnicalCredibility {
  projectsEval: string;
  experienceEval: string;
  techStack: string[];
  architecture: string;
  scalability: string;
  deployment: string;
  githubStatus: string;
  openSourceStatus: string;
  innovation: string;
}

export interface AchievementQuantificationItem {
  original: string;
  issue: string;
  impact: string;
  solution: string;
  improved: string;
}

export interface CareerStory {
  progression: string;
  consistency: string;
  growth: string;
  promotion: string;
  learningCurve: string;
  narrative: string;
}

export interface ResumeDesign {
  whitespace: string;
  spacing: string;
  margins: string;
  fonts: string;
  bulletPoints: string;
  alignment: string;
  sectionOrder: string;
  length: string;
  readability: string;
  accessibility: string;
}

export interface CompetitivePositioning {
  percentile: string;
  reasons: string[];
}

export interface BulletReviewItem {
  original: string;
  soWhat: string;
  rewrite: string;
}

export interface JdMatchReport {
  skillMatchPct: number;
  experienceMatchPct: number;
  educationMatchPct: number;
  projectMatchPct: number;
  cultureMatchPct: number;
  overallMatchPct: number;
  skillsMatchingJd: string[];
  skillsMissing: string[];
  projectsToEmphasize: string[];
  experienceToReorder: string[];
  sectionsToRewrite: string[];
}

export interface ScorecardTable {
  ats: number;
  recruiter: number;
  hiringManager: number;
  projects: number;
  experience: number;
  skills: number;
  education: number;
  grammar: number;
  formatting: number;
  keywords: number;
  overall: number;
}

export interface ListsAssets {
  top20Keywords: string[];
  actionVerbs: string[];
  quantifiedBulletExamples: string[];
  starBulletExamples: string[];
  interviewQuestions: string[];
  technicalQuestions: string[];
  hrQuestions: string[];
  behavioralQuestions: string[];
}

export interface ExecutiveSummary {
  summary: string;
  biggestStrength: string;
  biggestWeakness: string;
  redFlags: string[];
  hiddenAdvantages: string;
  salaryPositioning: string;
  companiesToTarget: string[];
  finalRecommendation: string;
  fiveStrategicImprovements: string[];
}

export interface RewrittenResume {
  content: string;
}

export interface AnalysisReport {
  parsedResume: ParsedResume;
  dashboard: DashboardScores;
  firstImpression: FirstImpression;
  atsOptimization: AtsOptimization;
  keywordGap: KeywordGap;
  recruiterPsychology: RecruiterPsychology;
  hiringManagerPerspective: HiringManagerPerspective;
  technicalCredibility: TechnicalCredibility;
  achievementQuantification: AchievementQuantificationItem[];
  careerStory: CareerStory;
  resumeDesign: ResumeDesign;
  competitivePositioning: CompetitivePositioning;
  bulletPointReview: BulletReviewItem[];
  jdMatch: JdMatchReport;
  lists: ListsAssets;
  scorecard: ScorecardTable;
  executiveSummary: ExecutiveSummary;
  rewrittenResume: RewrittenResume;
}
