import type { Tenant } from "@prisma/client";

import { prisma } from "@/lib/db";

const LOCAL_DEFAULT_DOMAIN = "localhost";

export function normalizeDomain(rawHost?: string | null): string {
  const host = (rawHost ?? "").trim().toLowerCase();
  if (!host) {
    return process.env.DEFAULT_TENANT_DOMAIN ?? LOCAL_DEFAULT_DOMAIN;
  }

  const withoutPort = host.includes(":") ? host.split(":")[0] : host;
  return withoutPort || process.env.DEFAULT_TENANT_DOMAIN || LOCAL_DEFAULT_DOMAIN;
}

export async function resolveTenantByDomain(domainInput: string): Promise<Tenant> {
  const domain = normalizeDomain(domainInput);

  return prisma.tenant.upsert({
    where: { domain },
    update: {},
    create: { domain },
  });
}

export async function resolveTenantFromHeaders(headers: Headers): Promise<Tenant> {
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  return resolveTenantByDomain(host);
}

export async function resolveTenantFromRequest(request: Request): Promise<Tenant> {
  return resolveTenantFromHeaders(request.headers);
}
