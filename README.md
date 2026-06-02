<div align="center">

<br/>

# 🌟 GLOBAL TALENTS
### AI-Powered Unified Talent Platform

*Connecting Talent. Enabling Growth. Going Global.*

<br/>

![Version](https://img.shields.io/badge/version-1.0.0-6366f1?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-FB015B?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Status](https://img.shields.io/badge/status-Live-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)

<br/>

> **A full-stack AI-powered platform unifying global talent acquisition, skill-based learning, and professional networking — built with React, Node.js, Express, and JWT authentication.**

<br/>

[🚀 Live Demo](#-deployment) · [📡 API Docs](#-api-reference) · [⚙️ Setup](#-quick-start) · [🤖 AI Engine](#-ai-matching-engine)

<br/>

---

</div>

## 📌 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [How the Backend Works](#-how-the-backend-works)
- [AI Matching Engine](#-ai-matching-engine)
- [API Reference](#-api-reference)
- [Deployment Guide](#-deployment-guide)
- [Research Foundation](#-research-foundation)
- [Team](#-team)

---

## 🎯 Overview

**Global Talents** is a unified, AI-driven platform designed to bridge the gap between job seekers, employers, educators, and consultants across the globe. Built during a 6-week internship at **Innobytes (Erfinden Technologies Pvt. Ltd.)**, this platform addresses the fragmented nature of today's talent ecosystem.

The platform intelligently matches candidates to jobs and courses using a **skill-overlap scoring algorithm**, provides **role-based personalized dashboards**, maintains a **dynamic trust score system**, and includes an **AI-powered chatbot assistant** — all in a single, beautifully designed web application.

---

## ❗ Problem Statement

Today's talent landscape is deeply fragmented:

```
❌  Job seekers use LinkedIn for jobs, Coursera for learning, Zoom for networking
❌  No single platform unifies talent acquisition + upskilling + verification
❌  Employers struggle to verify candidate credentials and skills
❌  No AI-driven matching between skill gaps and learning opportunities
❌  Global opportunities are inaccessible to talent in developing markets
```

**Global Talents solves this by providing:**

```
✅  One platform for jobs, courses, events, networking, and mentorship
✅  AI engine that matches skills to opportunities in real-time
✅  Trust Score system for verified, credible profiles
✅  Role-based dashboards for 4 distinct user types
✅  Smart chatbot for 24/7 platform navigation
```

---

## ✨ Features

### 🤖 AI Matching Engine
- Skill-overlap algorithm that scores every job and course against your profile
- Jobs sorted by match percentage — highest first
- Skill Gap Analysis showing exactly which skills to learn next
- Real-time re-scoring as your profile updates

### 🔐 Secure Authentication
- JWT (JSON Web Token) based stateless authentication
- bcryptjs password hashing with salt rounds
- Role-based access control (RBAC) — 4 distinct roles
- Token expiry and refresh mechanism

### 📊 Role-Based Dashboards

| Role | Dashboard Features |
|------|-------------------|
| 🎯 **Candidate** | AI job matches, applied jobs, enrolled courses, trust score, profile views |
| 🏢 **Corporate** | Job listings, applicant tracking, talent pool, post new jobs |
| 👩‍🏫 **Educator** | Course management, student enrollments, event participation |
| 💼 **Consultant** | Job browsing, event discovery, network connections |

### 💬 AI Chatbot Assistant
- Keyword-intent detection for 9+ conversation categories
- Context-aware responses about jobs, courses, events, trust score
- Platform navigation guidance
- Salary insights and market data

### 🛡️ Trust Score System
- Dynamic multi-factor trust scoring (0–100)
- KYC verification status
- Employer rating integration
- Platform activity scoring
- Certification verification tracking

### 🌐 Events & Networking
- Global tech summits and conferences
- Hackathons with prize pools
- Campus hiring fairs
- International talent exchange programs
- One-click event registration

---

## 🛠️ Tech Stack

```
┌────────────────────────────────────────────────────────────┐
│                       FRONTEND                             │
│              React 18 (via CDN, no build step)             │
│           Tailwind-inspired Custom CSS • Animations        │
│         Responsive Dark Theme • Role-based UI              │
└───────────────────────┬────────────────────────────────────┘
                        │  HTTP REST API calls (fetch)
                        │  Authorization: Bearer <JWT>
┌───────────────────────▼────────────────────────────────────┐
│                       BACKEND                              │
│                 Node.js + Express.js                       │
│         bcryptjs • jsonwebtoken • cors • dotenv            │
│              AI Matching Engine (custom)                   │
└───────────────────────┬────────────────────────────────────┘
                        │
┌───────────────────────▼────────────────────────────────────┐
│                      DATABASE                              │
│              In-Memory JavaScript Object                   │
│     (Demo) → Easily upgradeable to MongoDB/PostgreSQL      │
│    Collections: users • jobs • courses • events            │
│                applications • enrollments                  │
└────────────────────────────────────────────────────────────┘
```

| Layer | Technology | Why Chosen |
|-------|-----------|-----------|
| Frontend | React 18 (CDN) | No build step, instant setup, component-based |
| Styling | Custom CSS | Full control, luxury dark theme |
| Backend | Node.js + Express | Fast, lightweight, JavaScript everywhere |
| Auth | JWT + bcryptjs | Stateless, secure, industry standard |
| Database | In-Memory JS | Zero setup, perfect for demo/POC |
| Babel | Standalone (CDN) | JSX compilation in browser |

---

## 🏗️ System Architecture

### Request-Response Flow

```
┌─────────────┐     1. User fills form      ┌──────────────────┐
│   Browser   │ ──────────────────────────► │   Express Server  │
│  React SPA  │                             │   (server.js)     │
│ index.html  │ ◄────────────────────────── │   Port 3000       │
└─────────────┘     6. JSON response sent   └────────┬─────────┘
                                                     │
                    2. Route matched                 │
                    (/api/auth/register)             │
                                            ┌────────▼─────────┐
                                            │   Middleware      │
                                            │ authenticateToken │
                                            │ (JWT verified)    │
                                            └────────┬─────────┘
                                                     │
                                            3. Business Logic
                                            ┌────────▼─────────┐
                                            │   Route Handler   │
                                            │  bcrypt hash pw   │
                                            │  JWT sign token   │
                                            │  AI match score   │
                                            └────────┬─────────┘
                                                     │
                                            4. Read/Write data
                                            ┌────────▼─────────┐
                                            │  In-Memory db{}   │
                                            │  users[]          │
                                            │  jobs[]           │
                                            │  applications[]   │
                                            └────────┬─────────┘
                                                     │
                                            5. Respond with JSON
```

### Authentication Flow

```
User enters email + password
          │
          ▼
POST /api/auth/login
          │
          ▼
bcrypt.compareSync(password, hashedPassword)
          │
     ✅ Match?
          │
          ▼
jwt.sign({ id, role }, SECRET, { expiresIn: '24h' })
          │
          ▼
Token sent to browser → stored in localStorage
          │
          ▼
Every future request adds: Authorization: Bearer <token>
          │
          ▼
Middleware: jwt.verify(token, SECRET) → req.user = decoded
          │
          ▼
Route handler accesses req.user.id, req.user.role
```

---

## 📁 Project Structure

```
global-talents/
│
├── 📄 server.js              # Complete backend — all routes + middleware
│   ├── In-Memory Database    # db{} object with seed data
│   ├── Middleware            # authenticateToken()
│   ├── AI Engine             # calculateMatchScore()
│   ├── Auth Routes           # /api/auth/register, login, me
│   ├── Jobs Routes           # /api/jobs — GET, POST, apply
│   ├── Courses Routes        # /api/courses — GET, enroll
│   ├── Events Routes         # /api/events — GET
│   ├── AI Match Route        # /api/ai/matches
│   ├── Chatbot Route         # /api/chatbot
│   ├── Dashboard Route       # /api/dashboard
│   └── Talent Pool Route     # /api/talent
│
├── 📄 package.json           # Dependencies
├── 📄 .env                   # Environment variables
│
└── 📁 public/
    └── 📄 index.html         # Complete React SPA frontend
        ├── LandingPage       # Hero + features + stats
        ├── AuthPage          # Login + Register forms
        ├── Sidebar           # Role-based navigation
        ├── Dashboard         # Stats + top match
        ├── AIMatch           # Job/course matches + skill gaps
        ├── Jobs              # Browse + apply + post jobs
        ├── Courses           # Browse + enroll
        ├── Events            # Register for events
        ├── Chatbot           # AI assistant
        └── TrustScore        # Score breakdown + tips
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed — [nodejs.org](https://nodejs.org)
- Any terminal (WSL, PowerShell, Mac Terminal)

### Step 1 — Create Project Folder

```bash
# Windows (WSL or PowerShell)
cd C:\Users\YourName\Desktop
mkdir global-talents
cd global-talents
```

### Step 2 — Install Dependencies

```bash
npm init -y
npm install express bcryptjs jsonwebtoken cors
```

### Step 3 — Add Project Files

Your folder should look like this:
```
global-talents/
├── node_modules/     ← created by npm install
├── public/
│   └── index.html    ← paste frontend code here
├── package.json      ← created by npm init
└── server.js         ← paste backend code here
```

### Step 4 — Start the Server

```bash
node server.js
```

✅ You should see:
```
🌟 Global Talents Platform running on http://localhost:3000
Demo accounts:
  Candidate:  priya@email.com / pass123
  Corporate:  hr@techcorp.com / pass123
  Educator:   meera@edu.com   / pass123
  Consultant: alex@consult.com / pass123
```

### Step 5 — Open in Browser

```
http://localhost:3000
```

> ⚠️ Keep the terminal open while using the app — closing it stops the server.

---

### Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 🎯 Candidate | priya@email.com | pass123 | Jobs, Courses, AI Match, Chatbot, Trust Score |
| 🏢 Corporate | hr@techcorp.com | pass123 | Job Management, Talent Pool, Post Jobs |
| 👩‍🏫 Educator | meera@edu.com | pass123 | Courses, Events, Dashboard |
| 💼 Consultant | alex@consult.com | pass123 | Jobs, Events, Dashboard |

---

## ⚙️ How the Backend Works

### 1. Server Setup

```javascript
const express = require('express');
const app = express();

app.use(cors());            // allows browser to call API
app.use(express.json());    // parses JSON request bodies
app.use(express.static('public'));  // serves index.html
```

### 2. JWT Authentication — Step by Step

```javascript
// STEP 1: User logs in → server creates a token
const token = jwt.sign(
  { id: user.id, role: user.role },  // payload (data inside token)
  'secret-key',                       // secret to sign with
  { expiresIn: '24h' }               // token expires in 24 hours
);
// Token looks like: eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MX0.abc123

// STEP 2: Browser stores it
localStorage.setItem('token', token);

// STEP 3: Every request sends it in header
fetch('/api/jobs', {
  headers: { Authorization: `Bearer ${token}` }
});

// STEP 4: Middleware verifies it
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  req.user = jwt.verify(token, 'secret-key'); // decoded: { id, role }
  next();
}
```

### 3. Password Security

```javascript
// Registration — hash before saving
const hashedPassword = bcrypt.hashSync('pass123', 8);
// Stored: "$2a$08$xK9mP..." (60 char hash, impossible to reverse)

// Login — compare safely
const isMatch = bcrypt.compareSync('pass123', hashedPassword); // true
```

### 4. In-Memory Database

```javascript
const db = {
  users: [{ id: 1, name: 'Priya', role: 'candidate', ... }],
  jobs:  [{ id: 1, title: 'Full Stack Developer', ... }],
  courses: [...],
  events: [...],
  applications: [],   // grows as users apply
  enrollments: []     // grows as users enroll
};
// Data lives in RAM — resets when server restarts
// Easy to swap with MongoDB for production
```

---

## 🤖 AI Matching Engine

The core intelligence of the platform — a **skill-overlap scoring algorithm** that ranks every job and course based on how well a candidate's skills match the requirements.

### Algorithm

```javascript
function calculateMatchScore(userSkills, requiredSkills) {

  // Step 1: Convert user skills to a Set for O(1) lookup
  const userSet = new Set(userSkills.map(s => s.toLowerCase()));

  // Step 2: Count how many required skills the user has
  const matched = requiredSkills.filter(
    skill => userSet.has(skill.toLowerCase())
  ).length;

  // Step 3: Calculate base percentage
  const baseScore = Math.round((matched / requiredSkills.length) * 100);

  // Step 4: Add small bonus for partial matches
  const bonus = matched > 0 ? Math.floor(Math.random() * 10) : 0;

  // Step 5: Cap at 99% (100% would mean perfect, never show that)
  return Math.min(99, baseScore + bonus);
}
```

### Example in Action

```
Candidate Skills:  ['React', 'Node.js', 'Python', 'Machine Learning']

Job 1: AI/ML Engineer
  Required: ['Python', 'Machine Learning', 'TensorFlow']
  Matched:  ['Python', 'Machine Learning'] → 2/3 = 66% + bonus = 72% ✅

Job 2: Full Stack Developer
  Required: ['React', 'Node.js', 'MongoDB']
  Matched:  ['React', 'Node.js'] → 2/3 = 66% + bonus = 70% ✅

Job 3: DevOps Engineer
  Required: ['Docker', 'Kubernetes', 'AWS', 'CI/CD']
  Matched:  [] → 0/4 = 0% ❌

Result: Jobs sorted by score → AI/ML first, Full Stack second, DevOps last
```

### Skill Gap Analysis

```javascript
// Find skills in demand that the user doesn't have
const allRequiredSkills = [...new Set(db.jobs.flatMap(j => j.skills))];
const userSkillSet = new Set(userSkills.map(s => s.toLowerCase()));

const skillGaps = allRequiredSkills
  .filter(skill => !userSkillSet.has(skill.toLowerCase()))
  .slice(0, 5);

// Output: ['MongoDB', 'TensorFlow', 'Docker', 'SQL', 'TypeScript']
// → These become course recommendations!
```

---

## 📡 API Reference

### Base URL
```
http://localhost:3000/api
```

### Headers (for protected routes)
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

### 🔐 Authentication

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/auth/register` | ❌ | Create new account |
| POST | `/auth/login` | ❌ | Login |
| GET | `/auth/me` | ✅ | Get current user |
| PATCH | `/auth/profile` | ✅ | Update profile |

**Register Request:**
```json
POST /api/auth/register
{
  "name": "Priya Sharma",
  "email": "priya@email.com",
  "password": "pass123",
  "role": "candidate",
  "skills": ["React", "Python", "Node.js"],
  "location": "Mumbai"
}
```
**Register Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "name": "Priya Sharma",
    "role": "candidate",
    "trustScore": 74,
    "verified": false
  },
  "message": "Registration successful!"
}
```

---

### 💼 Jobs

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/jobs` | ❌ | All jobs with AI match scores |
| POST | `/jobs` | ✅ Corporate | Post a new job |
| POST | `/jobs/apply/:id` | ✅ | Apply to a job |

**Jobs Response (candidate view):**
```json
[
  {
    "id": 2,
    "title": "AI/ML Engineer",
    "company": "DataMinds",
    "location": "Hyderabad",
    "salary": "₹10-16 LPA",
    "type": "Full-time",
    "skills": ["Python", "Machine Learning", "TensorFlow"],
    "matchScore": 72,
    "applied": false
  }
]
```

---

### 📚 Courses

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/courses` | ❌ | All courses with match scores |
| POST | `/courses/enroll/:id` | ✅ | Enroll in a course |

---

### 🌐 Events

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/events` | ❌ | All upcoming events |

---

### 🤖 AI Engine

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/ai/matches` | ✅ | Top job + course matches + skill gaps |

**AI Matches Response:**
```json
{
  "jobMatches": [
    { "title": "AI/ML Engineer", "matchScore": 72, "salary": "₹10-16 LPA" }
  ],
  "courseMatches": [
    { "title": "Machine Learning A-Z", "matchScore": 85, "rating": 4.9 }
  ],
  "skillGaps": ["MongoDB", "TensorFlow", "Docker", "TypeScript", "SQL"],
  "trustScore": 87
}
```

---

### 💬 Chatbot

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | `/chatbot` | ✅ | Send message, get AI response |

```json
POST /api/chatbot
{ "message": "find me a job" }

Response:
{
  "response": "🎯 Based on your profile, I found 8 job opportunities...",
  "timestamp": "2025-07-01T10:30:00.000Z"
}
```

---

### 📊 Dashboard

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| GET | `/dashboard` | ✅ | Role-based stats |
| GET | `/talent` | ✅ Corporate | View all candidates |

---

### ✅ Health Check

```
GET /api/health
→ { "status": "OK", "platform": "Global Talents", "version": "1.0.0" }
```

---

## 🚀 Deployment Guide

### Step 1 — Prepare Files

Create `.gitignore`:
```
node_modules/
.env
*.log
```

Update `package.json`:
```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### Step 2 — Push to GitHub

```bash
git init
git add .
git commit -m "Global Talents Platform — Internship Project 2025"
git branch -M main
git remote add origin https://github.com/yourusername/global-talents.git
git push -u origin main
```

### Step 3 — Deploy on Render (Free, No Credit Card)

```
1. Go to https://render.com
2. Sign up with your GitHub account
3. Click "New +" → "Web Service"
4. Select your "global-talents" repository
5. Configure settings:
   Name:           global-talents-platform
   Environment:    Node
   Build Command:  npm install
   Start Command:  node server.js
   Instance Type:  Free

6. Add Environment Variables:
   JWT_SECRET = global-talents-secret-2025
   NODE_ENV   = production
   PORT       = 3000

7. Click "Create Web Service"
8. Wait 3–5 minutes
9. Your app is live at: https://global-talents-platform.onrender.com
```

> 💡 Render free tier may sleep after 15 minutes of inactivity — first load takes ~30 seconds.

### Step 4 — Share Your Live Link

```
https://global-talents-platform.onrender.com
```

Test all demo accounts still work on the live URL!

---

## 📄 Research Foundation

This platform is backed by a research paper analyzing the global talent gap and proposing a unified digital solution.

**Key Research Findings:**
- 40% of employers globally report difficulty finding skilled candidates *(LinkedIn Global Talent Trends, 2024)*
- Talent platforms with AI matching show 3x better placement rates
- Multi-role platforms reduce time-to-hire by 35%
- Trust verification increases employer confidence by 60%

**Platform Modules (from Research Paper):**
1. Multi-Role Registration & KYC Verification
2. AI-Driven Job & Course Matching Engine
3. Trust Score & Credibility System
4. Role-Based Personalized Dashboards
5. Global Events & Networking Hub
6. AI Chatbot Navigation Assistant

---

## 👥 Team

**Project Title**: Global Talents — AI-Powered Unified Talent Platform
**Institution**: MIT School of Computing, MIT ADT University, Pune
**Organization**: Innobytes — Erfinden Technologies Pvt. Ltd.
**Duration**: Summer Internship 2025

| Name | Enrollment No. | Role |
|------|---------------|------|
| Priyadarshini Wani | ADT23SOCB0804 | Backend Developer & Project Lead |
| Ritisha Bobde | ADT23SOCB0855 | Frontend Developer |
| Saanvi Dhote | ADT23SOCB0905 | UI/UX Designer & Documentation |

---

## 📊 Platform Data (Demo Seed)

| Entity | Count | Details |
|--------|-------|---------|
| 👤 Users | 4 | Candidate, Corporate, Educator, Consultant |
| 💼 Jobs | 8 | Full-time, Freelance across multiple domains |
| 📚 Courses | 6 | Development, AI/ML, DevOps, Management |
| 🌐 Events | 5 | Summits, Hackathons, Fairs, Webinars |
| 🛡️ Trust Score | Dynamic | 60–99 range, multi-factor |
| 🤖 Chatbot Topics | 9+ | Jobs, Courses, Events, Trust, Salary, AI, Freelance |

---

<div align="center">

<br/>

**Built with ❤️ at MIT ADT University, Pune**

*"Connecting talent across borders, one skill at a time."*

<br/>

⭐ **Star this repo if you found it helpful!**

<br/>

![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-339933?style=flat-square&logo=node.js)
![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)
![MIT ADT University](https://img.shields.io/badge/MIT%20ADT-University-6366f1?style=flat-square)
![Internship 2025](https://img.shields.io/badge/Internship-2025-orange?style=flat-square)

</div>
