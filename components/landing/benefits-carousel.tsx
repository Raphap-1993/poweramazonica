"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { OptimizedMedia } from "@/components/landing/optimized-media";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeatureItem } from "@/lib/content/types";

type BenefitsCarouselProps = {
  items: FeatureItem[];
  referenceImageUrl?: string;
};

const fallbackBenefits: FeatureItem[] = [
  {
    title: "Contrato notarial y papeles en regla",
    description: "Proceso formal para compra segura de tu lote.",
  },
  {
    title: "Servicios e infraestructura",
    description: "Pistas, veredas, luz, agua y alcantarillado en desarrollo urbano.",
  },
];

export function BenefitsCarousel({ items, referenceImageUrl }: BenefitsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const cards = items.length > 0 ? items : fallbackBenefits;

  function scrollBy(direction: "left" | "right") {
    if (!scrollRef.current) {
      return;
    }

    const amount = Math.floor(scrollRef.current.clientWidth * 0.88);
    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">Bonos y Beneficios</h2>
          <p className="text-zinc-600">
            Beneficios que fortalecen tu decisión de inversión en Santa Beatriz.
          </p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
            onClick={() => scrollBy("left")}
            aria-label="Desplazar beneficios a la izquierda"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50"
            onClick={() => scrollBy("right")}
            aria-label="Desplazar beneficios a la derecha"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div ref={scrollRef} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
        {cards.map((item, index) => (
          <Card
            key={`${item.title}-${index}`}
            className="group min-w-[88%] snap-center overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-[0_18px_50px_-42px_rgba(21,128,61,0.55)] sm:min-w-[70%] lg:min-w-[46%]"
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">
                  Beneficio {index + 1}
                </Badge>
                <Badge variant="outline" className="border-emerald-200 text-emerald-900">
                  Santa Beatriz
                </Badge>
              </div>
              <CardTitle className="text-2xl leading-tight text-zinc-950">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-zinc-600">{item.description}</p>

              <div className="relative min-h-40 overflow-hidden rounded-2xl border border-emerald-100">
                <OptimizedMedia
                  src={referenceImageUrl}
                  alt={item.title}
                  sizes="(max-width: 1024px) 88vw, 32vw"
                  className="absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105"
                  fallbackLabel="Colocar imagen real de beneficio en /public"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
