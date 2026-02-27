import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContactData } from "@/lib/content/types";

type ContactSectionProps = {
  contact: ContactData;
};

export function ContactSection({ contact }: ContactSectionProps) {
  return (
    <section className="space-y-4">
      <Card className="rounded-3xl">
        <CardHeader>
          <CardTitle className="text-3xl tracking-tight">Agenda tu visita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-muted-foreground">
            Equipo comercial de Power Amazónica para atención por WhatsApp, llamada o correo.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={contact.whatsapp} target="_blank" rel="noreferrer noopener">
                WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={`tel:${contact.phone}`}>Llamar</a>
            </Button>
            <Button asChild variant="secondary">
              <a href={`mailto:${contact.email}`}>Correo</a>
            </Button>
          </div>
          <div className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
            <p>{contact.address}</p>
            <p>{contact.phone}</p>
            <p>{contact.email}</p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
