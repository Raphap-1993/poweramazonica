"use client";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { OptimizedMedia } from "@/components/landing/optimized-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HeroSlide } from "@/lib/content/types";
import { LANDING_LINKS } from "@/lib/landing/constants";

type PremiumHeroSliderProps = {
  slides: HeroSlide[];
  telHref: string;
};

const quickHighlights = [
  {
    title: "Contrato notarial",
    description: "Proceso formal de compra y documentación en regla.",
  },
  {
    title: "Ubicación estratégica",
    description: "A 15 minutos del centro de Chanchamayo.",
  },
  {
    title: "Servicios proyectados",
    description: "Luz, agua y alcantarillado para el desarrollo urbano.",
  },
  {
    title: "Facilidades de pago",
    description: "MiVivienda, cuota inicial mínima y alternativas en cuotas.",
  },
];

function normalizeSlides(slides: HeroSlide[]): HeroSlide[] {
  return slides.length > 0
    ? slides
    : [
        {
          title: "Proyecto Urb. Santa Beatriz",
          subtitle: "Lotes de 150 m² a 15 minutos del centro de Chanchamayo.",
          ctaText: "WhatsApp",
          ctaHref: LANDING_LINKS.whatsappHref,
          imageUrl: "",
        },
      ];
}

export function PremiumHeroSlider({ slides, telHref }: PremiumHeroSliderProps) {
  const normalizedSlides = useMemo(() => normalizeSlides(slides), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = normalizedSlides[activeIndex];

  useEffect(() => {
    if (normalizedSlides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % normalizedSlides.length);
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [normalizedSlides.length]);

  useEffect(() => {
    const imageUrls = normalizedSlides.map((slide) => slide.imageUrl?.trim()).filter(Boolean);
    imageUrls.forEach((url) => {
      const image = new window.Image();
      image.decoding = "async";
      image.src = url as string;
    });
  }, [normalizedSlides]);

  function goToPrevious() {
    setActiveIndex((current) =>
      current === 0 ? normalizedSlides.length - 1 : current - 1,
    );
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % normalizedSlides.length);
  }

  return (
    <section className="relative left-1/2 right-1/2 -mx-[50vw] w-screen overflow-hidden bg-emerald-950">
      <div className="relative min-h-[560px] sm:min-h-[640px] lg:min-h-[700px]">
        <OptimizedMedia
          src={activeSlide.imageUrl}
          alt={activeSlide.title}
          priority={activeIndex === 0}
          sizes="100vw"
          quality={74}
          className="absolute inset-0 h-full w-full"
          overlayClassName="bg-gradient-to-r from-emerald-950/78 via-emerald-900/58 to-black/38"
          fallbackLabel="Colocar imagen panorámica real del proyecto en /public o subir desde admin."
        />

        <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-4 pb-24 pt-16 sm:min-h-[640px] sm:px-6 sm:pb-28 lg:min-h-[700px] lg:px-10 lg:pt-20">
          <div className="max-w-2xl space-y-5 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-white/20 text-white hover:bg-white/20">Proyecto Urb. Santa Beatriz</Badge>
              <Badge className="border-white/45 bg-white/10 text-white hover:bg-white/10">Lotes de 150 m²</Badge>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/45 bg-white/12 px-2.5 py-1 text-xs text-white">
                <MapPin className="h-3.5 w-3.5" />
                Chanchamayo
              </span>
            </div>

            <h1 className="text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {activeSlide.title}
            </h1>
            <p className="max-w-xl text-pretty text-lg text-white/88 sm:text-xl">{activeSlide.subtitle}</p>

            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-lime-300 font-semibold text-emerald-950 hover:bg-lime-200"
              >
                <a href={activeSlide.ctaHref} target="_blank" rel="noopener noreferrer">
                  {activeSlide.ctaText}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/55 bg-white/10 text-white hover:bg-white/20"
              >
                <a href={telHref} aria-label="Llamar a asesor comercial">
                  Llamar ahora
                </a>
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-7xl items-end justify-between gap-3 px-4 pb-4 sm:px-6 sm:pb-5 lg:px-10">
          <div className="flex items-center gap-2">
            {normalizedSlides.map((slide, index) => (
              <button
                key={`${slide.title}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ir al slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-9 bg-lime-300" : "w-2.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-10 w-10 border-white/45 bg-white/12 text-white hover:bg-white/24"
              onClick={goToPrevious}
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-10 w-10 border-white/45 bg-white/12 text-white hover:bg-white/24"
              onClick={goToNext}
              aria-label="Siguiente slide"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-30 mx-auto -mt-6 w-full max-w-7xl px-4 pb-3 sm:-mt-8 sm:px-6 lg:-mt-10 lg:px-10">
        <div className="grid gap-3 rounded-2xl border border-emerald-100 bg-white/96 p-3 shadow-xl backdrop-blur sm:grid-cols-2 lg:grid-cols-4">
          {quickHighlights.map((item) => (
            <div key={item.title} className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-3">
              <p className="text-sm font-semibold text-emerald-900">{item.title}</p>
              <p className="mt-1 text-xs text-zinc-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
