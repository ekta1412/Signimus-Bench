import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/homepage", destination: "/homepage/index.html" },
    ];
  },
};

export default nextConfig;