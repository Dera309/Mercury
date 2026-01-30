/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  transpilePackages: ['ui-kit', 'shared'],
  experimental: {
    optimizeCss: false,
  },
  compiler: {
    removeConsole: false,
  },
  outputFileTracingRoot: path.resolve(__dirname, '../../'),
  // Try to configure pages directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
};

module.exports = nextConfig;
