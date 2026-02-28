import { headers } from "next/headers";

import { LandingFallback } from "@/components/landing/landing-fallback";
import { LandingPageContent } from "@/components/landing/landing-page-content";
import { defaultLandingSeo } from "@/lib/content/defaults";
import { getPublishedLandingForDomain } from "@/lib/content";
import { resolveSiteUrlFromHost } from "@/lib/seo/site-url";
import { buildHomeJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 60;

export default async function Home() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const proto = headerStore.get("x-forwarded-proto");
  const siteUrl = resolveSiteUrlFromHost(host, proto);
  const { landing } = await getPublishedLandingForDomain(host);

  if (!landing) {
    return <LandingFallback />;
  }

  const seo = {
    title: landing.seo.title || defaultLandingSeo.title,
    description: landing.seo.description || defaultLandingSeo.description,
  };
  const jsonLdEntries = buildHomeJsonLd({
    siteUrl,
    seo,
    data: landing.data,
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f7fef2_0%,#f6faf7_40%,#ffffff_100%)]">
      {jsonLdEntries.map((jsonLd, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          key={`jsonld-${index}`}
          type="application/ld+json"
        />
      ))}
      <LandingPageContent data={landing.data} />
    </div>
  );
}
