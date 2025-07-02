"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Minus, Trash2, CreditCard, Receipt, Tag, X, Star, User } from "lucide-react"
import { useMultiStoreData } from "@/lib/multi-store-data"
import { SaleSuccessModal } from "@/components/sale-success-modal"
import { useToast } from "@/hooks/use-toast"
import { ReceiptPrinter, type ReceiptData } from "@/lib/receipt-printer"
import { LoyaltySystem, type LoyaltyCustomer } from "@/lib/loyalty-system"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  discount: number
  stock: number
}

export function EnhancedSalesInterface() {
  const {
    getProductsByStore,
    currentStore,
    addTransaction,
    validateCoupon,
    applyCoupon,
    loyaltyCustomers,
    loyaltyRewards,
    findLoyaltyCustomer,
    processLoyaltyTransaction,
    redeemLoyaltyReward,
  } = useMultiStoreData()
  const { toast } = useToast()
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [amountReceived, setAmountReceived] = useState("")
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<any>(null)

  // Loyalty states
  const [loyaltyNumber, setLoyaltyNumber] = useState("")
  const [selectedLoyaltyCustomer, setSelectedLoyaltyCustomer] = useState<LoyaltyCustomer | null>(null)
  const [selectedReward, setSelectedReward] = useState<any>(null)
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0)

  const products = getProductsByStore(currentStore.id)
  const categories = ["Electronics", "Home & Kitchen", "Stationery", "Home & Office"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory && product.status === "active"
  })

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
        toast({
          title: "Item Added",
          description: `${product.name} quantity increased to ${existingItem.quantity + 1}`,
          variant: "default",
        })
      } else {
        toast({
          title: "Stock Limit Reached",
          description: `Only ${product.stock} units available for ${product.name}`,
          variant: "destructive",
        })
      }
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          discount: 0,
          stock: product.stock,
        },
      ])
      toast({
        title: "Item Added to Cart",
        description: `${product.name} has been added to your cart`,
        variant: "success",
      })
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      const item = cart.find((item) => item.id === id)
      setCart(cart.filter((item) => item.id !== id))
      toast({
        title: "Item Removed",
        description: `${item?.name} has been removed from cart`,
        variant: "default",
      })
    } else {
      setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const removeFromCart = (id: string) => {
    const item = cart.find((item) => item.id === id)
    setCart(cart.filter((item) => item.id !== id))
    toast({
      title: "Item Removed",
      description: `${item?.name} has been removed from cart`,
      variant: "default",
    })
  }

  const applyCouponCode = () => {
    if (!couponCode) return

    const result = validateCoupon(couponCode, currentStore.id, subtotal)
    if (result.valid && result.coupon) {
      const discount = applyCoupon(
        result.coupon,
        cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
      )

      setAppliedCoupon(result.coupon)
      setCouponDiscount(discount)
      toast({
        title: "Coupon Applied!",
        description: `${result.coupon.name} - Save $${discount.toFixed(2)}`,
        variant: "success",
      })
    } else {
      toast({
        title: "Invalid Coupon",
        description: result.error || "Coupon code is not valid",
        variant: "destructive",
      })
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    setCouponCode("")
    toast({
      title: "Coupon Removed",
      description: "Coupon discount has been removed",
      variant: "default",
    })
  }

  const lookupLoyaltyCustomer = () => {
    if (!loyaltyNumber) return

    const customer = findLoyaltyCustomer(loyaltyNumber)
    if (customer) {
      setSelectedLoyaltyCustomer(customer)
      toast({
        title: "Customer Found!",
        description: `Welcome back, ${customer.name}! (${customer.tier} member)`,
        variant: "success",
      })
    } else {
      toast({
        title: "Customer Not Found",
        description: "No loyalty customer found with that number",
        variant: "destructive",
      })
    }
  }

  const removeLoyaltyCustomer = () => {
    setSelectedLoyaltyCustomer(null)
    setLoyaltyNumber("")
    setSelectedReward(null)
    setLoyaltyDiscount(0)
    toast({
      title: "Customer Removed",
      description: "Loyalty customer has been removed from transaction",
      variant: "default",
    })
  }

  const applyLoyaltyReward = () => {
    if (!selectedLoyaltyCustomer || !selectedReward) return

    const result = redeemLoyaltyReward(selectedLoyaltyCustomer.id, selectedReward.id)
    if (result.success) {
      const discount = LoyaltySystem.calculateRewardDiscount(selectedReward, subtotal)
      setLoyaltyDiscount(discount)
      toast({
        title: "Reward Applied!",
        description: `${selectedReward.name} - Save $${discount.toFixed(2)}`,
        variant: "success",
      })
    } else {
      toast({
        title: "Reward Error",
        description: result.error || "Unable to apply reward",
        variant: "destructive",
      })
    }
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalDiscounts = couponDiscount + loyaltyDiscount
  const tax = (subtotal - totalDiscounts) * 0.08 // 8% tax
  const total = subtotal - totalDiscounts + tax

  const handleCheckout = async () => {
    let loyaltyPointsEarned = 0
    let customerLoyaltyData = undefined

    // Process loyalty points if customer is enrolled
    if (selectedLoyaltyCustomer) {
      const loyaltyResult = processLoyaltyTransaction(selectedLoyaltyCustomer.id, total, `TXN${Date.now()}`)
      loyaltyPointsEarned = loyaltyResult.pointsEarned

      customerLoyaltyData = {
        pointsEarned: loyaltyPointsEarned,
        totalPoints: selectedLoyaltyCustomer.points + loyaltyPointsEarned,
        tier: loyaltyResult.newTier || selectedLoyaltyCustomer.tier,
      }
    }

    const transactionData = {
      storeId: currentStore.id,
      customerId: undefined,
      customerName: selectedLoyaltyCustomer?.name || "Walk-in Customer",
      loyaltyCustomerId: selectedLoyaltyCustomer?.id,
      items: cart.map((item) => ({
        productId: item.id,
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
        total: item.price * item.quantity - item.discount,
      })),
      subtotal,
      discountAmount: couponDiscount,
      couponCode: appliedCoupon?.code,
      loyaltyDiscount,
      loyaltyPointsEarned,
      tax,
      total,
      paymentMethod: paymentMethod as "cash" | "card" | "digital",
      amountReceived: paymentMethod === "cash" ? Number.parseFloat(amountReceived) || 0 : undefined,
      change: change,
      status: "completed" as const,
    }

    addTransaction(transactionData)

    // Prepare receipt data
    const receiptData: ReceiptData = {
      transactionId: `TXN${Date.now()}`,
      storeName: currentStore.name,
      storeAddress: currentStore.address,
      storePhone: currentStore.phone,
      customerName: selectedLoyaltyCustomer?.name || "Walk-in Customer",
      customerLoyalty: customerLoyaltyData,
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      subtotal,
      discountAmount: couponDiscount,
      couponCode: appliedCoupon?.code,
      loyaltyDiscount,
      tax,
      total,
      paymentMethod,
      amountReceived: paymentMethod === "cash" ? Number.parseFloat(amountReceived) || 0 : undefined,
      change: change > 0 ? change : undefined,
      timestamp: new Date().toISOString(),
    }

    // Auto-print receipt
    try {
      await ReceiptPrinter.printReceipt(receiptData)
    } catch (error) {
      console.error("Failed to print receipt:", error)
    }

    // Prepare data for success modal
    setLastTransaction({
      id: `TXN${Date.now()}`,
      total,
      items: cart.map((item) => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
      })),
      paymentMethod,
      change: change > 0 ? change : undefined,
      couponCode: appliedCoupon?.code,
      discountAmount: totalDiscounts,
      customerName: selectedLoyaltyCustomer?.name || "Walk-in Customer",
      storeName: currentStore.name,
      loyaltyData: customerLoyaltyData,
      receiptData,
    })

    // Clear cart and states after successful payment
    setCart([])
    setAmountReceived("")
    setCouponCode("")
    setAppliedCoupon(null)
    setCouponDiscount(0)
    setSelectedLoyaltyCustomer(null)
    setLoyaltyNumber("")
    setSelectedReward(null)
    setLoyaltyDiscount(0)
    setIsCheckoutOpen(false)

    // Show advanced success modal
    setShowSuccessModal(true)

    // Show toast notification
    toast({
      title: "🎉 Payment Successful!",
      description: `Transaction completed for $${total.toFixed(2)}${loyaltyPointsEarned > 0 ? ` • +${loyaltyPointsEarned} points earned` : ""}`,
      variant: "success",
    })
  }

  const change = paymentMethod === "cash" ? Math.max(0, (Number.parseFloat(amountReceived) || 0) - total) : 0

  const availableRewards = selectedLoyaltyCustomer
    ? loyaltyRewards.filter((reward) => LoyaltySystem.canRedeemReward(selectedLoyaltyCustomer, reward))
    : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sales - {currentStore.name}</h2>
          <p className="text-muted-foreground">Select products to add to cart</p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>Stock: {product.stock}</Badge>
                  </div>
                  <Button onClick={() => addToCart(product)} disabled={product.stock === 0} className="w-full">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="space-y-4">
        {/* Loyalty Customer Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Loyalty Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedLoyaltyCustomer ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                      <User className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{selectedLoyaltyCustomer.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedLoyaltyCustomer.loyaltyNumber}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={removeLoyaltyCustomer}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    Tier: <Badge variant="secondary">{selectedLoyaltyCustomer.tier}</Badge>
                  </span>
                  <span>Points: {selectedLoyaltyCustomer.points.toLocaleString()}</span>
                </div>

                {availableRewards.length > 0 && (
                  <div className="space-y-2">
                    <Select
                      value={selectedReward?.id || ""}
                      onValueChange={(value) => {
                        const reward = availableRewards.find((r) => r.id === value)
                        setSelectedReward(reward || null)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select reward to redeem" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableRewards.map((reward) => (
                          <SelectItem key={reward.id} value={reward.id}>
                            {reward.name} ({reward.pointsCost} pts)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedReward && (
                      <Button onClick={applyLoyaltyReward} size="sm" className="w-full">
                        Redeem Reward
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Loyalty number, email, or phone"
                  value={loyaltyNumber}
                  onChange={(e) => setLoyaltyNumber(e.target.value)}
                />
                <Button onClick={lookupLoyaltyCustomer} disabled={!loyaltyNumber}>
                  Lookup
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cart ({cart.length} items)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => removeFromCart(item.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Section */}
                <div className="space-y-2">
                  <Separator />
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={!!appliedCoupon}
                      />
                    </div>
                    {appliedCoupon ? (
                      <Button variant="outline" onClick={removeCoupon}>
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="outline" onClick={applyCouponCode} disabled={!couponCode}>
                        <Tag className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">✓ {appliedCoupon.name}</span>
                      <span className="text-green-600">-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {selectedReward && loyaltyDiscount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-600">✓ {selectedReward.name}</span>
                      <span className="text-blue-600">-${loyaltyDiscount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount:</span>
                      <span>-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Loyalty Discount:</span>
                      <span>-${loyaltyDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (8%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  {selectedLoyaltyCustomer && (
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>Points to earn:</span>
                      <span>+{LoyaltySystem.calculatePointsEarned(total, selectedLoyaltyCustomer.tier)} pts</span>
                    </div>
                  )}
                </div>

                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Checkout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Checkout</DialogTitle>
                      <DialogDescription>Complete the payment for this transaction</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Payment Method</label>
                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="digital">Digital Wallet</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {paymentMethod === "cash" && (
                        <div>
                          <label className="text-sm font-medium">Amount Received</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={amountReceived}
                            onChange={(e) => setAmountReceived(e.target.value)}
                            placeholder="0.00"
                          />
                          {change > 0 && (
                            <p className="text-sm text-muted-foreground mt-1">Change: ${change.toFixed(2)}</p>
                          )}
                        </div>
                      )}

                      <div className="bg-gray-50 p-4 rounded space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>
                        {totalDiscounts > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Total Discounts:</span>
                            <span>-${totalDiscounts.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total Amount:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <span className="capitalize">{paymentMethod}</span>
                        </div>
                        {selectedLoyaltyCustomer && (
                          <div className="flex justify-between text-blue-600">
                            <span>Points to Earn:</span>
                            <span>+{LoyaltySystem.calculatePointsEarned(total, selectedLoyaltyCustomer.tier)}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={handleCheckout}
                        className="w-full"
                        disabled={paymentMethod === "cash" && (Number.parseFloat(amountReceived) || 0) < total}
                      >
                        <Receipt className="mr-2 h-4 w-4" />
                        Process Payment & Print Receipt
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Success Modal */}
      {lastTransaction && (
        <SaleSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          transaction={lastTransaction}
        />
      )}
    </div>
  )
}
