import type { MetadataRoute } from "next";

import { getFallbackSiteUrl } from "@/lib/seo/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getFallbackSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/api/admin/*"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
