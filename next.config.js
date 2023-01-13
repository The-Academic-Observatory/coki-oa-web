/** @type {import('next').NextConfig} */
const { nanoid } = require("nanoid");
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,
  optimizeFonts: false,
  env: {
    COKI_ENVIRONMENT: process.env.COKI_ENVIRONMENT,
    COKI_SITE_URL: process.env.COKI_SITE_URL,
    COKI_API_URL: process.env.COKI_API_URL,
  },
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
  async rewrites() {
    return [
      {
        source: "/js/script.js",
        destination: "https://plausible.io/js/script.js",
      },
      {
        source: "/api/event/",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
};
