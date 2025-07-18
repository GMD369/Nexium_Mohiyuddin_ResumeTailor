"use client"
import { useState } from "react"

export default function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", jobTitle: "",
    resume: "", jobDesc: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted:", formData)
    // TODO: Send to backend
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6">
      <h2 className="text-2xl mb-6 font-bold">🎯 Resume Tailoring Form</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="p-3 bg-zinc-800 border border-zinc-700 rounded" />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="p-3 bg-zinc-800 border border-zinc-700 rounded" />
        <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} className="p-3 bg-zinc-800 border border-zinc-700 rounded" />
        <textarea name="resume" placeholder="Paste your Resume" value={formData.resume} onChange={handleChange} rows={6} className="p-3 bg-zinc-800 border border-zinc-700 rounded" />
        <textarea name="jobDesc" placeholder="Paste Job Description" value={formData.jobDesc} onChange={handleChange} rows={6} className="p-3 bg-zinc-800 border border-zinc-700 rounded" />
        <button type="submit" className="bg-teal-600 hover:bg-teal-500 p-3 rounded text-white">Submit</button>
      </form>
    </main>
  )
}
