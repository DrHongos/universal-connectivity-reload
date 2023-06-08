/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
//  webpack: (config) => {
//    config.resolve = {
//      ...config.resolve,
//      fallback: {
//        fs: false,
//        stream: false
//      },
//    };
//    return config;
//  },
};
module.exports = nextConfig
