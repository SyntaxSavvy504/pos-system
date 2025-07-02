"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Copy,
  Tag,
  Percent,
  DollarSign,
  Search,
  AlertCircle,
  CheckCircle,
  XCircle,
  Sparkles,
  Save,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useMultiStoreData } from "@/lib/multi-store-data"
import type { Coupon } from "@/lib/multi-store-data"
import { useToast } from "@/hooks/use-toast"

export function CouponDiscountManager() {
  const {
    coupons = [],
    discounts = [],
    stores = [],
    addCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
    currentStore,
  } = useMultiStoreData()

  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("coupons")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Coupon form state
  const [couponForm, setCouponForm] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage" as "percentage" | "fixed" | "buy_x_get_y",
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    buyQuantity: 1,
    getQuantity: 1,
    validFrom: new Date(),
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    usageLimit: 100,
    storeIds: [currentStore.id],
    applicableProducts: [] as string[],
    applicableCategories: [] as string[],
  })

  // Edit form state
  const [editForm, setEditForm] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage" as "percentage" | "fixed" | "buy_x_get_y",
    value: 0,
    minPurchase: 0,
    maxDiscount: 0,
    buyQuantity: 1,
    getQuantity: 1,
    validFrom: new Date(),
    validTo: new Date(),
    usageLimit: 100,
    storeIds: [] as string[],
    applicableProducts: [] as string[],
    applicableCategories: [] as string[],
  })

  const [testCouponCode, setTestCouponCode] = useState("")
  const [testAmount, setTestAmount] = useState(100)
  const [testResult, setTestResult] = useState<{ valid: boolean; coupon?: Coupon; error?: string } | null>(null)

  // Filter coupons based on search term
  const filteredCoupons = coupons.filter(
    (coupon) =>
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateCoupon = () => {
    if (!couponForm.code || !couponForm.name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check if coupon code already exists
    const existingCoupon = coupons.find((c) => c.code.toLowerCase() === couponForm.code.toLowerCase())
    if (existingCoupon) {
      toast({
        title: "Duplicate Code",
        description: "A coupon with this code already exists",
        variant: "destructive",
      })
      return
    }

    const newCoupon: Omit<Coupon, "id" | "createdAt" | "usedCount"> = {
      code: couponForm.code.toUpperCase(),
      name: couponForm.name,
      description: couponForm.description,
      type: couponForm.type,
      value: couponForm.value,
      minPurchase: couponForm.minPurchase || undefined,
      maxDiscount: couponForm.type === "percentage" ? couponForm.maxDiscount || undefined : undefined,
      buyQuantity: couponForm.type === "buy_x_get_y" ? couponForm.buyQuantity : undefined,
      getQuantity: couponForm.type === "buy_x_get_y" ? couponForm.getQuantity : undefined,
      validFrom: couponForm.validFrom.toISOString(),
      validTo: couponForm.validTo.toISOString(),
      usageLimit: couponForm.usageLimit || undefined,
      storeIds: couponForm.storeIds,
      applicableProducts: couponForm.applicableProducts.length > 0 ? couponForm.applicableProducts : undefined,
      applicableCategories: couponForm.applicableCategories.length > 0 ? couponForm.applicableCategories : undefined,
      status: "active",
      createdBy: "current-user",
    }

    addCoupon(newCoupon)
    setIsCreateDialogOpen(false)
    resetCouponForm()

    toast({
      title: "✨ Coupon Created",
      description: `Coupon "${couponForm.code}" has been created successfully`,
      variant: "default",
    })
  }

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setEditForm({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || "",
      type: coupon.type,
      value: coupon.value,
      minPurchase: coupon.minPurchase || 0,
      maxDiscount: coupon.maxDiscount || 0,
      buyQuantity: coupon.buyQuantity || 1,
      getQuantity: coupon.getQuantity || 1,
      validFrom: new Date(coupon.validFrom),
      validTo: new Date(coupon.validTo),
      usageLimit: coupon.usageLimit || 0,
      storeIds: coupon.storeIds || [currentStore.id],
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || [],
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateCoupon = () => {
    if (!editingCoupon || !editForm.code || !editForm.name) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Check if coupon code already exists (excluding current coupon)
    const existingCoupon = coupons.find(
      (c) => c.code.toLowerCase() === editForm.code.toLowerCase() && c.id !== editingCoupon.id,
    )
    if (existingCoupon) {
      toast({
        title: "Duplicate Code",
        description: "A coupon with this code already exists",
        variant: "destructive",
      })
      return
    }

    const updatedCoupon: Partial<Coupon> = {
      code: editForm.code.toUpperCase(),
      name: editForm.name,
      description: editForm.description,
      type: editForm.type,
      value: editForm.value,
      minPurchase: editForm.minPurchase || undefined,
      maxDiscount: editForm.type === "percentage" ? editForm.maxDiscount || undefined : undefined,
      buyQuantity: editForm.type === "buy_x_get_y" ? editForm.buyQuantity : undefined,
      getQuantity: editForm.type === "buy_x_get_y" ? editForm.getQuantity : undefined,
      validFrom: editForm.validFrom.toISOString(),
      validTo: editForm.validTo.toISOString(),
      usageLimit: editForm.usageLimit || undefined,
      storeIds: editForm.storeIds,
      applicableProducts: editForm.applicableProducts.length > 0 ? editForm.applicableProducts : undefined,
      applicableCategories: editForm.applicableCategories.length > 0 ? editForm.applicableCategories : undefined,
    }

    updateCoupon(editingCoupon.id, updatedCoupon)
    setIsEditDialogOpen(false)
    setEditingCoupon(null)

    toast({
      title: "✅ Coupon Updated",
      description: `Coupon "${editForm.code}" has been updated successfully`,
      variant: "default",
    })
  }

  const resetCouponForm = () => {
    setCouponForm({
      code: "",
      name: "",
      description: "",
      type: "percentage",
      value: 0,
      minPurchase: 0,
      maxDiscount: 0,
      buyQuantity: 1,
      getQuantity: 1,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usageLimit: 100,
      storeIds: [currentStore.id],
      applicableProducts: [],
      applicableCategories: [],
    })
  }

  const handleTestCoupon = () => {
    if (!testCouponCode) {
      toast({
        title: "Missing Code",
        description: "Please enter a coupon code to test",
        variant: "destructive",
      })
      return
    }

    const result = validateCoupon(testCouponCode, currentStore.id, testAmount)
    setTestResult(result)

    if (result.valid) {
      toast({
        title: "✅ Valid Coupon",
        description: `Coupon is valid and can be applied`,
        variant: "default",
      })
    } else {
      toast({
        title: "❌ Invalid Coupon",
        description: result.error || "Coupon validation failed",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCoupon = (couponId: string) => {
    const coupon = coupons.find((c) => c.id === couponId)
    if (!coupon) return

    if (confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
      deleteCoupon(couponId)
      toast({
        title: "🗑️ Coupon Deleted",
        description: `Coupon "${coupon.code}" has been deleted`,
        variant: "default",
      })
    }
  }

  const handleToggleCouponStatus = (couponId: string) => {
    const coupon = coupons.find((c) => c.id === couponId)
    if (!coupon) return

    const newStatus = coupon.status === "active" ? "inactive" : "active"
    updateCoupon(couponId, { status: newStatus })

    toast({
      title: "🔄 Status Updated",
      description: `Coupon "${coupon.code}" is now ${newStatus}`,
      variant: "default",
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "📋 Copied",
        description: "Coupon code copied to clipboard",
        variant: "default",
      })
    } catch (err) {
      console.error("Failed to copy: ", err)
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="default"
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg"
          >
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0">
            Inactive
          </Badge>
        )
      case "expired":
        return (
          <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-rose-500 text-white border-0">
            Expired
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "percentage":
        return (
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200 backdrop-blur-sm"
          >
            <Percent className="w-3 h-3 mr-1" />
            Percentage
          </Badge>
        )
      case "fixed":
        return (
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200 backdrop-blur-sm"
          >
            <DollarSign className="w-3 h-3 mr-1" />
            Fixed
          </Badge>
        )
      case "buy_x_get_y":
        return (
          <Badge
            variant="outline"
            className="bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200 backdrop-blur-sm"
          >
            <Tag className="w-3 h-3 mr-1" />
            Buy X Get Y
          </Badge>
        )
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const isExpired = (validTo: string) => {
    return new Date(validTo) < new Date()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Coupons & Discounts
            </h2>
            <p className="text-slate-600">Manage promotional offers and discounts with style</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm">
                <Plus className="w-4 h-4 mr-2" />
                <Sparkles className="w-4 h-4 mr-1" />
                Create {activeTab === "coupons" ? "Coupon" : "Discount"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Create New {activeTab === "coupons" ? "Coupon" : "Discount"}
                </DialogTitle>
                <DialogDescription className="text-slate-600">
                  Set up a new promotional offer for your customers
                </DialogDescription>
              </DialogHeader>

              {activeTab === "coupons" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="code" className="text-slate-700 font-medium">
                        Coupon Code *
                      </Label>
                      <Input
                        id="code"
                        placeholder="SAVE10"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                        className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-slate-700 font-medium">
                        Display Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="10% Off Everything"
                        value={couponForm.name}
                        onChange={(e) => setCouponForm({ ...couponForm, name: e.target.value })}
                        className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700 font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Get 10% off your entire purchase"
                      value={couponForm.description}
                      onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                      className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-slate-700 font-medium">
                        Discount Type
                      </Label>
                      <Select
                        value={couponForm.type}
                        onValueChange={(value: "percentage" | "fixed" | "buy_x_get_y") =>
                          setCouponForm({ ...couponForm, type: value })
                        }
                      >
                        <SelectTrigger className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border-slate-200">
                          <SelectItem value="percentage">Percentage</SelectItem>
                          <SelectItem value="fixed">Fixed Amount</SelectItem>
                          <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="value" className="text-slate-700 font-medium">
                        {couponForm.type === "percentage" ? "Percentage (%)" : "Amount ($)"}
                      </Label>
                      <Input
                        id="value"
                        type="number"
                        min="0"
                        step={couponForm.type === "percentage" ? "1" : "0.01"}
                        value={couponForm.value}
                        onChange={(e) => setCouponForm({ ...couponForm, value: Number(e.target.value) })}
                        className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minPurchase" className="text-slate-700 font-medium">
                        Min Purchase ($)
                      </Label>
                      <Input
                        id="minPurchase"
                        type="number"
                        min="0"
                        step="0.01"
                        value={couponForm.minPurchase}
                        onChange={(e) => setCouponForm({ ...couponForm, minPurchase: Number(e.target.value) })}
                        className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                  </div>

                  {couponForm.type === "percentage" && (
                    <div className="space-y-2">
                      <Label htmlFor="maxDiscount" className="text-slate-700 font-medium">
                        Max Discount ($)
                      </Label>
                      <Input
                        id="maxDiscount"
                        type="number"
                        min="0"
                        step="0.01"
                        value={couponForm.maxDiscount}
                        onChange={(e) => setCouponForm({ ...couponForm, maxDiscount: Number(e.target.value) })}
                        className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                      />
                    </div>
                  )}

                  {couponForm.type === "buy_x_get_y" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="buyQuantity" className="text-slate-700 font-medium">
                          Buy Quantity
                        </Label>
                        <Input
                          id="buyQuantity"
                          type="number"
                          min="1"
                          value={couponForm.buyQuantity}
                          onChange={(e) => setCouponForm({ ...couponForm, buyQuantity: Number(e.target.value) })}
                          className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="getQuantity" className="text-slate-700 font-medium">
                          Get Quantity
                        </Label>
                        <Input
                          id="getQuantity"
                          type="number"
                          min="1"
                          value={couponForm.getQuantity}
                          onChange={(e) => setCouponForm({ ...couponForm, getQuantity: Number(e.target.value) })}
                          className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Valid From</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80",
                              !couponForm.validFrom && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {couponForm.validFrom ? format(couponForm.validFrom, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-xl border-slate-200">
                          <Calendar
                            mode="single"
                            selected={couponForm.validFrom}
                            onSelect={(date) => date && setCouponForm({ ...couponForm, validFrom: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-700 font-medium">Valid To</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80",
                              !couponForm.validTo && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {couponForm.validTo ? format(couponForm.validTo, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-xl border-slate-200">
                          <Calendar
                            mode="single"
                            selected={couponForm.validTo}
                            onSelect={(date) => date && setCouponForm({ ...couponForm, validTo: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="usageLimit" className="text-slate-700 font-medium">
                      Usage Limit (0 for unlimited)
                    </Label>
                    <Input
                      id="usageLimit"
                      type="number"
                      min="0"
                      value={couponForm.usageLimit}
                      onChange={(e) => setCouponForm({ ...couponForm, usageLimit: Number(e.target.value) })}
                      className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateCoupon}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Coupon
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Edit Coupon
              </DialogTitle>
              <DialogDescription className="text-slate-600">Update the coupon details and settings</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code" className="text-slate-700 font-medium">
                    Coupon Code *
                  </Label>
                  <Input
                    id="edit-code"
                    placeholder="SAVE10"
                    value={editForm.code}
                    onChange={(e) => setEditForm({ ...editForm, code: e.target.value.toUpperCase() })}
                    className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-slate-700 font-medium">
                    Display Name *
                  </Label>
                  <Input
                    id="edit-name"
                    placeholder="10% Off Everything"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-slate-700 font-medium">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  placeholder="Get 10% off your entire purchase"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-slate-700 font-medium">
                    Discount Type
                  </Label>
                  <Select
                    value={editForm.type}
                    onValueChange={(value: "percentage" | "fixed" | "buy_x_get_y") =>
                      setEditForm({ ...editForm, type: value })
                    }
                  >
                    <SelectTrigger className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-slate-200">
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                      <SelectItem value="buy_x_get_y">Buy X Get Y</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-value" className="text-slate-700 font-medium">
                    {editForm.type === "percentage" ? "Percentage (%)" : "Amount ($)"}
                  </Label>
                  <Input
                    id="edit-value"
                    type="number"
                    min="0"
                    step={editForm.type === "percentage" ? "1" : "0.01"}
                    value={editForm.value}
                    onChange={(e) => setEditForm({ ...editForm, value: Number(e.target.value) })}
                    className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minPurchase" className="text-slate-700 font-medium">
                    Min Purchase ($)
                  </Label>
                  <Input
                    id="edit-minPurchase"
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.minPurchase}
                    onChange={(e) => setEditForm({ ...editForm, minPurchase: Number(e.target.value) })}
                    className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Valid From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80",
                          !editForm.validFrom && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editForm.validFrom ? format(editForm.validFrom, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-xl border-slate-200">
                      <Calendar
                        mode="single"
                        selected={editForm.validFrom}
                        onSelect={(date) => date && setEditForm({ ...editForm, validFrom: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 font-medium">Valid To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80",
                          !editForm.validTo && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editForm.validTo ? format(editForm.validTo, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white/95 backdrop-blur-xl border-slate-200">
                      <Calendar
                        mode="single"
                        selected={editForm.validTo}
                        onSelect={(date) => date && setEditForm({ ...editForm, validTo: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-usageLimit" className="text-slate-700 font-medium">
                  Usage Limit (0 for unlimited)
                </Label>
                <Input
                  id="edit-usageLimit"
                  type="number"
                  min="0"
                  value={editForm.usageLimit}
                  onChange={(e) => setEditForm({ ...editForm, usageLimit: Number(e.target.value) })}
                  className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCoupon}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Update Coupon
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/70 backdrop-blur-sm border border-slate-200 shadow-lg">
            <TabsTrigger
              value="coupons"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Coupons
            </TabsTrigger>
            <TabsTrigger
              value="discounts"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Discounts
            </TabsTrigger>
            <TabsTrigger
              value="test"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
            >
              Test Coupon
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coupons" className="space-y-6">
            {/* Search */}
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search coupons by code or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/70 backdrop-blur-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800">
                  Active Coupons ({filteredCoupons.length})
                </CardTitle>
                <CardDescription className="text-slate-600">Manage your promotional coupon codes</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {filteredCoupons.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                    {searchTerm ? "No coupons match your search." : "No coupons created yet."}
                    <br />
                    <Button
                      variant="outline"
                      className="mt-4 bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80"
                      onClick={() => setIsCreateDialogOpen(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Coupon
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
                          <TableHead className="font-semibold text-slate-700">Code</TableHead>
                          <TableHead className="font-semibold text-slate-700">Name</TableHead>
                          <TableHead className="font-semibold text-slate-700">Type</TableHead>
                          <TableHead className="font-semibold text-slate-700">Value</TableHead>
                          <TableHead className="font-semibold text-slate-700">Usage</TableHead>
                          <TableHead className="font-semibold text-slate-700">Valid Until</TableHead>
                          <TableHead className="font-semibold text-slate-700">Status</TableHead>
                          <TableHead className="font-semibold text-slate-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCoupons.map((coupon, index) => (
                          <TableRow
                            key={coupon.id}
                            className={cn(
                              "border-b border-slate-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200",
                              index % 2 === 0 ? "bg-white/50" : "bg-slate-50/30",
                            )}
                          >
                            <TableCell className="font-mono font-medium">
                              <div className="flex items-center space-x-2">
                                <span className="px-2 py-1 bg-gradient-to-r from-slate-100 to-slate-200 rounded text-sm">
                                  {coupon.code}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(coupon.code)}
                                  className="h-6 w-6 p-0 hover:bg-blue-100 transition-colors"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium text-slate-700">{coupon.name}</TableCell>
                            <TableCell>{getTypeBadge(coupon.type)}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-semibold text-slate-800">
                                  {coupon.type === "percentage" ? `${coupon.value}%` : `$${coupon.value}`}
                                </div>
                                {coupon.minPurchase && coupon.minPurchase > 0 && (
                                  <div className="text-xs text-slate-500">Min: ${coupon.minPurchase}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-slate-700">
                                  {coupon.usedCount} / {coupon.usageLimit || "∞"}
                                </div>
                                {coupon.usageLimit && (
                                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                                      style={{
                                        width: `${Math.min((coupon.usedCount / coupon.usageLimit) * 100, 100)}%`,
                                      }}
                                    />
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {isExpired(coupon.validTo) && <AlertCircle className="w-4 h-4 text-red-500" />}
                                <span
                                  className={cn(
                                    "text-sm",
                                    isExpired(coupon.validTo) ? "text-red-600 font-medium" : "text-slate-600",
                                  )}
                                >
                                  {format(new Date(coupon.validTo), "MMM dd, yyyy")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(coupon.status)}</TableCell>
                            <TableCell>
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleCouponStatus(coupon.id)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                                  title={coupon.status === "active" ? "Deactivate" : "Activate"}
                                >
                                  {coupon.status === "active" ? (
                                    <XCircle className="w-4 h-4 text-orange-500" />
                                  ) : (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditCoupon(coupon)}
                                  className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4 text-blue-500" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteCoupon(coupon.id)}
                                  className="h-8 w-8 p-0 hover:bg-red-100 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discounts" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800">Automatic Discounts</CardTitle>
                <CardDescription className="text-slate-600">
                  Set up automatic discounts based on conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Tag className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                  No automatic discounts configured yet.
                  <br />
                  <Button
                    variant="outline"
                    className="mt-4 bg-white/70 backdrop-blur-sm border-slate-200 hover:bg-white/80"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Discount
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50 rounded-t-lg">
                <CardTitle className="text-xl font-bold text-slate-800">Test Coupon</CardTitle>
                <CardDescription className="text-slate-600">
                  Test coupon codes to verify they work correctly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="testCode" className="text-slate-700 font-medium">
                      Coupon Code
                    </Label>
                    <Input
                      id="testCode"
                      placeholder="Enter coupon code"
                      value={testCouponCode}
                      onChange={(e) => setTestCouponCode(e.target.value.toUpperCase())}
                      className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="testAmount" className="text-slate-700 font-medium">
                      Purchase Amount ($)
                    </Label>
                    <Input
                      id="testAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={testAmount}
                      onChange={(e) => setTestAmount(Number(e.target.value))}
                      className="bg-white/70 backdrop-blur-sm border-slate-200 focus:border-green-400 focus:ring-green-400/20"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleTestCoupon}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Test Coupon
                </Button>

                {testResult && (
                  <Card
                    className={cn(
                      "border-2 backdrop-blur-sm",
                      testResult.valid
                        ? "border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
                        : "border-red-200 bg-gradient-to-r from-red-50 to-rose-50",
                    )}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center",
                            testResult.valid ? "bg-green-500" : "bg-red-500",
                          )}
                        >
                          {testResult.valid ? (
                            <CheckCircle className="w-3 h-3 text-white" />
                          ) : (
                            <XCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="font-semibold text-lg">
                          {testResult.valid ? "✅ Valid Coupon" : "❌ Invalid Coupon"}
                        </span>
                      </div>
                      {testResult.error && (
                        <p className="text-sm text-red-600 mb-3 p-3 bg-red-100/50 rounded-lg">{testResult.error}</p>
                      )}
                      {testResult.valid && testResult.coupon && (
                        <div className="space-y-3 p-4 bg-white/50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong className="text-slate-700">Name:</strong>
                              <div className="text-slate-600">{testResult.coupon.name}</div>
                            </div>
                            <div>
                              <strong className="text-slate-700">Type:</strong>
                              <div className="text-slate-600 capitalize">{testResult.coupon.type}</div>
                            </div>
                            <div>
                              <strong className="text-slate-700">Value:</strong>
                              <div className="text-slate-600">
                                {testResult.coupon.type === "percentage"
                                  ? `${testResult.coupon.value}%`
                                  : `$${testResult.coupon.value}`}
                              </div>
                            </div>
                            <div>
                              <strong className="text-slate-700">Min Purchase:</strong>
                              <div className="text-slate-600">${testResult.coupon.minPurchase || 0}</div>
                            </div>
                            <div className="col-span-2">
                              <strong className="text-slate-700">Usage:</strong>
                              <div className="text-slate-600">
                                {testResult.coupon.usedCount} / {testResult.coupon.usageLimit || "∞"}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
