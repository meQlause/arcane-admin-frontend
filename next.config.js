const fs = require('fs');
const https = require('https');

// Load the certificate
const cert = fs.readFileSync('./app/cert/cert.crt');

// Add the certificate to the global agent
https.globalAgent.options.ca = cert;

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
