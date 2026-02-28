"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HeroSlide } from "@/lib/content/types";

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
          ctaHref:
            "https://wa.me/51990814630?text=Hola%2C%20quiero%20informacion%20del%20Proyecto%20Urb.%20Santa%20Beatriz.",
          imageUrl: "",
        },
      ];
}

export function PremiumHeroSlider({ slides, telHref }: PremiumHeroSliderProps) {
  const normalizedSlides = useMemo(() => normalizeSlides(slides), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  const activeSlide = normalizedSlides[activeIndex];

  function goToPrevious() {
    setActiveIndex((current) =>
      current === 0 ? normalizedSlides.length - 1 : current - 1,
    );
  }

  function goToNext() {
    setActiveIndex((current) => (current + 1) % normalizedSlides.length);
  }

  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-card via-card to-muted/40 p-6 shadow-sm sm:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Proyecto Urb. Santa Beatriz</Badge>
            <Badge variant="outline">Lotes de 150 m²</Badge>
          </div>

          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {activeSlide.title}
          </h1>
          <p className="max-w-xl text-lg text-muted-foreground">{activeSlide.subtitle}</p>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href={activeSlide.ctaHref} target="_blank" rel="noopener noreferrer">
                {activeSlide.ctaText}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={telHref} aria-label="Llamar a asesor comercial">
                Llamar ahora
              </a>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Contrato notarial, papeles en regla y alta proyección de valorización.
          </p>
        </div>

        <div className="relative">
          <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl border bg-muted/30 p-4 sm:min-h-[340px]">
            {activeSlide.imageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${activeSlide.imageUrl})` }}
                role="img"
                aria-label={activeSlide.title}
              />
            ) : null}
            <div className="relative z-10 rounded-xl border border-dashed bg-background/90 px-5 py-4 text-center text-sm text-muted-foreground shadow-sm">
              Colocar imagen real del proyecto en <code>/public</code> o subir desde admin.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {normalizedSlides.map((slide, index) => (
            <button
              key={`${slide.title}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Ir al slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                index === activeIndex ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/35"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={goToPrevious}
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={goToNext}
            aria-label="Siguiente slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
