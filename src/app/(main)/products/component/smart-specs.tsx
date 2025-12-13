"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IProduct } from "@/types/product";
import { FileText, ListFilter, Truck } from "lucide-react";

export default function SmartSpecs({ product }: { product: IProduct }) {
  return (
    <Accordion type="single" collapsible defaultValue="details" className="w-full">
      
      {/* Item 1: Product Details */}
      <AccordionItem value="details" className="border-rose-100 dark:border-rose-900/50">
        <AccordionTrigger className="hover:no-underline hover:bg-rose-50/50 dark:hover:bg-rose-900/20 px-4 rounded-xl data-[state=open]:bg-rose-50 dark:data-[state=open]:bg-rose-900/30 transition-colors">
          <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <FileText className="w-5 h-5 text-primary" />
            Product Overview
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-4 pb-6 text-muted-foreground leading-7 text-[16px]">
            <div className="prose prose-rose dark:prose-invert max-w-none">
                <p>{product.longDescription}</p>
            </div>
        </AccordionContent>
      </AccordionItem>

      {/* Item 2: Tech Specs */}
      <AccordionItem value="specs" className="border-rose-100 dark:border-rose-900/50">
        <AccordionTrigger className="hover:no-underline hover:bg-rose-50/50 dark:hover:bg-rose-900/20 px-4 rounded-xl data-[state=open]:bg-rose-50 dark:data-[state=open]:bg-rose-900/30 transition-colors">
           <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <ListFilter className="w-5 h-5 text-primary" />
            Technical Specifications
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-4 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            {product.specifications.map((spec, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-dashed border-rose-100 dark:border-rose-900/50">
                <span className="font-medium text-muted-foreground">{spec.key}</span>
                <span className="font-semibold text-foreground">{spec.value}</span>
              </div>
            ))}
             <div className="flex justify-between py-2 border-b border-dashed border-rose-100 dark:border-rose-900/50">
                <span className="font-medium text-muted-foreground">SKU</span>
                <span className="font-semibold text-foreground font-mono text-sm">{product.sku}</span>
             </div>
          </div>
        </AccordionContent>
      </AccordionItem>

       {/* Item 3: Shipping & Returns */}
       <AccordionItem value="shipping" className="border-rose-100 dark:border-rose-900/50 border-b-0">
        <AccordionTrigger className="hover:no-underline hover:bg-rose-50/50 dark:hover:bg-rose-900/20 px-4 rounded-xl data-[state=open]:bg-rose-50 dark:data-[state=open]:bg-rose-900/30 transition-colors">
           <div className="flex items-center gap-3 text-lg font-semibold text-foreground">
            <Truck className="w-5 h-5 text-primary" />
            Shipping & Warranty
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-4 pb-6">
          <div className="grid gap-4 sm:grid-cols-2">
             <div className="bg-rose-50/50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100/50">
                <h4 className="font-semibold text-foreground mb-1">Delivery info</h4>
                <p className="text-sm text-muted-foreground">{product.shippingAndReturns.deliveryTime}</p>
                <p className="text-xs text-rose-500 mt-1">Weight: {product.shippingAndReturns.shippingWeight}</p>
             </div>
             <div className="bg-rose-50/50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100/50">
                <h4 className="font-semibold text-foreground mb-1">Warranty & Returns</h4>
                <p className="text-sm text-muted-foreground">{product.warranty.duration} - {product.warranty.coverage}</p>
                <p className="text-xs text-rose-500 mt-1">{product.shippingAndReturns.returnPolicy}</p>
             </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}