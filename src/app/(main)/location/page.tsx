import React from "react";
import { MapPin } from "lucide-react";

export default function LocationPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <MapPin className="w-8 h-8 text-rose-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Choose your location
        </h1>
        <p className="text-gray-500 mb-8">
          Delivery options and speeds may vary for different locations
        </p>

        <button className="w-full bg-rose-600 text-white py-3 rounded-xl font-semibold hover:bg-rose-700 transition-colors mb-3">
          Sign in to see your addresses
        </button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              or enter a US zip code
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Zip Code"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
