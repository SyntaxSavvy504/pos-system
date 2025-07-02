"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { LoyaltySystem, type LoyaltyCustomer, type LoyaltyReward } from "./loyalty-system"

// Types
export interface Product {
  id: string
  name: string
  price: number
  category: string
  stock: number
  barcode?: string
  image?: string
  description?: string
  cost?: number
  supplier?: string
  minStock?: number
  maxStock?: number
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
  notes?: string
}

export interface Employee {
  id: string
  name: string
  email: string
  role: "admin" | "manager" | "cashier"
  pin: string
  permissions: string[]
  isActive: boolean
  hireDate: string
  hourlyRate?: number
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
  loyaltyPointsEarned?: number
  couponUsed?: string
}

export interface SaleItem {
  productId: string
  name: string
  price: number
  quantity: number
  total: number
}

export interface Coupon {
  id: string
  code: string
  name: string
  description: string
  discountType: "percentage" | "fixed"
  discountValue: number
  minPurchase?: number
  maxDiscount?: number
  expiryDate: string
  usageLimit?: number
  usedCount: number
  isActive: boolean
  createdDate: string
}

// Context
interface MultiStoreDataContextType {
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

  // Employees
  employees: Employee[]
  addEmployee: (employee: Omit<Employee, "id">) => void
  updateEmployee: (id: string, employee: Partial<Employee>) => void
  deleteEmployee: (id: string) => void

  // Sales
  sales: Sale[]
  addSale: (sale: Omit<Sale, "id" | "timestamp" | "receiptNumber">) => void

  // Coupons
  coupons: Coupon[]
  addCoupon: (coupon: Omit<Coupon, "id" | "usedCount" | "createdDate">) => void
  updateCoupon: (id: string, coupon: Partial<Coupon>) => void
  deleteCoupon: (id: string) => void

  // Loyalty
  loyaltyCustomers: LoyaltyCustomer[]
  loyaltyRewards: LoyaltyReward[]
  addLoyaltyCustomer: (
    customer: Omit<
      LoyaltyCustomer,
      | "id"
      | "loyaltyNumber"
      | "points"
      | "tier"
      | "totalSpent"
      | "joinDate"
      | "lastActivity"
      | "pointsHistory"
      | "rewardsRedeemed"
    >,
  ) => void
  updateLoyaltyCustomer: (id: string, customer: Partial<LoyaltyCustomer>) => void
  addLoyaltyReward: (reward: Omit<LoyaltyReward, "id" | "isActive" | "usedCount">) => void
}

const MultiStoreDataContext = createContext<MultiStoreDataContextType | undefined>(undefined)

// Sample data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Coffee - Premium Blend",
    price: 12.99,
    category: "Beverages",
    stock: 50,
    barcode: "123456789012",
    cost: 8.5,
    supplier: "Coffee Co.",
    minStock: 10,
    maxStock: 100,
  },
  {
    id: "2",
    name: "Organic Tea - Earl Grey",
    price: 8.99,
    category: "Beverages",
    stock: 30,
    barcode: "123456789013",
    cost: 5.5,
    supplier: "Tea Masters",
    minStock: 5,
    maxStock: 50,
  },
  {
    id: "3",
    name: "Chocolate Bar - Dark 70%",
    price: 4.99,
    category: "Snacks",
    stock: 75,
    barcode: "123456789014",
    cost: 2.5,
    supplier: "Choco Delights",
    minStock: 20,
    maxStock: 100,
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

const sampleEmployees: Employee[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@store.com",
    role: "admin",
    pin: "1234",
    permissions: ["all"],
    isActive: true,
    hireDate: "2023-01-15",
    hourlyRate: 25.0,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@store.com",
    role: "manager",
    pin: "5678",
    permissions: ["sales", "inventory", "customers", "reports"],
    isActive: true,
    hireDate: "2023-03-20",
    hourlyRate: 20.0,
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@store.com",
    role: "cashier",
    pin: "9012",
    permissions: ["sales", "customers"],
    isActive: true,
    hireDate: "2023-06-10",
    hourlyRate: 15.0,
  },
]

const sampleCoupons: Coupon[] = [
  {
    id: "1",
    code: "SAVE10",
    name: "10% Off Everything",
    description: "Get 10% off your entire purchase",
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 50,
    maxDiscount: 25,
    expiryDate: "2024-12-31",
    usageLimit: 100,
    usedCount: 15,
    isActive: true,
    createdDate: "2024-01-01",
  },
  {
    id: "2",
    code: "WELCOME5",
    name: "$5 Off First Purchase",
    description: "New customer discount - $5 off your first purchase",
    discountType: "fixed",
    discountValue: 5,
    minPurchase: 25,
    expiryDate: "2024-06-30",
    usageLimit: 50,
    usedCount: 8,
    isActive: true,
    createdDate: "2024-01-01",
  },
]

const sampleLoyaltyCustomers: LoyaltyCustomer[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "(555) 111-2222",
    loyaltyNumber: "LOY123456789",
    points: 1250,
    tier: "Silver",
    totalSpent: 750.0,
    joinDate: "2023-06-15",
    lastActivity: "2024-01-10",
    pointsHistory: [
      {
        id: "1",
        type: "earned",
        points: 75,
        description: "Purchase #12345",
        transactionId: "12345",
        timestamp: "2024-01-10T10:30:00Z",
      },
      {
        id: "2",
        type: "redeemed",
        points: 500,
        description: "$5 Off Reward",
        timestamp: "2024-01-05T14:20:00Z",
      },
    ],
    rewardsRedeemed: [
      {
        id: "1",
        rewardId: "reward-1",
        rewardName: "$5 Off Purchase",
        pointsCost: 500,
        timestamp: "2024-01-05T14:20:00Z",
      },
    ],
  },
  {
    id: "2",
    name: "Bob Wilson",
    email: "bob@example.com",
    phone: "(555) 333-4444",
    loyaltyNumber: "LOY987654321",
    points: 2800,
    tier: "Gold",
    totalSpent: 2100.0,
    joinDate: "2023-03-20",
    lastActivity: "2024-01-12",
    pointsHistory: [
      {
        id: "3",
        type: "earned",
        points: 150,
        description: "Purchase #12346",
        transactionId: "12346",
        timestamp: "2024-01-12T16:45:00Z",
      },
    ],
    rewardsRedeemed: [],
  },
]

// Provider component
export function MultiStoreDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers)
  const [employees, setEmployees] = useState<Employee[]>(sampleEmployees)
  const [sales, setSales] = useState<Sale[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>(sampleCoupons)
  const [loyaltyCustomers, setLoyaltyCustomers] = useState<LoyaltyCustomer[]>(sampleLoyaltyCustomers)
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(LoyaltySystem.DEFAULT_REWARDS)

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("pos-products")
      const savedCustomers = localStorage.getItem("pos-customers")
      const savedEmployees = localStorage.getItem("pos-employees")
      const savedSales = localStorage.getItem("pos-sales")
      const savedCoupons = localStorage.getItem("pos-coupons")
      const savedLoyaltyCustomers = localStorage.getItem("pos-loyalty-customers")
      const savedLoyaltyRewards = localStorage.getItem("pos-loyalty-rewards")

      if (savedProducts) setProducts(JSON.parse(savedProducts))
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers))
      if (savedEmployees) setEmployees(JSON.parse(savedEmployees))
      if (savedSales) setSales(JSON.parse(savedSales))
      if (savedCoupons) setCoupons(JSON.parse(savedCoupons))
      if (savedLoyaltyCustomers) setLoyaltyCustomers(JSON.parse(savedLoyaltyCustomers))
      if (savedLoyaltyRewards) setLoyaltyRewards(JSON.parse(savedLoyaltyRewards))
    }
  }, [])

  // Save to localStorage whenever data changes
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
      localStorage.setItem("pos-employees", JSON.stringify(employees))
    }
  }, [employees])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos-sales", JSON.stringify(sales))
    }
  }, [sales])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos-coupons", JSON.stringify(coupons))
    }
  }, [coupons])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos-loyalty-customers", JSON.stringify(loyaltyCustomers))
    }
  }, [loyaltyCustomers])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("pos-loyalty-rewards", JSON.stringify(loyaltyRewards))
    }
  }, [loyaltyRewards])

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

  // Employee functions
  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = { ...employee, id: Date.now().toString() }
    setEmployees((prev) => [...prev, newEmployee])
  }

  const updateEmployee = (id: string, employee: Partial<Employee>) => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...employee } : e)))
  }

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
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

  // Coupon functions
  const addCoupon = (coupon: Omit<Coupon, "id" | "usedCount" | "createdDate">) => {
    const newCoupon = {
      ...coupon,
      id: Date.now().toString(),
      usedCount: 0,
      createdDate: new Date().toISOString().split("T")[0],
    }
    setCoupons((prev) => [...prev, newCoupon])
  }

  const updateCoupon = (id: string, coupon: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...coupon } : c)))
  }

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
  }

  // Loyalty functions
  const addLoyaltyCustomer = (
    customer: Omit<
      LoyaltyCustomer,
      | "id"
      | "loyaltyNumber"
      | "points"
      | "tier"
      | "totalSpent"
      | "joinDate"
      | "lastActivity"
      | "pointsHistory"
      | "rewardsRedeemed"
    >,
  ) => {
    const newCustomer: LoyaltyCustomer = {
      ...customer,
      id: Date.now().toString(),
      loyaltyNumber: LoyaltySystem.generateLoyaltyNumber(),
      points: 0,
      tier: "Bronze",
      totalSpent: 0,
      joinDate: new Date().toISOString().split("T")[0],
      lastActivity: new Date().toISOString(),
      pointsHistory: [],
      rewardsRedeemed: [],
    }
    setLoyaltyCustomers((prev) => [...prev, newCustomer])
  }

  const updateLoyaltyCustomer = (id: string, customer: Partial<LoyaltyCustomer>) => {
    setLoyaltyCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...customer } : c)))
  }

  const addLoyaltyReward = (reward: Omit<LoyaltyReward, "id" | "isActive" | "usedCount">) => {
    const newReward: LoyaltyReward = {
      ...reward,
      id: Date.now().toString(),
      isActive: true,
      usedCount: 0,
    }
    setLoyaltyRewards((prev) => [...prev, newReward])
  }

  const value: MultiStoreDataContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    employees,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    sales,
    addSale,
    coupons,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    loyaltyCustomers,
    loyaltyRewards,
    addLoyaltyCustomer,
    updateLoyaltyCustomer,
    addLoyaltyReward,
  }

  return <MultiStoreDataContext.Provider value={value}>{children}</MultiStoreDataContext.Provider>
}

export function useMultiStoreData() {
  const context = useContext(MultiStoreDataContext)
  if (context === undefined) {
    throw new Error("useMultiStoreData must be used within a MultiStoreDataProvider")
  }
  return context
}
