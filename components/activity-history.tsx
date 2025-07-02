"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock, Package, ShoppingCart, AlertTriangle } from "lucide-react"
import { useMultiStoreData } from "@/lib/multi-store-data"

export function ActivityHistory() {
  const { notifications, transactions, currentStore, stores } = useMultiStoreData()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedStore, setSelectedStore] = useState("all")

  // Combine notifications and transactions into activity feed
  const activities = [
    ...notifications.map((notification) => ({
      id: notification.id,
      type: "notification",
      title: notification.title,
      description: notification.message,
      timestamp: notification.createdAt,
      storeId: notification.storeId,
      category: notification.type,
      icon: getNotificationIcon(notification.type),
      color: getNotificationColor(notification.type),
    })),
    ...transactions.map((transaction) => ({
      id: transaction.id,
      type: "transaction",
      title: `Sale - $${transaction.total.toFixed(2)}`,
      description: `${transaction.items.length} items sold to ${transaction.customerName}`,
      timestamp: transaction.createdAt,
      storeId: transaction.storeId,
      category: "sale",
      icon: <ShoppingCart className="h-4 w-4" />,
      color: "text-green-600",
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || activity.type === filterType || activity.category === filterType
    const matchesStore = selectedStore === "all" || activity.storeId === selectedStore
    return matchesSearch && matchesType && matchesStore
  })

  function getNotificationIcon(type: string) {
    switch (type) {
      case "info":
        return <Package className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "success":
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  function getNotificationColor(type: string) {
    switch (type) {
      case "info":
        return "text-blue-600"
      case "warning":
        return "text-orange-600"
      case "error":
        return "text-red-600"
      case "success":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Activity History</h2>
        <p className="text-muted-foreground">Track all activities across your stores</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
                <SelectItem value="notification">Notifications</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStore} onValueChange={setSelectedStore}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Stores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stores</SelectItem>
                {stores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    {store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities ({filteredActivities.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No activities found matching your filters</div>
              ) : (
                filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`mt-1 ${activity.color}`}>{activity.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{activity.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.type === "notification" ? activity.category : "sale"}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                      {activity.storeId && (
                        <div className="flex items-center gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {stores.find((s) => s.id === activity.storeId)?.name || "Unknown Store"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
