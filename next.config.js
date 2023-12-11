/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '192.168.29.235',
        port: '7000',
        pathname: '/uploads/**',
      },
    ],
  },
  env: {
    CLIENT_ID: process.env.CLIENT_ID
  }
}

module.exports = nextConfig
