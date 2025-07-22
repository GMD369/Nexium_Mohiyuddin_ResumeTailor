"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Toaster, toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.loading("Sending magic link...", { id: "sending" });
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });
    toast.dismiss("sending");
    if (!error) {
      setSent(true);
      toast.success("Magic link sent! Check your email.");
    } else {
      setError(error.message);
      toast.error(error.message || "Failed to send magic link.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white px-4 py-12">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-8 flex flex-col items-center">
        <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-teal-700/20 mb-6">
          <FontAwesomeIcon icon={faEnvelope} className="text-teal-400 text-3xl" />
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-center tracking-tight">
          Sign in with Magic Link
        </h1>
        <p className="text-zinc-400 mb-8 text-center text-base font-medium">
          Enter your email address and we'll send you a secure sign-in link.
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
          <input
            type="email"
            className="p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:border-teal-500 outline-none text-base transition"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={sent}
          />
          <button
            type="submit"
            className={`bg-teal-600 hover:bg-teal-500 p-3 rounded-lg text-white font-semibold text-lg transition flex items-center justify-center gap-2 ${sent ? "opacity-70 cursor-not-allowed" : ""}`}
            disabled={sent}
          >
            {sent ? (
              <>
                <FontAwesomeIcon icon={faCheckCircle} className="text-green-400" />
                Link Sent!
              </>
            ) : (
              <>Send Magic Link</>
            )}
          </button>
          {error && (
            <div className="text-red-400 text-sm mt-1 text-center">{error}</div>
          )}
          {!sent && (
            <div className="text-zinc-400 text-xs text-center mt-2">You will receive an email with a magic link if the address is valid.</div>
          )}
        </form>
        {sent && (
          <div className="mt-6 text-green-400 text-center text-base flex flex-col items-center gap-2">
            <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
            Check your email for the magic link!
          </div>
        )}
      </div>
      <Toaster />
    </main>
  );
}
