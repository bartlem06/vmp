import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "frontend-cdn.solarreviews.com",
      },
      {
        protocol: "https",
        hostname: "natureconservancy-h.assetsadobe.com",
      },
    ],
  },
};

export default nextConfig;
