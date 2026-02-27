import { NextResponse } from "next/server";

import { getAuthenticatedAdminFromRequest } from "@/lib/auth/server";
import { getLandingDraft, landingDraftPayloadSchema, saveLandingDraft } from "@/lib/content";
import { resolveTenantFromRequest } from "@/lib/tenant";

async function authorize(request: Request) {
  const [tenant, admin] = await Promise.all([
    resolveTenantFromRequest(request),
    getAuthenticatedAdminFromRequest(request),
  ]);

  if (!admin) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (admin.user.tenantId !== tenant.id) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return {
    tenant,
    admin,
  };
}

export async function GET(request: Request) {
  const auth = await authorize(request);
  if ("error" in auth) {
    return auth.error;
  }

  const draft = await getLandingDraft(auth.tenant.id);
  return NextResponse.json({
    landing: draft,
  });
}

export async function PUT(request: Request) {
  const auth = await authorize(request);
  if ("error" in auth) {
    return auth.error;
  }

  const body = await request.json().catch(() => null);
  const payloadResult = landingDraftPayloadSchema.safeParse(body);

  if (!payloadResult.success) {
    return NextResponse.json(
      {
        error: "Payload invalido",
        issues: payloadResult.error.flatten(),
      },
      { status: 400 },
    );
  }

  const landing = await saveLandingDraft({
    tenantId: auth.tenant.id,
    payload: payloadResult.data,
    updatedById: auth.admin.user.id,
  });

  return NextResponse.json({
    ok: true,
    landing,
  });
}
