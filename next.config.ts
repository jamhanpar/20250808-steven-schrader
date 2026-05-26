import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 3600, // evict optimized images after 1 hour
    deviceSizes: [640, 1080, 1920], // 3 variants instead of the default 7
  },
};

export default nextConfig;
