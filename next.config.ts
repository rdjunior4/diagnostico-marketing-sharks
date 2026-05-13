import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  bundlePagesRouterDependencies: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
