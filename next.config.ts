import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "platform.aysar.sa" },
    ],
  },
};

export default nextConfig;
