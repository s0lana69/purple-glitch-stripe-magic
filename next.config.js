/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.pexels.com'],
    unoptimized: true,
  },
  // Reduce build time by disabling certain features
  productionBrowserSourceMaps: false,
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  // Asset handling and routing
  async rewrites() {
    return {
      beforeFiles: [
        // Handle dashboard assets
        {
          source: '/dashboard/assets/:path*',
          destination: '/client-dashboard/assets/:path*',
        },
        // Handle the dashboard HTML (removed Supabase auth cookie dependency)
        {
          source: '/dashboard',
          destination: '/client-dashboard/index.html',
        }
      ]
    };
  },
  // Cache control headers
  async headers() {
    return [
      {
        source: '/client-dashboard/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/dashboard',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
