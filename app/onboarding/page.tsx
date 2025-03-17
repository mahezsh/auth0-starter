"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth0 } from "@auth0/auth0-react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, user } = useAuth0()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome to Onboarding</CardTitle>
          <CardDescription className="text-center">
            {user?.name ? `Hello, ${user.name}!` : "Let's get you set up"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center">
            Your account has been successfully created. You can now access all features of the application.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleContinue}>Continue to Dashboard</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

