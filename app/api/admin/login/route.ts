import { AdminRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { ADMIN_SESSION_COOKIE } from "@/lib/auth/constants";
import { validateAdminCredentials } from "@/lib/auth/env";
import { getSessionCookieOptions, createSessionToken } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { resolveTenantFromRequest } from "@/lib/tenant";

const loginPayloadSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const payloadResult = loginPayloadSchema.safeParse(body);

  if (!payloadResult.success) {
    return NextResponse.json(
      {
        error: "Payload invalido",
        issues: payloadResult.error.flatten(),
      },
      { status: 400 },
    );
  }

  const credentials = validateAdminCredentials(payloadResult.data);
  if (!credentials.ok) {
    return NextResponse.json({ error: credentials.error }, { status: 401 });
  }

  const tenant = await resolveTenantFromRequest(request);

  const adminUser = await prisma.adminUser.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: credentials.email,
      },
    },
    update: {
      passwordHash: credentials.passwordHashForStorage,
      role: AdminRole.SUPER_ADMIN,
    },
    create: {
      tenantId: tenant.id,
      email: credentials.email,
      passwordHash: credentials.passwordHashForStorage,
      role: AdminRole.SUPER_ADMIN,
    },
    select: {
      id: true,
      tenantId: true,
      email: true,
      role: true,
    },
  });

  const token = createSessionToken({
    userId: adminUser.id,
    tenantId: adminUser.tenantId,
    email: adminUser.email,
    role: adminUser.role,
  });

  const response = NextResponse.json({
    ok: true,
    user: {
      email: adminUser.email,
      role: adminUser.role,
    },
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, token, getSessionCookieOptions());
  return response;
}
