import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  slug?: string;
  _id?: string;
  image?: React.ReactNode;
  title: string;
  price?: string;
  strike?: string;
  badge?: string;
};

export default function ProductCard({
  slug,
  _id,
  image,
  title,
  price,
  strike,
  badge,
}: Props) {
  const productId = _id || slug;
  return (
    <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm group h-full flex flex-col">
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="aspect-square bg-linear-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-5xl mb-3 group-hover:scale-105 transition-transform duration-300 shadow-inner relative overflow-hidden">
          {image}
        </div>

        <div className="min-h-7 mb-2">
          {badge && (
            <Badge className="bg-rose-600 hover:bg-rose-700 text-white font-semibold">
              {badge}
            </Badge>
          )}
        </div>

        <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 min-h-10 leading-tight">
          {title}
        </p>

        <div className="space-y-1 min-h-12">
          <p className="text-xl font-bold text-gray-900">{price}</p>
          {strike && (
            <p className="text-xs text-gray-500 line-through">{strike}</p>
          )}
        </div>

        <div className="mt-auto pt-3">
          <Button
            variant="outline"
            size="sm"
            className="w-full hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors duration-300 font-semibold"
            onClick={() => {
              // Add to cart logic here
            }}
          >
            Add to Cart
          </Button>
        </div>

        {productId && (
          <div className="mt-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-colors duration-300 font-semibold"
            >
              <Link href={`/products/${productId}`}>View Details</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
