

'use client';

import { useState } from 'react';
import { Menu, X, Search, ShoppingCart, User, MapPin, ChevronDown, ChevronRight, Globe } from 'lucide-react';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [languageDropdown, setLanguageDropdown] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');

  const languages = ['English', 'العربية', 'Français', 'Español', 'Deutsch'];
  const languageCodes = ['EN', 'AR', 'FR', 'ES', 'DE'];

  const menuSections = [
    {
      title: 'Trending',
      items: [
        { label: 'Best Sellers', hasArrow: false },
        { label: 'New Releases', hasArrow: false },
        { label: 'Movers & Shakers', hasArrow: false },
      ],
    },
    {
      title: 'Digital Content & Devices',
      items: [
        { label: 'Echo, Alexa & Smart Home', hasArrow: true },
        { label: 'Universal Kindle E-readers', hasArrow: true },
        { label: 'Universal Home Security', hasArrow: true },
      ],
    },
    {
      title: 'Shop by Category',
      items: [
        { label: 'Mobiles, Tablets & Accessories', hasArrow: true },
        { label: 'Computers & Office Supplies', hasArrow: true },
        { label: 'TVs & Electronics', hasArrow: true },
        { label: 'Home & Kitchen', hasArrow: true },
      ],
    },
  ];

  const quickCategories = [
    { icon: '🎁', label: 'Deals' },
    { icon: '📱', label: 'Mobiles' },
    { icon: '🛍️', label: 'Bazaar' },
    { icon: '👕', label: 'Fashion' },
    { icon: '🌍', label: 'Global Store' },
    { icon: '🖥️', label: 'Electronics' },
    { icon: '🎧', label: 'Accessories' },
    { icon: '📚', label: 'Books' },
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="w-full bg-white">
      {/* Main Navbar Header */}
      <div className="bg-rose-500 text-white shadow-md">
        <div className="w-full">
          {/* Mobile & Desktop Header */}
          <div className="px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
            {/* Left: Menu Icon & Logo */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Menu button - শুধু mobile এ দেখাবে */}
              <button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                className="lg:hidden p-2 hover:bg-rose-600 rounded transition"
              >
                <Menu size={20} />
              </button>
              <div className="text-lg sm:text-xl font-bold tracking-tight">
                Universal
              </div>
            </div>

            {/* Desktop: Location Badge */}
            <div className="hidden md:flex items-center gap-2 cursor-pointer hover:opacity-80 transition shrink-0 bg-rose-400 px-3 py-2 rounded">
              <MapPin size={14} className="shrink-0" />
              <div className="text-xs leading-tight">
                <div className="opacity-80">Delivering to</div>
                <div className="font-semibold">Riyadh</div>
              </div>
            </div>

            {/* Desktop: Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-2xl mx-2 md:mx-3">
              <div className="flex w-full rounded-sm overflow-hidden">
                <select className="px-2 sm:px-3 py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm border-r border-gray-300 hover:bg-gray-200 transition cursor-pointer font-medium">
                  <option>All Categories</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Books</option>
                  <option>Home & Kitchen</option>
                </select>
                <input
                  type="text"
                  placeholder="Search Universal"
                  className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm text-gray-700 outline-none bg-white placeholder-gray-500"
                />
              </div>
              <button className="bg-amber-400 hover:bg-amber-500 text-gray-800 px-3 sm:px-4 py-2 transition-colors flex items-center justify-center shrink-0">
                <Search size={18} />
              </button>
            </div>

            {/* Right: Account, Orders & Cart */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              {/* Language Dropdown - Desktop only */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLanguageDropdown(!languageDropdown)}
                  className="flex items-center gap-1 px-2 py-2 hover:bg-rose-600 transition rounded text-sm"
                >
                  <Globe size={14} />
                  <span className="font-medium">{selectedLanguage}</span>
                  <ChevronDown size={12} />
                </button>
                {languageDropdown && (
                  <div className="absolute right-0 mt-1 w-28 bg-white text-gray-800 rounded shadow-lg z-50 overflow-hidden">
                    {languages.map((lang, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedLanguage(languageCodes[idx]);
                          setLanguageDropdown(false);
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-rose-100 transition text-xs sm:text-sm"
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sign in - Mobile on left of cart, Desktop hidden sm, shown md+ */}
              <div className="flex sm:hidden flex-col cursor-pointer hover:opacity-80 transition text-xs">
                <span className="opacity-80">Sign in</span>
                <span className="font-semibold">Account</span>
              </div>

              {/* Sign in - Desktop */}
              <div className="hidden sm:flex flex-col cursor-pointer hover:opacity-80 transition text-xs sm:text-sm">
                <span className="opacity-80">Sign in</span>
                <span className="font-semibold">Account</span>
              </div>

              {/* Orders Button - Desktop only */}
              <button className="hidden lg:block bg-transparent hover:bg-rose-600 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-medium transition whitespace-nowrap">
                Orders
              </button>

              {/* Cart */}
              <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 bg-rose-300 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="sm:hidden px-3 pb-3">
            <div className="flex gap-2 items-center">
              <div className="flex-1 flex bg-white rounded-sm overflow-hidden">
                <select className="px-2 py-2 text-gray-700 text-xs bg-gray-100 border-r border-gray-300 font-medium">
                  <option>All</option>
                </select>
                <input
                  type="text"
                  placeholder="Search Universal"
                  className="flex-1 px-2 py-2 text-xs text-gray-900 outline-none bg-white placeholder-gray-400 font-medium"
                />
              </div>
              <button className="bg-amber-400 hover:bg-amber-500 text-gray-800 p-2 rounded transition-colors">
                <Search size={16} />
              </button>
            </div>
          </div>

          <div className="sm:hidden px-3 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {['Bazaar', 'Fresh', "Today's Deals", 'Mobile Phones', 'Prime', 'Supermarket', 'Toys & Games', 'Electronics', 'Your Universal'].map((category) => (
                <button
                  key={category}
                  className="text-white hover:text-rose-200 px-3 py-1 cursor-pointer transition text-xs font-semibold whitespace-nowrap border border-gray-300 rounded"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Menu - No background overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}
      
      {isDrawerOpen && (
        <div className="fixed left-0 top-0 h-screen w-80 bg-white z-40 overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="bg-gray-900 text-white p-4 flex items-center justify-between sticky top-0 z-50">
            <div className="flex items-center gap-2">
              <User size={20} />
              <span className="font-medium text-sm">Hello, sign in</span>
            </div>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="p-1 hover:bg-gray-800 rounded transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Sections */}
          <div>
            {menuSections.map((section, idx) => (
              <div key={idx} className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-4 py-4 text-gray-900 font-bold hover:bg-gray-50 transition text-left"
                >
                  {section.title}
                  <ChevronRight
                    size={20}
                    className={`transition-transform ${
                      expandedSection === section.title ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {expandedSection === section.title && (
                  <div className="bg-gray-50">
                    {section.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className="py-3 px-6 text-gray-700 hover:text-rose-500 cursor-pointer transition flex items-center justify-between border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm">{item.label}</span>
                        {item.hasArrow && <ChevronRight size={14} className="text-gray-400" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Help & Settings */}
          <div className="border-t-2 border-gray-200 p-4 space-y-3">
            <p className="font-bold text-gray-900 mb-4 text-sm">Help & Settings</p>
            <p className="text-xs text-gray-700 hover:text-rose-500 cursor-pointer transition">Your Account</p>
            <button
              onClick={() => setLanguageDropdown(!languageDropdown)}
              className="flex items-center gap-2 text-xs text-gray-700 hover:text-rose-500 transition w-full"
            >
              <Globe size={14} />
              <span>{selectedLanguage}</span>
            </button>
            <p className="text-xs text-gray-700 hover:text-rose-500 cursor-pointer transition">Help Center</p>
            <p className="text-xs text-gray-700 hover:text-rose-500 cursor-pointer transition">Sign out</p>
          </div>
        </div>
      )}

      {/* Categories Bar - Desktop */}
      <div className="hidden lg:block bg-rose-400">
        <div className="max-w-full px-6">
          <div className="flex items-stretch">
            {/* Menu button - শুধু desktop এ categories bar এ দেখাবে */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-2 hover:bg-rose-500 rounded transition text-white flex items-center justify-center"
            >
              <Menu size={20} />
            </button>
            {['Bazaar', 'Fresh', "Today's Deals", 'Mobile Phones', 'Prime', 'Supermarket', 'Toys & Games', 'Electronics', 'Your Universal'].map((category) => (
              <div
                key={category}
                className="text-white hover:bg-rose-500 px-4 py-3 cursor-pointer transition text-sm font-semibold whitespace-nowrap"
              >
                {category}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Categories Grid - Horizontally scrollable */}
      <div className="lg:hidden bg-gray-50 border-b border-gray-200">
        <div className="px-3 sm:px-4 py-3">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {quickCategories.map((category, idx) => (
              <div key={idx} className="text-center cursor-pointer hover:opacity-80 transition shrink-0 w-16">
                <div className="text-2xl mb-1">{category.icon}</div>
                <p className="text-xs text-gray-700 font-medium line-clamp-2">{category.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Location & Prime Bar */}
      <div className="lg:hidden bg-blue-50 border-b border-blue-200">
        <div className="px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
          <div className="text-xs sm:text-sm text-gray-700 flex items-center gap-1">
            <MapPin size={14} className="shrink-0 text-gray-600" />
            <span>Delivering to Riyadh - <span className="font-semibold cursor-pointer text-blue-600">Update location</span></span>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors shrink-0 whitespace-nowrap">
            Join Prime
          </button>
        </div>
      </div>

      {/* Add scrollbar hide CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}