"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Store, Shield, User, Settings } from "lucide-react"
import { useAuth } from "./auth-provider"

export function LoginScreen() {
  const [pin, setPin] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin.trim()) {
      setError("Please enter your PIN")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const result = await login(pin)
      if (!result.success) {
        setError(result.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePinInput = (digit: string) => {
    if (pin.length < 4) {
      setPin(pin + digit)
    }
  }

  const handleClear = () => {
    setPin("")
    setError("")
  }

  const handleBackspace = () => {
    setPin(pin.slice(0, -1))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              RetailPOS
            </h1>
            <p className="text-slate-600 mt-2">Enter your PIN to access the system</p>
          </div>
        </div>

        {/* Login Card */}
        <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-slate-800">Employee Login</CardTitle>
            <CardDescription className="text-slate-600">Use your 4-digit PIN to sign in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* PIN Display */}
              <div className="relative">
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.slice(0, 4))}
                  placeholder="Enter PIN"
                  className="text-center text-2xl tracking-widest bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  maxLength={4}
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <Shield className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <Alert variant="destructive" className="bg-red-50/80 backdrop-blur-sm border-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* PIN Pad */}
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                  <Button
                    key={digit}
                    type="button"
                    variant="outline"
                    onClick={() => handlePinInput(digit.toString())}
                    className="h-12 text-lg font-semibold bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80 hover:border-blue-300 transition-all duration-200"
                    disabled={isLoading}
                  >
                    {digit}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClear}
                  className="h-12 text-sm font-medium bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80 hover:border-red-300 text-red-600 transition-all duration-200"
                  disabled={isLoading}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handlePinInput("0")}
                  className="h-12 text-lg font-semibold bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80 hover:border-blue-300 transition-all duration-200"
                  disabled={isLoading}
                >
                  0
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackspace}
                  className="h-12 text-sm font-medium bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80 hover:border-orange-300 text-orange-600 transition-all duration-200"
                  disabled={isLoading}
                >
                  ⌫
                </Button>
              </div>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading || pin.length !== 4}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card className="bg-white/50 backdrop-blur-xl border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Demo Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-white/50 rounded">
              <span className="font-medium text-slate-700">Admin (John Smith)</span>
              <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">1234</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/50 rounded">
              <span className="font-medium text-slate-700">Manager (Sarah Johnson)</span>
              <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">5678</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/50 rounded">
              <span className="font-medium text-slate-700">Cashier (Mike Davis)</span>
              <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-600">9012</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
