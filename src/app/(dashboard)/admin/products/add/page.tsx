"use client"

import AddProductForm from "@/components/admin/products/add-product-form"

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Add New Product</h1>
        <p className="text-muted-foreground text-sm mt-2">Fill in the details to add a new product</p>
      </div>
      <AddProductForm />
    </div>
  )
}
