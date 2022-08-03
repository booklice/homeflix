/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  env: {
    SERVER_URL: process.env.SERVER_URL,
    BASE_URL: process.env.BASE_URL,
  },
};

module.exports = nextConfig;
