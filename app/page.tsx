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

const whatsappHref =
  "https://wa.me/51990814630?text=Hola%2C%20quiero%20informacion%20del%20Proyecto%20Urb.%20Santa%20Beatriz%20y%20agendar%20una%20visita.";

const projectFeatures = [
  "Contrato notarial",
  "Papeles en regla",
  "Pistas y veredas",
  "Luz, agua y alcantarillado",
  "Parques, mercado y areas verdes",
  "Seguridad",
];

const paymentOptions = [
  "Credito MiVivienda",
  "Cuota inicial minima",
  "Al contado",
  "Cuotas hasta 60",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto w-full max-w-6xl space-y-14 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <section className="grid gap-8 rounded-3xl border bg-card p-6 shadow-sm sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Papeles en regla</Badge>
              <Badge variant="secondary">Contrato notarial</Badge>
              <Badge variant="secondary">Servicios basicos</Badge>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Proyecto Urb. Santa Beatriz
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl">
              Lotes de 150 m² a 15 min del centro.
            </p>
            <p className="max-w-xl text-muted-foreground">
              Proyecto residencial en Chanchamayo con enfoque urbano y alta
              proyeccion, respaldado por gestion formal y acompanamiento
              comercial.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+51990814630">Llamar</a>
              </Button>
              <Button asChild size="lg" variant="ghost">
                <a href="mailto:orbezog@hotmail.com">Enviar correo</a>
              </Button>
            </div>
          </div>
          <div className="flex items-stretch">
            {/* Reemplazar por imagen real en /public, por ejemplo /public/santa-beatriz-hero.jpg */}
            <div className="flex min-h-72 w-full items-center justify-center rounded-2xl border border-dashed bg-muted/40 px-6 text-center text-sm text-muted-foreground">
              Imagen del proyecto
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Nosotros
          </h2>
          <Card className="border-0 bg-muted/40 shadow-none">
            <CardContent className="space-y-4 pt-6 text-muted-foreground">
              <p>
                Corporacion Power Amazonica S.A.C. fundada en 2018, con enfoque
                en desarrollo inmobiliario formal en la selva central.
              </p>
              <p>
                Operaciones vinculadas al Fondo MiVivienda en Chanchamayo,
                Satipo y Oxapampa, con acompanamiento en evaluacion de opciones
                de financiamiento.
              </p>
              <p>8 viviendas construidas y entregadas.</p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            El Proyecto
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projectFeatures.map((feature) => (
              <Card key={feature} className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">{feature}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Ubicacion y Ventajas
            </h2>
            <Card className="rounded-2xl">
              <CardContent className="space-y-4 pt-6 text-muted-foreground">
                <p>
                  Ubicado en Chanchamayo, en un punto estrategico por cercania a
                  distritos importantes y vias de conexion.
                </p>
                <p>
                  Zona residencial en ampliacion del casco urbano, con accesos y
                  cercania a comercios, instituciones educativas, terminal
                  terrestre e instituciones del estado como fiscalia y poder
                  judicial.
                </p>
                <p>Alta proyeccion de valorizacion.</p>
              </CardContent>
            </Card>
          </div>
          <div>
            {/* Reemplazar por imagen real en /public, por ejemplo /public/santa-beatriz-ubicacion.jpg */}
            <div className="flex min-h-64 h-full items-center justify-center rounded-2xl border border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground">
              Imagen del proyecto
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Facilidades de Pago
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paymentOptions.map((option) => (
              <Card key={option} className="rounded-2xl">
                <CardContent className="pt-6 text-sm font-medium text-foreground">
                  {option}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Preguntas Frecuentes
          </h2>
          <Card className="rounded-2xl">
            <CardContent className="pt-3">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="faq-1">
                  <AccordionTrigger>
                    Los lotes cuentan con documentos y papeles en regla?
                  </AccordionTrigger>
                  <AccordionContent>
                    Si, el proyecto considera papeles en regla y contrato
                    notarial para la formalizacion de la operacion.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>
                    Puedo financiar con MiVivienda?
                  </AccordionTrigger>
                  <AccordionContent>
                    Se brindan opciones vinculadas a Credito MiVivienda segun
                    evaluacion y perfil del solicitante.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>
                    El proyecto tiene servicios instalados?
                  </AccordionTrigger>
                  <AccordionContent>
                    El proyecto contempla luz, agua y alcantarillado, ademas de
                    pistas y veredas en su entorno.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-4">
                  <AccordionTrigger>
                    Donde esta ubicado y como puedo llegar?
                  </AccordionTrigger>
                  <AccordionContent>
                    Se encuentra en Chanchamayo, en zona residencial de
                    expansion urbana. La asesoria comercial te orienta sobre la
                    ruta mas conveniente para la visita.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-5">
                  <AccordionTrigger>
                    Como puedo agendar una visita?
                  </AccordionTrigger>
                  <AccordionContent>
                    Puedes agendar por WhatsApp, llamada telefonica o correo
                    para coordinar fecha y hora.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">
              Agenda tu visita
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Conoce ubicacion, accesos y disponibilidad actual del Proyecto
              Urb. Santa Beatriz con atencion directa del equipo comercial.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Ir a WhatsApp
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href="tel:+51990814630">Llamar ahora</a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <a href="mailto:orbezog@hotmail.com">Escribir por correo</a>
              </Button>
            </div>
          </div>
        </section>

        <footer className="rounded-2xl border bg-muted/30 p-6">
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>Jr. Ayacucho 599</p>
            <p>990 814 630</p>
            <a href="mailto:orbezog@hotmail.com" className="underline-offset-4 hover:underline">
              orbezog@hotmail.com
            </a>
          </div>
        </footer>
      </main>
    </div>
  );
}
