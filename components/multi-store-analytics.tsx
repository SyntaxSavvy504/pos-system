"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Store, DollarSign, ShoppingCart, Package, AlertTriangle } from "lucide-react"
import { useMultiStoreData } from "@/lib/multi-store-data"

export function MultiStoreAnalytics() {
  const { stores, getMultiStoreAnalytics, getStoreComparison, currentStore, setCurrentStore } = useMultiStoreData()
  const [dateRange, setDateRange] = useState("30days")

  const storeAnalytics = getMultiStoreAnalytics()
  const storeComparison = getStoreComparison()

  const totalSales = storeAnalytics.reduce((sum, a) => sum + a.totalSales, 0)
  const totalTransactions = storeAnalytics.reduce((sum, a) => sum + a.totalTransactions, 0)
  const totalProducts = storeAnalytics.reduce((sum, a) => sum + a.productCount, 0)
  const totalLowStock = storeAnalytics.reduce((sum, a) => sum + a.lowStockItems, 0)

  const bestPerformingStore = storeAnalytics.reduce((best, current) =>
    current.totalSales > best.totalSales ? current : best,
  )

  const worstPerformingStore = storeAnalytics.reduce((worst, current) =>
    current.totalSales < worst.totalSales ? current : worst,
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Multi-Store Analytics</h2>
          <p className="text-muted-foreground">Compare performance across all store locations</p>
        </div>
        <div className="flex gap-4">
          <Select
            value={currentStore.id}
            onValueChange={(value) => setCurrentStore(stores.find((s) => s.id === value)!)}
          >
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
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparison">Store Comparison</TabsTrigger>
          <TabsTrigger value="performance">Performance Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Network Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Network Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Across {stores.length} stores</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTransactions}</div>
                <p className="text-xs text-muted-foreground">Network wide</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProducts}</div>
                <p className="text-xs text-muted-foreground">In inventory</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{totalLowStock}</div>
                <p className="text-xs text-muted-foreground">Items need restocking</p>
              </CardContent>
            </Card>
          </div>

          {/* Store Performance Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Best Performing Store
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span className="font-medium">{bestPerformingStore.store.name}</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">${bestPerformingStore.totalSales.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    {bestPerformingStore.totalTransactions} transactions • $
                    {bestPerformingStore.averageOrderValue.toFixed(2)} avg order
                  </div>
                  <div className="text-sm text-muted-foreground">{bestPerformingStore.store.address}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  Needs Attention
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    <span className="font-medium">{worstPerformingStore.store.name}</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">${worstPerformingStore.totalSales.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">
                    {worstPerformingStore.totalTransactions} transactions • $
                    {worstPerformingStore.averageOrderValue.toFixed(2)} avg order
                  </div>
                  <div className="text-sm text-muted-foreground">{worstPerformingStore.store.address}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Performance Comparison</CardTitle>
              <CardDescription>Compare sales performance across all locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {storeComparison.map((store) => (
                  <div key={store.store.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Store className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{store.store.name}</div>
                          <div className="text-sm text-muted-foreground">{store.store.address}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${store.totalSales.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          {store.salesPercentage.toFixed(1)}% of total
                        </div>
                      </div>
                    </div>
                    <Progress value={store.salesPercentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{store.totalTransactions} transactions</span>
                      <span>${store.averageOrderValue.toFixed(2)} avg order</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Store Metrics</CardTitle>
              <CardDescription>Comprehensive performance data for each location</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Store</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Transactions</TableHead>
                    <TableHead>Avg Order</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Low Stock</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storeAnalytics.map((analytics) => (
                    <TableRow key={analytics.store.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{analytics.store.name}</div>
                          <div className="text-sm text-muted-foreground">{analytics.store.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{analytics.store.manager}</TableCell>
                      <TableCell>${analytics.totalSales.toFixed(2)}</TableCell>
                      <TableCell>{analytics.totalTransactions}</TableCell>
                      <TableCell>${analytics.averageOrderValue.toFixed(2)}</TableCell>
                      <TableCell>{analytics.productCount}</TableCell>
                      <TableCell>
                        {analytics.lowStockItems > 0 ? (
                          <Badge variant="destructive">{analytics.lowStockItems}</Badge>
                        ) : (
                          <Badge variant="default">0</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={analytics.store.status === "active" ? "default" : "secondary"}>
                          {analytics.store.status}
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
