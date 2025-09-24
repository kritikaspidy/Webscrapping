import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['image-server.worldofbooks.com'], // Add your external image host here
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://webscrapping-cjf9.onrender.com/:path*', // Proxy to your backend port
      },
    ];
  },
};

export default nextConfig;
