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

export default nextConfig;
