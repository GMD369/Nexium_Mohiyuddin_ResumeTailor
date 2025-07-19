// app/page.tsx
"use client"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faRobot, faBolt, faLink, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-10 py-16">
      {/* Hero Section */}
      <section className="text-center max-w-2xl mb-24">
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-700/20">
            <FontAwesomeIcon icon={faBullseye} className="text-teal-400 text-4xl" />
          </span>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-5 tracking-tight leading-tight">
          Tailor Your Resume with AI
        </h1>
        <p className="text-zinc-400 text-lg mb-8 font-medium">
          Paste your resume and job description. Get a tailored version that fits the job — instantly!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/login">
            <button className="bg-teal-600 hover:bg-teal-500 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow transition">
              Get Started
            </button>
          </Link>
          <a
            href="#features"
            className="text-teal-400 border border-teal-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-teal-800/40 transition"
          >
            How it Works
          </a>
        </div>
      </section>

      {/* Feature Section */}
      <section id="features" className="w-full max-w-4xl text-center mb-20">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 tracking-tight">
          <span className="inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faBolt} className="text-teal-400 text-2xl" />
            Features
          </span>
        </h2>
        <div className="grid sm:grid-cols-2 gap-8 text-left">
          <Feature icon={faRobot} title="AI-Powered Tailoring" desc="We use smart AI to align your resume with job descriptions automatically." />
          <Feature icon={faLink} title="Magic Link Login" desc="No passwords! Just enter your email and you're in." />
          <Feature icon={faBolt} title="Instant Results" desc="Tailored resume generated in seconds — no wait." />
          <Feature icon={faShieldAlt} title="Clean, Secure UI" desc="Privacy first, simple and fast interface built with Next.js + Supabase." />
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto text-sm text-zinc-600 border-t border-zinc-800 w-full max-w-4xl mx-auto pt-8 pb-4 text-center">
        © 2025 Resume Tailor — Built for Nexium Internship
      </footer>
    </main>
  );
}

function Feature({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="bg-zinc-900 p-7 rounded-xl border border-zinc-800 hover:border-teal-500 transition flex items-start gap-4 shadow-sm">
      <span className="mt-1">
        <FontAwesomeIcon icon={icon} className="text-teal-400 text-2xl" />
      </span>
      <div>
        <h3 className="text-xl font-semibold mb-1 text-teal-400">{title}</h3>
        <p className="text-zinc-400 text-base font-medium">{desc}</p>
      </div>
    </div>
  );
}
