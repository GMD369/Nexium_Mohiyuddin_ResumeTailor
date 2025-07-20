"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner, faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons"

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Authenticating you...')

  useEffect(() => {
    const handleMagicLink = async () => {
      const hash = window.location.hash.substring(1) // remove "#"
      const params = new URLSearchParams(hash)

      const access_token = params.get("access_token")
      const refresh_token = params.get("refresh_token")

      if (access_token && refresh_token) {
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          })

          if (error) {
            console.error("Error setting session:", error.message)
            setStatus('error')
            setMessage('Authentication failed. Please try again.')
          } else {
            console.log("Session established:", data)
            setStatus('success')
            setMessage('Authentication successful! Redirecting...')
            setTimeout(() => {
              router.push("/resume")
            }, 1500)
          }
        } catch (error) {
          console.error("Unexpected error:", error)
          setStatus('error')
          setMessage('An unexpected error occurred. Please try again.')
        }
      } else {
        console.warn("Tokens not found in URL")
        setStatus('error')
        setMessage('Invalid authentication link. Please try again.')
      }
    }

    handleMagicLink()
  }, [router])

  const getIcon = () => {
    switch (status) {
      case 'loading':
        return <FontAwesomeIcon icon={faSpinner} className="text-teal-400 text-4xl animate-spin" />
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-4xl" />
      case 'error':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 text-4xl" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-teal-400'
      case 'success':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white px-4 py-12">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg border border-zinc-800 p-8 flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-800/50 mb-6 border border-zinc-700">
          {getIcon()}
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center tracking-tight">
          Authentication
        </h1>
        
        <p className={`text-center text-lg font-medium mb-6 ${getStatusColor()}`}>
          {message}
        </p>

        {status === 'loading' && (
          <div className="w-full max-w-xs">
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-teal-500 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-zinc-500 text-sm text-center mt-3">
              Please wait while we verify your credentials...
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <p className="text-zinc-400 text-sm mb-4">
              If you continue to experience issues, please try signing in again.
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Back to Login
            </button>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <p className="text-zinc-400 text-sm">
              Redirecting you to the resume builder...
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
