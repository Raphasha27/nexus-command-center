import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/nexus-command-center',
  images: { unoptimized: true },
};

export default nextConfig;
