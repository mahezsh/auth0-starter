"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth0 } from "@auth0/auth0-react"
import { Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { loginWithRedirect, isAuthenticated, isLoading, error: auth0Error } = useAuth0()
  const [error, setError] = useState<string | null>(null)
  const [loadingState, setLoadingState] = useState("initial")
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Handle any error messages from Auth0
  useEffect(() => {
    const errorMessage = searchParams.get("error_description")
    if (errorMessage) {
      setError(decodeURIComponent(errorMessage))
    } else if (auth0Error) {
      setError(auth0Error.message)
    }
  }, [searchParams, auth0Error])

  // Add debugging logs
  useEffect(() => {
    console.log("Auth page - Auth state:", { isLoading, isAuthenticated, error: auth0Error })

    if (isLoading) {
      setLoadingState("auth-loading")
      console.log("Auth page - Auth0 is still loading")
    } else {
      if (isAuthenticated) {
        console.log("Auth page - User is authenticated, redirecting to dashboard")
        setLoadingState("redirecting")
        router.push("/dashboard")
      } else {
        console.log("Auth page - User is not authenticated, showing login form")
        setLoadingState("ready")
      }
    }
  }, [isLoading, isAuthenticated, router, auth0Error])

  const handleLogin = async () => {
    if (isRedirecting) return

    setIsRedirecting(true)
    console.log("Auth page - Initiating login redirect")

    try {
      await loginWithRedirect({
        authorizationParams: {
          prompt: "login",
        },
        appState: { returnTo: "/dashboard" },
      })
    } catch (error) {
      console.error("Login redirect error:", error)
      setIsRedirecting(false)
      setError(error instanceof Error ? error.message : "Failed to initiate login. Please try again.")
    }
  }

  const handleGoogleLogin = async () => {
    if (isRedirecting) return

    setIsRedirecting(true)
    console.log("Auth page - Initiating Google login redirect")

    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: "google-oauth2",
          prompt: "login",
        },
        appState: { returnTo: "/dashboard" },
      })
    } catch (error) {
      console.error("Google login redirect error:", error)
      setIsRedirecting(false)
      setError(error instanceof Error ? error.message : "Failed to initiate Google login. Please try again.")
    }
  }

  if (loadingState === "auth-loading" || loadingState === "redirecting") {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome</CardTitle>
          <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-center mb-2">
            <Link href="/auth-test" className="text-primary hover:underline">
              Test Auth0 Configuration
            </Link>
          </div>

          <Button onClick={handleLogin} className="w-full" disabled={isRedirecting}>
            {isRedirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              "Continue with Email"
            )}
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          <Button onClick={handleGoogleLogin} variant="outline" className="w-full" disabled={isRedirecting}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            {isRedirecting ? "Redirecting..." : "Continue with Google"}
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center flex-col space-y-2 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0"
              onClick={() => {
                if (isRedirecting) return
                setIsRedirecting(true)
                loginWithRedirect({
                  authorizationParams: {
                    screen_hint: "signup",
                    prompt: "login",
                  },
                  appState: { returnTo: "/dashboard" },
                })
              }}
              disabled={isRedirecting}
            >
              Sign up
            </Button>
          </p>
          <p className="text-sm text-gray-600">
            <Link href="/auth/reset-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

