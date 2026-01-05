"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";

interface RecentProductsProps {
  products: IProduct[];
}

export default function RecentProducts({ products }: RecentProductsProps) {
  return (
    <Card className="border-0 bg-linear-to-br from-card to-card/50 shadow-lg shadow-rose-500/10 dark:shadow-rose-500/5 overflow-hidden">
      <div className="bg-linear-to-r from-rose-50/50 to-orange-50/30 dark:from-rose-950/20 dark:to-orange-950/10 border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Products</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Latest items added to inventory
            </p>
          </div>
          <Link href="/admin/products">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-border/50 hover:bg-muted/50 transition-all duration-300 bg-transparent"
            >
              View All →
            </Button>
          </Link>
        </div>
      </div>

      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {products.map((product, index) => (
            <div
              key={product.id || product._id || index}
              className="flex items-center justify-between p-5 hover:bg-linear-to-r hover:from-rose-50/30 hover:to-orange-50/20 dark:hover:from-rose-950/10 dark:hover:to-orange-950/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 shadow-md group-hover:shadow-lg transition-all duration-300">
                  <Image
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-300">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.sku}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 ml-4">
                <div className="text-right hidden sm:block">
                  <p className="font-bold text-primary">${product.price}</p>
                  <p className="text-xs text-muted-foreground line-through">
                    ${product.strikePrice}
                  </p>
                </div>

                <div className="text-right hidden md:block min-w-16">
                  <p className="font-semibold text-sm text-foreground">
                    {product.stockQuantity}
                  </p>
                  <p className="text-xs text-muted-foreground">units</p>
                </div>

                <Badge
                  variant={
                    product.stockQuantity > 0 ? "outline" : "destructive"
                  }
                  className="whitespace-nowrap border-border/50 transition-all duration-300"
                >
                  {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
                </Badge>

               
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
