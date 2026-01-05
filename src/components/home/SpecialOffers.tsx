"use client";

import React from "react";
import Link from "next/link";
import { Clock, Tag, TrendingUp } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const offers = [
  {
    id: 1,
    title: "Flash Sale",
    discount: "Up to 70% OFF",
    description: "Limited time offer on selected items",
    image: "/images/offer-1.jpg",
    bgColor: "from-red-500 to-orange-500",
    icon: Clock,
    endTime: "23:59:00",
  },
  {
    id: 2,
    title: "New Arrivals",
    discount: "30% OFF",
    description: "Fresh stock just arrived",
    image: "/images/offer-2.jpg",
    bgColor: "from-blue-500 to-cyan-500",
    icon: TrendingUp,
    badge: "NEW",
  },
  {
    id: 3,
    title: "Best Deals",
    discount: "Buy 2 Get 1",
    description: "Special bundle offers",
    image: "/images/offer-3.jpg",
    bgColor: "from-purple-500 to-pink-500",
    icon: Tag,
    badge: "HOT",
  },
];

export default function SpecialOffers() {
  return (
    <section className="py-12">
      <SectionTitle
        title="Special Offers"
        subtitle="Don't miss out on our exclusive deals"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const IconComponent = offer.icon;
          return (
            <Link
              key={offer.id}
              href="/products"
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${offer.bgColor} opacity-90`}
              ></div>

              <div className="relative p-8 h-64 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  {offer.badge && (
                    <span className="bg-white text-red-600 text-xs font-bold px-3 py-1 rounded-full">
                      {offer.badge}
                    </span>
                  )}
                </div>

                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                  <p className="text-3xl font-extrabold mb-2">
                    {offer.discount}
                  </p>
                  <p className="text-white/90 text-sm mb-4">
                    {offer.description}
                  </p>
                  <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors group-hover:scale-105 transform duration-300">
                    Shop Now
                  </button>
                </div>

                {offer.endTime && (
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                    <p className="text-white text-xs font-semibold">
                      Ends in: {offer.endTime}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
