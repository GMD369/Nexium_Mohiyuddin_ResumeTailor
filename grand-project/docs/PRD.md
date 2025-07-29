# Resume Tailor – Product Requirements Document (PRD)

---

## Project Demo Video
[Loom Video Walkthrough](https://www.loom.com/share/abf6d565ac7043e8a518c684230faef2)

---

## 1. Problem Statement

Most job seekers use the same resume for every job application, which reduces their chances of getting noticed by recruiters. Every job has different requirements, and a generic resume often fails to highlight the most relevant skills and experiences. As a result, candidates miss out on opportunities simply because their resume is not tailored to the job description.

---

## 2. Project Goal

To build an easy-to-use, AI-powered web application that helps users instantly generate a customized, job-specific resume. The app should allow users to paste their existing resume and a job description, and then receive a professionally tailored resume optimized for that job.

---

## 3. Target Users

- Fresh graduates looking for their first job
- Mid-level professionals aiming for better opportunities
- Freelancers and remote workers applying to multiple jobs
- Career switchers who need to highlight relevant skills for a new field

---

## 4. Why This Solution?

- **Saves Time:** Instantly generates a tailored resume, saving hours of manual editing.
- **Increases Shortlisting Chances:** Uses AI to match resume content with job keywords, improving ATS (Applicant Tracking System) compatibility.
- **User-Friendly:** No technical skills required; just paste your resume and job description.
- **Secure:** No data is shared with third parties; user privacy is maintained.

---

## 5. Key Features

- **Magic Link Login:** Secure, passwordless authentication using Supabase Auth.
- **Paste Resume & Job Description:** Simple forms to input existing resume and job details.
- **AI Resume Tailoring:** Uses n8n workflow and Gemini AI to rewrite the resume for the target job.
- **Instant Results:** Tailored resume is generated in seconds.
- **Download as PDF:** Users can download the tailored resume as a clean, professional PDF.
- **Edit Before Download:** Users can review and edit the tailored resume before downloading.
- **Responsive UI:** Works on desktop and mobile.

---

## 6. Tech Stack

| Category       | Tools                                 |
|----------------|--------------------------------------|
| Frontend       | Next.js 15, TailwindCSS, ShadCN       |
| Backend        | Supabase (Auth + Postgres), MongoDB   |
| AI Integration | n8n workflow + Gemini AI              |
| DevOps         | Vercel (hosting), GitHub (CI/CD)      |

---

## 7. How It Works (User Flow)

1. **User opens the app** and logs in using their email (magic link).
2. **User pastes their existing resume** and the **job description** for the job they want.
3. **User clicks "Generate Tailored Resume".**
4. **AI (via n8n workflow)** processes the input, rewrites the resume to match the job description, and sends it back.
5. **User sees the tailored resume** on the right side of the screen, structured in clean paragraphs.
6. **User can edit the resume** directly in the browser if needed.
7. **User downloads the tailored resume as a PDF** or saves it to their account.

---

## 8. Why These Choices?

- **Next.js + TailwindCSS:** Fast, modern, and easy to style for a great user experience.
- **Supabase Auth:** Secure, easy-to-implement passwordless login.
- **n8n + Gemini AI:** Flexible, no-code/low-code automation for AI integration.
- **MongoDB:** (Optional) For saving multiple resume versions per user.
- **Vercel:** Simple, reliable deployment and hosting.

---

## 9. AI Flow (Technical)

- User input (resume + job description) is sent to the backend.
- Backend calls an n8n webhook.
- n8n workflow sends data to Gemini AI (or any LLM).
- AI rewrites the resume, focusing on job-relevant keywords, ATS optimization, and professional tone.
- n8n returns the tailored resume to the backend, which sends it to the frontend for display and download.

---

## 10. Future Improvements (Optional)

- Support for multiple languages.
- More advanced editing (drag-and-drop sections).
- Integration with job boards for one-click apply.
- Analytics dashboard for users to track job applications.


