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
  // TODO: Vercel migration
  // async rewrites() {
  //   return [
  //     {
  //       source: "/js/script.js",
  //       destination: "https://plausible.io/js/script.js",
  //     },
  //     {
  //       source: "/api/event/",
  //       destination: "https://plausible.io/api/event",
  //     },
  //   ];
  // },
};
