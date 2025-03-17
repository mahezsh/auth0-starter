"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth0 } from "@auth0/auth0-react"
import { Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AuthDebugger } from "@/components/auth-debugger"

export default function DashboardPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user, loginWithRedirect } = useAuth0()
  const [loadingState, setLoadingState] = useState("initial")
  const redirectAttempted = useRef(false)

  // Simplified authentication check with redirect prevention
  useEffect(() => {
    console.log("Dashboard - Auth state:", { isLoading, isAuthenticated, user: !!user })

    if (isLoading) {
      setLoadingState("auth-loading")
      console.log("Dashboard - Auth0 is still loading")
      return
    }

    if (!isAuthenticated) {
      console.log("Dashboard - Not authenticated, redirecting to auth page")
      setLoadingState("not-authenticated")

      // Prevent infinite redirect loops by only redirecting once
      if (!redirectAttempted.current) {
        redirectAttempted.current = true
        console.log("Dashboard - Redirecting to /auth page")
        router.push("/auth")
      }
    } else {
      console.log("Dashboard - User is authenticated, showing dashboard")
      setLoadingState("authenticated")
    }
  }, [isLoading, isAuthenticated, user, router])

  // Show loading state with more details
  if (isLoading || loadingState === "auth-loading") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading authentication status...</p>
          <p className="text-xs text-muted-foreground mt-2">State: {loadingState}</p>
        </div>
      </div>
    )
  }

  // Show redirect message
  if (loadingState === "not-authenticated") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">You need to be logged in to view this page</p>
          <p className="text-xs text-muted-foreground mt-2">Redirecting to login page...</p>
          <Button onClick={() => router.push("/auth")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full overflow-hidden">
                  {user?.picture ? (
                    <img
                      src={user.picture || "/placeholder.svg"}
                      alt={user?.name || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{user?.name}</h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>Your account status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email verified</span>
                <span className="font-medium">{user?.email_verified ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last login</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account type</span>
                <span className="font-medium">Standard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AuthDebugger />
    </div>
  )
}

