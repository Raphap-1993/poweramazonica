import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireAuthenticatedAdminForPage } from "@/lib/auth/server";
import { listLeadsByTenant } from "@/lib/leads";

type LeadsSearchParams = {
  q?: string | string[];
  source?: string | string[];
};

function normalizeParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0]?.trim() || "";
  }

  return value?.trim() || "";
}

function toTelHref(phone: string): string {
  const normalized = phone.trim().replace(/\s+/g, "");
  if (!normalized) {
    return "tel:+51990814630";
  }

  return normalized.startsWith("+") ? `tel:${normalized}` : `tel:+${normalized}`;
}

function toWhatsappHref(phone: string, name: string): string {
  const digits = phone.replace(/\D+/g, "");
  const normalized = digits.startsWith("51") ? digits : `51${digits}`;
  const message = encodeURIComponent(
    `Hola ${name}, gracias por tu interés en el Proyecto Santa Beatriz. ¿Te puedo ayudar con tu consulta?`,
  );
  return `https://wa.me/${normalized}?text=${message}`;
}

function toSafeCell(value?: string | null): string {
  return value?.trim() || "No registrado";
}

function buildExportHref(search: string, source: string): string {
  const params = new URLSearchParams();
  if (search) {
    params.set("q", search);
  }
  if (source) {
    params.set("source", source);
  }

  const query = params.toString();
  return query ? `/api/admin/leads/export?${query}` : "/api/admin/leads/export";
}

export default async function AdminLeadsPage(props: {
  searchParams?: LeadsSearchParams | Promise<LeadsSearchParams>;
}) {
  const admin = await requireAuthenticatedAdminForPage();
  const rawSearchParams = props.searchParams ? await props.searchParams : {};
  const search = normalizeParam(rawSearchParams.q);
  const source = normalizeParam(rawSearchParams.source);

  const leads = await listLeadsByTenant({
    tenantId: admin.user.tenantId,
    search: search || undefined,
    source: source || undefined,
    limit: 300,
  });

  const sourceOptions = Array.from(new Set(leads.map((lead) => lead.source?.trim()).filter(Boolean))).sort();
  const exportHref = buildExportHref(search, source);

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Leads de Formularios</CardTitle>
          <CardDescription>
            Vista para marketing. Aquí se registran los contactos enviados desde la landing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="grid gap-3 md:grid-cols-[1.1fr_0.8fr_auto_auto]" method="GET">
            <input
              type="text"
              name="q"
              defaultValue={search}
              placeholder="Buscar por nombre, teléfono, correo o mensaje"
              className="h-10 rounded-md border px-3 text-sm"
            />
            <input
              type="text"
              name="source"
              defaultValue={source}
              placeholder="Filtrar por source"
              className="h-10 rounded-md border px-3 text-sm"
              list="sources-list"
            />
            <datalist id="sources-list">
              {sourceOptions.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
            <Button type="submit">Aplicar filtros</Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/leads">Limpiar</Link>
            </Button>
          </form>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Badge variant="secondary">{leads.length} leads visibles</Badge>
            <Button asChild variant="outline">
              <Link href={exportHref}>Exportar CSV</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {leads.length === 0 ? (
            <p className="text-sm text-muted-foreground">No hay leads con los filtros actuales.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-2">Fecha</th>
                    <th className="px-3 py-2">Nombre</th>
                    <th className="px-3 py-2">Teléfono</th>
                    <th className="px-3 py-2">Correo</th>
                    <th className="px-3 py-2">Mensaje</th>
                    <th className="px-3 py-2">Source</th>
                    <th className="px-3 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b align-top">
                      <td className="px-3 py-3 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleString("es-PE")}
                      </td>
                      <td className="px-3 py-3 font-medium">{lead.name}</td>
                      <td className="px-3 py-3">{lead.phone}</td>
                      <td className="px-3 py-3">{toSafeCell(lead.email)}</td>
                      <td className="max-w-[420px] px-3 py-3">
                        <p className="line-clamp-3 text-muted-foreground">{lead.message}</p>
                      </td>
                      <td className="px-3 py-3">{toSafeCell(lead.source)}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <a href={toTelHref(lead.phone)}>Llamar</a>
                          </Button>
                          <Button size="sm" asChild>
                            <a href={toWhatsappHref(lead.phone, lead.name)} target="_blank" rel="noopener noreferrer">
                              WhatsApp
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
