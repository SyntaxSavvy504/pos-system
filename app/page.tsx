"use client"

import { useState } from "react"
import { LoginScreen } from "@/components/login-screen"
import { AuthProvider, useAuth } from "@/components/auth-provider"
import { SalesInterface } from "@/components/sales-interface"
import { ProductManagement } from "@/components/product-management"
import { CustomerManagement } from "@/components/customer-management"
import { ReportsAnalytics } from "@/components/reports-analytics"
import { EmployeeManagement } from "@/components/employee-management"
import { SettingsPage } from "@/components/settings-page"
import { LoyaltyManagement } from "@/components/loyalty-management"
import { CouponDiscountManager } from "@/components/coupon-discount-manager"
import { ActivityHistory } from "@/components/activity-history"
import { AdvancedReports } from "@/components/advanced-reports"
import { MultiStoreAnalytics } from "@/components/multi-store-analytics"
import { NotificationCenter } from "@/components/notification-center"
import { PermissionGuard } from "@/components/permission-guard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  UserCheck,
  Settings,
  Star,
  Ticket,
  Activity,
  TrendingUp,
  Store,
  LogOut,
  Menu,
  X,
} from "lucide-react"

function MainApp() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("sales")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!user) {
    return <LoginScreen />
  }

  const navigationItems = [
    { id: "sales", label: "Sales", icon: ShoppingCart, permission: "sales" },
    { id: "products", label: "Products", icon: Package, permission: "inventory" },
    { id: "customers", label: "Customers", icon: Users, permission: "customers" },
    { id: "reports", label: "Reports", icon: BarChart3, permission: "reports" },
    { id: "employees", label: "Employees", icon: UserCheck, permission: "employees" },
    { id: "loyalty", label: "Loyalty", icon: Star, permission: "loyalty" },
    { id: "coupons", label: "Coupons", icon: Ticket, permission: "coupons" },
    { id: "activity", label: "Activity", icon: Activity, permission: "activity" },
    { id: "advanced", label: "Advanced Reports", icon: TrendingUp, permission: "reports" },
    { id: "multistore", label: "Multi-Store", icon: Store, permission: "multistore" },
    { id: "settings", label: "Settings", icon: Settings, permission: "settings" },
  ]

  const filteredNavItems = navigationItems.filter((item) => {
    if (user.role === "admin") return true
    if (user.role === "manager") {
      return !["employees", "multistore", "settings"].includes(item.id)
    }
    return ["sales", "customers"].includes(item.id)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-white/80 backdrop-blur-xl border-r border-white/20 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Demo POS
              </h1>
              <p className="text-sm text-gray-600">{user.name}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {user.role}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {filteredNavItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                  : "hover:bg-white/50"
              }`}
              onClick={() => {
                setActiveTab(item.id)
                setSidebarOpen(false)
              }}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            variant="outline"
            className="w-full justify-start bg-white/50 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
            onClick={logout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {navigationItems.find((item) => item.id === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Online
              </Badge>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === "sales" && <SalesInterface />}
            {activeTab === "products" && (
              <PermissionGuard permission="inventory">
                <ProductManagement />
              </PermissionGuard>
            )}
            {activeTab === "customers" && (
              <PermissionGuard permission="customers">
                <CustomerManagement />
              </PermissionGuard>
            )}
            {activeTab === "reports" && (
              <PermissionGuard permission="reports">
                <ReportsAnalytics />
              </PermissionGuard>
            )}
            {activeTab === "employees" && (
              <PermissionGuard permission="employees">
                <EmployeeManagement />
              </PermissionGuard>
            )}
            {activeTab === "loyalty" && (
              <PermissionGuard permission="loyalty">
                <LoyaltyManagement />
              </PermissionGuard>
            )}
            {activeTab === "coupons" && (
              <PermissionGuard permission="coupons">
                <CouponDiscountManager />
              </PermissionGuard>
            )}
            {activeTab === "activity" && (
              <PermissionGuard permission="activity">
                <ActivityHistory />
              </PermissionGuard>
            )}
            {activeTab === "advanced" && (
              <PermissionGuard permission="reports">
                <AdvancedReports />
              </PermissionGuard>
            )}
            {activeTab === "multistore" && (
              <PermissionGuard permission="multistore">
                <MultiStoreAnalytics />
              </PermissionGuard>
            )}
            {activeTab === "settings" && (
              <PermissionGuard permission="settings">
                <SettingsPage />
              </PermissionGuard>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}
