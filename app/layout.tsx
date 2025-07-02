import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { MultiStoreDataProvider } from "@/lib/multi-store-data"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Demo POS System",
  description: "A comprehensive point of sale system for retail businesses",
    generator: 'v0.dev'
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
          <MultiStoreDataProvider>
            {children}
            <Toaster />
          </MultiStoreDataProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
