"use client";

import { ChevronLeft, ChevronRight, MapPin, PhoneCall } from "lucide-react";
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
    <section className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-lime-50 via-white to-emerald-50 p-3 shadow-[0_22px_70px_-45px_rgba(21,128,61,0.65)] sm:p-4">
      <div className="relative overflow-hidden rounded-[1.65rem] border border-emerald-100/80 bg-white/90 p-5 backdrop-blur sm:p-7">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(132,204,22,0.16),_transparent_58%)]" />

        <div className="relative grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
                Proyecto Urb. Santa Beatriz
              </Badge>
              <Badge
                variant="outline"
                className="border-emerald-200 bg-white text-emerald-900"
              >
                Lotes de 150 m²
              </Badge>
            </div>

            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              {activeSlide.title}
            </h1>
            <p className="max-w-xl text-lg text-zinc-600">{activeSlide.subtitle}</p>

            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-emerald-700 text-white hover:bg-emerald-800">
                <a href={activeSlide.ctaHref} target="_blank" rel="noopener noreferrer">
                  {activeSlide.ctaText}
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
              >
                <a href={telHref} aria-label="Llamar a asesor comercial">
                  Llamar ahora
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-zinc-600">
              <span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5">
                Contrato notarial
              </span>
              <span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5">
                Papeles en regla
              </span>
              <span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5">
                Alta proyección de valorización
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-emerald-200 p-4 sm:min-h-[360px] sm:p-6">
              <OptimizedMedia
                src={activeSlide.imageUrl}
                alt={activeSlide.title}
                priority={activeIndex === 0}
                sizes="(max-width: 1024px) 100vw, 46vw"
                quality={74}
                className="absolute inset-0 h-full w-full"
              />
              <div className="relative z-10 w-full space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/20 px-3 py-1 text-xs text-white backdrop-blur">
                  <MapPin className="h-3.5 w-3.5" />
                  Chanchamayo, selva central
                </div>

                <div className="rounded-xl border border-white/35 bg-white/20 p-3 text-white backdrop-blur-md">
                  <p className="text-sm font-medium">
                    Colocar imagen real del proyecto en <code>/public</code> o subir desde admin.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-emerald-900">
                    15 min del centro
                  </span>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-emerald-900">
                    Servicios proyectados
                  </span>
                </div>
              </div>
            </div>

            <div className="absolute -left-2 -top-2 hidden rounded-xl border border-emerald-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:block">
              <p className="text-xs font-medium text-zinc-700">Asesor comercial</p>
              <p className="flex items-center gap-1 text-sm font-semibold text-emerald-800">
                <PhoneCall className="h-3.5 w-3.5" />
                990 814 630
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {normalizedSlides.map((slide, index) => (
              <button
                key={`${slide.title}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ir al slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-8 bg-emerald-700"
                    : "w-2.5 bg-emerald-700/25 hover:bg-emerald-700/40"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-9 w-9 border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
              onClick={goToPrevious}
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-9 w-9 border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
              onClick={goToNext}
              aria-label="Siguiente slide"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
