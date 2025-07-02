"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Printer, Mail, Copy } from "lucide-react"
import { ReceiptPrinter, type ReceiptData } from "@/lib/receipt-printer"
import { useToast } from "@/hooks/use-toast"

interface SaleSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    id: string
    customerName: string
    items: Array<{
      productName: string
      quantity: number
      price: number
      total: number
    }>
    subtotal: number
    tax: number
    total: number
    paymentMethod: string
    amountReceived?: number
    change?: number
    createdAt: string
    createdBy: string
  }
}

export function SaleSuccessModal({ isOpen, onClose, transaction }: SaleSuccessModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const receiptData: ReceiptData = {
    transactionId: transaction.id,
    date: transaction.createdAt,
    cashier: transaction.createdBy,
    customer: transaction.customerName,
    items: transaction.items.map((item) => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
      total: item.total,
    })),
    subtotal: transaction.subtotal,
    tax: transaction.tax,
    total: transaction.total,
    paymentMethod: transaction.paymentMethod,
    amountReceived: transaction.amountReceived,
    change: transaction.change,
  }

  const handlePrintReceipt = async () => {
    setIsProcessing(true)
    try {
      ReceiptPrinter.printReceipt(receiptData)
      toast({
        title: "Receipt Sent to Printer",
        description: "The receipt has been sent to the default printer.",
      })
    } catch (error) {
      toast({
        title: "Print Error",
        description: "Failed to print receipt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadReceipt = () => {
    try {
      ReceiptPrinter.downloadReceipt(receiptData)
      toast({
        title: "Receipt Downloaded",
        description: "The receipt has been downloaded to your device.",
      })
    } catch (error) {
      toast({
        title: "Download Error",
        description: "Failed to download receipt. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transaction.id)
    toast({
      title: "Transaction ID Copied",
      description: "The transaction ID has been copied to your clipboard.",
    })
  }

  const handleEmailReceipt = () => {
    // This would typically integrate with an email service
    toast({
      title: "Email Feature",
      description: "Email receipt feature would be implemented here.",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl border-slate-200">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold text-slate-900">Sale Completed Successfully!</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Summary */}
          <div className="rounded-lg bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Transaction ID</span>
              <div className="flex items-center space-x-2">
                <code className="text-sm font-mono bg-white px-2 py-1 rounded">{transaction.id}</code>
                <Button variant="ghost" size="sm" onClick={handleCopyTransactionId} className="h-6 w-6 p-0">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Customer</span>
              <span className="text-sm text-slate-900">{transaction.customerName}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-600">Payment Method</span>
              <Badge variant="outline" className="capitalize">
                {transaction.paymentMethod}
              </Badge>
            </div>

            <Separator className="my-3" />

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-green-600">${transaction.total.toFixed(2)}</span>
            </div>

            {transaction.change && transaction.change > 0 && (
              <div className="flex items-center justify-between text-sm text-slate-600 mt-1">
                <span>Change Given</span>
                <span>${transaction.change.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Items Summary */}
          <div className="rounded-lg bg-slate-50 p-4">
            <h4 className="font-medium text-slate-900 mb-2">Items Purchased</h4>
            <div className="space-y-2">
              {transaction.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-medium">${item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handlePrintReceipt} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700">
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>

            <Button onClick={handleDownloadReceipt} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>

            <Button onClick={handleEmailReceipt} variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Email Receipt
            </Button>

            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
