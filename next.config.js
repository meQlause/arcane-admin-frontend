/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          hostname: 'host.docker.internal',
        }
      ],
    },
  };

module.exports = nextConfig;