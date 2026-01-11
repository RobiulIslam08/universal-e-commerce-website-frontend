

"use client";

import React from "react";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import SectionTitle from "@/components/common/SectionTitle";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Verified Buyer",
    rating: 5,
    comment: "Absolutely love my purchase! The quality exceeded my expectations and delivery was super fast. Highly recommend!",
    date: "Jan 10, 2026",
    accent: "bg-blue-600"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Regular Customer",
    rating: 5,
    comment: "Best online shopping experience I've had. Great prices, genuine products, and excellent customer service.",
    date: "Jan 05, 2026",
    accent: "bg-purple-600"
  },
  {
    id: 3,
    name: "Emily Williams",
    role: "Verified Buyer",
    rating: 5,
    comment: "The product quality is outstanding and the packaging was perfect. Will definitely shop here again!",
    date: "Dec 28, 2025",
    accent: "bg-rose-600"
  },
  {
    id: 4,
    name: "David Martinez",
    role: "VIP Member",
    rating: 5,
    comment: "Professional service and authentic products. This is now my go-to store for all my shopping needs.",
    date: "Dec 15, 2025",
    accent: "bg-amber-600"
  },
  // অসীম স্ক্রলিং সুন্দর দেখানোর জন্য আরও কিছু ডাটা ডুপ্লিকেট বা নতুন যোগ করা হয়েছে
  {
    id: 5,
    name: "Sophia Lee",
    role: "New Customer",
    rating: 5,
    comment: "I was skeptical at first, but the quality of the products is amazing. Fast shipping too!",
    date: "Dec 10, 2025",
    accent: "bg-indigo-600"
  }
];

export default function Testimonials() {
  return (
    <section className="overflow-hidden ">
      <div className="container mx-auto px-4 mb-16">
        <SectionTitle
          title="Voice of Our Customers"
          subtitle="Real stories from real shoppers. We pride ourselves on quality and trust."
        />
      </div>

      {/* --- Infinite Scroll Wrapper --- */}
      <div className="relative flex w-full">
        {/* মাউস হোভার করলে স্ক্রলিং থেমে যাবে (group-hover:pause) */}
        <div className="flex space-x-6 animate-infinite-scroll group-hover:pause py-4">
          {/* ২ বার ম্যাপ করা হয়েছে যাতে লুপটি শেষ না হয় */}
          {[...testimonials, ...testimonials].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="w-[380px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${item.accent} text-white`}>
                  <Quote className="w-5 h-5 rotate-180" />
                </div>
                <div className="flex gap-1 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8 font-medium italic">
                &quot;{item.comment}&quot;
              </p>

              <div className="flex items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${item.accent} shadow-md`}>
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    {item.name}
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  </h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {item.role}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {item.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Global CSS for Animation (Add to your globals.css or use <style>) --- */}
      <style jsx>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 40s linear infinite;
          width: max-content;
        }
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}