import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Write build artifacts to /tmp (RAM-backed tmpfs on Linux) — eliminates
  // the "slow filesystem" warning and speeds up dev hot-reload significantly.
  // Change back to '.next' if you need build artifacts to persist across reboots.
  distDir: process.env.NODE_ENV === 'production' ? '.next' : '/tmp/task-tide-next',

  // Produce a self-contained build for Docker/fly.io deployment.
  // The .next/standalone directory can be run with: node server.js
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

