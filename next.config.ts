import {NextConfig} from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
 
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.io',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
      },
      {
        protocol: 'https',
        hostname: 'ipfs.alchemy.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // {
          //   key: 'Content-Security-Policy',
          //   value: [
          //     "default-src 'self'",
          //     "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Next.js requires unsafe-eval and unsafe-inline
          //     "style-src 'self' 'unsafe-inline'", // Tailwind CSS and React require unsafe-inline
          //     // "img-src 'self' data: blob: https://placehold.co https://picsum.photos https://ipfs.io https://gateway.pinata.cloud https://cloudflare-ipfs.com https://ipfs.alchemy.com",
          //     "font-src 'self' data:",
          //     // "connect-src 'self' https://api.dahantech.app https://*.walletconnect.com https://*.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org https://*.infura.io https://*.alchemyapi.io https://*.rpc.thirdweb.com https://*.web3modal.org",
          //     // "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://*.web3modal.org",
          //     "object-src 'none'",
          //     "base-uri 'self'",
          //     "form-action 'self'",
          //     "frame-ancestors 'self'",
          //     "upgrade-insecure-requests"
          //   ].join('; ')
          // }
        ],
      },
    ];
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       destination: 'https://api.dahantech.app/api/:path*',
  //     },
  //   ];
  // },
};
 
const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);