"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (!error) setSent(true)
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Sign in with Magic Link</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
        <input
          type="email"
          className="p-3 rounded bg-zinc-800 border border-zinc-700"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="bg-teal-600 hover:bg-teal-500 p-3 rounded text-white">
          {sent ? "Link Sent!" : "Send Magic Link"}
        </button>
      </form>
    </main>
  )
}
