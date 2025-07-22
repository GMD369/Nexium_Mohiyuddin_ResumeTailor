"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faBriefcase, faFileAlt, faClipboardList, faSpinner, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import LogoutButton from "@/components/logoutButton";
import { Toaster, toast } from "react-hot-toast";

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
    setOutput("");
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!formData.jobTitle.trim()) {
      toast.error("Job title is required.");
      return;
    }
    if (!formData.resume.trim()) {
      toast.error("Resume is required.");
      return;
    }
    if (!formData.jobDesc.trim()) {
      toast.error("Job description is required.");
      return;
    }
    setLoading(true);
    toast.loading("Submitting your data...", { id: "resume-submit" });
    const { data, error } = await supabase
      .from("resumes")
      .insert([formData]);
    if (error) {
      toast.dismiss("resume-submit");
      toast.error("Database error: " + error.message);
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.text();
      setOutput(result);
      toast.dismiss("resume-submit");
      toast.success("Resume tailored successfully!");
    } catch (err) {
      toast.dismiss("resume-submit");
      toast.error("Failed to tailor resume.");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white flex flex-col items-center justify-center px-2 py-8">
      <div className="w-full max-w-2xl bg-zinc-900/95 rounded-3xl shadow-2xl border border-zinc-800 p-0 overflow-hidden backdrop-blur-md">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-8 pt-8 pb-4 bg-zinc-950 border-b border-zinc-800 gap-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3 text-teal-400">
            <FontAwesomeIcon icon={faClipboardList} className="text-2xl" />
            Resume Tailoring
          </h2>
          <LogoutButton />
        </div>
        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent mb-0" />
        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-8 py-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2 focus-within:border-teal-500 transition-all">
              <FontAwesomeIcon icon={faUser} className="text-zinc-400" />
              <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="bg-transparent outline-none py-3 w-full text-base placeholder-zinc-500" />
            </div>
            <div className="flex-1 flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2 focus-within:border-teal-500 transition-all">
              <FontAwesomeIcon icon={faEnvelope} className="text-zinc-400" />
              <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="bg-transparent outline-none py-3 w-full text-base placeholder-zinc-500" />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2 focus-within:border-teal-500 transition-all">
            <FontAwesomeIcon icon={faBriefcase} className="text-zinc-400" />
            <input type="text" name="jobTitle" placeholder="Target Job Title" value={formData.jobTitle} onChange={handleChange} className="bg-transparent outline-none py-3 w-full text-base placeholder-zinc-500" />
          </div>
          <div className="flex items-start gap-2 bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2 focus-within:border-teal-500 transition-all">
            <FontAwesomeIcon icon={faFileAlt} className="text-zinc-400 mt-3" />
            <textarea name="resume" placeholder="Paste your Resume here..." value={formData.resume} onChange={handleChange} rows={6} className="bg-transparent outline-none py-3 w-full text-base resize-none placeholder-zinc-500" />
          </div>
          <div className="flex items-start gap-2 bg-zinc-800/80 border border-zinc-700 rounded-xl px-4 py-2 focus-within:border-teal-500 transition-all">
            <FontAwesomeIcon icon={faClipboardList} className="text-zinc-400 mt-3" />
            <textarea name="jobDesc" placeholder="Paste Job Description here..." value={formData.jobDesc} onChange={handleChange} rows={6} className="bg-transparent outline-none py-3 w-full text-base resize-none placeholder-zinc-500" />
          </div>
          <button type="submit" disabled={loading} className={`bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 p-3 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-lg mt-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.03] active:scale-95"}`}>
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin className="text-white" />
                Processing...
              </>
            ) : (
              <>Generate Tailored Resume</>
            )}
          </button>
        </form>
        <Toaster />
        {/* Output Section */}
        {loading && (
          <div className="flex items-center gap-2 text-zinc-400 px-8 pb-4 text-base animate-pulse">
            <FontAwesomeIcon icon={faSpinner} spin className="text-teal-400" />
            Tailoring your resume, please wait...
          </div>
        )}
        {output && (
          <div className="px-8 pb-8">
            <div className="mt-8 bg-gradient-to-br from-zinc-800/90 to-zinc-900/80 p-6 rounded-2xl shadow border border-zinc-700">
              <div className="flex items-center gap-2 mb-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xl" />
                <h3 className="text-lg font-semibold text-green-300">Tailored Resume:</h3>
              </div>
              {/* Format output into paragraphs */}
              <div>
                {output
                  .split(/\n{2,}/) // split on double newlines (sections)
                  .map((section, idx) => (
                    <p key={idx} className="whitespace-pre-line text-zinc-100 text-base font-mono leading-relaxed mb-4">
                      {section.trim()}
                    </p>
                  ))}
              </div>
              {/* Download PDF Button */}
              <button
                className="mt-6 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold py-2 px-6 rounded-lg text-base transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/tailor/pdf", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ resume: output })
                    });
                    if (!res.ok) throw new Error("Failed to generate PDF");
                    const blob = await res.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "resume.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    toast.success("PDF downloaded!");
                  } catch (err) {
                    toast.error("PDF download failed. Please try again.");
                  }
                }}
                disabled={!output || loading}
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
