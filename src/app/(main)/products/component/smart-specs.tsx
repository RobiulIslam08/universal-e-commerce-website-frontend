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
    <Accordion
      type="single"
      collapsible
      defaultValue="details"
      className="w-full space-y-2"
    >
      {/* Product Overview */}
      <AccordionItem
        value="details"
        className="border rounded-lg overflow-hidden"
      >
        <AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/50">
          <div className="flex items-center gap-2 font-medium">
            <FileText className="w-4 h-4" />
            Product Overview
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-4">
          <p className="text-sm leading-relaxed">{product.longDescription}</p>
        </AccordionContent>
      </AccordionItem>

      {/* Technical Specifications */}
      <AccordionItem
        value="specs"
        className="border rounded-lg overflow-hidden"
      >
        <AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/50">
          <div className="flex items-center gap-2 font-medium">
            <ListFilter className="w-4 h-4" />
            Technical Specifications
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-4">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              {product.specifications.map((spec, idx) => (
                <tr key={idx} className="hover:bg-muted/30">
                  <td className="py-2.5 pr-4 text-muted-foreground">
                    {spec.key}
                  </td>
                  <td className="py-2.5 font-medium text-right">
                    {spec.value}
                  </td>
                </tr>
              ))}
              <tr className="hover:bg-muted/30">
                <td className="py-2.5 pr-4 text-muted-foreground">SKU</td>
                <td className="py-2.5 font-medium text-right font-mono">
                  {product.sku}
                </td>
              </tr>
            </tbody>
          </table>
        </AccordionContent>
      </AccordionItem>

      {/* Shipping & Warranty */}
      <AccordionItem
        value="shipping"
        className="border rounded-lg overflow-hidden"
      >
        <AccordionTrigger className="hover:no-underline px-4 py-3 bg-muted/50">
          <div className="flex items-center gap-2 font-medium">
            <Truck className="w-4 h-4" />
            Shipping & Warranty
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 py-4">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              <tr className="hover:bg-muted/30">
                <td className="py-2.5 pr-4 text-muted-foreground">
                  Delivery Time
                </td>
                <td className="py-2.5 font-medium text-right">
                  {product.shippingAndReturns.deliveryTime}
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-2.5 pr-4 text-muted-foreground">
                  Shipping Weight
                </td>
                <td className="py-2.5 font-medium text-right">
                  {product.shippingAndReturns.shippingWeight}
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-2.5 pr-4 text-muted-foreground">Warranty</td>
                <td className="py-2.5 font-medium text-right">
                  {product.warranty.duration} - {product.warranty.coverage}
                </td>
              </tr>
              <tr className="hover:bg-muted/30">
                <td className="py-2.5 pr-4 text-muted-foreground">
                  Return Policy
                </td>
                <td className="py-2.5 font-medium text-right">
                  {product.shippingAndReturns.returnPolicy}
                </td>
              </tr>
            </tbody>
          </table>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
