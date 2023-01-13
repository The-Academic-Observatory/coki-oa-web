/** @type {import('next-sitemap').IConfig} */
const topInstitutions = require("./data/topInstitutions.json");
const institutions = require("./data/institution.json");

// On non production deployments block all robots
let policies = [
  {
    userAgent: "*",
    disallow: ["/"],
  },
];

// Production specific policy
if (process.env.COKI_ENVIRONMENT === "production") {
  policies = [
    {
      userAgent: "*",
      allow: "/",
    },
    {
      userAgent: "*",
      disallow: ["/cdn-cgi/"],
    },
  ];
}

module.exports = {
  siteUrl: process.env.COKI_SITE_URL || "https://open.coki.ac",
  generateRobotsTxt: true,
  changefreq: "weekly",
  priority: 1.0,
  sitemapSize: 50000,
  robotsTxtOptions: {
    policies: policies,
  },
  additionalPaths: async (config) => {
    // Find institution ids that were not rendered and put into the sitemap
    const alreadyIncluded = new Set(topInstitutions);
    const institutionIds = institutions
      .filter((institution) => !alreadyIncluded.has(institution.id))
      .map((institution) => {
        return institution.id;
      });

    // Create paths for institution pages with fallback:true
    const result = [];
    let configFallback = JSON.parse(JSON.stringify(config));
    configFallback.priority = 0.7;
    for (const id of institutionIds) {
      result.push(await config.transform(configFallback, `/institution/${id}/`));
    }

    return result;
  },
};
