# AdmitWise — College Admission Prediction and Recommendation System

[![Project Status: Completed](https://img.shields.io/badge/Status-Completed-success.svg)](#)
[![Degree Project: BSc IT](https://img.shields.io/badge/Project-BSc%20Information%20Technology-blue.svg)](#)
[![Tests Passing: 12/12](https://img.shields.io/badge/Tests-12%20Passing-brightgreen.svg)](#)
[![Stack: MERN](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20Express%20%7C%20MongoDB-informational.svg)](#)

> **"Predict. Explore. Achieve."**  
> An explainable, rule-based college admission prediction, multi-college comparison, and recommendation platform tailored for students aspiring to join higher education institutions across Mumbai and Maharashtra.

---

## 1. Project Overview & Identity
- **Website Name:** AdmitWise
- **Project Title:** College Admission Prediction and Recommendation System
- **Academic Context:** Final Year BSc Information Technology (BSc IT) Capstone Project, viva examination, and portfolio submission.
- **Geographic Scope:** Mumbai, Navi Mumbai, Thane, and Pune (University of Mumbai, Autonomous colleges, and Maharashtra State CET Cell institutions).
- **Primary Programs Supported:**
  - B.Sc. Information Technology (B.Sc. IT)
  - B.Sc. Computer Science (B.Sc. CS)
  - B.Tech. Computer Engineering (B.Tech CE)
  - B.Tech. Artificial Intelligence & Data Science (B.Tech AI&DS)
  - Bachelor of Management Studies (BMS)
  - Bachelor of Commerce (B.Com)

---

## 2. Technology Stack

### Frontend:
- **React.js 18** (Vite build system for rapid HMR)
- **React Router DOM v6** (Client-side routing with nested protected route guards)
- **Recharts** (Interactive cutoff benchmarks and distribution charts)
- **Lucide React** (Clean, modern UI icons)
- **Custom CSS3 Design System** (Blue & white palette, dark navy text `#0f172a`, responsive grid, card and modal patterns)

### Backend:
- **Node.js** (v24.x LTS)
- **Express.js 4** (Modular REST API architecture)
- **MongoDB & Mongoose 8** (Document database with schema validation and compound unique indexes)
- **Bcrypt.js** (Salted password hashing with 10 salt rounds)
- **JSON Web Tokens (JWT) & HTTP-Only Cookies** (Secure session persistence)
- **PDFKit** (Server-side downloadable PDF counseling report generator)
- **Helmet & Express Rate Limit** (Security headers and brute-force protection)

---

## 3. Key Features

1. **Rule-Based Admission Predictor:**
   - Evaluates mandatory eligibility criteria first (e.g. compulsory Mathematics subject in HSC for B.Sc. IT under Mumbai University circulars).
   - Compares candidate marks against historical cutoff archives by reservation category (Open, OBC, SC, ST, EWS, TFWS) and admission rounds.
   - Categorizes outcomes into: **High Chance**, **Moderate Chance**, **Low Chance**, **Insufficient Data**, and **Not Eligible**.
   - Transparently explains the exact score difference and data provenance.
2. **Downloadable PDF Reports:**
   - Server-streamed PDF counseling reports with AdmitWise branding, applicant scores, comparison tables, and disclaimers.
3. **Multi-College Comparison Matrix:**
   - Compare up to 4 colleges side-by-side evaluating fees, NAAC grades, affiliations, and cutoffs.
4. **Student Portal:**
   - Personalized dashboard, academic profile editor with completion progress bar, saved colleges shortlist, and prediction history.
5. **Administrator Panel:**
   - Dashboard with real-time statistics and Recharts distributions.
   - Full CRUD operations for Colleges, Degree Programs, and Historical Cutoffs with duplicate prevention.
   - Student account directory with activation/deactivation controls.
6. **Admission Guidance:**
   - Explanations of merit lists, CAP rounds, document verification checklists, and official state links.

---

## 4. Directory Structure

```
AdmitWise/
|-- client/                         # React Frontend (Vite)
|   |-- public/                     # Static assets & SVG favicon
|   |-- src/
|   |   |-- components/             # Common UI components (Navbar, Footer, Cards, Badges)
|   |   |-- context/                # AuthContext & CompareContext
|   |   |-- pages/                  # Public & Student views (Home, Predictor, Results, Catalog)
|   |   |   |-- admin/              # Administrator views (Colleges, Courses, Cutoffs, Users)
|   |   |-- services/               # REST API client wrapper (api.js)
|   |   |-- styles/                 # Global CSS design system (index.css)
|   |   |-- App.jsx                 # Route declarations & provider nesting
|   |   |-- main.jsx                # DOM entry point
|   |-- package.json
|   |-- vite.config.js
|   |-- .env.example
|
|-- server/                         # Express REST API Backend
|   |-- scripts/
|   |   |-- seed.js                 # Database seed script (15 colleges, 6 courses, 35 cutoffs)
|   |   |-- create-admin.js         # Secure CLI script for first admin creation
|   |-- src/
|   |   |-- config/                 # MongoDB database connection (db.js)
|   |   |-- controllers/            # Request handlers (auth, colleges, predictions, admin)
|   |   |-- middleware/             # Auth, rate limiting, and error handling
|   |   |-- models/                 # Mongoose schemas (User, College, Course, Cutoff, Prediction)
|   |   |-- routes/                 # Express route definitions
|   |   |-- services/               # Rule-based predictionEngine.js & pdfService.js
|   |   |-- app.js                  # Express middleware configuration
|   |   |-- server.js               # Application bootstrapper
|   |-- tests/                      # Automated unit & integration tests
|   |-- package.json
|   |-- .env.example
|
|-- docs/                           # BSc IT Project Submission Documentation
|   |-- requirements.md             # Abstract, scope, functional & non-functional requirements
|   |-- database-design.md          # ER diagram, data dictionary, indexes
|   |-- api-documentation.md        # Comprehensive REST API reference
|   |-- testing.md                  # QA report and test cases matrix
|   |-- viva-guide.md               # Viva preparation and algorithm defense guide
|
|-- .gitignore
|-- README.md                       # Project documentation
|-- package.json                    # Root task runner scripts
```

---

## 5. Prerequisites

Before running the application, ensure you have:
1. **Node.js** (v18.x or v20.x or v24.x LTS recommended)
2. **npm** (v9.x or later)
3. **MongoDB** installed and running locally on port `27017` (or a MongoDB Atlas connection URI)
4. **Git** for version control

---

## 6. Installation & Quick Start

### Step 1: Clone the Repository
```bash
git clone https://github.com/<your-username>/admitwise-college-predictor.git
cd admitwise-college-predictor
```

### Step 2: Install Dependencies
Run from the project root:
```bash
npm run install-all
```
*(Or install manually: `npm install`, `cd server && npm install`, `cd ../client && npm install`)*

---

## 7. Environment Configuration

### Backend Configuration (`server/.env`):
Create `server/.env` (a template is available at `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/admitwise_db
JWT_SECRET=admitwise_dev_jwt_secret_key_bsc_it_project_2026_super_safe
JWT_EXPIRES_IN=7d
COOKIE_SECURE=false
CLIENT_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

### Frontend Configuration (`client/.env`):
Create `client/.env` (a template is available at `client/.env.example`):
```env
VITE_API_URL=/api
```
*(Vite proxies `/api` requests to `http://localhost:5000` automatically).*

---

## 8. Database Seeding & Admin Setup

### Seed Initial Database Records:
AdmitWise provides an automated development seed script with **15 verified colleges** across Mumbai, Navi Mumbai, Thane, and Pune, **6 degree programs**, **35 historical cutoffs**, and admission guidance articles:
```bash
npm run seed
# or: cd server && npm run seed
```

### Pre-Configured Demo Accounts:
The seed script automatically provisions two demonstration accounts for evaluation:

| Account Type | Email | Password | Role |
|---|---|---|---|
| **Demo Student** | `student@admitwise.edu` | `Student@123password` | Student (`student`) |
| **Demo Administrator** | `admin@admitwise.edu` | `Admin@123password` | Admin (`admin`) |

*(On the login screen, clicking **Demo Student** or **Demo Admin** automatically pre-fills these credentials for quick evaluation).*

### Creating Custom Administrators (CLI):
To prevent hardcoded credentials in production, create new administrator accounts securely via the CLI script:
```bash
npm run create-admin
# or: cd server && node scripts/create-admin.js
```
The script prompts for the administrator's name, email, and password, securely hashing the credentials directly into MongoDB.

---

## 9. Running the Application

### Option A: Running in Two Separate Terminals

**Terminal 1 (Backend Server):**
```bash
npm run server
# Runs Express on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run client
# Runs Vite React on http://localhost:5173
```

Now open **http://localhost:5173** in your web browser.

---

## 10. Automated Testing

AdmitWise includes automated integration and unit test suites:
```bash
npm run test:server
# or: cd server && npm test
```

### Actual Test Execution Output:
```
▶ API Integration Tests
  ✔ GET /api/health returns 200 OK (47.8ms)
  ✔ GET /api/courses returns seeded courses (68.2ms)
  ✔ GET /api/colleges returns colleges list and pagination (49.5ms)
  ✔ POST /api/auth/login succeeds for seeded student (142.9ms)
  ✔ POST /api/auth/login rejects invalid credentials (113.5ms)
  ✔ POST /api/auth/register rejects duplicate email (8.5ms)
  ✔ POST /api/predictions executes rule-based prediction for candidate (60.7ms)
✔ API Integration Tests (533.6ms)

▶ PredictionEngine - Eligibility Checks
  ✔ Fails eligibility when HSC percentage is below required minimum (1.1ms)
  ✔ Fails eligibility when Mathematics is missing for B.Sc. IT (0.3ms)
  ✔ Passes eligibility when all academic criteria are satisfied (0.2ms)
✔ PredictionEngine - Eligibility Checks (3.0ms)

ℹ tests 12
ℹ suites 0
ℹ pass 12
ℹ fail 0
```

---

## 11. Connecting to GitHub

To push this codebase to a GitHub repository:

1. Create a new repository named `admitwise-college-predictor` on [GitHub](https://github.com/new) (do not initialize with README or license, as they are already provided).
2. Connect your local git repository and push:
```bash
git add .
git commit -m "Initial commit: AdmitWise full-stack college admission predictor"
git branch -M main
git remote add origin https://github.com/<your-username>/admitwise-college-predictor.git
git push -u origin main
```

---

## 12. College Project Submission & Viva Documentation
Detailed academic documentation is provided inside the `docs/` folder:
- [docs/requirements.md](docs/requirements.md) — Problem statement, objectives, functional & non-functional requirements.
- [docs/database-design.md](docs/database-design.md) — Entity-relationship diagrams, schema structures, compound indexes.
- [docs/api-documentation.md](docs/api-documentation.md) — Complete REST API endpoint reference and payloads.
- [docs/testing.md](docs/testing.md) — Test cases, coverage matrix, and QA results.
- [docs/viva-guide.md](docs/viva-guide.md) — Viva examination questions, architectural defense, and algorithm explanations.

---

## 13. License & Disclaimer
This project is developed for educational and academic submission purposes for the Bachelor of Science in Information Technology (BSc IT). Admission cutoffs and recommendations are mathematical estimates based on published historical merit lists and do not constitute an official guarantee of admission.
