"use client"

import { useAuth } from "@/components/auth-provider"
import { LoginScreen } from "@/components/login-screen"
import { DataStoreProvider } from "@/lib/data-store"
import { MultiStoreDataProvider } from "@/lib/multi-store-data"

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginScreen />
  }

  return (
    <DataStoreProvider>
      <MultiStoreDataProvider>
        \
