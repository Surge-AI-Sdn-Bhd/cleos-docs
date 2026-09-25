import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/cleos-docs",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
