import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "i0.wp.com",
      "www.johnpaulcaponigro.com",
      "communist.red",
      "i.ytimg.com",
    ], // Add allowed domains here
  },
};

export default nextConfig;
