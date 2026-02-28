const baseWhatsappMessage = "Hola, quiero info del Proyecto Santa Beatriz y agendar una visita.";

export const LANDING_CONTACT = {
  phone: "990 814 630",
  phoneIntl: "+51990814630",
  email: "orbezog@hotmail.com",
  address: "Jr. Ayacucho 599",
};

export const LANDING_LINKS = {
  whatsappMessage: baseWhatsappMessage,
  whatsappHref: `https://wa.me/51990814630?text=${encodeURIComponent(baseWhatsappMessage)}`,
  telHref: `tel:${LANDING_CONTACT.phoneIntl}`,
  mailtoHref: `mailto:${LANDING_CONTACT.email}`,
};
