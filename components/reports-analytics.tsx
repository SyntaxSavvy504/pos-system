"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users } from "lucide-react"

const salesData = [
  { date: "2024-01-15", sales: 1250.75, transactions: 23, customers: 18 },
  { date: "2024-01-14", sales: 980.5, transactions: 19, customers: 15 },
  { date: "2024-01-13", sales: 1450.25, transactions: 28, customers: 22 },
  { date: "2024-01-12", sales: 1100.0, transactions: 21, customers: 17 },
  { date: "2024-01-11", sales: 890.75, transactions: 16, customers: 13 },
  { date: "2024-01-10", sales: 1320.5, transactions: 25, customers: 20 },
  { date: "2024-01-09", sales: 1180.25, transactions: 22, customers: 19 },
]

const topProducts = [
  { name: "Wireless Headphones", sold: 45, revenue: 4499.55, trend: "up" },
  { name: "Coffee Mug", sold: 89, revenue: 1156.11, trend: "up" },
  { name: "Desk Lamp", sold: 23, revenue: 1057.77, trend: "down" },
  { name: "Phone Case", sold: 67, revenue: 1674.33, trend: "up" },
  { name: "Water Bottle", sold: 34, revenue: 645.66, trend: "down" },
]

const recentTransactions = [
  { id: "TXN001", date: "2024-01-15", customer: "John Doe", amount: 145.99, items: 3, status: "completed" },
  { id: "TXN002", date: "2024-01-15", customer: "Jane Smith", amount: 89.5, items: 2, status: "completed" },
  { id: "TXN003", date: "2024-01-15", customer: "Mike Johnson", amount: 234.75, items: 5, status: "completed" },
  { id: "TXN004", date: "2024-01-14", customer: "Sarah Wilson", amount: 67.25, items: 1, status: "refunded" },
  { id: "TXN005", date: "2024-01-14", customer: "Tom Brown", amount: 156.8, items: 4, status: "completed" },
]

export function ReportsAnalytics() {
  const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0)
  const totalTransactions = salesData.reduce((sum, day) => sum + day.transactions, 0)
  const averageOrderValue = totalSales / totalTransactions

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports & Analytics</h2>
        <p className="text-muted-foreground">Track your business performance and insights</p>
      </div>

      {/* Time Period Selector */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Select defaultValue="7days">
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
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
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +8% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -2% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +15% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Sales</CardTitle>
            <CardDescription>Sales performance over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{day.date}</div>
                    <div className="text-sm text-muted-foreground">
                      {day.transactions} transactions • {day.customers} customers
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">${day.sales.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      ${(day.sales / day.transactions).toFixed(2)} avg
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing products this period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.sold} units sold</div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <div>
                      <div className="font-bold">${product.revenue.toFixed(2)}</div>
                    </div>
                    {product.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest sales activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.customer}</TableCell>
                  <TableCell>{transaction.items}</TableCell>
                  <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "refunded"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
