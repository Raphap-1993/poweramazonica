import { ArrowUpRight, Building2, Landmark, Mail, MapPin, PhoneCall, ShieldCheck, Trees } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BenefitsCarousel } from "@/components/landing/benefits-carousel";
import { LandingHeader } from "@/components/landing/landing-header";
import { LeadCaptureForm } from "@/components/landing/lead-capture-form";
import { OptimizedMedia } from "@/components/landing/optimized-media";
import { PremiumHeroSlider } from "@/components/landing/premium-hero-slider";
import type { HeroSlide, LandingData } from "@/lib/content/types";
import { LANDING_CONTACT, LANDING_LINKS } from "@/lib/landing/constants";
import { normalizeImageSrc } from "@/lib/media/normalize-image-src";

type LandingPageContentProps = {
  data: LandingData;
};

const paymentOptions = [
  "Crédito MiVivienda",
  "Cuota inicial mínima",
  "Al contado",
  "Hasta 60 cuotas",
];

const trustTips = [
  "Compra con contrato notarial y documentación en regla.",
  "Proyecto con acceso a comercios, instituciones educativas y terminal terrestre.",
  "Atención comercial directa para evaluar alternativas de pago.",
  "Zona con alta proyección de valorización en Chanchamayo.",
];

const instagramMockCards = [
  "Comunidad y visitas al proyecto",
  "Actualizaciones comerciales",
  "Avances de infraestructura",
];

const blogPlaceholders = [
  {
    title: "Cómo evaluar un lote con enfoque de valorización",
    description:
      "Aspectos clave de ubicación, accesos y formalidad para tomar una mejor decisión de compra.",
  },
  {
    title: "Guía rápida de financiamiento con MiVivienda",
    description: "Recomendaciones prácticas para preparar tu evaluación y tu documentación.",
  },
];

const trustStats = [
  { label: "Fundada", value: "2018", icon: Building2 },
  { label: "Viviendas entregadas", value: "8", icon: ShieldCheck },
  { label: "Ciudades de operación", value: "3", icon: MapPin },
  { label: "Proyecto actual", value: "Santa Beatriz", icon: Trees },
];

const advisoryHighlights = [
  "Evaluamos tu objetivo de compra o inversión.",
  "Revisamos ubicación, documentos y facilidades de pago.",
  "Atención comercial directa por llamada o WhatsApp.",
];

function toTelHref(phone: string): string {
  const normalized = phone.trim().replace(/\s+/g, "");
  if (!normalized) {
    return LANDING_LINKS.telHref;
  }

  return normalized.startsWith("+") ? `tel:${normalized}` : `tel:+${normalized}`;
}

function normalizeCopyText(value?: string): string {
  return (value ?? "").replace(/\s+/g, " ").trim();
}

function looksGenericCopy(value: string): boolean {
  const text = normalizeCopyText(value);
  if (!text) {
    return true;
  }

  const normalized = text.toLowerCase();
  return (
    normalized.length < 6 ||
    /\b(slide|lorem|ipsum|demo|test|placeholder)\b/i.test(normalized) ||
    /[a-záéíóúñ]\d+$/i.test(text) ||
    /^cta$/i.test(normalized)
  );
}

function hasAllKeywords(value: string, keywords: string[]): boolean {
  const normalized = value.toLowerCase();
  return keywords.every((keyword) => normalized.includes(keyword));
}

function normalizeCtaHref(value: string, fallbackHref: string): string {
  const href = normalizeCopyText(value);
  if (!href) {
    return fallbackHref;
  }

  if (/^(https?:\/\/|tel:|mailto:|#)/i.test(href)) {
    return href;
  }

  return fallbackHref;
}

function normalizeHeroSlides(dataSlides: HeroSlide[], whatsappHref: string): HeroSlide[] {
  const curatedSlides: HeroSlide[] = [
    {
      title: "Proyecto Urb. Santa Beatriz | Lotes de 150 m² en Chanchamayo",
      subtitle:
        "A 15 minutos del centro de Chanchamayo, con contrato notarial y papeles en regla.",
      ctaText: "Agendar visita por WhatsApp",
      ctaHref: whatsappHref,
      imageUrl: "",
    },
    {
      title: "Proyecto formal con ubicación estratégica",
      subtitle:
        "Pistas y veredas, servicios proyectados y entorno cercano a comercios e instituciones.",
      ctaText: "Solicitar asesoría comercial",
      ctaHref: whatsappHref,
      imageUrl: "",
    },
    {
      title: "Facilidades de pago para comprar tu lote",
      subtitle:
        "Opciones con Crédito MiVivienda, cuota inicial mínima, al contado o hasta 60 cuotas.",
      ctaText: "Evaluar opción de pago",
      ctaHref: whatsappHref,
      imageUrl: "",
    },
  ];

  const subtitleKeywordMap = [
    ["150", "chanchamayo"],
    ["pistas", "servicios"],
    ["mivivienda", "cuota"],
  ];

  const usableSlides = dataSlides.filter(
    (slide) => normalizeCopyText(slide.title) || normalizeCopyText(slide.subtitle),
  );
  const normalizedSlides = [...Array(3)].map((_, index) => {
    const fallback = curatedSlides[index];
    const candidate = usableSlides[index];

    const candidateTitle = normalizeCopyText(candidate?.title);
    const title =
      candidateTitle && !looksGenericCopy(candidateTitle) ? candidateTitle : fallback.title;

    const candidateSubtitle = normalizeCopyText(candidate?.subtitle);
    const subtitle =
      candidateSubtitle &&
      !looksGenericCopy(candidateSubtitle) &&
      hasAllKeywords(candidateSubtitle, subtitleKeywordMap[index] ?? [])
        ? candidateSubtitle
        : fallback.subtitle;

    const candidateCta = normalizeCopyText(candidate?.ctaText);
    const ctaText =
      candidateCta &&
      !looksGenericCopy(candidateCta) &&
      !/^whatsapp\d*$/i.test(candidateCta)
        ? candidateCta
        : fallback.ctaText;

    const imageUrl = normalizeImageSrc(candidate?.imageUrl || fallback.imageUrl);
    const imagePosition = normalizeCopyText(candidate?.imagePosition);

    return {
      title,
      subtitle,
      ctaText,
      ctaHref: normalizeCtaHref(candidate?.ctaHref ?? "", fallback.ctaHref || whatsappHref),
      imageUrl,
      imagePosition: imagePosition || undefined,
    };
  });

  return normalizedSlides;
}

export function LandingPageContent({ data }: LandingPageContentProps) {
  const whatsappHref = data.contact.whatsapp || LANDING_LINKS.whatsappHref;
  const phone = data.contact.phone || LANDING_CONTACT.phone;
  const email = data.contact.email || LANDING_CONTACT.email;
  const address = data.contact.address || LANDING_CONTACT.address;
  const telHref = toTelHref(phone);
  const mailtoHref = email ? `mailto:${email}` : LANDING_LINKS.mailtoHref;
  const heroSlides = normalizeHeroSlides(data.heroSlider, whatsappHref);
  const referenceImageUrl = heroSlides.find((slide) => slide.imageUrl?.trim())?.imageUrl ?? "";

  return (
    <main className="relative w-full">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-80 bg-[radial-gradient(circle,_rgba(132,204,22,0.18)_0%,_transparent_70%)]" />

      <LandingHeader header={data.header} />
      <div aria-hidden="true" className="h-[74px] sm:h-[78px]" />

      <section id="proyecto" className="relative z-10 scroll-mt-28">
        <PremiumHeroSlider slides={heroSlides} telHref={telHref} />
      </section>

      <div className="relative mx-auto w-full max-w-6xl space-y-9 px-4 py-8 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10">
        <section id="beneficios" className="relative z-10 scroll-mt-28">
          <BenefitsCarousel items={data.features} referenceImageUrl={referenceImageUrl} />
        </section>

        <section
          id="lead-form"
          className="relative z-10 scroll-mt-28 overflow-hidden rounded-[2rem] border border-emerald-900/20 bg-emerald-950 px-5 py-6 shadow-[0_28px_80px_-55px_rgba(6,78,59,0.9)] sm:px-7 sm:py-8 lg:px-8"
        >
          <OptimizedMedia
            src={referenceImageUrl}
            alt="Vista referencial de Santa Beatriz"
            priority
            sizes="100vw"
            quality={74}
            objectPosition="center 42%"
            className="absolute inset-0 h-full w-full opacity-70"
            overlayClassName="bg-gradient-to-r from-emerald-950/90 via-emerald-950/65 to-emerald-900/75"
            fallbackLabel="Imagen referencial del Proyecto Santa Beatriz."
          />

          <div className="relative grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-5 text-white">
              <Badge className="bg-white/15 text-white hover:bg-white/15">Proyecto en Selva Central</Badge>
              <h2 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
                Desarrollamos espacios para vivir, invertir y proyectarte
              </h2>
              <p className="max-w-2xl text-white/90">
                Santa Beatriz se ubica en zona estratégica de Chanchamayo, con accesos y cercanía a
                áreas comerciales, instituciones educativas, terminal terrestre, fiscalía y poder
                judicial.
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                {paymentOptions.map((option) => (
                  <div
                    key={option}
                    className="rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white/95 backdrop-blur"
                  >
                    {option}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Conversar por WhatsApp
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/45 bg-transparent text-white hover:bg-white/10"
                >
                  <a href={telHref}>Llamar: {phone}</a>
                </Button>
              </div>
            </div>

            <Card className="border-white/20 bg-white/95 text-foreground shadow-xl">
              <CardContent className="pt-6">
                <LeadCaptureForm
                  formId="lead-capture-main"
                  source="hero-showcase"
                  title="Solicita asesoría personalizada"
                  description="Déjanos tus datos y te orientamos en el proceso de compra."
                  whatsappHref={whatsappHref}
                  submitLabel="Quiero que me contacten"
                />
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="relative z-10 grid gap-6 rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-[0_22px_60px_-52px_rgba(5,150,105,0.8)] md:grid-cols-[1.02fr_0.98fr] md:p-7">
          <div className="space-y-4">
            <Badge variant="outline" className="border-emerald-200 text-emerald-900">
              ¿Ya tienes proyecto o consulta?
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
              Resolvemos tu caso comercial con atención directa
            </h2>
            <p className="text-zinc-600">
              Nuestro equipo te orienta según tu objetivo: compra para vivienda, inversión o
              evaluación de financiamiento.
            </p>

            <div className="grid gap-3 text-sm text-zinc-600 sm:grid-cols-2">
              <p className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2">
                <PhoneCall className="h-4 w-4 text-emerald-700" />
                {phone}
              </p>
              <p className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2">
                <Mail className="h-4 w-4 text-emerald-700" />
                {email}
              </p>
              <p className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2 sm:col-span-2">
                <MapPin className="h-4 w-4 text-emerald-700" />
                {address}
              </p>
            </div>

            <div className="relative min-h-56 overflow-hidden rounded-2xl border border-emerald-100">
              <OptimizedMedia
                src={referenceImageUrl}
                alt="Asesor comercial Power Amazónica"
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="absolute inset-0 h-full w-full"
                fallbackLabel="Asesor comercial de Power Amazónica."
              />
            </div>
          </div>

          <Card className="rounded-2xl border-emerald-100">
            <CardHeader>
              <CardTitle className="text-zinc-950">Agenda tu asesoría comercial hoy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-zinc-600">Te ayudamos a tomar una decisión informada, sin compromiso.</p>
              <div className="space-y-2 text-sm text-zinc-600">
                {advisoryHighlights.map((item) => (
                  <p key={item}>• {item}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <a href="#lead-form">Quiero asesoría ahora</a>
                </Button>
                <Button asChild variant="outline">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    Hablar por WhatsApp
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="relative z-10 grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[2rem] border-emerald-100 shadow-[0_22px_60px_-52px_rgba(5,150,105,0.8)]">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl tracking-tight text-zinc-950">Instagram / Comunidad</CardTitle>
            <p className="text-zinc-600">
              Compartimos novedades comerciales, avances y visitas de campo con nuestra comunidad.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {instagramMockCards.map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-3 py-4 text-center text-xs font-medium text-emerald-900"
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="relative min-h-52 overflow-hidden rounded-2xl border border-emerald-100">
              <OptimizedMedia
                src={referenceImageUrl}
                alt="Comunidad Power Amazónica"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="absolute inset-0 h-full w-full"
                fallbackLabel="Comunidad y novedades del proyecto."
              />
            </div>
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-900 hover:bg-emerald-50">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                Solicitar redes por WhatsApp
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-emerald-100 shadow-[0_22px_60px_-52px_rgba(5,150,105,0.8)]">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl tracking-tight text-zinc-950">Blog / Artículos</CardTitle>
            <p className="text-zinc-600">Contenido útil para tomar decisiones de compra con más claridad.</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {blogPlaceholders.map((article) => (
              <div key={article.title} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4">
                <p className="text-lg font-semibold text-zinc-950">{article.title}</p>
                <p className="text-sm text-zinc-600">{article.description}</p>
              </div>
            ))}
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-900 hover:bg-emerald-50">
              <a href={mailtoHref}>
                Recibir novedades por correo
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
        </section>

        <section id="faq" className="relative z-10 scroll-mt-28 space-y-6 rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-[0_22px_60px_-52px_rgba(5,150,105,0.8)] sm:p-8">
        <div className="space-y-3 text-center">
          <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
            Respaldo comercial y documental
          </Badge>
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">
            Power Amazónica combina formalidad, experiencia regional y enfoque de servicio
          </h2>
          <p className="mx-auto max-w-3xl text-zinc-600">
            Corporación Power Amazónica S.A.C. opera desde 2018 en la selva central con proyectos
            vinculados al Fondo MiVivienda en Chanchamayo, Satipo y Oxapampa.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="space-y-2 rounded-2xl border border-emerald-100 bg-emerald-50/45 px-4 py-4 text-center"
              >
                <Icon className="mx-auto h-5 w-5 text-emerald-700" />
                <p className="text-xl font-semibold text-zinc-950">{stat.value}</p>
                <p className="text-xs text-zinc-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {trustTips.map((tip) => (
            <div key={tip} className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-sm text-zinc-600">
              {tip}
            </div>
          ))}
        </div>

        <Accordion type="single" collapsible className="rounded-2xl border border-emerald-100 bg-emerald-50/35 px-4">
          {data.faq.map((item, index) => (
            <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </section>

        <Separator />

        <footer id="contacto" className="relative z-10 scroll-mt-28 grid gap-8 pb-10 md:grid-cols-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-zinc-950">Power Amazónica</h3>
          <p className="text-sm text-zinc-600">
            Corporación Power Amazónica S.A.C. fundada en 2018. Operaciones en Chanchamayo,
            Satipo y Oxapampa.
          </p>
          <p className="text-sm text-zinc-600">8 viviendas construidas y entregadas.</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-zinc-950">Navegación</p>
          <a className="block text-zinc-600 hover:text-emerald-800 hover:underline" href="#proyecto">
            Proyecto
          </a>
          <a className="block text-zinc-600 hover:text-emerald-800 hover:underline" href="#beneficios">
            Beneficios
          </a>
          <a className="block text-zinc-600 hover:text-emerald-800 hover:underline" href="#faq">
            Preguntas frecuentes
          </a>
          <a className="block text-zinc-600 hover:text-emerald-800 hover:underline" href="#contacto">
            Contacto
          </a>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-zinc-950">Contacto</p>
          <a className="block text-zinc-600 hover:text-emerald-800 hover:underline" href={telHref}>
            {phone}
          </a>
          <a className="block text-zinc-600 hover:text-emerald-800 hover:underline" href={mailtoHref}>
            {email}
          </a>
          <p className="text-zinc-600">{address}</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-zinc-950">Gestiones</p>
          <a
            className="block text-zinc-600 hover:text-emerald-800 hover:underline"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a className="block text-zinc-600 hover:text-emerald-800 hover:underline" href={telHref}>
            Llamada directa
          </a>
          <a className="block text-zinc-600 hover:text-emerald-800 hover:underline" href={mailtoHref}>
            Correo
          </a>
        </div>
        </footer>

        <section className="relative z-10 rounded-2xl border border-emerald-100 bg-emerald-50/45 p-4 text-xs text-zinc-600">
          <p className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-emerald-700" />
            Proyecto Urb. Santa Beatriz con enfoque de formalidad y atención comercial directa.
          </p>
        </section>
      </div>
    </main>
  );
}
