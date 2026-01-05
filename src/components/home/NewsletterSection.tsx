"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle newsletter subscription
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="py-16 bg-linear-to-br from-blue-600 via-blue-700 to-purple-700 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Get the latest updates on new products, exclusive offers, and
            special discounts delivered to your inbox!
          </p>

          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Subscribe
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-blue-100 text-sm mt-4">
                🔒 We respect your privacy. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            <div className="max-w-xl mx-auto bg-white/20 backdrop-blur-sm rounded-2xl p-6 animate-fade-in">
              <div className="flex items-center justify-center gap-3 text-white">
                <CheckCircle className="w-8 h-8" />
                <p className="text-lg font-semibold">
                  Thank you for subscribing! 🎉
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-blue-200 text-sm">Subscribers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">100K+</div>
              <div className="text-blue-200 text-sm">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9★</div>
              <div className="text-blue-200 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
