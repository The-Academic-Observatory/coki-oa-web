/** @type {import('next').NextConfig} */
const path = require("path");
const { nanoid } = require("nanoid");
const webpack = require("webpack");

module.exports = {
  reactStrictMode: true,
  trailingSlash: false,
  swcMinify: true,
  optimizeFonts: false,
  env: {
    COKI_ENVIRONMENT: process.env.COKI_ENVIRONMENT,
    COKI_SITE_URL: process.env.COKI_SITE_URL,
    COKI_API_URL: process.env.COKI_API_URL,
    COKI_IMAGES_URL: process.env.COKI_IMAGES_URL,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    // Root alias for @svgr/webpack imports from the dashboard folder
    config.resolve.alias = {
      ...config.resolve.alias,
      "@root": path.resolve(__dirname),
    };

    // Data alias for importing data files in the root of the monorepo
    config.resolve.alias = {
      ...config.resolve.alias,
      "@data": path.resolve(__dirname, "..", "data"),
    };

    // Add new BUILD_ID each time we build
    config.plugins.push(
      new webpack.DefinePlugin({
        BUILD_ID: '"' + nanoid() + '"',
      }),
    );
    return config;
  },
  async redirects() {
    return [
      // At one point in time the social cards were hosted on the https://open.coki.ac/social-cards path
      // Hence we need to redirect them to their new location
      {
        source: "/social-cards/:slug",
        destination: "https://images.open.coki.ac/social-cards/:slug",
        permanent: true,
      },
    ];
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
