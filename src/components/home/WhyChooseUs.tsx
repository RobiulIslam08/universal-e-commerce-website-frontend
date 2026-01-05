"use client";

import React from "react";
import {
  Truck,
  Shield,
  CreditCard,
  Headphones,
  RefreshCw,
  Award,
} from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const features = [
  {
    id: 1,
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: 2,
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected transactions",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: 3,
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day return policy",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: 4,
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer service",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: 5,
    icon: CreditCard,
    title: "Flexible Payment",
    description: "Multiple payment options",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
  {
    id: 6,
    icon: Award,
    title: "Quality Guaranteed",
    description: "100% authentic products",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <SectionTitle
        title="Why Choose Us"
        subtitle="Your satisfaction is our top priority"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={feature.id}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              <div
                className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <IconComponent className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
