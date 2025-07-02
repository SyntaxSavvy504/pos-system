"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Star, Gift, Trophy, Award, TrendingUp } from "lucide-react"
import { useMultiStoreData } from "@/lib/multi-store-data"
import { LoyaltySystem, type LoyaltyCustomer, type LoyaltyReward } from "@/lib/loyalty-system"

export function LoyaltyManagement() {
  const { loyaltyCustomers, loyaltyRewards, addLoyaltyCustomer, updateLoyaltyCustomer, addLoyaltyReward } =
    useMultiStoreData()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<LoyaltyCustomer | null>(null)
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false)
  const [isAddRewardOpen, setIsAddRewardOpen] = useState(false)

  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
  })

  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    pointsCost: 0,
    discountType: "fixed" as "fixed" | "percentage",
    discountValue: 0,
    minPurchase: 0,
  })

  const filteredCustomers = loyaltyCustomers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.loyaltyNumber.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCustomer = () => {
    const customer: Omit<
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
    > = {
      ...newCustomer,
    }
    addLoyaltyCustomer(customer)
    setNewCustomer({ name: "", email: "", phone: "" })
    setIsAddCustomerOpen(false)
  }

  const handleAddReward = () => {
    const reward: Omit<LoyaltyReward, "id" | "isActive" | "usedCount"> = {
      ...newReward,
    }
    addLoyaltyReward(reward)
    setNewReward({
      name: "",
      description: "",
      pointsCost: 0,
      discountType: "fixed",
      discountValue: 0,
      minPurchase: 0,
    })
    setIsAddRewardOpen(false)
  }

  const getTierColor = (tier: string) => {
    const tierInfo = LoyaltySystem.getTierInfo(tier as any)
    return tierInfo.color
  }

  const getTierStats = () => {
    const stats = {
      Bronze: loyaltyCustomers.filter((c) => c.tier === "Bronze").length,
      Silver: loyaltyCustomers.filter((c) => c.tier === "Silver").length,
      Gold: loyaltyCustomers.filter((c) => c.tier === "Gold").length,
      Platinum: loyaltyCustomers.filter((c) => c.tier === "Platinum").length,
    }
    return stats
  }

  const tierStats = getTierStats()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Loyalty Program Management</h2>
          <p className="text-muted-foreground">Manage customer loyalty program and rewards</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddRewardOpen} onOpenChange={setIsAddRewardOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Gift className="mr-2 h-4 w-4" />
                Add Reward
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Reward</DialogTitle>
                <DialogDescription>Create a new loyalty reward for customers</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reward-name">Reward Name</Label>
                  <Input
                    id="reward-name"
                    value={newReward.name}
                    onChange={(e) => setNewReward({ ...newReward, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="reward-description">Description</Label>
                  <Input
                    id="reward-description"
                    value={newReward.description}
                    onChange={(e) => setNewReward({ ...newReward, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="points-cost">Points Cost</Label>
                    <Input
                      id="points-cost"
                      type="number"
                      value={newReward.pointsCost}
                      onChange={(e) => setNewReward({ ...newReward, pointsCost: Number(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount-value">Discount Value</Label>
                    <Input
                      id="discount-value"
                      type="number"
                      step="0.01"
                      value={newReward.discountValue}
                      onChange={(e) => setNewReward({ ...newReward, discountValue: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddReward} className="w-full">
                  Add Reward
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Loyalty Customer</DialogTitle>
                <DialogDescription>Enroll a new customer in the loyalty program</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customer-name">Full Name</Label>
                  <Input
                    id="customer-name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-email">Email</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input
                    id="customer-phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddCustomer} className="w-full">
                  Enroll Customer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          {/* Search */}
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers by name, email, or loyalty number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardContent>
          </Card>

          {/* Customer Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {Object.entries(tierStats).map(([tier, count]) => (
              <Card key={tier}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{tier} Members</CardTitle>
                  <Trophy className="h-4 w-4" style={{ color: getTierColor(tier) }} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{count}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Customers Table */}
          <Card>
            <CardHeader>
              <CardTitle>Loyalty Customers ({filteredCustomers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Loyalty #</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => {
                    const nextTierProgress = LoyaltySystem.getNextTierProgress(customer)
                    return (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: getTierColor(customer.tier) + "20" }}
                            >
                              <Star className="h-4 w-4" style={{ color: getTierColor(customer.tier) }} />
                            </div>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-sm text-muted-foreground">{customer.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{customer.loyaltyNumber}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge style={{ backgroundColor: getTierColor(customer.tier), color: "white" }}>
                            {customer.tier}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{customer.points.toLocaleString()}</div>
                          {nextTierProgress.nextTier && (
                            <div className="text-xs text-muted-foreground">
                              ${nextTierProgress.amountNeeded.toFixed(2)} to {nextTierProgress.nextTier}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(customer)}>
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loyaltyRewards.map((reward) => (
              <Card key={reward.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    {reward.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary">{reward.pointsCost} points</Badge>
                    <Badge variant={reward.isActive ? "default" : "secondary"}>
                      {reward.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <div>
                      Discount:{" "}
                      {reward.discountType === "percentage" ? `${reward.discountValue}%` : `$${reward.discountValue}`}
                    </div>
                    {reward.minPurchase && <div>Min Purchase: ${reward.minPurchase}</div>}
                    <div>Used: {reward.usedCount} times</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loyaltyCustomers.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Points Issued</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loyaltyCustomers.reduce((sum, c) => sum + c.points, 0).toLocaleString()}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Points per Customer</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loyaltyCustomers.length > 0
                    ? Math.round(loyaltyCustomers.reduce((sum, c) => sum + c.points, 0) / loyaltyCustomers.length)
                    : 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Rewards Redeemed</CardTitle>
                <Gift className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{loyaltyRewards.reduce((sum, r) => sum + r.usedCount, 0)}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Customer Details Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Loyalty Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: getTierColor(selectedCustomer.tier) + "20" }}
                >
                  <Star className="h-6 w-6" style={{ color: getTierColor(selectedCustomer.tier) }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedCustomer.name}</h3>
                  <p className="text-muted-foreground">{selectedCustomer.email}</p>
                  <Badge style={{ backgroundColor: getTierColor(selectedCustomer.tier), color: "white" }}>
                    {selectedCustomer.tier} Member
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{selectedCustomer.points.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Available Points</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold">${selectedCustomer.totalSpent.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Total Spent</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tier Progress */}
              {(() => {
                const progress = LoyaltySystem.getNextTierProgress(selectedCustomer)
                return progress.nextTier ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to {progress.nextTier}</span>
                      <span>${progress.amountNeeded.toFixed(2)} needed</span>
                    </div>
                    <Progress value={progress.progress} className="h-2" />
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">🎉 Highest tier achieved!</div>
                )
              })()}

              {/* Recent Activity */}
              <div>
                <h4 className="font-semibold mb-3">Recent Points Activity</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedCustomer.pointsHistory.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center text-sm">
                      <span>{transaction.description}</span>
                      <span className={transaction.type === "earned" ? "text-green-600" : "text-red-600"}>
                        {transaction.type === "earned" ? "+" : "-"}
                        {transaction.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
