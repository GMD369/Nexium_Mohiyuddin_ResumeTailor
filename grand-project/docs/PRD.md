# Resume Tailor – PRD

## Overview
Resume Tailor is an AI-powered web app that generates tailored resumes based on the user’s input and a specific job description. It uses AI (via n8n + Hugging Face/OpenAI) to craft content that aligns with job roles.

## Target Users
- Job seekers who want personalized resumes
- Freelancers or fresh graduates applying to different roles

## Features
- Magic link login (via Supabase)
- Input fields:
  - Name
  - Email
  - Experience
  - Skills
  - Job Title
  - Job Description (Paste from LinkedIn/Indeed)
- AI-generated tailored resume section
- Download / Copy / Edit options
- Resume history (optional)

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, ShadCN UI
- **Backend**: Supabase (Postgres), MongoDB Atlas
- **AI Automation**: n8n + OpenAI
- **Deployment**: Vercel (CI/CD from GitHub)


