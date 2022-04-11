/** @type {import('next').NextConfig} */
const { nanoid } = require("nanoid");
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
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
        source: "/country/",
        destination: "/",
      },
      {
        source: "/institution/",
        destination: "/",
      },
    ];
  },
  optimizeFonts: false,
};
