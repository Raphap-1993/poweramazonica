import type { MetadataRoute } from "next";

import { getFallbackSiteUrl } from "@/lib/seo/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getFallbackSiteUrl();

  return [
    {
      url: `${siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
