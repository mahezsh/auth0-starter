import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  // Get all query parameters
  const code = searchParams.get("code")
  const state = searchParams.get("state")
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // Log the callback parameters for debugging
  console.log("API Auth callback received:", {
    code: code ? "present" : "missing",
    state: state ? "present" : "missing",
    error,
    errorDescription,
  })

  // If there's an error, redirect to auth page with error message
  if (error) {
    const errorUrl = new URL("/auth", process.env.NEXT_PUBLIC_APP_URL || url.origin)
    errorUrl.searchParams.set("error", error)
    if (errorDescription) {
      errorUrl.searchParams.set("error_description", errorDescription)
    }
    return NextResponse.redirect(errorUrl)
  }

  // Get all query parameters
  const queryParams = Array.from(searchParams.entries())
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")

  // Redirect to the client-side callback with all query parameters preserved
  const callbackUrl = new URL(`/callback?${queryParams}`, process.env.NEXT_PUBLIC_APP_URL || url.origin)

  return NextResponse.redirect(callbackUrl)
}

