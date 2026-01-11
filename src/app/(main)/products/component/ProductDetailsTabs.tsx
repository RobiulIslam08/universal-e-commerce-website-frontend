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
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4"
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Overview</span>
        </TabsTrigger>
        <TabsTrigger
          value="specs"
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4"
        >
          <ListFilter className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Specifications</span>
        </TabsTrigger>
        <TabsTrigger
          value="review"
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-4"
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-xs sm:text-sm">Reviews</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-4 sm:mt-6">
        <div className="border rounded-lg p-4 sm:p-6 bg-card">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            Description
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            {product.longDescription}
          </p>
        </div>
      </TabsContent>

      <TabsContent value="specs" className="mt-4 sm:mt-6">
        <div className="border rounded-lg p-4 sm:p-6 bg-card">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <ListFilter className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
           Specifications
          </h3>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full text-sm min-w-full">
              <tbody className="divide-y">
                {product.specifications.map((spec, idx) => (
                  <tr key={idx} className="hover:bg-muted/30">
                    <td className="py-2.5 pl-4 sm:pl-0 pr-4 text-muted-foreground text-xs sm:text-sm">
                      {spec.key}
                    </td>
                    <td className="py-2 pr-4 sm:pr-0 font-medium text-left text-xs sm:text-sm">
                      {spec.value}
                    </td>
                  </tr>
                ))}
                <tr className="hover:bg-muted/30">
                  <td className="py-2.5 pl-4 sm:pl-0 pr-4 text-muted-foreground text-xs sm:text-sm">
                    SKU
                  </td>
                  <td className="py-2.5 pr-4 sm:pr-0 font-medium text-left font-mono text-xs sm:text-sm">
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
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" />
            Write a Review
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
