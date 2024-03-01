/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'host.docker.internal',
      },
      {
        hostname: 'arcanedev.site',
      },
    ],
  },
};

module.exports = nextConfig;
