export interface ReceiptData {
  transactionId: string
  date: string
  cashier: string
  customer?: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  subtotal: number
  tax: number
  discount?: number
  total: number
  paymentMethod: string
  amountReceived?: number
  change?: number
}

export class ReceiptPrinter {
  static generateReceiptText(data: ReceiptData): string {
    const lines: string[] = []

    // Header
    lines.push("================================")
    lines.push("        RETAIL POS PRO")
    lines.push("      123 Main Street")
    lines.push("    Anytown, ST 12345")
    lines.push("     Phone: (555) 123-4567")
    lines.push("================================")
    lines.push("")

    // Transaction info
    lines.push(`Transaction: ${data.transactionId}`)
    lines.push(`Date: ${new Date(data.date).toLocaleString()}`)
    lines.push(`Cashier: ${data.cashier}`)
    if (data.customer) {
      lines.push(`Customer: ${data.customer}`)
    }
    lines.push("")
    lines.push("--------------------------------")

    // Items
    data.items.forEach((item) => {
      lines.push(`${item.name}`)
      lines.push(`  ${item.quantity} x $${item.price.toFixed(2)} = $${item.total.toFixed(2)}`)
    })

    lines.push("--------------------------------")

    // Totals
    lines.push(`Subtotal:        $${data.subtotal.toFixed(2)}`)
    if (data.discount && data.discount > 0) {
      lines.push(`Discount:       -$${data.discount.toFixed(2)}`)
    }
    lines.push(`Tax:             $${data.tax.toFixed(2)}`)
    lines.push(`TOTAL:           $${data.total.toFixed(2)}`)
    lines.push("")

    // Payment info
    lines.push(`Payment: ${data.paymentMethod.toUpperCase()}`)
    if (data.amountReceived) {
      lines.push(`Received:        $${data.amountReceived.toFixed(2)}`)
    }
    if (data.change) {
      lines.push(`Change:          $${data.change.toFixed(2)}`)
    }

    lines.push("")
    lines.push("================================")
    lines.push("     Thank you for shopping!")
    lines.push("       Please come again!")
    lines.push("================================")

    return lines.join("\n")
  }

  static downloadReceipt(data: ReceiptData): void {
    const receiptText = this.generateReceiptText(data)
    const blob = new Blob([receiptText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `receipt-${data.transactionId}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  static printReceipt(data: ReceiptData): void {
    const receiptText = this.generateReceiptText(data)
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${data.transactionId}</title>
            <style>
              body { 
                font-family: 'Courier New', monospace; 
                font-size: 12px; 
                line-height: 1.2;
                margin: 0;
                padding: 20px;
              }
              pre { 
                white-space: pre-wrap; 
                margin: 0;
              }
            </style>
          </head>
          <body>
            <pre>${receiptText}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }
}
