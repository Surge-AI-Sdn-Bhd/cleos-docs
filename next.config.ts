import type { NextConfig } from "next";

// Served from https://<user>.github.io/cleos-docs, so every URL needs this prefix.
const basePath = "/cleos-docs";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // `next/link` and `_next/*` assets get `basePath` automatically, but
  // `next/image` does not, so expose it for prefixing image `src` values.
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
