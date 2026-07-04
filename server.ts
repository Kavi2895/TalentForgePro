import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase body limit to handle PDF base64 payloads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Initialize GoogleGenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Resume analysis API route
app.post("/api/analyze", async (req, res) => {
  try {
    const { resumeText, fileBase64, fileMimeType, jobTitle, jobDescription } = req.body;

    if (!resumeText && !fileBase64) {
      return res.status(400).json({ error: "Missing resume text or uploaded file." });
    }

    if (!jobTitle) {
      return res.status(400).json({ error: "Job title is required." });
    }

    // Prepare contents for Gemini
    const contents: any[] = [];

    let contextPrompt = `You are TargetForge Pro, an enterprise-grade AI Resume Intelligence Engine combining the expertise of an Executive Recruiter, FAANG Hiring Manager, ATS Optimization Engineer, Resume Writing Expert, and Career Coach.

Analyze the resume provided for the target Job Title: "${jobTitle}"
${jobDescription ? `and target Job Description:\n"""\n${jobDescription}\n"""` : "Since no Job Description is provided, perform a General ATS & Role-Specific Best Practices Analysis."}

Please perform a thorough, critical, and highly constructive analysis of this resume. Under no circumstances should you invent or hallucinate achievements, experience, or facts. If any standard resume element is not found, list it as "🔴 Not Found".

You must output a single, complete, and syntactically valid JSON object. Do NOT wrap the JSON in markdown code blocks like \`\`\`json. Return ONLY the JSON object.

The output JSON object MUST have the following structure:
{
  "parsedResume": {
    "name": "Full Name or '🔴 Not Found'",
    "email": "Email address or '🔴 Not Found'",
    "phone": "Phone number or '🔴 Not Found'",
    "linkedin": "LinkedIn profile URL or '🔴 Not Found'",
    "github": "GitHub profile URL or '🔴 Not Found'",
    "portfolio": "Portfolio/Website URL or '🔴 Not Found'",
    "summary": "Professional Summary or '🔴 Not Found'",
    "skills": ["Skill 1", "Skill 2"],
    "education": [{"school": "School Name", "degree": "Degree", "field": "Field", "year": "Year"}],
    "experience": [{"company": "Company Name", "role": "Role Title", "period": "Date Range", "bullets": ["Bullet point 1"]}],
    "projects": [{"title": "Project Name", "technologies": "Tech stack used", "description": "Short description", "bullets": ["Bullet 1"]}],
    "certifications": ["Cert 1"],
    "achievements": ["Achievement 1"],
    "languages": ["Language 1"]
  },
  "dashboard": {
    "atsScore": 85,
    "recruiterScore": 80,
    "hiringManagerScore": 75,
    "technicalScore": 78,
    "keywordScore": 82,
    "formattingScore": 80,
    "grammarScore": 90,
    "experienceScore": 75,
    "projectScore": 80,
    "overallHireProbability": 78
  },
  "firstImpression": {
    "continueReading": true,
    "decision": "YES",
    "reason": "Explain would the recruiter continue reading based on the first 7 seconds of visual hierarchy, clear formatting, and immediate relevance."
  },
  "atsOptimization": {
    "parsingStatus": "🟢 Excellent / 🔵 Good / 🟡 Needs Improvement / 🟠 Weak / 🔴 Critical",
    "parsingDetails": "Detailed feedback on parsing compatibility.",
    "headersStatus": "Status badge",
    "headersDetails": "Feedback on headers.",
    "tablesStatus": "Status badge",
    "tablesDetails": "Feedback on tables and columns usage (avoiding columns or text boxes).",
    "fontsStatus": "Status badge",
    "fontsDetails": "Feedback on fonts.",
    "columnsStatus": "Status badge",
    "columnsDetails": "Feedback on visual layout or column splits.",
    "iconsStatus": "Status badge",
    "iconsDetails": "Feedback on symbols, icons, or visual clutter.",
    "fileStructureStatus": "Status badge",
    "fileStructureDetails": "Feedback on resume sections structure.",
    "contactDetailsStatus": "Status badge",
    "contactDetailsDetails": "Feedback on accessibility of contact details.",
    "keywordDensityStatus": "Status badge",
    "keywordDensityDetails": "Feedback on matching density against target standard.",
    "resumeLengthStatus": "Status badge",
    "resumeLengthDetails": "Feedback on page length (1 page for <5 years, 2 pages for >=5 years)."
  },
  "keywordGap": {
    "matchedKeywords": ["Keyword A", "Keyword B"],
    "missingKeywords": ["Keyword C", "Keyword D"],
    "keywordDensity": [{"keyword": "React", "count": 3, "density": "1.2%"}],
    "suggestions": ["Add Keyword X to project Y", "Include Keyword Z under experience"],
    "top20AtsKeywords": ["List of 20 relevant ATS keywords for this job role"]
  },
  "recruiterPsychology": {
    "whatAttracts": ["Point 1", "Point 2"],
    "whatCausesRejection": ["Point 1", "Point 2"],
    "wouldShortlist": "YES / NO",
    "explanation": "Why a professional recruiter would or would not shortlist this."
  },
  "hiringManagerPerspective": {
    "technicalDepth": "Explain Issue -> Impact -> Solution -> Improved Version style or critical feedback.",
    "businessValue": "Analysis of business impact alignment.",
    "leadership": "Evidence of leadership or ownership.",
    "ownership": "Evidence of ownership.",
    "problemSolving": "Evidence of problem solving capabilities.",
    "impact": "Evaluation of actual quantified business impact."
  },
  "technicalCredibility": {
    "projectsEval": "Evaluation of technical projects.",
    "experienceEval": "Evaluation of technical depth in experience.",
    "techStack": ["Technology 1", "Technology 2"],
    "architecture": "Evaluation of architectural and software engineering skills.",
    "scalability": "Feedback on scalability.",
    "deployment": "Feedback on deployment and cloud services.",
    "githubStatus": "Feedback on GitHub presence or '🔴 Not Found'",
    "openSourceStatus": "Feedback on open source contributions or '🔴 Not Found'",
    "innovation": "Feedback on innovation and product thinking."
  },
  "achievementQuantification": [
    {
      "original": "Original unquantified bullet point from resume.",
      "issue": "What makes it weak (e.g., missing metrics, lack of scale).",
      "impact": "Why recruiters or hiring managers ignore it.",
      "solution": "How to fix it by introducing a metric (percentage, revenue, latency).",
      "improved": "Rewritten professional bullet with quantified metrics."
    }
  ],
  "careerStory": {
    "progression": "Feedback on job title and responsibility progression.",
    "consistency": "Gaps, tenure stability, and consistency.",
    "growth": "Clear signs of technical or professional growth.",
    "promotion": "Any direct promotions or expanded responsibilities.",
    "learningCurve": "Adaptability and rapid learning.",
    "narrative": "Cohesive career narrative summary."
  },
  "resumeDesign": {
    "whitespace": "Feedback on white space usage.",
    "spacing": "Feedback on padding and margins.",
    "margins": "Feedback on outer margins.",
    "fonts": "Feedback on typography choices.",
    "bulletPoints": "Feedback on bullet structure.",
    "alignment": "Feedback on text alignment.",
    "sectionOrder": "Feedback on order of sections.",
    "length": "Feedback on resume length.",
    "readability": "Feedback on general readability.",
    "accessibility": "Feedback on contrast and screen-reader accessibility."
  },
  "competitivePositioning": {
    "percentile": "Top 10% / Top 25% / Top 50% / Bottom 50%",
    "reasons": ["Reason 1", "Reason 2"]
  },
  "bulletPointReview": [
    {
      "original": "Current resume bullet point to review.",
      "soWhat": "Why the recruiter won't care about this in its current form.",
      "rewrite": "Complete STAR-formatted rewrite: Strong Action Verb + Action taken + Quantified Metric + Business Impact + ATS Keywords."
    }
  ],
  "jdMatch": {
    "skillMatchPct": 75,
    "experienceMatchPct": 80,
    "educationMatchPct": 90,
    "projectMatchPct": 70,
    "cultureMatchPct": 85,
    "overallMatchPct": 80,
    "skillsMatchingJd": ["Skill A", "Skill B"],
    "skillsMissing": ["Skill C", "Skill D"],
    "projectsToEmphasize": ["Emphasize project X because it shows tech Y"],
    "experienceToReorder": ["Reorder role A above B to highlight experience Z"],
    "sectionsToRewrite": ["Rewrite summary to include JD keyword W"]
  },
  "lists": {
    "top20Keywords": ["Keyword 1", "Keyword 2"],
    "actionVerbs": ["Verb 1", "Verb 2"],
    "quantifiedBulletExamples": ["Example 1", "Example 2"],
    "starBulletExamples": ["Example 1", "Example 2"],
    "interviewQuestions": ["Question 1", "Question 2"],
    "technicalQuestions": ["Question 1", "Question 2"],
    "hrQuestions": ["Question 1", "Question 2"],
    "behavioralQuestions": ["Question 1", "Question 2"]
  },
  "scorecard": {
    "ats": 85,
    "recruiter": 80,
    "hiringManager": 75,
    "projects": 80,
    "experience": 78,
    "skills": 82,
    "education": 90,
    "grammar": 95,
    "formatting": 80,
    "keywords": 85,
    "overall": 83
  },
  "executiveSummary": {
    "summary": "1-2 sentence executive overview.",
    "biggestStrength": "Description of the absolute strongest asset.",
    "biggestWeakness": "Description of the biggest gap.",
    "redFlags": ["Any gaps, formatting issues, or warning signs"],
    "hiddenAdvantages": "Value-adds that set the candidate apart.",
    "salaryPositioning": "Expected salary positioning based on market standard.",
    "companiesToTarget": ["Target Company 1", "Target Company 2"],
    "finalRecommendation": "Overall strategic recommendation on how to approach job applications.",
    "fiveStrategicImprovements": ["Actionable step 1", "Actionable step 2", "Actionable step 3", "Actionable step 4", "Actionable step 5"]
  },
  "rewrittenResume": {
    "content": "Fully rewritten resume in clean markdown, structured perfectly. Use standard single-column sections (Summary, Skills, Experience, Projects, Education, Certifications). Include the quantified improvements and STAR bullet rewrites directly here. Never invent information or change facts; only optimize phrasing, verbs, and keywords."
  }
}
`;

    if (fileBase64 && fileMimeType) {
      contents.push({
        inlineData: {
          mimeType: fileMimeType,
          data: fileBase64,
        },
      });
    }

    if (resumeText) {
      contents.push({
        text: `Here is the plain text of the resume:\n"""\n${resumeText}\n"""`,
      });
    }

    contents.push({
      text: contextPrompt,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    let jsonText = response.text || "";
    // Clean up any potential markdown wrapper just in case
    jsonText = jsonText.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.substring(7);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.substring(0, jsonText.length - 3);
    }
    jsonText = jsonText.trim();

    const analysisResult = JSON.parse(jsonText);
    res.json(analysisResult);
  } catch (error: any) {
    console.error("Resume Analysis Error:", error);
    res.status(500).json({ error: error.message || "An error occurred during analysis." });
  }
});

// Vite middleware and routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
