
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add a custom image loader
  images: {
    loader: "custom", // This tells Next.js to use our custom loader
    loaderFile: "./my-custom-loader.ts", // Updated to point to the .ts file
  },
};

export default nextConfig;
