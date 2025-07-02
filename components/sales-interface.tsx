"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { SaleSuccessModal } from "./sale-success-modal"
import { useMultiStoreData } from "@/lib/multi-store-data"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Plus, Minus, Trash2, Search, CreditCard, DollarSign, Smartphone, UserPlus } from "lucide-react"

interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  total: number
}

export function SalesInterface() {
  const { products, customers, addTransaction, addCustomer } = useMultiStoreData()
  const { toast } = useToast()

  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "digital">("cash")
  const [amountReceived, setAmountReceived] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [lastTransaction, setLastTransaction] = useState<any>(null)
  const [showNewCustomerDialog, setShowNewCustomerDialog] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as const,
  })

  const filteredProducts = products.filter(
    (product) =>
      product.status === "active" &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const addToCart = (product: (typeof products)[0]) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      })
      return
    }

    const existingItem = cart.find((item) => item.productId === product.id)

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} units available for ${product.name}.`,
          variant: "destructive",
        })
        return
      }
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: 1,
        total: product.price,
      }
      setCart((prev) => [...prev, newItem])
    }
  }

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }

    const product = products.find((p) => p.id === productId)
    if (product && newQuantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} units available.`,
        variant: "destructive",
      })
      return
    }

    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity, total: item.price * newQuantity } : item,
      ),
    )
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId))
  }

  const clearCart = () => {
    setCart([])
    setSelectedCustomer("")
    setAmountReceived("")
  }

  const subtotal = cart.reduce((sum, item) => sum + item.total, 0)
  const taxRate = 0.08 // 8% tax
  const tax = subtotal * taxRate
  const total = subtotal + tax
  const change = paymentMethod === "cash" && amountReceived ? Math.max(0, Number.parseFloat(amountReceived) - total) : 0

  const canProcessSale =
    cart.length > 0 && (paymentMethod !== "cash" || (amountReceived && Number.parseFloat(amountReceived) >= total))

  const processSale = () => {
    if (!canProcessSale) return

    const customer = customers.find((c) => c.id === selectedCustomer)
    const customerName = customer?.name || "Walk-in Customer"

    const transaction = {
      customerId: selectedCustomer || undefined,
      customerName,
      items: cart,
      subtotal,
      tax,
      total,
      paymentMethod,
      amountReceived: paymentMethod === "cash" ? Number.parseFloat(amountReceived) : undefined,
      change: paymentMethod === "cash" ? change : undefined,
      status: "completed" as const,
    }

    addTransaction(transaction)
    setLastTransaction({
      ...transaction,
      id: `TXN${Date.now()}`,
      createdAt: new Date().toISOString(),
      createdBy: "Current User",
    })

    clearCart()
    setShowSuccessModal(true)

    toast({
      title: "Sale Completed",
      description: `Transaction completed successfully for $${total.toFixed(2)}`,
    })
  }

  const handleAddCustomer = () => {
    if (!newCustomer.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a customer name.",
        variant: "destructive",
      })
      return
    }

    addCustomer(newCustomer)
    setNewCustomer({ name: "", email: "", phone: "", status: "active" })
    setShowNewCustomerDialog(false)

    toast({
      title: "Customer Added",
      description: `${newCustomer.name} has been added to the system.`,
    })
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Product Selection</span>
              </CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search products by name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white/60 backdrop-blur-sm border-slate-200"
                    onClick={() => addToCart(product)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-slate-900 truncate">{product.name}</h3>
                          <Badge
                            variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
                          >
                            {product.stock}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-semibold text-green-600">${product.price.toFixed(2)}</span>
                          <Button size="sm" disabled={product.stock <= 0}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart and Checkout */}
        <div className="space-y-4">
          <Card className="bg-white/80 backdrop-blur-xl border-slate-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart ({cart.length})</span>
                </div>
                {cart.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearCart}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Cart is empty</p>
                  <p className="text-sm">Add products to get started</p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{item.productName}</h4>
                          <p className="text-sm text-slate-600">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Customer Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Customer</Label>
                    <div className="flex space-x-2">
                      <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select customer (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              {customer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Dialog open={showNewCustomerDialog} onOpenChange={setShowNewCustomerDialog}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Customer</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="name">Name *</Label>
                              <Input
                                id="name"
                                value={newCustomer.name}
                                onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                                placeholder="Customer name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input
                                id="email"
                                type="email"
                                value={newCustomer.email}
                                onChange={(e) => setNewCustomer((prev) => ({ ...prev, email: e.target.value }))}
                                placeholder="customer@email.com"
                              />
                            </div>
                            <div>
                              <Label htmlFor="phone">Phone</Label>
                              <Input
                                id="phone"
                                value={newCustomer.phone}
                                onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                                placeholder="+1 (555) 123-4567"
                              />
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={handleAddCustomer} className="flex-1">
                                Add Customer
                              </Button>
                              <Button variant="outline" onClick={() => setShowNewCustomerDialog(false)}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Payment Method</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={paymentMethod === "cash" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPaymentMethod("cash")}
                        className="flex items-center space-x-1"
                      >
                        <DollarSign className="h-4 w-4" />
                        <span>Cash</span>
                      </Button>
                      <Button
                        variant={paymentMethod === "card" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPaymentMethod("card")}
                        className="flex items-center space-x-1"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Card</span>
                      </Button>
                      <Button
                        variant={paymentMethod === "digital" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPaymentMethod("digital")}
                        className="flex items-center space-x-1"
                      >
                        <Smartphone className="h-4 w-4" />
                        <span>Digital</span>
                      </Button>
                    </div>
                  </div>

                  {/* Cash Payment Input */}
                  {paymentMethod === "cash" && (
                    <div className="space-y-2">
                      <Label htmlFor="amount-received">Amount Received</Label>
                      <Input
                        id="amount-received"
                        type="number"
                        step="0.01"
                        min={total}
                        value={amountReceived}
                        onChange={(e) => setAmountReceived(e.target.value)}
                        placeholder={`Minimum: $${total.toFixed(2)}`}
                      />
                      {change > 0 && <p className="text-sm text-green-600 font-medium">Change: ${change.toFixed(2)}</p>}
                    </div>
                  )}

                  {/* Totals */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Process Sale Button */}
                  <Button
                    onClick={processSale}
                    disabled={!canProcessSale}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                  >
                    Process Sale
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && lastTransaction && (
        <SaleSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          transaction={lastTransaction}
        />
      )}
    </div>
  )
}
