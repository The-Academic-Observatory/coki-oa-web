/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: "https://open.coki.ac",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: "*",
        disallow: ["/cdn-cgi/"],
      },
    ],
  },
};
