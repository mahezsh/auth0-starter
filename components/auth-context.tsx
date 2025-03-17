"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type User = {
  sub: string
  name: string
  email: string
  picture: string
  email_verified: boolean
} | null

type AuthContextType = {
  user: User
  isLoading: boolean
  isAuthenticated: boolean
  login: () => void
  loginWithGoogle: () => void
  signup: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: () => {},
  loginWithGoogle: () => {},
  signup: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user data is in cookie
    const userCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_user="))
      ?.split("=")[1]

    if (userCookie) {
      try {
        const userData = JSON.parse(decodeURIComponent(userCookie))
        setUser(userData)
      } catch (error) {
        console.error("Failed to parse user data from cookie:", error)
      }
    }

    setIsLoading(false)
  }, [])

  // Helper function to generate a random string for state
  function generateRandomString(length: number) {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    const randomValues = new Uint8Array(length)
    window.crypto.getRandomValues(randomValues)
    randomValues.forEach((v) => (result += charset[v % charset.length]))
    return result
  }

  const login = () => {
    // Build Auth0 authorization URL manually
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    const redirectUri = `${window.location.origin}/api/auth/callback`
    const state = generateRandomString(32)

    // Store state in localStorage for verification
    localStorage.setItem("auth_state", state)
    localStorage.setItem("auth_redirect", "/dashboard")

    const authUrl =
      `https://${domain}/authorize?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("openid profile email")}` +
      `&state=${state}`

    // Redirect to Auth0
    window.location.href = authUrl
  }

  const loginWithGoogle = () => {
    // Build Auth0 authorization URL manually with Google connection
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    const redirectUri = `${window.location.origin}/api/auth/callback`
    const state = generateRandomString(32)

    // Store state in localStorage for verification
    localStorage.setItem("auth_state", state)
    localStorage.setItem("auth_redirect", "/dashboard")

    const authUrl =
      `https://${domain}/authorize?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("openid profile email")}` +
      `&connection=google-oauth2` +
      `&state=${state}`

    // Redirect to Auth0
    window.location.href = authUrl
  }

  const signup = () => {
    // Build Auth0 signup URL manually
    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
    const redirectUri = `${window.location.origin}/api/auth/callback`
    const state = generateRandomString(32)

    // Store state in localStorage for verification
    localStorage.setItem("auth_state", state)
    localStorage.setItem("auth_redirect", "/dashboard")

    const authUrl =
      `https://${domain}/authorize?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent("openid profile email")}` +
      `&screen_hint=signup` +
      `&state=${state}`

    // Redirect to Auth0
    window.location.href = authUrl
  }

  const logout = async () => {
    try {
      // Call logout API
      const response = await fetch("/api/auth/logout", { method: "POST" })
      const data = await response.json()

      // Clear user state
      setUser(null)

      // Redirect to Auth0 logout page
      if (data.logoutUrl) {
        window.location.href = data.logoutUrl
      } else {
        // Fallback to home page
        router.push("/")
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Fallback to home page
      router.push("/")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

