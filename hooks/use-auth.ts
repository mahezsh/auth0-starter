"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const router = useRouter()
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user, error } = useAuth0()

  // Redirect to onboarding if authenticated
  const checkAuthAndRedirect = (redirectPath = "/onboarding") => {
    if (isAuthenticated) {
      router.push(redirectPath)
      return true
    }
    return false
  }

  // Handle login with email/password
  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/callback`,
        },
        appState: {
          returnTo: "/onboarding",
        },
      })
      return true
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  // Handle signup with email/password
  const handleSignup = async () => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: "signup",
          redirect_uri: `${window.location.origin}/callback`,
        },
        appState: {
          returnTo: "/onboarding",
        },
      })
      return true
    } catch (error) {
      console.error("Signup failed:", error)
      return false
    }
  }

  // Handle social login/signup
  const handleSocialAuth = async (provider: string, isSignup = false) => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          connection: provider,
          screen_hint: isSignup ? "signup" : undefined,
          redirect_uri: `${window.location.origin}/callback`,
        },
        appState: {
          returnTo: "/onboarding",
        },
      })
      return true
    } catch (error) {
      console.error(`${provider} auth failed:`, error)
      return false
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      })
      return true
    } catch (error) {
      console.error("Logout failed:", error)
      return false
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    checkAuthAndRedirect,
    handleLogin,
    handleSignup,
    handleSocialAuth,
    handleLogout,
  }
}

