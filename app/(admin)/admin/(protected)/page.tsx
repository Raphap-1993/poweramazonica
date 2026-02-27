import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Editor de Landing</CardTitle>
          <CardDescription>Gestiona hero, features, FAQ, contacto y SEO.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Badge variant="secondary">Borrador + Publicación</Badge>
          <Button asChild>
            <Link href="/admin/landing">Abrir editor</Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Historial</CardTitle>
          <CardDescription>Revisa snapshots de publicaciones recientes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link href="/admin/publishes">Ver historial</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
