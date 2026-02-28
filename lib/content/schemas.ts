import { z } from "zod";

import { LANDING_LINKS } from "@/lib/landing/constants";

const requiredText = z.string().trim().min(1);

const optionalText = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined);

const optionalUrl = z
  .string()
  .trim()
  .optional()
  .transform((value) => value || undefined)
  .refine((value) => !value || value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "imageUrl debe ser URL absoluta o ruta local",
  });

export const heroSlideSchema = z.object({
  title: requiredText,
  subtitle: requiredText,
  ctaText: requiredText,
  ctaHref: requiredText,
  imageUrl: optionalUrl,
  imagePosition: optionalText,
});

export const headerMenuItemSchema = z.object({
  label: requiredText,
  href: requiredText,
});

function createDefaultHeaderConfig() {
  return {
    brandText: "Power Amazónica",
    logoUrl: "",
    menu: [
      { label: "Proyecto", href: "#proyecto" },
      { label: "Beneficios", href: "#beneficios" },
      { label: "FAQ", href: "#faq" },
      { label: "Contacto", href: "#contacto" },
    ],
    primaryCtaText: "WhatsApp",
    primaryCtaHref: LANDING_LINKS.whatsappHref,
    secondaryCtaText: "Llamar",
    secondaryCtaHref: LANDING_LINKS.telHref,
  };
}

export const headerConfigSchema = z
  .object({
    brandText: requiredText,
    logoUrl: optionalUrl,
    menu: z.array(headerMenuItemSchema).max(8),
    primaryCtaText: requiredText,
    primaryCtaHref: requiredText,
    secondaryCtaText: requiredText,
    secondaryCtaHref: requiredText,
  })
  .default(createDefaultHeaderConfig);

export const featureSchema = z.object({
  title: requiredText,
  description: requiredText,
  iconKey: optionalText,
});

export const faqSchema = z.object({
  question: requiredText,
  answer: requiredText,
});

export const contactSchema = z.object({
  phone: requiredText,
  whatsapp: requiredText,
  email: z.string().trim().email(),
  address: requiredText,
});

export const landingDataSchema = z.object({
  header: headerConfigSchema,
  heroSlider: z.array(heroSlideSchema).min(1),
  features: z.array(featureSchema),
  faq: z.array(faqSchema),
  contact: contactSchema,
});

export const landingSeoSchema = z.object({
  title: requiredText,
  description: requiredText,
  ogTitle: requiredText,
  ogDescription: requiredText,
});

export const landingDraftPayloadSchema = z.object({
  data: landingDataSchema,
  seo: landingSeoSchema,
});

export type LandingDataInput = z.infer<typeof landingDataSchema>;
export type LandingSeoInput = z.infer<typeof landingSeoSchema>;
export type LandingDraftPayloadInput = z.infer<typeof landingDraftPayloadSchema>;
