// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/explorer',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/users/pfp/**',
      },
    ],
  },
};