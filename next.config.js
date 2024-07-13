/** @type {import('next').NextConfig} */
module.exports = {
    output: 'export',
    distDir: 'dist',
    reactStrictMode: false,
    trailingSlash: true,
    exportPathMap: async function (
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
    ) {
      return {
        '/': { page: '/' },
        '/dashboard': { page: '/dashboard' },
      }
    },
  }
  
