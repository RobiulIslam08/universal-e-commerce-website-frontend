// // components/cart/CartItemCard.tsx
// "use client";

// import { Trash2, Heart, Plus, Minus, Tag } from "lucide-react";

// // Shadcn Components
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// // Types
// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   originalPrice: number;
//   quantity: number;
//   image: string;
//   color: string;
//   inStock: boolean;
// }

// interface CartItemCardProps {
//   item: CartItem;
//   updateQuantity: (id: number, newQuantity: number) => void;
//   removeItem: (id: number) => void;
//   moveToWishlist: (id: number) => void;
//   isRemoving: boolean;
// }

// export default function CartItemCard({ item, updateQuantity, removeItem, moveToWishlist, isRemoving }: CartItemCardProps) {
//   const itemTotal = item.price * item.quantity;
//   const itemSavings = (item.originalPrice - item.price) * item.quantity;

//   return (
//     <Card 
//       className={`transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} shadow-lg hover:shadow-xl border-slate-200 dark:border-slate-800`}
//     >
//       <CardContent className="p-4 sm:p-6">
//         <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
//           {/* Product Image */}
//           <div className="relative shrink-0 w-full sm:w-32">
//             <div className="w-full h-24 sm:h-full rounded-xl bg-rose-50 dark:bg-slate-800 flex items-center justify-center text-5xl border-2 border-rose-100 dark:border-rose-900">
//               {item.image}
//             </div>
//             {!item.inStock && (
//               <div className="absolute top-0 right-0 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
//                 Out of Stock
//               </div>
//             )}
//           </div>

//           {/* Product Details & Actions */}
//           <div className="flex-1 min-w-0">
//             <div className="flex justify-between items-start gap-4 mb-3">
//               <div>
//                 <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
//                   {item.name}
//                 </h3>
//                 <p className="text-sm text-slate-500 dark:text-slate-400">Color: {item.color}</p>
//               </div>

//               {/* Actions on desktop/tablet */}
//               <div className="hidden sm:flex gap-1 shrink-0">
//                 <Button variant="ghost" size="icon" onClick={() => moveToWishlist(item.id)} title="Move to Wishlist">
//                   <Heart className="w-4 h-4 text-slate-400 hover:text-rose-500 hover:fill-rose-500 transition-all" />
//                 </Button>
//                 <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} title="Remove Item">
//                   <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500 transition-all" />
//                 </Button>
//               </div>
//             </div>

//             {/* Price, Quantity, and Total */}
//             <div className="flex flex-wrap items-center justify-between gap-4">
//               <div className="flex items-baseline gap-2">
//                 <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
//                   ${item.price}
//                 </span>
//                 {item.originalPrice > item.price && (
//                   <span className="text-sm text-slate-400 dark:text-slate-600 line-through">
//                     ${item.originalPrice}
//                   </span>
//                 )}
//               </div>

//               {/* Quantity Selector */}
//               <div className="flex items-center space-x-2">
//                 <Button 
//                   variant="outline" 
//                   size="icon" 
//                   onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                   disabled={item.quantity <= 1}
//                 >
//                   <Minus className="h-4 w-4" />
//                 </Button>
//                 <span className="px-3 font-semibold text-lg">{item.quantity}</span>
//                 <Button 
//                   variant="outline" 
//                   size="icon" 
//                   onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                 >
//                   <Plus className="h-4 w-4" />
//                 </Button>
//               </div>

//               <div className="text-lg font-bold text-slate-900 dark:text-white sm:w-auto w-full text-right sm:text-left">
//                 Total: <span className="text-rose-600 dark:text-rose-400">${itemTotal.toFixed(2)}</span>
//               </div>
//             </div>

//             {/* Savings Badge */}
//             {item.originalPrice > item.price && (
//               <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
//                 <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
//                 <span className="text-xs font-semibold text-green-700 dark:text-green-400">
//                   You save ${itemSavings}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
        
//         {/* Actions on mobile */}
//         <div className="flex justify-end gap-3 mt-4 sm:hidden border-t pt-4">
//           <Button variant="ghost" className="text-slate-500 hover:text-rose-500" onClick={() => moveToWishlist(item.id)}><Heart className="w-4 h-4 mr-2" /> Wishlist</Button>
//           <Button variant="ghost" className="text-slate-500 hover:text-red-500" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4 mr-2" /> Remove</Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// components/cart/CartItemCard.tsx
"use client";

import { Trash2, Heart, Plus, Minus, Tag } from "lucide-react";

// Shadcn Components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // ⭐️ New import

// Types
interface CartItem {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  color: string;
  inStock: boolean;
}

interface CartItemCardProps {
  item: CartItem;
  updateQuantity: (id: number, newQuantity: number) => void;
  removeItem: (id: number) => void;
  moveToWishlist: (id: number) => void;
  isRemoving: boolean;
  // ⭐️ New Selection Props
  isSelected: boolean;
  onToggleSelection: (id: number, checked: boolean) => void;
}

export default function CartItemCard({ item, updateQuantity, removeItem, moveToWishlist, isRemoving, isSelected, onToggleSelection }: CartItemCardProps) {
  const itemTotal = item.price * item.quantity;
  const itemSavings = (item.originalPrice - item.price) * item.quantity;

  return (
    <Card 
      className={`transition-all duration-300 ${isRemoving ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} shadow-lg hover:shadow-xl border-slate-200 dark:border-slate-800`}
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex gap-4"> 
          {/* ⭐️ Checkbox */}
          <div className="pt-2 shrink-0">
            <Checkbox 
              id={`item-${item.id}`}
              checked={isSelected}
              onCheckedChange={(checked) => onToggleSelection(item.id, checked as boolean)}
              className="w-5 h-5 mt-1 data-[state=checked]:bg-rose-600"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-1">
            {/* Product Image */}
            <div className="relative shrink-0 w-full sm:w-32">
              <div className="w-full h-24 sm:h-full rounded-xl bg-rose-50 dark:bg-slate-800 flex items-center justify-center text-5xl border-2 border-rose-100 dark:border-rose-900">
                {item.image}
              </div>
              {!item.inStock && (
                <div className="absolute top-0 right-0 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Details & Actions */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-4 mb-3">
                <label htmlFor={`item-${item.id}`} className="cursor-pointer">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Color: {item.color}</p>
                </label>

                {/* Actions on desktop/tablet */}
                <div className="hidden sm:flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => moveToWishlist(item.id)} title="Move to Wishlist">
                    <Heart className="w-4 h-4 text-slate-400 hover:text-rose-500 hover:fill-rose-500 transition-all" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} title="Remove Item">
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500 transition-all" />
                  </Button>
                </div>
              </div>

              {/* Price, Quantity, and Total */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
                    ${item.price}
                  </span>
                  {item.originalPrice > item.price && (
                    <span className="text-sm text-slate-400 dark:text-slate-600 line-through">
                      ${item.originalPrice}
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-3 font-semibold text-lg">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-lg font-bold text-slate-900 dark:text-white sm:w-auto w-full text-right sm:text-left">
                  Total: <span className="text-rose-600 dark:text-rose-400">${itemTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Savings Badge */}
              {item.originalPrice > item.price && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Tag className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-semibold text-green-700 dark:text-green-400">
                    You save ${itemSavings}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions on mobile */}
        <div className="flex justify-end gap-3 mt-4 sm:hidden border-t pt-4">
          <Button variant="ghost" className="text-slate-500 hover:text-rose-500" onClick={() => moveToWishlist(item.id)}><Heart className="w-4 h-4 mr-2" /> Wishlist</Button>
          <Button variant="ghost" className="text-slate-500 hover:text-red-500" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4 mr-2" /> Remove</Button>
        </div>
      </CardContent>
    </Card>
  );
}