import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/',
      },
      {
        source: '/about',
        destination: '/#about',
      },
      {
        source: '/services',
        destination: '/#services',
      },
      {
        source: '/contact',
        destination: '/#contact',
      },
    ];
  },
};

export default nextConfig;
