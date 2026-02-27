import { NextResponse } from "next/server";

import { getAuthenticatedAdminFromRequest } from "@/lib/auth/server";
import { listLandingPublishes } from "@/lib/content";
import { resolveTenantFromRequest } from "@/lib/tenant";

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

  const publishes = await listLandingPublishes(tenant.id, 30);
  return NextResponse.json({ publishes });
}
