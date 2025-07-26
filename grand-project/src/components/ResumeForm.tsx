"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faBriefcase, faFileAlt, faClipboardList, faSpinner, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoutButton from "@/components/logoutButton";
import { Toaster, toast } from "react-hot-toast";

// Helper: Parse resume text into structured sections
function parseResumeSections(text: string) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  
  // Name: first line
  const name = lines[0] || '';
  
  // Contact: next lines until we find a line that looks like content (not contact info)
  let contactLines: string[] = [];
  let i = 1;
  while (i < lines.length) {
    const line = lines[i];
    // If line contains email, phone, or common contact patterns, it's contact info
    if (line.includes('@') || line.includes('+') || line.includes('www') || 
        line.includes('linkedin') || line.includes('github') || line.includes('portfolio')) {
      contactLines.push(line);
      i++;
    } else {
      // This line looks like content, not contact info
      break;
    }
  }
  const contact = contactLines.join(' | ');
  
  // Remaining content: split into paragraphs
  const remainingLines = lines.slice(i);
  const content = remainingLines.join('\n');
  const paragraphs = content.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  
  // Structure: first paragraph = summary, middle = experience, last = skills
  const summary = paragraphs[0] || '';
  const skills = paragraphs[paragraphs.length - 1] || '';
  const experience = paragraphs.slice(1, -1).join('\n\n');
  
  return {
    name,
    contact,
    sections: {
      'Summary': summary,
      'Experience': experience,
      'Skills': skills
    }
  };
}

export default function ResumeForm() {
  const [formData, setFormData] = useState({
    name: "", email: "", jobTitle: "",
    resume: "", jobDesc: ""
  });
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResume, setEditedResume] = useState("");

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
    try {
      const response = await fetch("/api/tailor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const result = await response.text();
      setOutput(result);
      setEditedResume(result);
      toast.dismiss("resume-submit");
      toast.success("Resume tailored successfully!");
    } catch (err) {
      toast.dismiss("resume-submit");
      toast.error("Failed to tailor resume.");
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedResume(output);
  };

  const handleSave = () => {
    setOutput(editedResume);
    setIsEditing(false);
    toast.success("Resume updated!");
  };

  const handleCancel = () => {
    setEditedResume(output);
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white flex pt-16">
      {/* Left Side - Form (30%) */}
      <div className="w-1/3 bg-zinc-900/95 border-r border-zinc-800 p-6 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-zinc-800 gap-4">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3 text-teal-400">
              <FontAwesomeIcon icon={faClipboardList} className="text-xl" />
              Resume Tailoring
            </h2>
            <LogoutButton />
          </div>
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 focus-within:border-teal-500 transition-all">
                <FontAwesomeIcon icon={faUser} className="text-zinc-400 text-sm" />
                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="bg-transparent outline-none py-2 w-full text-sm placeholder-zinc-500" />
              </div>
              <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 focus-within:border-teal-500 transition-all">
                <FontAwesomeIcon icon={faEnvelope} className="text-zinc-400 text-sm" />
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="bg-transparent outline-none py-2 w-full text-sm placeholder-zinc-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 focus-within:border-teal-500 transition-all">
              <FontAwesomeIcon icon={faBriefcase} className="text-zinc-400 text-sm" />
              <input type="text" name="jobTitle" placeholder="Target Job Title" value={formData.jobTitle} onChange={handleChange} className="bg-transparent outline-none py-2 w-full text-sm placeholder-zinc-500" />
            </div>
            <div className="flex items-start gap-2 bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 focus-within:border-teal-500 transition-all">
              <FontAwesomeIcon icon={faFileAlt} className="text-zinc-400 text-sm mt-2" />
              <textarea name="resume" placeholder="Paste your Resume here..." value={formData.resume} onChange={handleChange} rows={4} className="bg-transparent outline-none py-2 w-full text-sm resize-none placeholder-zinc-500" />
            </div>
            <div className="flex items-start gap-2 bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 focus-within:border-teal-500 transition-all">
              <FontAwesomeIcon icon={faClipboardList} className="text-zinc-400 text-sm mt-2" />
              <textarea name="jobDesc" placeholder="Paste Job Description here..." value={formData.jobDesc} onChange={handleChange} rows={4} className="bg-transparent outline-none py-2 w-full text-sm resize-none placeholder-zinc-500" />
            </div>
            <button type="submit" disabled={loading} className={`bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 p-3 rounded-lg text-white font-semibold text-base transition-all flex items-center justify-center gap-2 shadow-lg mt-2 ${loading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"}`}>
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
          {/* Loading State */}
          {loading && (
            <div className="flex items-center gap-2 text-zinc-400 mt-4 text-sm animate-pulse">
              <FontAwesomeIcon icon={faSpinner} spin className="text-teal-400" />
              Tailoring your resume, please wait...
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Resume Display (70%) */}
      <div className="w-2/3 bg-zinc-950 p-6 overflow-y-auto">
        {output ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-zinc-800/90 to-zinc-900/80 p-8 rounded-2xl shadow border border-zinc-700">
              {/* Structured Resume Preview - No Headings */}
              {(() => {
                if (isEditing) {
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <FontAwesomeIcon icon={faFileAlt} className="text-blue-400 text-xl" />
                        <h3 className="text-xl font-semibold text-blue-300">Edit Resume:</h3>
                      </div>
                      <textarea
                        value={editedResume}
                        onChange={(e) => setEditedResume(e.target.value)}
                        className="w-full h-96 p-4 bg-zinc-800 border border-zinc-600 rounded-lg text-sm text-zinc-100 font-mono resize-none focus:border-teal-500 outline-none"
                        placeholder="Edit your resume here..."
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleSave}
                          className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-zinc-600 hover:bg-zinc-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                } else {
                  const { name, contact, sections } = parseResumeSections(output);
                  return (
                    <div className="resume-structured-preview">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xl" />
                          <h3 className="text-xl font-semibold text-green-300">Tailored Resume:</h3>
                        </div>
                        <button
                          onClick={handleEdit}
                          className="bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg text-sm transition-all"
                        >
                          Edit Resume
                        </button>
                      </div>
                       {/* Simple text display like edit mode */}
                       <div className="text-sm text-zinc-100 leading-relaxed font-normal">
                         {output.split(/\n{2,}/).map((paragraph, index) => (
                           <div key={index} className="mb-4">
                             {paragraph.trim()}
                           </div>
                         ))}
                       </div>
                    </div>
                  );
                }
              })()}
              {/* Download PDF Button */}
              <button
                className="mt-6 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white font-semibold py-2 px-6 rounded-lg text-base transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={async () => {
                  try {
                    const res = await fetch("/api/tailor/pdf", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ resume: isEditing ? editedResume : output })
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
        ) : (
          <div className="flex items-center justify-center h-full text-zinc-400">
            <div className="text-center">
              <FontAwesomeIcon icon={faFileAlt} className="text-6xl mb-4 text-zinc-600" />
              <p className="text-lg">Fill the form and generate your tailored resume</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
