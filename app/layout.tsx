import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { MultiStoreDataProvider } from "@/lib/multi-store-data"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Demo POS System",
  description: "A comprehensive point of sale system with modern features",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MultiStoreDataProvider>
            {children}
            <Toaster />
          </MultiStoreDataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
