"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth0 } from "@auth0/auth0-react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoading, error, isAuthenticated, handleRedirectCallback } = useAuth0()
  const [status, setStatus] = useState("processing")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const processAuth = async () => {
      try {
        console.log("Callback page - Processing authentication")
        setStatus("processing-callback")

        // Get the state and code from the URL
        const code = searchParams.get("code")
        const state = searchParams.get("state")

        if (!code || !state) {
          console.error("Missing code or state")
          setStatus("error")
          setErrorMessage("Missing authentication parameters")
          return
        }

        // Process the callback
        await handleRedirectCallback()

        // If we get here, the callback was successful
        console.log("Callback page - Authentication successful")
        setStatus("success")

        // Redirect to dashboard
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } catch (err) {
        console.error("Callback error:", err)
        setStatus("error")
        const errorMsg = err instanceof Error ? err.message : "Authentication failed"
        console.log("Error details:", errorMsg)
        setErrorMessage(errorMsg)
      }
    }

    if (!isLoading && !isAuthenticated && !error) {
      processAuth()
    } else if (!isLoading && isAuthenticated) {
      console.log("Callback page - Already authenticated, redirecting to dashboard")
      setStatus("already-authenticated")
      router.push("/dashboard")
    } else if (!isLoading && error) {
      console.error("Auth0 error:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Authentication failed")
    }
  }, [isLoading, isAuthenticated, error, router, searchParams, handleRedirectCallback])

  const handleRetry = () => {
    router.push("/auth")
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md">
        {status === "processing" || status === "processing-callback" || isLoading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Completing authentication...</h2>
            <p className="text-muted-foreground">Please wait while we log you in</p>
          </>
        ) : status === "success" || status === "already-authenticated" ? (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold">Authentication successful!</h2>
            <p className="text-muted-foreground">Redirecting to dashboard...</p>
          </>
        ) : (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-xl font-semibold">Authentication failed</h2>
            <p className="text-red-500 mt-2">{errorMessage || "An error occurred during authentication"}</p>
            <Button onClick={handleRetry} className="mt-4">
              Return to Login
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

