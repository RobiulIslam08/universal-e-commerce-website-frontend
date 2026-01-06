// "use client";

// import React from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ShoppingCart } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useAppDispatch } from "@/redux/hooks";
// import { toast } from "sonner";
// import { IProduct } from "@/types/product";
// import { addProduct } from "@/redux/features/cartSlice";

// type Props = {
//   slug?: string;
//   _id?: string;
//   image?: React.ReactNode;
//   title: string;
//   price?: string;
//   strike?: string;
//   badge?: string;
//   product?: IProduct;
// };

// export default function ProductCard({
//   slug,
//   _id,
//   image,
//   title,
//   price,
//   strike,
//   badge,
//   product,
// }: Props) {
//   const productId = _id || slug;
//   const dispatch = useAppDispatch();
//   const router = useRouter();

//   const handleAddToCart = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!product) {
//       toast.error("Product information is missing");
//       return;
//     }

//     // Check if product is out of stock
//     if (product.stockQuantity <= 0) {
//       toast.error("Sorry, this product is out of stock!");
//       return;
//     }

//     // Check if product has orderQuantity and if it exceeds stock
//     if (
//       product.orderQuantity &&
//       product.orderQuantity >= product.stockQuantity
//     ) {
//       toast.error(`Sorry, only ${product.stockQuantity} items left in stock!`);
//       return;
//     }

//     dispatch(addProduct(product));
//     toast.success(`${product.title} added to cart!`);
//   };

//   const handleBuyNow = (e: React.MouseEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (!product?._id) {
//       toast.error("Product information is missing");
//       return;
//     }

//     // Check if product is out of stock
//     if (product.stockQuantity <= 0) {
//       toast.error("Sorry, this product is out of stock!");
//       return;
//     }

//     // Check if product has orderQuantity and if it exceeds stock
//     if (
//       product.orderQuantity &&
//       product.orderQuantity >= product.stockQuantity
//     ) {
//       toast.error(`Sorry, only ${product.stockQuantity} items left in stock!`);
//       return;
//     }

//     // Add to cart first (so it's available in checkout)
//     dispatch(addProduct(product));
//     // Navigate with buyNow query param and quantity=1
//     router.push(`/checkout?buyNow=${product._id}&quantity=1`);
//   };

//   return (
//     <Link
//       href={productId ? `/products/${productId}` : "#"}
//       className="block h-full"
//     >
//       <Card className="hover:shadow-sm transition-all duration-300 hover:-translate-y-1  dark:border-gray-800  group h-full flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
//         <CardContent className="p-0 flex flex-col flex-1">
//           {/* Image Section */}
//           <div className="relative aspect-square  flex items-center justify-center text-5xl overflow-hidden">
//             {image}

//             {/* Badge */}
//             {badge && (
//               <Badge className="absolute top-3 left-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-2 py-0.5 shadow-lg z-10">
//                 {badge}
//               </Badge>
//             )}
//           </div>

//           {/* Content Section */}
//           <div className="px-4 flex flex-col flex-1">
//             {/* Title */}
//             <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 mb-3 min-h-10 leading-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
//               {title}
//             </h3>

//             {/* Price Section */}
//             <div className="flex items-center gap-2 mb-2">
//               <p className="text-xl font-bold text-gray-900 dark:text-white">
//                 {price}
//               </p>
//               {strike && (
//                 <p className="text-sm text-gray-400 line-through">{strike}</p>
//               )}
//             </div>

//             {/* Action Buttons */}
//             <div className="mt-auto flex gap-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 className="flex-1 cursor-pointer hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-300 font-medium text-xs"
//                 onClick={handleAddToCart}
//               >
//                 <ShoppingCart />
//                 Cart
//               </Button>

//               <Button
//                 size="sm"
//                 className="flex-1 cursor-pointer bg-rose-600 hover:bg-rose-700 text-white transition-all duration-300 font-medium text-xs shadow-md hover:shadow-lg"
//                 onClick={handleBuyNow}
//               >
//                 Buy
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   );
// }

"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react"; // ইমেজ এর সাথে মিল রেখে Bag আইকন ব্যবহার করা হয়েছে
import { Badge } from "@/components/ui/badge";
import { useAppDispatch } from "@/redux/hooks";
import { toast } from "sonner";
import { IProduct } from "@/types/product";
import { addProduct } from "@/redux/features/cartSlice";

type Props = {
  slug?: string;
  _id?: string;
  image?: React.ReactNode;
  title: string;
  category?: string; // নতুন প্রপ যোগ করা হয়েছে
  price?: string;
  strike?: string;
  badge?: string;
  product?: IProduct;
};

export default function ProductCard({
  slug,
  _id,
  image,
  title,
  category,
  price,
  strike,
  badge,
  product,
}: Props) {
  const productId = _id || slug;
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product) {
      toast.error("Product information is missing");
      return;
    }

    if (product.stockQuantity <= 0) {
      toast.error("Sorry, this product is out of stock!");
      return;
    }

    if (product.orderQuantity && product.orderQuantity >= product.stockQuantity) {
      toast.error(`Sorry, only ${product.stockQuantity} items left in stock!`);
      return;
    }

    dispatch(addProduct(product));
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <Link
      href={productId ? `/products/${productId}` : "#"}
      className="group block h-full"
    >
      <div className="flex flex-col h-full space-y-3">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-sm bg-gray-100 dark:bg-gray-800 aspect-4/5 sm:aspect-square">
          {/* Main Image */}
          <div className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 flex items-center justify-center text-5xl">
            {image}
          </div>

          {/* Badge (Optional - if needed) */}
          {badge && (
            <Badge className="absolute top-3 left-3 bg-rose-600 text-white border-none px-2 py-0.5 text-xs font-semibold shadow-sm">
              {badge}
            </Badge>
          )}

          {/* Floating Add to Cart Button (Top Right like the image) */}
          <button
            onClick={handleAddToCart}
            className="absolute top-3 right-3 h-10 w-10 flex items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition-all duration-300 hover:bg-rose-600 hover:text-white hover:scale-110 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            aria-label="Add to cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-1">
          {/* Title */}
          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight truncate">
            {title}
          </h3>

          {/* Category */}
          {category && (
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              {category}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 pt-1">
            <p className="text-lg font-bold text-gray-600 dark:text-blue-400">
              {price}
            </p>
            {strike && (
              <p className="text-sm text-gray-400 line-through decoration-gray-400">
                {strike}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}