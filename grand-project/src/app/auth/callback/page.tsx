"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleMagicLink = async () => {
      const hash = window.location.hash.substring(1) // remove "#"
      const params = new URLSearchParams(hash)

      const access_token = params.get("access_token")
      const refresh_token = params.get("refresh_token")

      if (access_token && refresh_token) {
        const { data, error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })

        if (error) {
          console.error("Error setting session:", error.message)
        } else {
          console.log("✅ Session established:", data)
          router.push("/resume") // redirect to resume form
        }
      } else {
        console.warn("❌ Tokens not found in URL")
      }
    }

    handleMagicLink()
  }, [router])

  return <p className="text-white p-6">Authenticating you... 🔁</p>
}
