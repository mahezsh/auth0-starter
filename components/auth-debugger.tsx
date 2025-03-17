"use client"

import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from "lucide-react"

export function AuthDebugger() {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0()
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)

  const getToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently()
      setToken(accessToken)
      setTokenError(null)
    } catch (error) {
      setTokenError((error as Error).message)
      setToken(null)
    }
  }

  if (isLoading) {
    return <div>Loading authentication status...</div>
  }

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Authentication Debug
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </Button>
        </CardTitle>
        <CardDescription>View your current authentication status and details</CardDescription>
      </CardHeader>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Authentication Status:</div>
              <div>{isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated"}</div>

              {isAuthenticated && (
                <>
                  <div className="font-medium">User ID:</div>
                  <div className="break-all">{user?.sub}</div>

                  <div className="font-medium">Email:</div>
                  <div>{user?.email}</div>

                  <div className="font-medium">Email Verified:</div>
                  <div>{user?.email_verified ? "Yes" : "No"}</div>
                </>
              )}
            </div>

            {isAuthenticated && (
              <div className="space-y-2">
                <Button onClick={getToken} variant="outline" size="sm">
                  Test Token Retrieval
                </Button>

                {token && (
                  <div className="mt-2">
                    <div className="font-medium mb-1">Access Token:</div>
                    <div className="bg-gray-100 p-2 rounded text-xs break-all max-h-20 overflow-auto">{token}</div>
                  </div>
                )}

                {tokenError && (
                  <div className="mt-2 text-red-500 text-sm">
                    <div className="font-medium">Token Error:</div>
                    <div>{tokenError}</div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <CardFooter className="text-xs text-gray-500">
        {isOpen ? "Click to hide details" : "Click to show authentication details"}
      </CardFooter>
    </Card>
  )
}

