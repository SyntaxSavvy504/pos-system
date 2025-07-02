"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Store, Receipt, Bell, Shield, Palette } from "lucide-react"

export function SettingsPage() {
  const [settings, setSettings] = useState({
    storeName: "RetailPOS Pro",
    storeAddress: "123 Main Street, City, State 12345",
    storePhone: "+1 (555) 123-4567",
    storeEmail: "contact@retailpos.com",
    taxRate: 8.0,
    currency: "USD",
    receiptFooter: "Thank you for your business!",
    lowStockThreshold: 5,
    enableNotifications: true,
    enableLowStockAlerts: true,
    enableSalesReports: true,
    autoBackup: true,
    theme: "light",
  })

  const handleSave = () => {
    // Save settings logic here
    console.log("Saving settings:", settings)
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Configure your POS system preferences and business information</p>
      </div>

      {/* Store Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Store Information
          </CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="storePhone">Phone Number</Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="storeAddress">Address</Label>
            <Input
              id="storeAddress"
              value={settings.storeAddress}
              onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="storeEmail">Email</Label>
            <Input
              id="storeEmail"
              type="email"
              value={settings.storeEmail}
              onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sales & Tax Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Sales & Tax Settings
          </CardTitle>
          <CardDescription>Configure tax rates and currency settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.1"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number.parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={settings.currency}
                onValueChange={(value) => setSettings({ ...settings, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD (C$)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="receiptFooter">Receipt Footer Message</Label>
            <Input
              id="receiptFooter"
              value={settings.receiptFooter}
              onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Inventory Settings
          </CardTitle>
          <CardDescription>Configure inventory management preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="lowStockThreshold">Low Stock Alert Threshold</Label>
            <Input
              id="lowStockThreshold"
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings({ ...settings, lowStockThreshold: Number.parseInt(e.target.value) || 0 })}
            />
            <p className="text-sm text-muted-foreground mt-1">Alert when product stock falls below this number</p>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableNotifications">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive general system notifications</p>
            </div>
            <Switch
              id="enableNotifications"
              checked={settings.enableNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableLowStockAlerts">Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
            </div>
            <Switch
              id="enableLowStockAlerts"
              checked={settings.enableLowStockAlerts}
              onCheckedChange={(checked) => setSettings({ ...settings, enableLowStockAlerts: checked })}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="enableSalesReports">Daily Sales Reports</Label>
              <p className="text-sm text-muted-foreground">Receive daily sales summary reports</p>
            </div>
            <Switch
              id="enableSalesReports"
              checked={settings.enableSalesReports}
              onCheckedChange={(checked) => setSettings({ ...settings, enableSalesReports: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>Configure system preferences and appearance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme">Theme</Label>
            <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="autoBackup">Automatic Backup</Label>
              <p className="text-sm text-muted-foreground">Automatically backup your data daily</p>
            </div>
            <Switch
              id="autoBackup"
              checked={settings.autoBackup}
              onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  )
}
