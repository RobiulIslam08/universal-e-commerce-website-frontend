"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-balance">Store Settings</h1>
        <p className="text-muted-foreground text-sm mt-2">Manage your store information</p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
          <span className="text-xl">✓</span>
          <p className="text-sm text-green-900 dark:text-green-100">Settings saved successfully!</p>
        </div>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your store name and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Store Name</label>
            <Input defaultValue="My Store" className="mt-1 bg-input border-border" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Store Description</label>
            <Textarea
              defaultValue="Welcome to our online store where we offer premium products across multiple categories."
              className="mt-1 bg-input border-border resize-none h-24"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Store Email</label>
            <Input type="email" defaultValue="support@mystore.com" className="mt-1 bg-input border-border" />
          </div>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
