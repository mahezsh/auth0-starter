"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth0 } from "@auth0/auth0-react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const [loadingState, setLoadingState] = useState("initial")

  // Add debugging logs
  useEffect(() => {
    console.log("Home page - Auth state:", { isLoading, isAuthenticated })

    if (isLoading) {
      setLoadingState("auth-loading")
      console.log("Home page - Auth0 is still loading")
    } else {
      if (isAuthenticated) {
        console.log("Home page - User is authenticated, redirecting to dashboard")
        setLoadingState("redirecting")
        router.push("/dashboard")
      } else {
        console.log("Home page - User is not authenticated, showing home content")
        setLoadingState("ready")
      }
    }
  }, [isLoading, isAuthenticated, router])

  // Show appropriate loading state with timeout protection
  useEffect(() => {
    // Safety timeout - if we're stuck loading for more than 5 seconds, show the page anyway
    const timeout = setTimeout(() => {
      if (loadingState === "auth-loading" || loadingState === "redirecting") {
        console.log("Home page - Loading timeout reached, showing content anyway")
        setLoadingState("ready")
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, [loadingState])

  if (loadingState === "auth-loading" || loadingState === "redirecting") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            {loadingState === "auth-loading" ? "Checking authentication status..." : "Redirecting to dashboard..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4 text-center px-4">
      <h1 className="text-4xl font-bold">Welcome to Auth Demo</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        A complete authentication system using Auth0 with email/password and Google OAuth.
      </p>
      <Button size="lg" onClick={() => router.push("/auth")}>
        Get Started
      </Button>
    </div>
  )
}

