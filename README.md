# 🎯 TalentForge Pro

TalentForge Pro is a multi-agent AI resume review and Applicant Tracking System (ATS) optimization application. It parses, evaluates, scores, and rewrites resumes using advanced AI agents coordinated concurrently to minimize latency. It runs on local LLMs (Ollama) or external APIs (Google Gemini, OpenAI, Anthropic) and works completely locally or containerized via Docker.

---

## Key Features

1. **Multi-Agent Pipeline**:
   - **Parser Agent**: Extracts contact info, summary, experience, education, skills, projects, and certifications.
   - **ATS Agent**: Scans formatting risks, structural compliance, and generic clichés.
   - **Keyword Optimization Agent**: Compares resume text to a target job description and conducts a keyword gap assessment (checks exactly 15 missing words).
   - **Recruiter Review Agent**: Performs a FAANG-style rubric score review, lists strengths/weaknesses, interview screening questions, and hiring manager objections with preemptive answers.
   - **Resume Rewrite Agent**: Rebuilds descriptions using accomplishment-centric STAR (Situation/Task/Action/Result) formatting.
   - **Cover Letter Agent**: Tailors a formal cover letter matching your qualifications to the job description.

2. **Core Capabilities**:
   - **PDF, DOCX, and TXT Extraction**: Extracts text layouts cleanly.
   - **Export PDF/DOCX**: Download optimized rewritten resumes and cover letters in formatted layouts.
   - **Authentication & History**: Locally logs reviews and stores state securely in SQLite.
   - **Privacy First**: No third-party data tracking. Completely self-contained.

---

## Project Structure

```
resumegpt-pro/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI startup entry
│   │   ├── config.py            # Environment configurations reader
│   │   ├── db/                  # Session and SQLAlchemy models (User, AnalysisHistory)
│   │   ├── models/              # Pydantic schemas (resume, score, analysis)
│   │   ├── agents/              # The 6 pipeline agents
│   │   ├── services/            # LLM, file parsing, coordination, and docx/pdf exports
│   │   ├── api/                 # Auth and Resume router controllers
│   │   ├── prompts/             # System prompts for all agents
│   │   └── utils/               # Text, file, and security token utilities
│   ├── tests/                   # Backend unit tests
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/                     # Page views (Auth login/register, dashboard page)
│   ├── components/              # Results tabs, File uploader, and loading states
│   ├── hooks/                   # Custom file drag-drop hook
│   ├── store/                   # Zustand global store manager
│   ├── lib/                     # Typescript declarations and styling class merging
│   └── Dockerfile
├── docker-compose.yml           # Multi-service composition
└── README.md
```

---

## Quick Start (Docker Compose)

The easiest way to start the system is using Docker Compose. Make sure you have Docker installed.

1. **Clone or navigate** to the project directory:
   ```bash
   cd resumegpt-pro
   ```

2. **Boot the services**:
   ```bash
   docker-compose up --build
   ```

3. **Pull the model in Ollama** (if using Ollama as default local provider):
   - In a new terminal, download the default model:
     ```bash
     docker exec -it resumegpt-ollama ollama pull gemma3:4b
     ```
     *(Or pull other models such as `llama2` or `llama3` depending on your local machine capability).*

4. **Access the application**:
   - Open your browser to `http://localhost:3000` to access the Next.js frontend.
   - The backend Swagger documents are available at `http://localhost:8000/docs`.

---

## Manual Execution (Without Docker)

### 1. Backend Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy environment variables file and edit it:
   ```bash
   cp .env.example .env
   ```
5. Pull your local LLM in Ollama:
   ```bash
   ollama pull gemma3:4b
   ```
6. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 2. Frontend Setup
1. Navigate to the `frontend/` directory in a new terminal:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Access `http://localhost:3000`.

---

## Configuration Settings

You can customize LLMs, keys, and authorization timing inside `backend/.env`:

| Variable | Description | Default |
|---|---|---|
| `DEFAULT_LLM_PROVIDER` | Pick LLM provider: `ollama`, `openai`, `gemini`, or `anthropic` | `ollama` |
| `DATABASE_URL` | SQLite path database URL connection string | `sqlite:///./resumegpt.db` |
| `OLLAMA_BASE_URL` | Local port URL for running Ollama service | `http://localhost:11434` |
| `OLLAMA_MODEL` | Ollama model identifier | `gemma3:4b` |
| `OPENAI_API_KEY` | Optional OpenAI API token | *(Blank)* |
| `GOOGLE_API_KEY` | Optional Google Generative AI API token | *(Blank)* |
| `ANTHROPIC_API_KEY` | Optional Anthropic API token | *(Blank)* |
| `SECRET_KEY` | Key used to encode JWT authorization tokens | *(Secure Hex)* |

---

## Multi-Agent Review Process

When you upload a file, the application coordinates the execution of agents concurrently:

```
[Document Uploaded]
        │
        ├── ParserAgent  ──► Extract contact info & structure data sections
        ├── ATSAgent     ──► Evaluate format layout risk & generic clichés
        ├── RecruiterAgent ──► Score rubric (0-100) & screen questions & objections
        ├── KeywordAgent  ──► Cross-reference keywords and list 15 missing items
        ├── RewriterAgent ──► Translate experience statements to STAR accomplishments
        └── CoverLetterAgent ──► Draft tailored formal cover letter
```
All outputs are compiled into a single interactive report, cached locally in SQLite for history lookup, and exportable.
