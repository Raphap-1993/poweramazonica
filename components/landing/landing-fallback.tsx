import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { landingFallbackContent } from "@/lib/content";

export function LandingFallback() {
  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-12 sm:px-8">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">{landingFallbackContent.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{landingFallbackContent.description}</p>
          <Button asChild>
            <a href={landingFallbackContent.ctaHref} target="_blank" rel="noreferrer noopener">
              {landingFallbackContent.ctaText}
            </a>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
