/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://trueviral.ai',
    generateRobotsTxt: true,
    outDir: 'public',
    changefreq: 'daily',
    priority: 0.7,
    alternateRefs: [
      {
        href: 'https://trueviral.ai',
        hreflang: 'x-default',
      },
      {
        href: 'https://trueviral.io',
        hreflang: 'en',
      },
    ],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
        },
      ],
      additionalSitemaps: [
        'https://trueviral.ai/sitemap.xml',
        'https://trueviral.io/sitemap.xml',
      ],
    },
  };
