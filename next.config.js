/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    distDir: 'dist',
    reactStrictMode: false,
    trailingSlash: false
}

module.exports = nextConfig

// module.exports = {
//     nextConfig,
//     reactStrictMode: true,
//     swcMinify: true,
//     // If you have custom Babel configuration, ensure it includes the automatic runtime
//     babel: {
//         presets: [
//         ["next/babel", {
//             "preset-react": {
//             "runtime": "automatic"
//             }
//         }]
//         ]
//     }
// }