"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "manager" | "cashier"
  permissions: {
    sales: boolean
    inventory: boolean
    customers: boolean
    reports: boolean
    settings: boolean
    employees: boolean
  }
}

interface AuthContextType {
  user: User | null
  login: (pin: string) => Promise<{ success: boolean; user?: User; error?: string }>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Demo users for authentication
const demoUsers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@retailpos.com",
    role: "admin" as const,
    pin: "1234",
    permissions: {
      sales: true,
      inventory: true,
      customers: true,
      reports: true,
      settings: true,
      employees: true,
    },
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@retailpos.com",
    role: "manager" as const,
    pin: "5678",
    permissions: {
      sales: true,
      inventory: true,
      customers: true,
      reports: true,
      settings: false,
      employees: false,
    },
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Davis",
    email: "mike.davis@retailpos.com",
    role: "cashier" as const,
    pin: "9012",
    permissions: {
      sales: true,
      inventory: false,
      customers: true,
      reports: false,
      settings: false,
      employees: false,
    },
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("pos-user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("pos-user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (pin: string): Promise<{ success: boolean; user?: User; error?: string }> => {
    const foundUser = demoUsers.find((u) => u.pin === pin)

    if (!foundUser) {
      return { success: false, error: "Invalid PIN" }
    }

    const authUser: User = {
      id: foundUser.id,
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      email: foundUser.email,
      role: foundUser.role,
      permissions: foundUser.permissions,
    }

    setUser(authUser)
    localStorage.setItem("pos-user", JSON.stringify(authUser))

    return { success: true, user: authUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("pos-user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
