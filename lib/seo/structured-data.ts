import type { LandingData } from "@/lib/content/types";
import { LANDING_CONTACT } from "@/lib/landing/constants";

type HomeSeo = {
  title: string;
  description: string;
};

type BuildHomeJsonLdArgs = {
  siteUrl: string;
  seo: HomeSeo;
  data: LandingData;
};

type JsonLdRecord = Record<string, unknown>;

function normalizePhone(rawPhone?: string): string {
  const fallback = LANDING_CONTACT.phoneIntl;
  const phone = rawPhone?.trim();
  if (!phone) {
    return fallback;
  }

  const normalized = phone.replace(/\s+/g, "");
  if (normalized.startsWith("+")) {
    return normalized;
  }

  if (normalized.startsWith("51")) {
    return `+${normalized}`;
  }

  return fallback;
}

function normalizeAddress(rawAddress?: string): string {
  const address = rawAddress?.trim();
  return address || LANDING_CONTACT.address;
}

export function buildHomeJsonLd({ siteUrl, seo, data }: BuildHomeJsonLdArgs): JsonLdRecord[] {
  const pageUrl = `${siteUrl}/`;
  const phone = normalizePhone(data.contact.phone);
  const email = data.contact.email?.trim() || LANDING_CONTACT.email;
  const address = normalizeAddress(data.contact.address);

  const organizationSchema: JsonLdRecord = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Corporación Power Amazónica S.A.C.",
    url: siteUrl,
    foundingDate: "2018",
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressCountry: "PE",
    },
    areaServed: ["Chanchamayo", "Satipo", "Oxapampa"],
  };

  const websiteSchema: JsonLdRecord = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: siteUrl,
    name: "Power Amazónica",
    inLanguage: "es-PE",
  };

  const webPageSchema: JsonLdRecord = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: seo.title,
    description: seo.description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      url: siteUrl,
      name: "Power Amazónica",
    },
    inLanguage: "es-PE",
  };

  const offerSchema: JsonLdRecord = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Proyecto Urb. Santa Beatriz",
    description:
      "Lotes de 150 m² en Chanchamayo con contrato notarial, papeles en regla y facilidades de pago.",
    areaServed: "Chanchamayo, Junín, Perú",
    provider: {
      "@type": "Organization",
      name: "Corporación Power Amazónica S.A.C.",
      url: siteUrl,
    },
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: phone,
      serviceUrl: pageUrl,
    },
  };

  const faqItems = data.faq
    .filter((item) => item.question.trim() && item.answer.trim())
    .map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    }));

  const entries = [organizationSchema, websiteSchema, webPageSchema, offerSchema];

  if (faqItems.length > 0) {
    entries.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems,
    });
  }

  return entries;
}
