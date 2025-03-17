"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Auth0Provider } from "@auth0/auth0-react"
import { useRouter } from "next/navigation"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Get the deployment URL from the environment variable
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || (typeof window !== "undefined" ? window.location.origin : "")

  // Initialize loading state
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading authentication...</div>
  }

  return (
    <Auth0Provider
      domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ""}
      clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ""}
      authorizationParams={{
        redirect_uri: `${appUrl}/callback`,
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={(appState) => {
        router.push(appState?.returnTo || "/dashboard")
      }}
    >
      {children}
    </Auth0Provider>
  )
}

