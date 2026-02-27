import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10">
        <section className="space-y-6">
          <Badge variant="secondary" className="w-fit">
            Power Amazonica
          </Badge>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Base de componentes shadcn/ui lista para construir la landing.
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Esta base mantiene compatibilidad con Next.js App Router, React 19
            y Tailwind 4. Incluye componentes reutilizables para acelerar
            iteraciones sin romper el pipeline.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a
                href="https://wa.me/5592999999999?text=Hola%20equipo%20Power%20Amazonica"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="tel:+5592999999999">Llamar</a>
            </Button>
            <Button asChild variant="ghost">
              <a href="mailto:contato@poweramazonica.com">Enviar correo</a>
            </Button>
          </div>
        </section>

        <Separator />

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Button</CardTitle>
              <CardDescription>CTAs primarios y secundarios.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Variantes `default`, `outline`, `ghost`, `secondary` y
              `destructive`.
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card + Badge</CardTitle>
              <CardDescription>Bloques de contenido y estados.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge>Nuevo</Badge>
              <span>Estructura base para secciones de la landing.</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Accordion + Separator</CardTitle>
              <CardDescription>FAQs y separadores visuales.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ideal para dudas frecuentes sin sobrecargar la interfaz.
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Preguntas frecuentes
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-xl border px-4"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Que componentes base quedaron listos?
              </AccordionTrigger>
              <AccordionContent>
                Button, Card, Badge, Accordion y Separator en
                `components/ui`.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Esta preparada la estructura para seguir iterando?
              </AccordionTrigger>
              <AccordionContent>
                Si. Quedo integrada con alias `@/*`, utilitario `cn` y tokens
                CSS para extender estilos sin romper build.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </div>
  );
}
