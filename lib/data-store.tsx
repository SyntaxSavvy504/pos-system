"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "cashier"
  pin: string
  permissions: string[]
  isActive: boolean
}

export interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  barcode?: string
  image?: string
  description?: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  loyaltyNumber?: string
  totalSpent: number
  lastVisit: string
}

export interface Sale {
  id: string
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: "cash" | "card" | "digital"
  customerId?: string
  employeeId: string
  timestamp: string
  receiptNumber: string
}

export interface SaleItem {
  productId: string
  name: string
  price: number
  quantity: number
  total: number
}

// Context
interface DataStoreContextType {
  // Auth
  currentUser: User | null
  login: (pin: string) => Promise<boolean>
  logout: () => void

  // Products
  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void

  // Customers
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "totalSpent" | "lastVisit">) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void

  // Sales
  sales: Sale[]
  addSale: (sale: Omit<Sale, "id" | "timestamp" | "receiptNumber">) => void

  // Users
  users: User[]
  addUser: (user: Omit<User, "id">) => void
  updateUser: (id: string, user: Partial<User>) => void
  deleteUser: (id: string) => void
}

const DataStoreContext = createContext<DataStoreContextType | undefined>(undefined)

// Sample data
const sampleUsers: User[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@store.com",
    role: "admin",
    pin: "1234",
    permissions: ["all"],
    isActive: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@store.com",
    role: "manager",
    pin: "5678",
    permissions: ["sales", "inventory", "customers", "reports"],
    isActive: true,
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@store.com",
    role: "cashier",
    pin: "9012",
    permissions: ["sales", "customers"],
    isActive: true,
  },
]

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Coffee - Premium Blend",
    price: 12.99,
    category: "Beverages",
    stock: 50,
    barcode: "123456789012",
  },
  {
    id: "2",
    name: "Organic Tea - Earl Grey",
    price: 8.99,
    category: "Beverages",
    stock: 30,
    barcode: "123456789013",
  },
  {
    id: "3",
    name: "Chocolate Bar - Dark 70%",
    price: 4.99,
    category: "Snacks",
    stock: 75,
    barcode: "123456789014",
  },
]

const sampleCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, City, State 12345",
    loyaltyNumber: "LOY001",
    totalSpent: 245.67,
    lastVisit: "2024-01-15",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, City, State 12345",
    loyaltyNumber: "LOY002",
    totalSpent: 189.32,
    lastVisit: "2024-01-14",
  },
]

// Provider component
export function DataStoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>(sampleUsers)
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers)
  const [sales, setSales] = useState<Sale[]>([])

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("pos-current-user")
      const savedUsers = localStorage.getItem("pos-users")
      const savedProducts = localStorage.getItem("pos-products")
      const savedCustomers = localStorage.getItem("pos-customers")
      const savedSales = localStorage.getItem("pos-sales")

      if (savedUser) setCurrentUser(JSON.parse(savedUser))
      if (savedUsers) setUsers(JSON.parse(savedUsers))
      if (savedProducts) setProducts(JSON.parse(savedProducts))
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers))
      if (savedSales) setSales(JSON.parse(savedSales))
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (currentUser) {
        localStorage.setItem("pos-current-user", JSON.stringify(currentUser))
      } else {
        localStorage.removeItem("pos-current-user")
      }
    }
  }, [currentUser])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos-users", JSON.stringify(users))
    }
  }, [users])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos-products", JSON.stringify(products))
    }
  }, [products])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos-customers", JSON.stringify(customers))
    }
  }, [customers])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos-sales", JSON.stringify(sales))
    }
  }, [sales])

  // Auth functions
  const login = async (pin: string): Promise<boolean> => {
    const user = users.find((u) => u.pin === pin && u.isActive)
    if (user) {
      setCurrentUser(user)
      return true
    }
    return false
  }

  const logout = () => {
    setCurrentUser(null)
  }

  // Product functions
  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct = { ...product, id: Date.now().toString() }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, product: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...product } : p)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // Customer functions
  const addCustomer = (customer: Omit<Customer, "id" | "totalSpent" | "lastVisit">) => {
    const newCustomer = {
      ...customer,
      id: Date.now().toString(),
      totalSpent: 0,
      lastVisit: new Date().toISOString().split("T")[0],
    }
    setCustomers((prev) => [...prev, newCustomer])
  }

  const updateCustomer = (id: string, customer: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...customer } : c)))
  }

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  // Sales functions
  const addSale = (sale: Omit<Sale, "id" | "timestamp" | "receiptNumber">) => {
    const newSale = {
      ...sale,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      receiptNumber: `RCP${Date.now()}`,
    }
    setSales((prev) => [...prev, newSale])

    // Update product stock
    sale.items.forEach((item) => {
      updateProduct(item.productId, {
        stock: products.find((p) => p.id === item.productId)!.stock - item.quantity,
      })
    })
  }

  // User functions
  const addUser = (user: Omit<User, "id">) => {
    const newUser = { ...user, id: Date.now().toString() }
    setUsers((prev) => [...prev, newUser])
  }

  const updateUser = (id: string, user: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...user } : u)))
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const value: DataStoreContextType = {
    currentUser,
    login,
    logout,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    sales,
    addSale,
    users,
    addUser,
    updateUser,
    deleteUser,
  }

  return <DataStoreContext.Provider value={value}>{children}</DataStoreContext.Provider>
}

export function useDataStore() {
  const context = useContext(DataStoreContext)
  if (context === undefined) {
    throw new Error("useDataStore must be used within a DataStoreProvider")
  }
  return context
}
