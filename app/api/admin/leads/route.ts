import { NextResponse } from "next/server";

import { getAuthenticatedAdminFromRequest } from "@/lib/auth/server";
import { listLeadsByTenant } from "@/lib/leads";
import { resolveTenantFromRequest } from "@/lib/tenant";

function parseLimit(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
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
  const limit = parseLimit(url.searchParams.get("limit"));

  const leads = await listLeadsByTenant({
    tenantId: tenant.id,
    search,
    source,
    limit,
  });

  return NextResponse.json({ leads });
}
