"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/types/product"
import { Card } from "@/components/ui/card"

interface ProductsTableProps {
  products: Product[]
}

export default function ProductsTable({ products }: ProductsTableProps) {
  if (products.length === 0) {
    return (
      <Card className="border-border">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground text-sm">No products found</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Product</TableHead>
              <TableHead className="text-muted-foreground">SKU</TableHead>
              <TableHead className="text-muted-foreground text-right">Price</TableHead>
              <TableHead className="text-muted-foreground text-right">Stock</TableHead>
              <TableHead className="text-muted-foreground">Status</TableHead>
              <TableHead className="text-muted-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-border hover:bg-muted/50">
                <TableCell>
                  <div>
                    <p className="font-medium text-sm text-foreground line-clamp-1">{product.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{product.category}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.sku}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <p className="font-semibold text-primary">${product.price}</p>
                    <p className="text-xs text-muted-foreground line-through">${product.strikePrice}</p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium text-sm text-foreground">{product.stockQuantity}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={product.inStock ? "outline" : "destructive"} className="whitespace-nowrap">
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                      ✏️
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      🗑️
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}
