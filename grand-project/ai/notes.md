# Resume Tailor – Workflow Notes

- This workflow uses the Gemini 1.5 Flash model via Google Generative Language API.
- The API key must be set in the HTTP Request node in n8n.
- The webhook expects a POST request with JSON body containing: name, email, jobTitle, resume, jobDesc.
- The workflow formats a prompt, sends it to Gemini, and returns the generated resume in the `tailored_resume` field.
- Ensure the webhook path and method match your Next.js backend integration.
- The output is plain text, formatted for easy parsing and display in the frontend.
- For best results, keep the input resume and job description concise and relevant. 