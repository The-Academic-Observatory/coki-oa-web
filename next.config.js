/** @type {import('next').NextConfig} */
const { nanoid } = require("nanoid");
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,
  optimizeFonts: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        BUILD_ID: '"' + nanoid() + '"',
      }),
    );
    return config;
  },
  // Solution to rewrites problem: https://github.com/vercel/next.js/issues/40549#issuecomment-1278844506
  async rewrites() {
    return [
      {
        source: "/country/{/}?",
        destination: "/",
      },
      {
        source: "/institution/{/}?",
        destination: "/",
      },
    ];
  },
};
