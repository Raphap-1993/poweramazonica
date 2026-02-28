"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FeatureItem } from "@/lib/content/types";

type BenefitsCarouselProps = {
  items: FeatureItem[];
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

export function BenefitsCarousel({ items }: BenefitsCarouselProps) {
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
          <h2 className="text-3xl font-semibold tracking-tight">Bonos y Beneficios</h2>
          <p className="text-muted-foreground">
            Beneficios que fortalecen tu decisión de inversión en Santa Beatriz.
          </p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => scrollBy("left")}
            aria-label="Desplazar beneficios a la izquierda"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
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
            className="min-w-[88%] snap-center rounded-2xl border shadow-sm sm:min-w-[70%] lg:min-w-[46%]"
          >
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">Beneficio {index + 1}</Badge>
                <Badge variant="outline">Santa Beatriz</Badge>
              </div>
              <CardTitle className="text-2xl leading-tight">{item.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{item.description}</p>
              <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed bg-muted/35 px-4 text-center text-xs text-muted-foreground">
                Colocar imagen real de beneficio en <code>/public</code>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
