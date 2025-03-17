import type React from "react"
import { Inter } from "next/font/google"
import { AuthProvider } from "@/components/auth-provider"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Auth Demo",
  description: "Modern authentication with Auth0",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Navbar />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'