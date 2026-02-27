import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { getAuthenticatedAdminFromRequest } from "@/lib/auth/server";
import { publishLanding } from "@/lib/content";
import { resolveTenantFromRequest } from "@/lib/tenant";

export async function POST(request: Request) {
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

  const result = await publishLanding({
    tenantId: tenant.id,
    publishedById: admin.user.id,
  });

  revalidateTag("landing-published", "max");
  revalidatePath("/");

  return NextResponse.json({
    ok: true,
    published: result.published,
    snapshot: result.snapshot,
  });
}
