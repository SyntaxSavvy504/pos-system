"use client"

import type { ReactNode } from "react"
import { useAuth } from "./auth-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield } from "lucide-react"

interface PermissionGuardProps {
  children: ReactNode
  permission: keyof typeof useAuth extends () => { user: { permissions: infer P } } ? keyof P : never
  fallback?: ReactNode
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { user } = useAuth()

  if (!user || !user.permissions[permission as keyof typeof user.permissions]) {
    return (
      fallback || (
        <Alert className="bg-yellow-50 border-yellow-200">
          <Shield className="h-4 w-4" />
          <AlertDescription>You don't have permission to access this feature.</AlertDescription>
        </Alert>
      )
    )
  }

  return <>{children}</>
}
