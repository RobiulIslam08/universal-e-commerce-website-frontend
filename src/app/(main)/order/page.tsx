"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ChevronRight,
  Search,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { products } from "@/constants/products";

// Mock Data Types
type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  trackingNumber?: string;
}

// Mock Orders Data using products from constants
const mockOrders: Order[] = [
  {
    id: "ORD-7782-3421",
    date: "Nov 28, 2025",
    status: "processing",
    total: 129.99,
    items: [
      {
        id: "item-1",
        productId: "1", // Wireless Headphones
        quantity: 1,
        price: 89.99,
      },
      {
        id: "item-2",
        productId: "2", // Smart Watch
        quantity: 1,
        price: 19.99,
      },
    ],
  },
  {
    id: "ORD-9921-1120",
    date: "Nov 25, 2025",
    status: "shipped",
    total: 245.5,
    trackingNumber: "TRK-88219922",
    items: [
      {
        id: "item-3",
        productId: "3", // Bluetooth Speaker
        quantity: 1,
        price: 199.99,
      },
      {
        id: "item-4",
        productId: "4", // Wireless Mouse
        quantity: 1,
        price: 15.0,
      },
    ],
  },
  {
    id: "ORD-1102-4432",
    date: "Nov 10, 2025",
    status: "delivered",
    total: 59.99,
    items: [
      {
        id: "item-5",
        productId: "9", // Cotton T-Shirt
        quantity: 1,
        price: 59.99,
      },
    ],
  },
  {
    id: "ORD-5521-0092",
    date: "Oct 15, 2025",
    status: "cancelled",
    total: 450.0,
    items: [
      {
        id: "item-6",
        productId: "62", // Gaming Monitor
        quantity: 1,
        price: 450.0,
      },
    ],
  },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "processing":
      return "bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20";
    case "shipped":
      return "bg-purple-500/10 text-purple-600 border-purple-200 hover:bg-purple-500/20";
    case "delivered":
      return "bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20";
    case "cancelled":
      return "bg-red-500/10 text-red-600 border-red-200 hover:bg-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-200";
  }
};

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case "processing":
      return <Clock className="w-3.5 h-3.5 mr-1" />;
    case "shipped":
      return <Truck className="w-3.5 h-3.5 mr-1" />;
    case "delivered":
      return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
    case "cancelled":
      return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
  }
};

export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Helper to get product details
  const getProductDetails = (productId: string) => {
    return products.find((p) => p.id === productId);
  };

  const filteredOrders = mockOrders.filter((order) => {
    const matchesTab = activeTab === "all" || order.status === activeTab;
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) => {
        const product = getProductDetails(item.productId);
        return product?.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-muted/30 py-8 md:py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Orders
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track your recent purchases
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="hidden md:flex">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-card rounded-xl border shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
              {(
                [
                  "all",
                  "processing",
                  "shipped",
                  "delivered",
                  "cancelled",
                ] as const
              ).map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab)}
                  className={`capitalize rounded-full px-4 ${
                    activeTab === tab
                      ? "shadow-md"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </Button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search order ID or product..."
                className="pl-9 bg-muted/50 border-transparent focus:bg-background focus:border-primary transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden border-border/60 hover:border-primary/30 hover:shadow-md transition-all duration-300 group"
              >
                {/* Card Header */}
                <div className="bg-muted/30 p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium mb-0.5">
                        Order Placed
                      </span>
                      <span className="font-medium text-foreground">
                        {order.date}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium mb-0.5">
                        Total Amount
                      </span>
                      <span className="font-medium text-foreground">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider font-medium mb-0.5">
                        Order ID
                      </span>
                      <span className="font-mono text-foreground">
                        {order.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`px-3 py-1 border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </Badge>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* Product Images */}
                    <div className="flex -space-x-3 overflow-hidden py-1 pl-1">
                      {order.items.map((item, index) => {
                        const product = getProductDetails(item.productId);
                        return (
                          <div
                            key={item.id}
                            className="relative w-14 h-14 rounded-lg border-2 border-background bg-muted shadow-sm overflow-hidden hover:scale-110 hover:z-10 transition-transform duration-200 flex items-center justify-center text-2xl"
                            style={{ zIndex: order.items.length - index }}
                          >
                            {product?.image ? (
                              // Check if image is an emoji or a URL
                              product.image.startsWith("/") ||
                              product.image.startsWith("http") ? (
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <span>{product.image}</span>
                              )
                            ) : (
                              <span className="text-xs">No Img</span>
                            )}
                          </div>
                        );
                      })}
                      {order.items.length > 3 && (
                        <div className="relative w-14 h-14 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground z-0">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Order Summary Text */}
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {getProductDetails(order.items[0].productId)?.title ||
                          "Unknown Product"}
                        {order.items.length > 1 && (
                          <span className="text-muted-foreground font-normal">
                            {" "}
                            + {order.items.length - 1} more items
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {order.status === "shipped"
                          ? `Arriving soon • Track: ${order.trackingNumber}`
                          : order.status === "delivered"
                          ? "Delivered on time"
                          : "Updated recently"}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto mt-4 md:mt-0">
                      <Button variant="outline" className="w-full sm:w-auto">
                        View Details
                      </Button>
                      {order.status === "shipped" && (
                        <Button className="w-full sm:w-auto">
                          Track Order
                        </Button>
                      )}
                      {order.status === "delivered" && (
                        <Button
                          className="w-full sm:w-auto"
                          variant="secondary"
                        >
                          Write Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-medium text-foreground">
                No orders found
              </h3>
              <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
                We couldn&apos;t find any orders matching your current filters.
                Try changing the status or search term.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
