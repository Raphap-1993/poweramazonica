const DEFAULT_SITE_URL = "https://poweramazonica.com";

export function getFallbackSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim();
  const base = configured || DEFAULT_SITE_URL;
  return base.replace(/\/+$/, "");
}

export function resolveSiteUrlFromHost(rawHost?: string | null, rawProto?: string | null) {
  const host = rawHost?.trim();
  if (!host) {
    return getFallbackSiteUrl();
  }

  const protocol = rawProto?.trim() || "https";
  return `${protocol}://${host}`.replace(/\/+$/, "");
}
