"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IProduct } from "@/types/product";
import { FileText, ListFilter, MessageSquare } from "lucide-react";
import ReviewForm from "./ReviewForm";

interface ProductDetailsTabsProps {
  product: IProduct;
  productId: string;
  onReviewSubmitted: () => void;
}

export default function ProductDetailsTabs({
  product,
  productId,
  onReviewSubmitted,
}: ProductDetailsTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full md:w-[60%] lg:w-[50%] grid-cols-3 h-auto">
        <TabsTrigger
          value="overview"
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 antialiased"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 600,
          }}
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="specs"
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 antialiased"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 600,
          }}
        >
          <ListFilter className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Specifications</span>
        </TabsTrigger>
        <TabsTrigger
          value="review"
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4 antialiased"
          style={{
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 600,
          }}
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Reviews</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 sm:mt-6">
        <div className="border rounded-lg p-4 sm:p-6 bg-card">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight mb-4 sm:mb-6 flex items-center gap-2 antialiased"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
            Product Description
          </h3>
          <p
            className="text-sm sm:text-base lg:text-lg leading-loose text-slate-600 dark:text-slate-400 font-medium antialiased"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: "1.8",
            }}
          >
            {product.longDescription}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="specs" className="mt-4 sm:mt-6">
        <div className="border rounded-lg p-4 sm:p-6 bg-card">
          <h3 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight mb-4 sm:mb-6 flex items-center gap-2">
            <ListFilter className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
            Technical Specifications
          </h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full min-w-full">
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {product.specifications.map((spec, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <td className="py-3 sm:py-4 pl-4 sm:pl-0 pr-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base font-semibold uppercase tracking-wide">
                      {spec.key}
                    </td>
                    <td className="py-3 sm:py-4 pr-4 sm:pr-0 font-bold text-left text-sm sm:text-base lg:text-lg text-foreground">
                      {spec.value}
                    </td>
                  </tr>
                ))}
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 sm:py-4 pl-4 sm:pl-0 pr-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base font-semibold uppercase tracking-wide">
                    SKU
                  </td>
                  <td className="py-3 sm:py-4 pr-4 sm:pr-0 font-bold text-left font-mono text-sm sm:text-base lg:text-lg text-foreground">
                    {product.sku}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="review" className="mt-4 sm:mt-6">
        <div className="border rounded-lg p-4 sm:p-6 bg-card">
          <h3
            className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight mb-4 sm:mb-6 flex items-center gap-2 antialiased"
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
            Share Your Experience
          </h3>
          <ReviewForm
            productId={productId}
            onReviewSubmitted={onReviewSubmitted}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
