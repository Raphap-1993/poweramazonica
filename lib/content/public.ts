import { unstable_cache } from "next/cache";

import { defaultLandingSeo } from "@/lib/content/defaults";
import { getLandingPublished } from "@/lib/content/repository";
import { normalizeDomain, resolveTenantByDomain } from "@/lib/tenant";

const getCachedPublishedLanding = unstable_cache(
  async (domain: string) => {
    const tenant = await resolveTenantByDomain(domain);
    return getLandingPublished(tenant.id);
  },
  ["landing-published-by-domain"],
  {
    revalidate: 60,
    tags: ["landing-published"],
  },
);

export async function getPublishedLandingForDomain(domainInput?: string | null) {
  const domain = normalizeDomain(domainInput);

  try {
    const landing = await getCachedPublishedLanding(domain);
    return { domain, landing };
  } catch (error) {
    console.error("No se pudo cargar landing publicada", error);
    return { domain, landing: null };
  }
}

export async function getPublishedSeoForDomain(domainInput?: string | null) {
  const { landing } = await getPublishedLandingForDomain(domainInput);
  return landing?.seo ?? defaultLandingSeo;
}
