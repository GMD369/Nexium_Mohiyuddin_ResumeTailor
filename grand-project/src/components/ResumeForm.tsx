"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faBriefcase, faFileAlt, faClipboardList, faSpinner, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoutButton from "@/components/logoutButton";

export default function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", jobTitle: "",
    resume: "", jobDesc: ""
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOutput("");

    const { data, error } = await supabase
      .from("resumes")
      .insert([formData]);

    if (error) {
      console.error("DB error:", error);
    } else {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      setOutput(result.output || "No output from AI.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-800 p-0 overflow-hidden">
        {/* Header Section */}
        <div className="flex justify-between items-center px-8 pt-8 pb-4 bg-zinc-950 border-b border-zinc-800">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <FontAwesomeIcon icon={faClipboardList} className="text-teal-400 text-2xl" />
            Resume Tailoring
          </h2>
          <LogoutButton />
        </div>
        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-0" />
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-8">
          <div className="flex gap-4">
            <div className="flex-1 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3">
              <FontAwesomeIcon icon={faUser} className="text-zinc-400" />
              <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="bg-transparent outline-none py-3 w-full text-base" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3">
              <FontAwesomeIcon icon={faEnvelope} className="text-zinc-400" />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="bg-transparent outline-none py-3 w-full text-base" />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3">
            <FontAwesomeIcon icon={faBriefcase} className="text-zinc-400" />
            <input type="text" name="jobTitle" placeholder="Job Title" value={formData.jobTitle} onChange={handleChange} className="bg-transparent outline-none py-3 w-full text-base" />
          </div>
          <div className="flex items-start gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3">
            <FontAwesomeIcon icon={faFileAlt} className="text-zinc-400 mt-3" />
            <textarea name="resume" placeholder="Paste your Resume" value={formData.resume} onChange={handleChange} rows={6} className="bg-transparent outline-none py-3 w-full text-base resize-none" />
          </div>
          <div className="flex items-start gap-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3">
            <FontAwesomeIcon icon={faClipboardList} className="text-zinc-400 mt-3" />
            <textarea name="jobDesc" placeholder="Paste Job Description" value={formData.jobDesc} onChange={handleChange} rows={6} className="bg-transparent outline-none py-3 w-full text-base resize-none" />
          </div>
          <button type="submit" disabled={loading} className={`bg-teal-600 hover:bg-teal-500 p-3 rounded-lg text-white font-semibold text-lg transition flex items-center justify-center gap-2 shadow ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="text-white" />
                Processing...
              </>
            ) : (
              <>Submit</>
            )}
          </button>
        </form>
        {/* Output Section */}
        {loading && (
          <div className="flex items-center gap-2 text-zinc-400 px-8 pb-4 text-base">
            <FontAwesomeIcon icon={faSpinner} spin className="text-teal-400" />
            Tailoring your resume, please wait...
          </div>
        )}
        {output && (
          <div className="px-8 pb-8">
            <div className="mt-8 bg-gradient-to-br from-zinc-800/90 to-zinc-900/80 p-6 rounded-2xl shadow border border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xl" />
                <h3 className="text-lg font-semibold">Tailored Resume:</h3>
              </div>
              <pre className="whitespace-pre-wrap text-zinc-100 text-base font-mono leading-relaxed">{output}</pre>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
