import type { LandingData, LandingSeo } from "@/lib/content/types";

export const defaultLandingData: LandingData = {
  heroSlider: [
    {
      title: "Proyecto Urb. Santa Beatriz",
      subtitle: "Lotes de 150 m2 a 15 min del centro de Chanchamayo",
      ctaText: "WhatsApp",
      ctaHref:
        "https://wa.me/51990814630?text=Hola%2C%20quiero%20informacion%20del%20Proyecto%20Urb.%20Santa%20Beatriz.",
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
    phone: "+51990814630",
    whatsapp:
      "https://wa.me/51990814630?text=Hola%2C%20quiero%20informacion%20del%20Proyecto%20Urb.%20Santa%20Beatriz.",
    email: "orbezog@hotmail.com",
    address: "Jr. Ayacucho 599",
  },
};

export const defaultLandingSeo: LandingSeo = {
  title: "Power Amazonica | Proyecto Santa Beatriz",
  description:
    "Conoce el Proyecto Urb. Santa Beatriz de Power Amazonica: lotes de 150 m2 en Chanchamayo.",
  ogTitle: "Power Amazonica | Proyecto Santa Beatriz",
  ogDescription:
    "Lotes de 150 m2 en Chanchamayo, con papeles en regla y facilidades de pago.",
};

export const landingFallbackContent = {
  title: "Contenido en actualizacion",
  description:
    "Estamos preparando la informacion oficial del proyecto. Contactanos para recibir detalle actualizado.",
  ctaText: "Contactar por WhatsApp",
  ctaHref:
    "https://wa.me/51990814630?text=Hola%2C%20quiero%20informacion%20actualizada%20del%20proyecto.",
};
