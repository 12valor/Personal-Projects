import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fastly.picsum.photos',
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
