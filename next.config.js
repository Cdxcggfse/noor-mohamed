/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mir-s3-cdn-cf.behance.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.behance.net',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
