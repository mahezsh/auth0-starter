"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AuthTestPage() {
  const [status, setStatus] = useState<string>("idle")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testAuth0Config = async () => {
    setStatus("testing")
    setError(null)
    setResult(null)

    try {
      // Display Auth0 configuration
      const config = {
        domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
        clientId: process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID,
        redirectUri: `${window.location.origin}/api/auth/callback`,
        appUrl: process.env.NEXT_PUBLIC_APP_URL,
      }

      setResult(config)

      // Test if we can reach Auth0
      const response = await fetch(`https://${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}/.well-known/openid-configuration`)

      if (!response.ok) {
        throw new Error(`Failed to reach Auth0: ${response.status} ${response.statusText}`)
      }

      const openidConfig = await response.json()
      setResult((prev) => ({
        ...prev,
        openidConfig: {
          issuer: openidConfig.issuer,
          authorizationEndpoint: openidConfig.authorization_endpoint,
          tokenEndpoint: openidConfig.token_endpoint,
          available: true,
        },
      }))

      setStatus("success")
    } catch (err) {
      console.error("Auth0 test failed:", err)
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      setStatus("error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Auth0 Configuration Test</CardTitle>
          <CardDescription className="text-center">
            Test your Auth0 configuration to diagnose authentication issues
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={testAuth0Config} className="w-full" disabled={status === "testing"}>
            {status === "testing" ? "Testing..." : "Test Auth0 Configuration"}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md overflow-auto">
              <h3 className="font-semibold mb-2">Configuration:</h3>
              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}

          {status === "success" && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Successfully connected to Auth0! If you're still having issues, check your application settings in
                Auth0.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-gray-600 space-y-2">
            <p className="font-semibold">Common issues to check in Auth0 dashboard:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>
                Make sure <code className="bg-gray-100 px-1 rounded">Username-Password-Authentication</code> is enabled
              </li>
              <li>
                Verify <code className="bg-gray-100 px-1 rounded">{`${window.location.origin}/api/auth/callback`}</code>{" "}
                is in the allowed callback URLs
              </li>
              <li>Check if your application type is set to "Single Page Application"</li>
              <li>Ensure "Token Endpoint Authentication Method" is set to "None"</li>
              <li>Verify your application is not in a disabled state</li>
            </ol>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

