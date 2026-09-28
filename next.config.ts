import type { NextConfig } from "next";

const basePath = process.env.CLEOS_DOCS_BASE_PATH ?? "/cleos-docs";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  turbopack: { root: process.cwd() },
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
