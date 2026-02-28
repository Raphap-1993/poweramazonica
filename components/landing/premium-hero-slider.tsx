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
    <section className="relative overflow-hidden rounded-[2rem] border border-emerald-200/80 shadow-[0_25px_80px_-52px_rgba(21,128,61,0.75)]">
      <div className="relative min-h-[520px] sm:min-h-[580px] lg:min-h-[640px]">
        <OptimizedMedia
          src={activeSlide.imageUrl}
          alt={activeSlide.title}
          priority={activeIndex === 0}
          sizes="100vw"
          quality={74}
          className="absolute inset-0 h-full w-full"
          overlayClassName="bg-gradient-to-r from-emerald-950/78 via-emerald-950/58 to-emerald-900/45"
          fallbackLabel="Colocar imagen panorámica real del proyecto en /public o subir desde admin."
        />

        <div className="relative z-10 flex min-h-[520px] items-end p-4 sm:min-h-[580px] sm:p-6 lg:min-h-[640px] lg:p-9">
          <div className="w-full rounded-3xl border border-white/35 bg-white/88 p-5 shadow-xl backdrop-blur-md sm:max-w-xl sm:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
                Proyecto Urb. Santa Beatriz
              </Badge>
              <Badge variant="outline" className="border-emerald-200 bg-white text-emerald-900">
                Lotes de 150 m²
              </Badge>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-900">
                <MapPin className="h-3.5 w-3.5" />
                Chanchamayo
              </span>
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
              {activeSlide.title}
            </h1>
            <p className="mt-3 text-lg text-zinc-600">{activeSlide.subtitle}</p>

            <div className="mt-5 flex flex-wrap gap-3">
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

            <div className="mt-4 flex flex-wrap gap-2 text-sm text-zinc-600">
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
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-gradient-to-t from-black/45 via-black/25 to-transparent p-4 sm:p-6">
          <div className="flex items-center gap-2">
            {normalizedSlides.map((slide, index) => (
              <button
                key={`${slide.title}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Ir al slide ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-10 w-10 border-white/45 bg-white/15 text-white hover:bg-white/25"
              onClick={goToPrevious}
              aria-label="Slide anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="outline"
              className="h-10 w-10 border-white/45 bg-white/15 text-white hover:bg-white/25"
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
