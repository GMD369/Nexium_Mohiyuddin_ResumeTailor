# Resume Tailor – Product Requirements Document (PRD)

## Problem Statement
Job seekers often struggle to create tailored resumes that match specific job descriptions. Most use one-size-fits-all resumes, which reduces their chances of getting shortlisted.

## Goal
Build an AI-powered web application that helps users generate customized resumes based on their professional background and the job description they are applying for.

##Target User
- Fresh graduates
- Mid-level professionals
- Freelancers & remote workers
- Career switchers

## Authentication
- Magic link email login (via Supabase Auth)

## Key Features
- Email-based login with Supabase
- AI-generated resume tailoring using n8n 
- paste existing resume 
- Paste job description
- Get a tailored resume in seconds
- Save/download result
- Optional: Multiple versions saved in MongoDB

## AI Flow
- User pastes their resume and job description
- n8n workflow sends data to Gemini via HTTP Request
- AI rewrites resume tailored to the job
- Tailored resume sent back to frontend

## Tech Stack
| Category       | Tools                            |
|----------------|----------------------------------|
| Frontend       | Next.js 15, TailwindCSS, ShadCN  |
| Backend        | Supabase (Auth + Postgres), MongoDB Atlas |
| AI Integration | n8n workflow          |
| DevOps         | CI/CD via Vercel, GitHub         |

## User Flow (Step-by-Step)
1. User opens app and signs in with email
2. User uploads existing resume or pastes resume text
3. User pastes job description
4. Clicks "Generate Tailored Resume"
5. AI processes the request via n8n & OpenAI
6. Tailored resume is displayed to the user
7. User can copy, download, or save to account

## Metrics for Success
- Time to generate resume < 10 seconds
- Resume relevance rated 4+ stars by user
- 80%+ task completion rate by users