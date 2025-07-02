"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Employee types
export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "admin" | "manager" | "cashier"
  pin: string
  status: "active" | "inactive"
  hireDate: string
  lastLogin?: string
  permissions: {
    sales: boolean
    inventory: boolean
    customers: boolean
    reports: boolean
    settings: boolean
    employees: boolean
  }
}

// Auth types
export interface AuthUser {
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

interface DataStoreContextType {
  // Auth
  currentUser: AuthUser | null
  login: (pin: string) => Promise<{ success: boolean; user?: AuthUser; error?: string }>
  logout: () => void
  isAuthenticated: boolean

  // Employees
  employees: Employee[]
  addEmployee: (employee: Omit<Employee, "id" | "lastLogin">) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  getEmployeeByPin: (pin: string) => Employee | null
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

// Initial employees data
const initialEmployees: Employee[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@retailpos.com",
    phone: "+1 (555) 123-4567",
    role: "admin",
    pin: "1234",
    status: "active",
    hireDate: "2023-01-15",
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
    phone: "+1 (555) 987-6543",
    role: "manager",
    pin: "5678",
    status: "active",
    hireDate: "2023-03-20",
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
    phone: "+1 (555) 456-7890",
    role: "cashier",
    pin: "9012",
    status: "active",
    hireDate: "2023-06-10",
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

export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("pos-user")
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("pos-user")
      }
    }
  }, [])

  const login = async (pin: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> => {
    const employee = employees.find((emp) => emp.pin === pin && emp.status === "active")

    if (!employee) {
      return { success: false, error: "Invalid PIN or inactive account" }
    }

    const authUser: AuthUser = {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role,
      permissions: employee.permissions,
    }

    // Update last login
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employee.id ? { ...emp, lastLogin: new Date().toISOString() } : emp)),
    )

    setCurrentUser(authUser)
    setIsAuthenticated(true)
    localStorage.setItem("pos-user", JSON.stringify(authUser))

    return { success: true, user: authUser }
  }

  const logout = () => {
    setCurrentUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("pos-user")
  }

  const addEmployee = (employeeData: Omit<Employee, "id" | "lastLogin">) => {
    const employee: Employee = {
      ...employeeData,
      id: Date.now().toString(),
    }
    setEmployees((prev) => [...prev, employee])
  }

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) => prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp)))
  }

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id))
  }

  const getEmployeeByPin = (pin: string): Employee | null => {
    return employees.find((emp) => emp.pin === pin && emp.status === "active") || null
  }

  return (
    <DataStoreContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployeeByPin,
      }}
    >
      {children}
    </DataStoreContext.Provider>
  )
}

export function useDataStore() {
  const context = useContext(DataStoreContext)
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider")
  }
  return context
}
