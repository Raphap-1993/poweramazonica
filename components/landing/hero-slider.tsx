import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { HeroSlide } from "@/lib/content/types";

type HeroSliderProps = {
  slides: HeroSlide[];
};

export function HeroSlider({ slides }: HeroSliderProps) {
  const [primarySlide, ...secondarySlides] = slides;

  if (!primarySlide) {
    return null;
  }

  return (
    <section className="space-y-4">
      <Card className="overflow-hidden rounded-3xl border shadow-sm">
        <CardContent className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
          <div className="space-y-5">
            <Badge variant="secondary">Proyecto inmobiliario</Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">{primarySlide.title}</h1>
            <p className="text-lg text-muted-foreground">{primarySlide.subtitle}</p>
            <Button asChild size="lg">
              <a href={primarySlide.ctaHref} target="_blank" rel="noreferrer noopener">
                {primarySlide.ctaText}
              </a>
            </Button>
          </div>
          <div className="flex min-h-60 items-center justify-center rounded-2xl border border-dashed bg-muted/40 p-4 text-center text-sm text-muted-foreground">
            {primarySlide.imageUrl ? (
              <div
                className="h-full w-full rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url(${primarySlide.imageUrl})` }}
                role="img"
                aria-label={primarySlide.title}
              />
            ) : (
              <span>Imagen principal del proyecto</span>
            )}
          </div>
        </CardContent>
      </Card>

      {secondarySlides.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {secondarySlides.map((slide, index) => (
            <Card key={`${slide.title}-${index}`} className="rounded-2xl">
              <CardContent className="space-y-3 pt-6">
                <h3 className="text-xl font-semibold">{slide.title}</h3>
                <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                <Button asChild variant="outline" size="sm">
                  <a href={slide.ctaHref} target="_blank" rel="noreferrer noopener">
                    {slide.ctaText}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </section>
  );
}
