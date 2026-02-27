import { headers } from "next/headers";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { listLandingPublishes } from "@/lib/content";
import { resolveTenantFromHeaders } from "@/lib/tenant";

export default async function AdminPublishesPage() {
  const headerStore = await headers();
  const tenant = await resolveTenantFromHeaders(headerStore);
  const publishes = await listLandingPublishes(tenant.id, 30);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de publicaciones</CardTitle>
        <CardDescription>Snapshots guardados por fecha de publicación.</CardDescription>
      </CardHeader>
      <CardContent>
        {publishes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aún no hay publicaciones registradas.</p>
        ) : (
          <div className="space-y-4">
            {publishes.map((item) => (
              <div key={item.id} className="space-y-2 rounded-xl border p-3">
                <p className="text-sm font-medium">
                  {new Date(item.publishedAt).toLocaleString("es-PE")}
                </p>
                <p className="text-sm text-muted-foreground">
                  Publicado por: {item.publishedBy?.email ?? "Usuario no disponible"}
                </p>
                <p className="text-sm text-muted-foreground">
                  SEO title: {item.seo.title}
                </p>
                <Separator />
                <p className="text-sm text-muted-foreground">
                  Slides: {item.data.heroSlider.length} | Features: {item.data.features.length} | FAQ: {" "}
                  {item.data.faq.length}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
