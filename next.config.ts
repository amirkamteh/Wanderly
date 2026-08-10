import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so a stray lockfile in a parent directory is ignored.
  turbopack: { root: __dirname },
  images: {
    // All demo imagery is served from Unsplash. Keeping the allow-list narrow
    // means a typo in a data file fails loudly instead of proxying anything.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
    qualities: [60, 75, 90],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
