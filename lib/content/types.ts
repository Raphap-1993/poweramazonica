export type HeroSlide = {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageUrl?: string;
};

export type FeatureItem = {
  title: string;
  description: string;
  iconKey?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ContactData = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
};

export type LandingData = {
  heroSlider: HeroSlide[];
  features: FeatureItem[];
  faq: FaqItem[];
  contact: ContactData;
};

export type LandingSeo = {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
};

export type LandingDraftPayload = {
  data: LandingData;
  seo: LandingSeo;
};

export type LandingPageRecord = {
  id: string;
  status: "DRAFT" | "PUBLISHED";
  data: LandingData;
  seo: LandingSeo;
  updatedAt: Date;
  updatedBy: {
    id: string;
    email: string;
  } | null;
};

export type LandingPublishRecord = {
  id: string;
  publishedAt: Date;
  data: LandingData;
  seo: LandingSeo;
  publishedBy: {
    id: string;
    email: string;
  } | null;
};
