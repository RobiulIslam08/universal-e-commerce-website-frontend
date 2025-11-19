import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const categories = [
  { title: "Home essentials", icon: "🛋️" },
  { title: "Appliances", icon: "🔌" },
  { title: "Toys", icon: "🧸" },
  { title: "Sports", icon: "🏀" },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {categories.map((c, idx) => (
        <Card
          key={idx}
          className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-0 shadow-md"
        >
          <CardHeader>
            <CardTitle className="text-lg font-bold">{c.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-square bg-linear-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-5xl shadow-inner hover:scale-110 transition-transform duration-300">
                {c.icon}
              </div>
              <div className="flex items-center">
                <p className="text-sm text-gray-600 font-medium">
                  See offers and top picks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
