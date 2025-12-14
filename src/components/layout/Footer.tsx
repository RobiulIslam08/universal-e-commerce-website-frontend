"use client"
import {  Globe } from 'lucide-react';

export default function Footer() {
  const footerSections = [
    {
      title: 'Get to Know Us',
      links: ['About Universal', 'Career', 'Universal Science'],
    },
    {
      title: 'Shop with Us',
      links: ['Your Account', 'Your Orders', 'Your Addresses', 'Your Lists'],
    },
    {
      title: 'Make Money with Us',
      links: [
        'Protect and build your brand',
        'Sell on Universal',
        'Supply to Universal',
        'Fulfillment by Universal',
        'Advertise Your Products',
      ],
    },
    {
      title: 'Let Us Help You',
      links: [
        'Help',
        'Shipping & Delivery',
        'Returns & Replacements',
        'Recalls and Product Safety Alerts',
        'Universal App Download',
      ],
    },
  ];

  const bottomLinks = [
    {
      title: 'Universal Advertising',
      subtitle: 'Find, attract, and engage customers',
    },
    {
      title: 'Universal Web Services',
      subtitle: 'Scalable Cloud Computing Services',
    },
    {
      title: 'Goodreads',
      subtitle: 'Book reviews & recommendations',
    },
    {
      title: 'Audible',
      subtitle: 'Download Audio Books',
    },
    {
      title: 'IMDb',
      subtitle: 'Movies, TV & Celebrities',
    },
    {
      title: 'Alexa',
      subtitle: 'Actionable Analytics for the Web',
    },
    {
      title: 'Shopbop',
      subtitle: 'Designer Fashion Brands',
    },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-gray-800 text-gray-300">
      {/* Back to Top Button */}
      <div
        onClick={scrollToTop}
        className="w-full bg-gray-700 hover:bg-gray-600 transition cursor-pointer"
      >
        <div className="container mx-auto px-4 py-4 text-center">
          <span className="text-sm font-medium text-white">Back to top</span>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {footerSections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-white font-bold text-base sm:text-lg mb-3 sm:mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <a
                        href="#"
                        className="text-sm hover:text-white hover:underline transition text-gray-300"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Logo and Language/Country Selector */}
      <div className="border-t border-gray-700 bg-slate-800">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {/* Universal Logo */}
            <div className="flex items-center">
              <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                universal
              
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 transition">
                <Globe size={18} className="text-white" />
                <span className="text-sm text-white font-medium">English</span>
              </button>

              {/* Country Selector */}
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded border border-gray-600 transition">
                <span className="text-lg">🇸🇦</span>
                <span className="text-sm text-white font-medium">Saudi Arabia</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Links Grid */}
      <div className="bg-slate-900">
        <div className="container mx-auto px-4 py-8 sm:py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 mb-8">
            {bottomLinks.map((item, idx) => (
              <div key={idx} className="text-center sm:text-left">
                <a href="#" className="block group">
                  <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-rose-400 transition mb-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-400">{item.subtitle}</div>
                </a>
              </div>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6 text-xs text-gray-400 border-t border-gray-700 pt-6">
            <a href="#" className="hover:text-white hover:underline transition">
              Conditions of Use & Sale
            </a>
            <a href="#" className="hover:text-white hover:underline transition">
              Privacy Notice
            </a>
            <a href="#" className="hover:text-white hover:underline transition">
              Interest-Based Ads
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs text-gray-500 mt-4">
            © 1996-2025, Universal.com, Inc. or its affiliates
          </div>
        </div>
      </div>
    </footer>
  );
}