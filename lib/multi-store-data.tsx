"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Types
export interface Store {
  id: string
  name: string
  address: string
  phone: string
  email: string
  manager: string
  status: "active" | "inactive"
  timezone: string
  createdAt: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  sku: string
  description: string
  status: "active" | "inactive"
  storeId: string
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export interface Transaction {
  id: string
  storeId: string
  customerId?: string
  customerName: string
  loyaltyCustomerId?: string
  items: TransactionItem[]
  subtotal: number
  discountAmount: number
  couponCode?: string
  loyaltyDiscount?: number
  loyaltyPointsEarned?: number
  tax: number
  total: number
  paymentMethod: "cash" | "card" | "digital"
  amountReceived?: number
  change?: number
  status: "completed" | "refunded" | "cancelled"
  createdAt: string
  createdBy: string
  refundedAt?: string
  refundedBy?: string
}

export interface TransactionItem {
  productId: string
  productName: string
  price: number
  quantity: number
  discount: number
  total: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  totalSpent: number
  lastVisit: string
  status: "active" | "inactive"
  createdAt: string
  updatedAt: string
}

export interface Coupon {
  id: string
  code: string
  name: string
  description?: string
  type: "percentage" | "fixed" | "buy_x_get_y"
  value: number
  minPurchase?: number
  maxDiscount?: number
  buyQuantity?: number
  getQuantity?: number
  applicableProducts?: string[]
  applicableCategories?: string[]
  validFrom: string
  validTo: string
  usageLimit?: number
  usedCount: number
  storeIds: string[]
  status: "active" | "inactive" | "expired"
  createdAt: string
  createdBy: string
}

export interface Discount {
  id: string
  name: string
  type: "percentage" | "fixed"
  value: number
  applicableProducts?: string[]
  applicableCategories?: string[]
  minQuantity?: number
  storeIds: string[]
  status: "active" | "inactive"
  createdAt: string
}

export interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  storeId?: string
  userId?: string
  read: boolean
  createdAt: string
  expiresAt?: string
}

export interface LoyaltyCustomer {
  id: string
  name: string
  email: string
  phone: string
  loyaltyNumber: string
  points: number
  tier: "Bronze" | "Silver" | "Gold" | "Platinum"
  totalSpent: number
  joinDate: string
  lastActivity: string
  pointsHistory: PointsTransaction[]
  rewardsRedeemed: RewardRedemption[]
}

export interface PointsTransaction {
  id: string
  type: "earned" | "redeemed"
  points: number
  description: string
  transactionId?: string
  timestamp: string
}

export interface RewardRedemption {
  id: string
  rewardId: string
  rewardName: string
  pointsCost: number
  timestamp: string
}

export interface LoyaltyReward {
  id: string
  name: string
  description: string
  pointsCost: number
  discountType: "fixed" | "percentage"
  discountValue: number
  minPurchase?: number
  isActive: boolean
  usedCount: number
}

export interface ActivityLog {
  id: string
  type: "product" | "transaction" | "customer" | "employee" | "system"
  action: "create" | "update" | "delete" | "login" | "logout" | "sale" | "refund"
  entityId: string
  entityName: string
  userId: string
  userName: string
  details: string
  oldData?: any
  newData?: any
  timestamp: string
}

export interface StockMovement {
  id: string
  productId: string
  productName: string
  type: "sale" | "restock" | "adjustment" | "return"
  quantity: number
  previousStock: number
  newStock: number
  reason?: string
  userId: string
  userName: string
  timestamp: string
}

// Context
interface MultiStoreDataContextType {
  // Current store
  currentStore: Store
  setCurrentStore: (store: Store) => void
  stores: Store[]

  // Products
  products: Product[]
  getProductsByStore: (storeId: string) => Product[]
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateStock: (productId: string, quantity: number, type: "sale" | "restock" | "adjustment") => void

  // Transactions
  transactions: Transaction[]
  getTransactionsByStore: (storeId: string) => Transaction[]
  addTransaction: (transaction: Omit<Transaction, "id" | "createdAt" | "createdBy">) => void

  // Coupons & Discounts
  coupons: Coupon[]
  discounts: Discount[]
  addCoupon: (coupon: Omit<Coupon, "id" | "createdAt" | "usedCount">) => void
  updateCoupon: (id: string, updates: Partial<Coupon>) => void
  deleteCoupon: (id: string) => void
  validateCoupon: (code: string, storeId: string, total: number) => { valid: boolean; coupon?: Coupon; error?: string }
  applyCoupon: (coupon: Coupon, items: TransactionItem[]) => number

  // Loyalty Program
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
  updateLoyaltyCustomer: (id: string, updates: Partial<LoyaltyCustomer>) => void
  addLoyaltyReward: (reward: Omit<LoyaltyReward, "id" | "isActive" | "usedCount">) => void
  findLoyaltyCustomer: (identifier: string) => LoyaltyCustomer | undefined
  processLoyaltyTransaction: (
    customerId: string,
    amount: number,
    transactionId: string,
  ) => { pointsEarned: number; newTier?: string }
  redeemLoyaltyReward: (customerId: string, rewardId: string) => { success: boolean; discount: number; error?: string }

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void
  markNotificationRead: (id: string) => void
  getUnreadCount: () => number

  // Customers
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, "id" | "totalSpent" | "lastVisit" | "createdAt" | "updatedAt">) => void
  updateCustomer: (id: string, updates: Partial<Customer>) => void

  // Activity & History
  activityLogs: ActivityLog[]
  stockMovements: StockMovement[]

  // Real-time stats
  todayStats: {
    sales: number
    transactions: number
    customers: number
    topProducts: Array<{ id: string; name: string; sold: number; revenue: number }>
  }

  // Analytics
  getMultiStoreAnalytics: () => Array<{
    store: Store
    totalSales: number
    totalTransactions: number
    averageOrderValue: number
    productCount: number
    lowStockItems: number
  }>
  getStoreComparison: () => Array<{
    store: Store
    totalSales: number
    totalTransactions: number
    averageOrderValue: number
    productCount: number
    lowStockItems: number
    salesPercentage: number
  }>

  // Sync
  syncData: () => void
  lastSyncTime: string
}

const MultiStoreDataContext = createContext<MultiStoreDataContextType | undefined>(undefined)

// Initial data
const initialStores: Store[] = [
  {
    id: "store1",
    name: "Downtown Store",
    address: "123 Main St, Downtown",
    phone: "+1 (555) 123-4567",
    email: "downtown@retailpos.com",
    manager: "John Smith",
    status: "active",
    timezone: "America/New_York",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "store2",
    name: "Mall Location",
    address: "456 Shopping Mall, Suite 200",
    phone: "+1 (555) 987-6543",
    email: "mall@retailpos.com",
    manager: "Sarah Johnson",
    status: "active",
    timezone: "America/New_York",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "store3",
    name: "Airport Branch",
    address: "789 Airport Terminal, Gate A12",
    phone: "+1 (555) 456-7890",
    email: "airport@retailpos.com",
    manager: "Mike Davis",
    status: "active",
    timezone: "America/New_York",
    createdAt: "2024-01-01T10:00:00Z",
  },
]

const initialProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "Electronics",
    price: 99.99,
    stock: 25,
    sku: "WH001",
    description: "High-quality wireless headphones with noise cancellation",
    status: "active",
    storeId: "store1",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "2",
    name: "Coffee Mug",
    category: "Home & Kitchen",
    price: 12.99,
    stock: 50,
    sku: "CM001",
    description: "Ceramic coffee mug with ergonomic handle",
    status: "active",
    storeId: "store1",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "3",
    name: "Notebook",
    category: "Stationery",
    price: 5.99,
    stock: 15,
    sku: "NB001",
    description: "A5 lined notebook with hardcover",
    status: "active",
    storeId: "store2",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "4",
    name: "Smartphone Case",
    category: "Electronics",
    price: 24.99,
    stock: 30,
    sku: "SC001",
    description: "Protective smartphone case with screen protector",
    status: "active",
    storeId: "store2",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    createdBy: "system",
    updatedBy: "system",
  },
  {
    id: "5",
    name: "Water Bottle",
    category: "Sports",
    price: 18.99,
    stock: 40,
    sku: "WB001",
    description: "Insulated stainless steel water bottle",
    status: "active",
    storeId: "store3",
    createdAt: "2024-01-01T10:00:00Z",
    updatedAt: "2024-01-01T10:00:00Z",
    createdBy: "system",
    updatedBy: "system",
  },
]

const initialCoupons: Coupon[] = [
  {
    id: "1",
    code: "SAVE10",
    name: "10% Off Everything",
    type: "percentage",
    value: 10,
    minPurchase: 50,
    maxDiscount: 100,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2024-12-31T23:59:59Z",
    usageLimit: 1000,
    usedCount: 45,
    storeIds: ["store1", "store2", "store3"],
    status: "active",
    createdAt: "2024-01-01T10:00:00Z",
    createdBy: "admin",
  },
  {
    id: "2",
    code: "WELCOME20",
    name: "Welcome Discount",
    type: "fixed",
    value: 20,
    minPurchase: 100,
    validFrom: "2024-01-01T00:00:00Z",
    validTo: "2024-06-30T23:59:59Z",
    usageLimit: 500,
    usedCount: 123,
    storeIds: ["store1"],
    status: "active",
    createdAt: "2024-01-01T10:00:00Z",
    createdBy: "admin",
  },
]

const initialCustomers: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    totalSpent: 1250.75,
    lastVisit: "2024-01-15",
    status: "active",
    createdAt: "2023-12-01T10:00:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    totalSpent: 890.5,
    lastVisit: "2024-01-10",
    status: "active",
    createdAt: "2023-11-15T10:00:00Z",
    updatedAt: "2024-01-10T16:20:00Z",
  },
]

const initialLoyaltyCustomers: LoyaltyCustomer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    loyaltyNumber: "LOY123456",
    points: 1250,
    tier: "Gold",
    totalSpent: 2100.5,
    joinDate: "2023-06-15T10:00:00Z",
    lastActivity: "2024-01-15T14:30:00Z",
    pointsHistory: [
      {
        id: "1",
        type: "earned",
        points: 105,
        description: "Purchase at Downtown Store",
        transactionId: "TXN001",
        timestamp: "2024-01-15T14:30:00Z",
      },
    ],
    rewardsRedeemed: [],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    loyaltyNumber: "LOY789012",
    points: 890,
    tier: "Silver",
    totalSpent: 750.25,
    joinDate: "2023-08-20T10:00:00Z",
    lastActivity: "2024-01-10T16:20:00Z",
    pointsHistory: [
      {
        id: "2",
        type: "earned",
        points: 75,
        description: "Purchase at Mall Location",
        transactionId: "TXN002",
        timestamp: "2024-01-10T16:20:00Z",
      },
    ],
    rewardsRedeemed: [],
  },
]

const initialLoyaltyRewards: LoyaltyReward[] = [
  {
    id: "1",
    name: "$5 Off Purchase",
    description: "Get $5 off your next purchase",
    pointsCost: 500,
    discountType: "fixed",
    discountValue: 5,
    minPurchase: 25,
    isActive: true,
    usedCount: 12,
  },
  {
    id: "2",
    name: "10% Off Everything",
    description: "Get 10% off your entire purchase",
    pointsCost: 1000,
    discountType: "percentage",
    discountValue: 10,
    minPurchase: 50,
    isActive: true,
    usedCount: 8,
  },
  {
    id: "3",
    name: "Free Shipping",
    description: "Free shipping on your next order",
    pointsCost: 300,
    discountType: "fixed",
    discountValue: 9.99,
    isActive: true,
    usedCount: 25,
  },
]

export function MultiStoreDataProvider({ children }: { children: React.ReactNode }) {
  const [currentStore, setCurrentStore] = useState<Store>(initialStores[0])
  const [stores] = useState<Store[]>(initialStores)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons)
  const [discounts] = useState<Discount[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loyaltyCustomers, setLoyaltyCustomers] = useState<LoyaltyCustomer[]>(initialLoyaltyCustomers)
  const [loyaltyRewards, setLoyaltyRewards] = useState<LoyaltyReward[]>(initialLoyaltyRewards)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([])
  const [lastSyncTime, setLastSyncTime] = useState<string>(new Date().toISOString())
  const [todayStats, setTodayStats] = useState({
    sales: 0,
    transactions: 0,
    customers: 0,
    topProducts: [] as Array<{ id: string; name: string; sold: number; revenue: number }>,
  })

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem("pos-user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        return { id: user.id, name: `${user.firstName} ${user.lastName}` }
      }
    } catch (error) {
      console.error("Error parsing stored user:", error)
    }
    return { id: "system", name: "System" }
  }

  // Products
  const getProductsByStore = (storeId: string) => {
    return products.filter((p) => p.storeId === storeId)
  }

  const addProduct = (productData: Omit<Product, "id" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy">) => {
    const user = getCurrentUser()
    const product: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.name || "System",
      updatedBy: user?.name || "System",
    }

    setProducts((prev) => [...prev, product])
    addNotification({
      type: "success",
      title: "Product Added",
      message: `${product.name} has been added to ${stores.find((s) => s.id === product.storeId)?.name}`,
      storeId: product.storeId,
    })
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const user = getCurrentUser()
    const oldProduct = products.find((p) => p.id === id)
    if (!oldProduct) return

    const updatedProduct = {
      ...oldProduct,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: user?.name || "System",
    }

    setProducts((prev) => prev.map((p) => (p.id === id ? updatedProduct : p)))
  }

  const deleteProduct = (id: string) => {
    const product = products.find((p) => p.id === id)
    if (!product) return

    setProducts((prev) => prev.filter((p) => p.id !== id))
    addNotification({
      type: "info",
      title: "Product Removed",
      message: `${product.name} has been removed from ${stores.find((s) => s.id === product.storeId)?.name}`,
      storeId: product.storeId,
    })
  }

  const updateStock = (productId: string, quantity: number, type: "sale" | "restock" | "adjustment") => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const newStock = type === "sale" ? product.stock - quantity : product.stock + quantity

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              stock: Math.max(0, newStock),
              updatedAt: new Date().toISOString(),
            }
          : p,
      ),
    )

    // Add low stock notification
    if (newStock <= 5 && newStock > 0) {
      addNotification({
        type: "warning",
        title: "Low Stock Alert",
        message: `${product.name} is running low (${newStock} left)`,
        storeId: product.storeId,
      })
    } else if (newStock === 0) {
      addNotification({
        type: "error",
        title: "Out of Stock",
        message: `${product.name} is now out of stock`,
        storeId: product.storeId,
      })
    }
  }

  // Transactions
  const getTransactionsByStore = (storeId: string) => {
    return transactions.filter((t) => t.storeId === storeId)
  }

  const addTransaction = (transactionData: Omit<Transaction, "id" | "createdAt" | "createdBy">) => {
    const user = getCurrentUser()
    const transaction: Transaction = {
      ...transactionData,
      id: `TXN${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || "System",
    }

    setTransactions((prev) => [transaction, ...prev])

    // Update stock for each item
    transaction.items.forEach((item) => {
      updateStock(item.productId, item.quantity, "sale")
    })

    // Update coupon usage if applicable
    if (transaction.couponCode) {
      setCoupons((prev) =>
        prev.map((c) => (c.code === transaction.couponCode ? { ...c, usedCount: c.usedCount + 1 } : c)),
      )
    }

    // Process loyalty points if customer is enrolled
    if (transaction.loyaltyCustomerId) {
      processLoyaltyTransaction(transaction.loyaltyCustomerId, transaction.total, transaction.id)
    }

    addNotification({
      type: "success",
      title: "Sale Completed",
      message: `Sale of $${transaction.total.toFixed(2)} completed at ${stores.find((s) => s.id === transaction.storeId)?.name}`,
      storeId: transaction.storeId,
    })
  }

  // Coupons
  const addCoupon = (couponData: Omit<Coupon, "id" | "createdAt" | "usedCount">) => {
    const coupon: Coupon = {
      ...couponData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      usedCount: 0,
    }

    setCoupons((prev) => [...prev, coupon])
    addNotification({
      type: "info",
      title: "New Coupon Created",
      message: `Coupon "${coupon.code}" has been created`,
    })
  }

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteCoupon = (id: string) => {
    const coupon = coupons.find((c) => c.id === id)
    if (!coupon) return

    setCoupons((prev) => prev.filter((c) => c.id !== id))
    addNotification({
      type: "info",
      title: "Coupon Deleted",
      message: `Coupon "${coupon.code}" has been deleted`,
    })
  }

  const validateCoupon = (code: string, storeId: string, total: number) => {
    const coupon = coupons.find((c) => c.code === code && c.status === "active")

    if (!coupon) {
      return { valid: false, error: "Invalid coupon code" }
    }

    if (!coupon.storeIds.includes(storeId)) {
      return { valid: false, error: "Coupon not valid for this store" }
    }

    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validTo = new Date(coupon.validTo)

    if (now < validFrom || now > validTo) {
      return { valid: false, error: "Coupon has expired" }
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: "Coupon usage limit reached" }
    }

    if (coupon.minPurchase && total < coupon.minPurchase) {
      return { valid: false, error: `Minimum purchase of $${coupon.minPurchase} required` }
    }

    return { valid: true, coupon }
  }

  const applyCoupon = (coupon: Coupon, items: TransactionItem[]) => {
    let discount = 0

    if (coupon.type === "percentage") {
      const subtotal = items.reduce((sum, item) => sum + item.total, 0)
      discount = (subtotal * coupon.value) / 100
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount)
      }
    } else if (coupon.type === "fixed") {
      discount = coupon.value
    }

    return discount
  }

  // Loyalty Program Functions
  const addLoyaltyCustomer = (
    customerData: Omit<
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
    const customer: LoyaltyCustomer = {
      ...customerData,
      id: Date.now().toString(),
      loyaltyNumber: `LOY${String(loyaltyCustomers.length + 1).padStart(6, "0")}`,
      points: 0,
      tier: "Bronze",
      totalSpent: 0,
      joinDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      pointsHistory: [],
      rewardsRedeemed: [],
    }

    setLoyaltyCustomers((prev) => [...prev, customer])
    addNotification({
      type: "success",
      title: "New Loyalty Member",
      message: `${customer.name} has joined the loyalty program`,
    })
  }

  const updateLoyaltyCustomer = (id: string, updates: Partial<LoyaltyCustomer>) => {
    setLoyaltyCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const addLoyaltyReward = (rewardData: Omit<LoyaltyReward, "id" | "isActive" | "usedCount">) => {
    const reward: LoyaltyReward = {
      ...rewardData,
      id: Date.now().toString(),
      isActive: true,
      usedCount: 0,
    }

    setLoyaltyRewards((prev) => [...prev, reward])
    addNotification({
      type: "info",
      title: "New Reward Added",
      message: `${reward.name} has been added to the loyalty program`,
    })
  }

  const findLoyaltyCustomer = (identifier: string): LoyaltyCustomer | undefined => {
    return loyaltyCustomers.find(
      (c) => c.loyaltyNumber === identifier || c.email === identifier || c.phone === identifier,
    )
  }

  const processLoyaltyTransaction = (customerId: string, amount: number, transactionId: string) => {
    const customer = loyaltyCustomers.find((c) => c.id === customerId)
    if (!customer) return { pointsEarned: 0 }

    const pointsEarned = Math.floor(amount) // 1 point per dollar
    const newTotalSpent = customer.totalSpent + amount

    // Determine tier based on total spent
    let newTier = customer.tier
    if (newTotalSpent >= 5000) newTier = "Platinum"
    else if (newTotalSpent >= 2000) newTier = "Gold"
    else if (newTotalSpent >= 500) newTier = "Silver"
    else newTier = "Bronze"

    const tierChanged = newTier !== customer.tier

    const pointsTransaction: PointsTransaction = {
      id: Date.now().toString(),
      type: "earned",
      points: pointsEarned,
      description: `Purchase - Transaction ${transactionId}`,
      transactionId,
      timestamp: new Date().toISOString(),
    }

    const updatedCustomer: LoyaltyCustomer = {
      ...customer,
      points: customer.points + pointsEarned,
      tier: newTier,
      totalSpent: newTotalSpent,
      lastActivity: new Date().toISOString(),
      pointsHistory: [pointsTransaction, ...customer.pointsHistory],
    }

    setLoyaltyCustomers((prev) => prev.map((c) => (c.id === customerId ? updatedCustomer : c)))

    if (tierChanged) {
      addNotification({
        type: "success",
        title: "Tier Upgrade!",
        message: `${customer.name} has been upgraded to ${newTier} tier!`,
      })
    }

    return { pointsEarned, newTier: tierChanged ? newTier : undefined }
  }

  const redeemLoyaltyReward = (customerId: string, rewardId: string) => {
    const customer = loyaltyCustomers.find((c) => c.id === customerId)
    const reward = loyaltyRewards.find((r) => r.id === rewardId)

    if (!customer || !reward) {
      return { success: false, discount: 0, error: "Customer or reward not found" }
    }

    if (customer.points < reward.pointsCost) {
      return { success: false, discount: 0, error: "Insufficient points" }
    }

    const pointsTransaction: PointsTransaction = {
      id: Date.now().toString(),
      type: "redeemed",
      points: reward.pointsCost,
      description: `Redeemed: ${reward.name}`,
      timestamp: new Date().toISOString(),
    }

    const redemption = {
      id: Date.now().toString(),
      rewardId: reward.id,
      rewardName: reward.name,
      pointsCost: reward.pointsCost,
      timestamp: new Date().toISOString(),
    }

    const updatedCustomer: LoyaltyCustomer = {
      ...customer,
      points: customer.points - reward.pointsCost,
      lastActivity: new Date().toISOString(),
      pointsHistory: [pointsTransaction, ...customer.pointsHistory],
      rewardsRedeemed: [redemption, ...customer.rewardsRedeemed],
    }

    setLoyaltyCustomers((prev) => prev.map((c) => (c.id === customerId ? updatedCustomer : c)))
    setLoyaltyRewards((prev) => prev.map((r) => (r.id === rewardId ? { ...r, usedCount: r.usedCount + 1 } : r)))

    return { success: true, discount: reward.discountValue }
  }

  // Notifications
  const addNotification = (notificationData: Omit<Notification, "id" | "createdAt" | "read">) => {
    const notification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      read: false,
    }

    setNotifications((prev) => [notification, ...prev])

    // Browser notification if supported
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
        })
      } catch (error) {
        console.error("Failed to show notification:", error)
      }
    }
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length
  }

  // Customers
  const addCustomer = (customerData: Omit<Customer, "id" | "totalSpent" | "lastVisit" | "createdAt" | "updatedAt">) => {
    const customer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      totalSpent: 0,
      lastVisit: "Never",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setCustomers((prev) => [...prev, customer])
    addNotification({
      type: "success",
      title: "New Customer",
      message: `${customer.name} has been added to the customer database`,
    })
  }

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, ...updates, updatedAt: new Date().toISOString() } : customer,
      ),
    )
  }

  // Analytics
  const getMultiStoreAnalytics = () => {
    const storeAnalytics = stores.map((store) => {
      const storeTransactions = getTransactionsByStore(store.id).filter((t) => t.status === "completed")
      const storeProducts = getProductsByStore(store.id)

      const totalSales = storeTransactions.reduce((sum, t) => sum + t.total, 0)
      const totalTransactions = storeTransactions.length
      const averageOrderValue = totalTransactions > 0 ? totalSales / totalTransactions : 0
      const lowStockItems = storeProducts.filter((p) => p.stock <= 5).length

      return {
        store,
        totalSales,
        totalTransactions,
        averageOrderValue,
        lowStockItems,
        productCount: storeProducts.length,
      }
    })

    return storeAnalytics
  }

  const getStoreComparison = () => {
    const analytics = getMultiStoreAnalytics()
    const totalSales = analytics.reduce((sum, a) => sum + a.totalSales, 0)

    return analytics.map((a) => ({
      ...a,
      salesPercentage: totalSales > 0 ? (a.totalSales / totalSales) * 100 : 0,
    }))
  }

  const syncData = () => {
    // Simulate data sync
    setLastSyncTime(new Date().toISOString())
    console.log("Data synced at:", new Date().toISOString())
  }

  // Calculate real-time stats
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0]
    const todayTransactions = transactions.filter((t) => t.createdAt.startsWith(today) && t.status === "completed")

    const sales = todayTransactions.reduce((sum, t) => sum + t.total, 0)
    const transactionCount = todayTransactions.length
    const uniqueCustomers = new Set(todayTransactions.map((t) => t.customerId).filter(Boolean)).size

    // Calculate top products
    const productSales = new Map<string, { name: string; sold: number; revenue: number }>()
    todayTransactions.forEach((transaction) => {
      transaction.items.forEach((item) => {
        const existing = productSales.get(item.productId) || { name: item.productName, sold: 0, revenue: 0 }
        productSales.set(item.productId, {
          name: item.productName,
          sold: existing.sold + item.quantity,
          revenue: existing.revenue + item.total,
        })
      })
    })

    const topProducts = Array.from(productSales.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    setTodayStats({
      sales,
      transactions: transactionCount,
      customers: uniqueCustomers,
      topProducts,
    })
  }, [transactions])

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(console.error)
    }
  }, [])

  return (
    <MultiStoreDataContext.Provider
      value={{
        currentStore,
        setCurrentStore,
        stores,
        products,
        getProductsByStore,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        transactions,
        getTransactionsByStore,
        addTransaction,
        coupons,
        discounts,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        validateCoupon,
        applyCoupon,
        loyaltyCustomers,
        loyaltyRewards,
        addLoyaltyCustomer,
        updateLoyaltyCustomer,
        addLoyaltyReward,
        findLoyaltyCustomer,
        processLoyaltyTransaction,
        redeemLoyaltyReward,
        notifications,
        addNotification,
        markNotificationRead,
        getUnreadCount,
        customers,
        addCustomer,
        updateCustomer,
        activityLogs,
        stockMovements,
        todayStats,
        getMultiStoreAnalytics,
        getStoreComparison,
        syncData,
        lastSyncTime,
      }}
    >
      {children}
    </MultiStoreDataContext.Provider>
  )
}

export function useMultiStoreData() {
  const context = useContext(MultiStoreDataContext)
  if (context === undefined) {
    throw new Error("useMultiStoreData must be used within a MultiStoreDataProvider")
  }
  return context
}
