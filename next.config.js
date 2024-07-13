/** @type {import('next').NextConfig} */
module.exports = {
    output: 'export',
    distDir: 'dist',
    reactStrictMode: false,
    trailingSlash: true,
    exportPathMap: function () {
      return {
        '/': { page: '/' },
        '/dashboard': { page: '/dashboard' },
      }
    },
  }
  
