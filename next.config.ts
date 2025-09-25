
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // We don't need a custom loader because we are using Cloudinary.
  // Next.js will handle the optimization automatically with Cloudinary URLs.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
