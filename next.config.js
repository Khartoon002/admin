/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { typedRoutes: true },
  output: "standalone",
  reactStrictMode: true,
};
module.exports = nextConfig;
