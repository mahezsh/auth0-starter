import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = cookies()

  // Clear all auth cookies
  cookieStore.delete("auth_access_token")
  cookieStore.delete("auth_refresh_token")
  cookieStore.delete("auth_id_token")
  cookieStore.delete("auth_user")

  // Redirect to Auth0 logout
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID
  const returnTo = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const logoutUrl = `https://${domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`

  return NextResponse.json({ success: true, logoutUrl })
}

