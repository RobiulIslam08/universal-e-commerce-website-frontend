export interface ICarouselSlide {
  _id?: string;
  id?: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeSubtext: string;
  bgColor: string; // Gradient or solid color class
  image?: string; // Optional background image URL
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICarouselResponse {
  success: boolean;
  message?: string;
  data: ICarouselSlide[];
}

export interface ICarouselSingleResponse {
  success: boolean;
  message?: string;
  data: ICarouselSlide;
}

// Predefined gradient options for admin to select
export const GRADIENT_OPTIONS = [
  { label: "Blue Gradient", value: "bg-linear-to-r from-blue-400 to-blue-600" },
  {
    label: "Purple Gradient",
    value: "bg-linear-to-r from-purple-400 to-purple-600",
  },
  { label: "Rose Gradient", value: "bg-linear-to-r from-rose-400 to-rose-600" },
  {
    label: "Green Gradient",
    value: "bg-linear-to-r from-green-400 to-green-600",
  },
  {
    label: "Orange Gradient",
    value: "bg-linear-to-r from-orange-400 to-orange-600",
  },
  { label: "Teal Gradient", value: "bg-linear-to-r from-teal-400 to-teal-600" },
  {
    label: "Indigo Gradient",
    value: "bg-linear-to-r from-indigo-400 to-indigo-600",
  },
  { label: "Pink Gradient", value: "bg-linear-to-r from-pink-400 to-pink-600" },
  {
    label: "Amber Gradient",
    value: "bg-linear-to-r from-amber-400 to-amber-600",
  },
  { label: "Cyan Gradient", value: "bg-linear-to-r from-cyan-400 to-cyan-600" },
  // Simple additional gradients
  { label: "Gray Gradient", value: "bg-linear-to-r from-gray-400 to-gray-600" },
  { label: "Red Gradient", value: "bg-linear-to-r from-red-400 to-red-600" },
  {
    label: "Yellow Gradient",
    value: "bg-linear-to-r from-yellow-400 to-yellow-600",
  },
  { label: "Lime Gradient", value: "bg-linear-to-r from-lime-400 to-lime-600" },
  {
    label: "Slate Gradient",
    value: "bg-linear-to-r from-slate-400 to-slate-600",
  },
  {
    label: "Emerald Gradient",
    value: "bg-linear-to-r from-emerald-400 to-emerald-600",
  },
  // Transparent gradients for clear image background
  {
    label: "Blue Transparent",
    value: "bg-linear-to-r from-blue-400/50 to-blue-600/50",
  },
  {
    label: "Purple Transparent",
    value: "bg-linear-to-r from-purple-400/50 to-purple-600/50",
  },
  {
    label: "Gray Transparent",
    value: "bg-linear-to-r from-gray-400/50 to-gray-600/50",
  },
  {
    label: "Red Transparent",
    value: "bg-linear-to-r from-red-400/50 to-red-600/50",
  },
  {
    label: "Green Transparent",
    value: "bg-linear-to-r from-green-400/50 to-green-600/50",
  },
  {
    label: "Yellow Transparent",
    value: "bg-linear-to-r from-yellow-400/50 to-yellow-600/50",
  },
];
