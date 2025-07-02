"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart } from "lucide-react"
import { useMultiStoreData } from "@/lib/multi-store-data"

export function AdvancedReports() {
  const {
    getTransactionsByStore,
    getProductsByStore,
    currentStore,
    stores,
    getMultiStoreAnalytics,
    getStoreComparison,
  } = useMultiStoreData()

  const [selectedStore, setSelectedStore] = useState(currentStore.id)
  const [dateRange, setDateRange] = useState("7d")

  const transactions = getTransactionsByStore(selectedStore).filter((t) => t.status === "completed")
  const products = getProductsByStore(selectedStore)
  const multiStoreAnalytics = getMultiStoreAnalytics()
  const storeComparison = getStoreComparison()

  // Calculate metrics
  const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0)
  const totalTransactions = transactions.length
  const averageOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock <= 5).length

  // Top selling products
  const productSales = transactions.reduce(
    (acc, transaction) => {
      transaction.items.forEach((item) => {
        if (!acc[item.productId]) {
          acc[item.productId] = {
            id: item.productId,
            name: item.productName,
            quantity: 0,
            revenue: 0,
          }
        }
        acc[item.productId].quantity += item.quantity
        acc[item.productId].revenue += item.total
      })
      return acc
    },
    {} as Record<string, any>,
  )

  const topProducts = Object.values(productSales)
    .sort((a: any, b: any) => b.quantity - a.quantity)
    .slice(0, 10)

  // Sales by payment method
  const paymentMethodStats = transactions.reduce(
    (acc, transaction) => {
      if (!acc[transaction.paymentMethod]) {
        acc[transaction.paymentMethod] = { count: 0, total: 0 }
      }
      acc[transaction.paymentMethod].count++
      acc[transaction.paymentMethod].total += transaction.total
      return acc
    },
    {} as Record<string, any>,
  )

  // Recent transactions
  const recentTransactions = transactions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)

  const exportReport = (type: string) => {
    const reportData = {
      store: stores.find((s) => s.id === selectedStore)?.name,
      dateRange,
      generatedAt: new Date().toISOString(),
      metrics: {
        totalRevenue,
        totalTransactions,
        averageOrderValue,
        totalProducts,
        lowStockProducts,
      },
      topProducts,
      paymentMethodStats,
      recentTransactions: recentTransactions.slice(0, 5),
    }

    const dataStr = JSON.stringify(reportData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${type}-report-${selectedStore}-${new Date().toISOString().split("T")[0]}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Advanced Reports</h2>
          <p className="text-muted-foreground">Detailed analytics and insights for your business</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportReport("sales")}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedStore} onValueChange={setSelectedStore}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {stores.map((store) => (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -2% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <Package className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="multi-store">Multi-Store Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(paymentMethodStats).map(([method, stats]: [string, any]) => (
                    <div key={method} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {method}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{stats.count} transactions</span>
                      </div>
                      <span className="font-medium">${stats.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-sm">{transaction.id}</div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.customerName} • {new Date(transaction.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${transaction.total.toFixed(2)}</div>
                        <Badge variant="outline" className="text-xs capitalize">
                          {transaction.paymentMethod}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Avg Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product: any, index) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">#{index + 1}</Badge>
                          {product.name}
                        </div>
                      </TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>${product.revenue.toFixed(2)}</TableCell>
                      <TableCell>${(product.revenue / product.quantity).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="multi-store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Avg Order Value</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Low Stock</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeComparison.map((storeData: any) => (
                    <TableRow key={storeData.store.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{storeData.store.name}</div>
                          <div className="text-xs text-muted-foreground">{storeData.store.manager}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">${storeData.totalSales.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            {storeData.salesPercentage.toFixed(1)}% of total
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{storeData.totalTransactions}</TableCell>
                      <TableCell>${storeData.averageOrderValue.toFixed(2)}</TableCell>
                      <TableCell>{storeData.productCount}</TableCell>
                      <TableCell>
                        <Badge variant={storeData.lowStockItems > 0 ? "destructive" : "default"}>
                          {storeData.lowStockItems}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
