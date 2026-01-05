"use client";

import React from "react";
import { Star, Quote } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Buyer",
    rating: 5,
    comment:
      "Absolutely love my purchase! The quality exceeded my expectations and delivery was super fast. Highly recommend!",
    image: "/images/user-1.jpg",
    date: "2 days ago",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Regular Customer",
    rating: 5,
    comment:
      "Best online shopping experience I've had. Great prices, genuine products, and excellent customer service.",
    image: "/images/user-2.jpg",
    date: "1 week ago",
  },
  {
    id: 3,
    name: "Emily Williams",
    role: "Verified Buyer",
    rating: 5,
    comment:
      "The product quality is outstanding and the packaging was perfect. Will definitely shop here again!",
    image: "/images/user-3.jpg",
    date: "2 weeks ago",
  },
  {
    id: 4,
    name: "David Martinez",
    role: "VIP Member",
    rating: 5,
    comment:
      "Professional service and authentic products. This is now my go-to store for all my shopping needs.",
    image: "/images/user-4.jpg",
    date: "3 weeks ago",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 bg-linear-to-br from-gray-50 to-blue-50">
      <SectionTitle
        title="What Our Customers Say"
        subtitle="Don't just take our word for it"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <Quote className="w-8 h-8 text-blue-500 opacity-50" />
              <div className="flex gap-1">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            </div>

            <p className="text-gray-700 text-sm mb-6 leading-relaxed">
              &quot;{testimonial.comment}&quot;
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {testimonial.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-400">{testimonial.date}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
