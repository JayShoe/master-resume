import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize images with new configuration format
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'hallrentalreviews.com',
      },
    ],
    // Use unoptimized images for simpler deployment
    unoptimized: true,
  },

  // Use standalone output for production (supports API routes)
  // Note: 'export' mode is incompatible with API routes
  output: 'standalone',

  // Trailing slash configuration
  trailingSlash: false,

  // Experimental features
  experimental: {
    // Any experimental features needed
  },
};

export default nextConfig;
