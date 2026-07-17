/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {},
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co' }]
  }
};

module.exports = nextConfig;
