import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true, // এটি cPanel এর জন্য খুবই গুরুত্বপূর্ণ, এটি রাখবেন
};

export default nextConfig;