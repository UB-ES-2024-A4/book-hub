// next.config.js
module.exports = {
  async redirects() {
    console.log('Applying redirect from / to /explore');
    return [
      {
        source: '/',
        destination: '/explorer',
        permanent: false,
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
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/posts/images/**',
      },
      {
        protocol: 'https',
        hostname: 'bookhubimages.blob.core.windows.net',
        pathname: '/profilepictures/**',
      },
      {
        protocol: 'https',
        hostname: 'bookhubimages.blob.core.windows.net',
        pathname: '/bookcovers/**',
      }
    ],
  },
};