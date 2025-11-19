import React from "react";
import SectionCard from "./SectionCard";
import ProductCard from "@/components/common/ProductCard";

const sampleSections = [
  {
    title: "PC Devices | Up to 20% off",
    products: [
      { img: "🖥️", title: "Samsung Monitor", price: "SAR 1,299" },
      { img: "💻", title: "Gaming Laptop", price: "SAR 4,999" },
      { img: "🖱️", title: "RGB Mouse", price: "SAR 129" },
      { img: "⌨️", title: "Mechanical Keyboard", price: "SAR 349" },
    ],
  },
  {
    title: "Up to 30% off | Deals on new arrivals",
    products: [
      { img: "🛋️", title: "Home essentials", price: "From SAR 49" },
      { img: "🧰", title: "Tools & home improvement", price: "From SAR 29" },
      { img: "🚗", title: "Car essentials", price: "From SAR 59" },
      { img: "🪑", title: "Furniture", price: "From SAR 199" },
    ],
  },
];

export default function DealsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sampleSections.map((s, i) => (
        <SectionCard key={i} title={s.title} cta="See more">
          <div className="grid grid-cols-2 gap-3">
            {s.products.map((p, idx) => (
              <ProductCard
                key={idx}
                image={p.img}
                title={p.title}
                price={p.price}
              />
            ))}
          </div>
        </SectionCard>
      ))}
    </div>
  );
}
