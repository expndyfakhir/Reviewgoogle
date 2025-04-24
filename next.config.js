/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true
  },
  // Configure dynamic routes
  trailingSlash: true,
  skipTrailingSlashRedirect: true
};

module.exports = nextConfig;

// Enable dynamic features
// experimental: {
//   serverActions: true
// }
// experimental.serverActions configuration since it's enabled by default in Next.js 14