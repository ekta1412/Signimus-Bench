import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/bench", destination: "/bench/index.html" },
      { source: "/homepage", destination: "/homepage/index.html" },
    ];
  },
};

export default nextConfig;
