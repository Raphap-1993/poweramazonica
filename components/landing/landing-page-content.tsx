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
import { LeadCaptureForm } from "@/components/landing/lead-capture-form";
import { PremiumHeroSlider } from "@/components/landing/premium-hero-slider";
import type { HeroSlide, LandingData } from "@/lib/content/types";

type LandingPageContentProps = {
  data: LandingData;
};

const paymentOptions = [
  "Crédito MiVivienda",
  "Cuota inicial mínima",
  "Al contado",
  "Cuotas hasta 60",
];

const trustTips = [
  "Compra con contrato notarial y documentación en regla.",
  "Proyecto con enfoque urbano y acceso a zonas clave de Chanchamayo.",
  "Atención comercial directa para evaluación de alternativas de pago.",
  "Alta proyección de valorización en zona estratégica.",
];

const blogPlaceholders = [
  {
    title: "Cómo evaluar un lote con enfoque de valorización",
    description:
      "Checklist básico para analizar ubicación, accesos y entorno urbano antes de comprar.",
  },
  {
    title: "Guía rápida de financiamiento con MiVivienda",
    description:
      "Aspectos clave para preparar tu evaluación y ordenar tu documentación.",
  },
];

function toTelHref(phone: string): string {
  const normalized = phone.trim().replace(/\s+/g, "");
  if (!normalized) {
    return "tel:+51990814630";
  }

  return normalized.startsWith("+") ? `tel:${normalized}` : `tel:+${normalized}`;
}

function normalizeHeroSlides(dataSlides: HeroSlide[], whatsappHref: string): HeroSlide[] {
  const curated: HeroSlide[] = [
    {
      title: "Proyecto Urb. Santa Beatriz",
      subtitle: "Lotes de 150 m² a 15 minutos del centro de Chanchamayo.",
      ctaText: "Agendar por WhatsApp",
      ctaHref: whatsappHref,
      imageUrl: "",
    },
    {
      title: "Corporación Power Amazónica S.A.C.",
      subtitle:
        "Fundada en 2018, con operaciones en Chanchamayo, Satipo y Oxapampa; 8 viviendas construidas y entregadas.",
      ctaText: "Hablar con un asesor",
      ctaHref: whatsappHref,
      imageUrl: "",
    },
    {
      title: "Facilidades de pago para avanzar hoy",
      subtitle:
        "Opciones con Crédito MiVivienda, cuota inicial mínima, al contado o cuotas hasta 60.",
      ctaText: "Quiero información",
      ctaHref: whatsappHref,
      imageUrl: "",
    },
  ];

  const fromDb = dataSlides.filter((slide) => slide.title.trim() && slide.subtitle.trim());
  const merged = [...fromDb, ...curated].slice(0, 3);

  return merged.map((slide, index) => ({
    ...slide,
    ctaText: slide.ctaText || curated[index]?.ctaText || "WhatsApp",
    ctaHref: slide.ctaHref || whatsappHref,
  }));
}

export function LandingPageContent({ data }: LandingPageContentProps) {
  const whatsappHref = data.contact.whatsapp;
  const telHref = toTelHref(data.contact.phone);
  const heroSlides = normalizeHeroSlides(data.heroSlider, whatsappHref);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <PremiumHeroSlider slides={heroSlides} telHref={telHref} />

      <BenefitsCarousel items={data.features} />

      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-950/95 p-6 text-white shadow-sm sm:p-8 lg:p-10">
        <div className="absolute inset-0 opacity-15">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_#ffffff_0%,_transparent_58%)]" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <Badge className="bg-white/15 text-white hover:bg-white/15">Proyecto en Selva Central</Badge>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Desarrollamos espacios en los que quieres vivir
            </h2>
            <p className="max-w-2xl text-white/90">
              Proyecto residencial con accesos estratégicos, cerca de comercios, instituciones
              educativas, terminal terrestre e instituciones del estado como fiscalía y poder
              judicial.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              {paymentOptions.map((option) => (
                <div
                  key={option}
                  className="rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm"
                >
                  {option}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-white/90">
                <a href={telHref}>Llamar: {data.contact.phone}</a>
              </Button>
            </div>
          </div>

          <Card className="border-white/20 bg-white/95 text-foreground shadow-xl">
            <CardContent className="pt-6">
              <LeadCaptureForm
                source="hero-showcase"
                title="Solicita asesoría personalizada"
                description="Déjanos tus datos y te ayudamos a evaluar tu mejor opción de compra."
                whatsappHref={whatsappHref}
                submitLabel="Quiero que me contacten"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-6 rounded-3xl border bg-card p-5 shadow-sm md:grid-cols-[1.05fr_0.95fr] md:p-7">
        <div className="space-y-4">
          <Badge variant="outline">Asesoría comercial</Badge>
          <h2 className="text-3xl font-semibold tracking-tight">¿Ya tienes proyecto o consulta?</h2>
          <p className="text-muted-foreground">
            Nuestro equipo comercial revisa tu caso y te orienta sobre la alternativa de compra
            más conveniente para Santa Beatriz.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Atención directa: 990 814 630</p>
            <p>Correo: {data.contact.email}</p>
            <p>Oficina: {data.contact.address}</p>
          </div>
          <div className="flex min-h-52 items-center justify-center rounded-2xl border border-dashed bg-muted/40 text-center text-sm text-muted-foreground">
            Colocar foto real de asesor en <code>/public</code>
          </div>
        </div>

        <Card className="rounded-2xl border-dashed">
          <CardHeader>
            <CardTitle>Cuéntanos tu objetivo</CardTitle>
          </CardHeader>
          <CardContent>
            <LeadCaptureForm
              source="proyecto-consulta"
              title="Te llamamos para orientarte"
              description="Comparte tu consulta y agendamos contacto por llamada o WhatsApp."
              whatsappHref={whatsappHref}
              compact
              submitLabel="Solicitar llamada"
            />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-3xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Instagram / Comunidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Mantenemos comunicación activa sobre avances, visitas y novedades del proyecto.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed bg-muted/40 text-xs text-muted-foreground">
                Preview feed 1
              </div>
              <div className="flex min-h-44 items-center justify-center rounded-2xl border border-dashed bg-muted/40 text-xs text-muted-foreground">
                Preview feed 2
              </div>
            </div>
            <Button asChild variant="outline">
              <a href="#" aria-label="Abrir Instagram de Power Amazónica">
                Ver Instagram (placeholder)
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border shadow-sm">
          <CardHeader>
            <CardTitle className="text-3xl tracking-tight">Blog / Artículos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {blogPlaceholders.map((article) => (
              <div key={article.title} className="rounded-2xl border p-4">
                <p className="text-lg font-medium">{article.title}</p>
                <p className="text-sm text-muted-foreground">{article.description}</p>
              </div>
            ))}
            <Button asChild variant="outline">
              <a href="#" aria-label="Abrir blog de Power Amazónica">
                Ir al blog (placeholder)
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6 rounded-3xl border bg-muted/20 p-6 shadow-sm sm:p-8">
        <div className="space-y-3 text-center">
          <Badge variant="secondary">Compra con respaldo</Badge>
          <h2 className="mx-auto max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Con Power Amazónica, priorizas seguridad documental y un proyecto con alta proyección
          </h2>
          <p className="mx-auto max-w-3xl text-muted-foreground">
            Corporación Power Amazónica S.A.C. opera desde 2018 en selva central y acompaña procesos
            formales de compra y evaluación de financiamiento.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {trustTips.map((tip) => (
            <div key={tip} className="rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground">
              {tip}
            </div>
          ))}
        </div>

        <Accordion type="single" collapsible className="rounded-2xl border bg-card px-4">
          {data.faq.map((item, index) => (
            <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <Separator />

      <footer className="grid gap-8 pb-8 md:grid-cols-4">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Power Amazónica</h3>
          <p className="text-sm text-muted-foreground">
            Corporación Power Amazónica S.A.C. fundada en 2018. Operaciones vinculadas al Fondo
            MiVivienda en Chanchamayo, Satipo y Oxapampa.
          </p>
          <p className="text-sm text-muted-foreground">8 viviendas construidas y entregadas.</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Navegación</p>
          <a className="block text-muted-foreground hover:underline" href="#">
            Inicio
          </a>
          <a className="block text-muted-foreground hover:underline" href="#">
            Beneficios
          </a>
          <a className="block text-muted-foreground hover:underline" href="#">
            Contacto
          </a>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Contacto</p>
          <a className="block text-muted-foreground hover:underline" href={telHref}>
            {data.contact.phone}
          </a>
          <a
            className="block text-muted-foreground hover:underline"
            href={`mailto:${data.contact.email}`}
          >
            {data.contact.email}
          </a>
          <p className="text-muted-foreground">{data.contact.address}</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Redes (placeholder)</p>
          <a className="block text-muted-foreground hover:underline" href="#">
            Instagram
          </a>
          <a className="block text-muted-foreground hover:underline" href="#">
            Facebook
          </a>
          <a
            className="block text-muted-foreground hover:underline"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </footer>
    </main>
  );
}
