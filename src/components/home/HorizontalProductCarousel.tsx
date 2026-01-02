/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/common/ProductCard";

export default function HorizontalProductCarousel() {
  const items = Array.from({ length: 8 }, (_, i) => i + 1);
  const [prices, setPrices] = useState<number[]>([]);
  const [strike, setStrike] = useState<number[]>([]);

  useEffect(() => {
    // generate client-only prices to avoid SSR hydration mismatches
    const p = items.map(() => Math.floor(Math.random() * 200 + 50));
    const s = p.map((v) => v + Math.floor(Math.random() * 150 + 100));
    setPrices(p);
    setStrike(s);
  }, []);

  return (
    <div className="overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-3 w-max">
        {items.map((id, idx) => (
          <div key={id} className="shrink-0 w-40 sm:w-48">
            <ProductCard
              image={"🎁"}
              title={`Limited Time Deal ${id}`}
              price={prices[idx] ? `$${prices[idx]}` : "$ —"}
              strike={strike[idx] ? `$${strike[idx]}` : ""}
              badge={"Up to 50% off"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
