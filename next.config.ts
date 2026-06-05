import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "platform.aysar.sa" },
      // Allow all Supabase Storage public buckets for user-uploaded images
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals as string[]), "jsdom"];
    }
    return config;
  },
};

export default nextConfig;
