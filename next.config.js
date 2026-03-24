/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'img.icdn.my.id',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
