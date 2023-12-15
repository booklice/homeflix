/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ["localhost", "youngjo.com", "homeflix.youngjo.com"],
  },
  env: {
    SERVER_URL: process.env.SERVER_URL,
    BASE_URL: process.env.BASE_URL,
  },
};

module.exports = nextConfig;
