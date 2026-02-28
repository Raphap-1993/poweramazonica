import type { LandingData, LandingSeo } from "@/lib/content/types";
import { LANDING_CONTACT, LANDING_LINKS } from "@/lib/landing/constants";

export const defaultLandingData: LandingData = {
  header: {
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
  },
  heroSlider: [
    {
      title: "Proyecto Urb. Santa Beatriz",
      subtitle: "Lotes de 150 m2 a 15 min del centro de Chanchamayo",
      ctaText: "WhatsApp",
      ctaHref: LANDING_LINKS.whatsappHref,
      imageUrl: "",
    },
  ],
  features: [
    { title: "Contrato notarial", description: "Formalizacion segura de la compra." },
    { title: "Papeles en regla", description: "Documentacion validada para la operacion." },
    { title: "Servicios basicos", description: "Luz, agua y alcantarillado." },
    { title: "Pistas y veredas", description: "Urbanizacion con accesos en desarrollo." },
  ],
  faq: [
    {
      question: "Los lotes tienen documentacion en regla?",
      answer: "Si. El proyecto contempla documentacion y formalizacion notarial.",
    },
    {
      question: "Como puedo agendar una visita?",
      answer: "Puedes coordinar por WhatsApp, llamada telefonica o correo.",
    },
  ],
  contact: {
    phone: LANDING_CONTACT.phoneIntl,
    whatsapp: LANDING_LINKS.whatsappHref,
    email: LANDING_CONTACT.email,
    address: LANDING_CONTACT.address,
  },
};

export const defaultLandingSeo: LandingSeo = {
  title: "Power Amazónica | Proyecto Santa Beatriz – Lotes de 150 m² en Chanchamayo",
  description:
    "Conoce el Proyecto Urb. Santa Beatriz de Power Amazónica: lotes de 150 m² con papeles en regla, contrato notarial y facilidades de pago.",
  ogTitle: "Power Amazónica | Proyecto Santa Beatriz – Lotes de 150 m² en Chanchamayo",
  ogDescription:
    "Proyecto Urb. Santa Beatriz en Chanchamayo con lotes de 150 m², ubicación estratégica y facilidades de pago.",
};

export const landingFallbackContent = {
  title: "Contenido en actualizacion",
  description:
    "Estamos preparando la informacion oficial del proyecto. Contactanos para recibir detalle actualizado.",
  ctaText: "Contactar por WhatsApp",
  ctaHref: LANDING_LINKS.whatsappHref,
};
