import { NextResponse } from "next/server";

import { getAuthenticatedAdminFromRequest } from "@/lib/auth/server";
import { listLeadsByTenant } from "@/lib/leads";
import { resolveTenantFromRequest } from "@/lib/tenant";

function escapeCsvCell(value: string): string {
  const normalized = value.replace(/"/g, "\"\"");
  return `"${normalized}"`;
}

function toCsvDate(value: Date): string {
  return value.toISOString();
}

function buildCsv(rows: Array<Record<string, string>>): string {
  if (rows.length === 0) {
    return "createdAt,name,phone,email,message,source\n";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsvCell(row[header] ?? "")).join(",")),
  ];

  return `${lines.join("\n")}\n`;
}

function toFilenameDate(value: Date): string {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  const hours = String(value.getUTCHours()).padStart(2, "0");
  const minutes = String(value.getUTCMinutes()).padStart(2, "0");
  return `${year}${month}${day}_${hours}${minutes}`;
}

export async function GET(request: Request) {
  const [tenant, admin] = await Promise.all([
    resolveTenantFromRequest(request),
    getAuthenticatedAdminFromRequest(request),
  ]);

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (admin.user.tenantId !== tenant.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const search = url.searchParams.get("q") ?? undefined;
  const source = url.searchParams.get("source") ?? undefined;

  const leads = await listLeadsByTenant({
    tenantId: tenant.id,
    search,
    source,
    limit: 500,
  });

  const rows = leads.map((lead) => ({
    createdAt: toCsvDate(lead.createdAt),
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? "",
    message: lead.message,
    source: lead.source ?? "",
  }));

  const csv = buildCsv(rows);
  const fileName = `leads_${toFilenameDate(new Date())}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
