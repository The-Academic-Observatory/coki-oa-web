/** @type {import('next').NextConfig} */
const path = require("path");
const { nanoid } = require("nanoid");
const webpack = require("webpack");

// Check that all environment variables are defined
const envVars = ["NEXT_PUBLIC_TYPEKIT_ID", "COKI_ENVIRONMENT", "COKI_SITE_URL", "COKI_API_URL", "COKI_IMAGES_URL"];
const missingEnvVars = envVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
}

module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,
  optimizeFonts: false,
  env: Object.fromEntries(envVars.map((varName) => [varName, process.env[varName]])),
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
