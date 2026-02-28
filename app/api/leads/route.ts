import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { resolveTenantFromRequest } from "@/lib/tenant";
import { leadCreateSchema } from "@/lib/leads/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (
    payload &&
    typeof payload === "object" &&
    "website" in payload &&
    typeof payload.website === "string" &&
    payload.website.trim().length > 0
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = leadCreateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Payload inválido",
        issues: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const tenant = await resolveTenantFromRequest(request);

  try {
    const lead = await prisma.lead.create({
      data: {
        tenantId: tenant.id,
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        source: parsed.data.source,
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (error) {
    console.error("No se pudo registrar lead", error);
    return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 500 });
  }
}
