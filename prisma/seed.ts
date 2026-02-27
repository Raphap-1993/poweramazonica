import { randomBytes, scryptSync } from "node:crypto";

import { AdminRole, LandingStatus, Prisma } from "@prisma/client";

import { defaultLandingData, defaultLandingSeo } from "../lib/content/defaults";
import { prisma } from "../lib/db";

const SCRYPT_PARAMS = {
  N: 16384,
  r: 8,
  p: 1,
  keylen: 64,
};

function normalizeDomain(rawDomain?: string): string {
  const value = (rawDomain ?? "").trim().toLowerCase();
  if (!value) return "localhost";
  return value.includes(":") ? value.split(":")[0] : value;
}

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function createScryptHash(plain: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(plain, salt, SCRYPT_PARAMS.keylen, {
    N: SCRYPT_PARAMS.N,
    r: SCRYPT_PARAMS.r,
    p: SCRYPT_PARAMS.p,
  }).toString("hex");

  return [
    "scrypt",
    SCRYPT_PARAMS.N,
    SCRYPT_PARAMS.r,
    SCRYPT_PARAMS.p,
    salt,
    derived,
  ].join("$");
}

function resolvePasswordHash(): string {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return process.env.ADMIN_PASSWORD_HASH;
  }

  if (process.env.ADMIN_PASSWORD_PLAIN) {
    return createScryptHash(process.env.ADMIN_PASSWORD_PLAIN);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_PASSWORD_HASH o ADMIN_PASSWORD_PLAIN es requerido para seed en produccion",
    );
  }

  return createScryptHash("admin123");
}

async function main() {
  const domain = normalizeDomain(
    process.env.DEFAULT_TENANT_DOMAIN ?? process.env.SEED_TENANT_DOMAIN,
  );
  const adminEmail = (process.env.ADMIN_EMAIL ?? "admin@poweramazonica.com").toLowerCase();
  const passwordHash = resolvePasswordHash();

  const tenant = await prisma.tenant.upsert({
    where: { domain },
    update: {},
    create: { domain },
  });

  const admin = await prisma.adminUser.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: adminEmail,
      },
    },
    update: {
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
    create: {
      tenantId: tenant.id,
      email: adminEmail,
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  });

  await prisma.landingPage.upsert({
    where: {
      tenantId_status: {
        tenantId: tenant.id,
        status: LandingStatus.DRAFT,
      },
    },
    update: {
      data: toInputJson(defaultLandingData),
      seo: toInputJson(defaultLandingSeo),
      updatedById: admin.id,
    },
    create: {
      tenantId: tenant.id,
      status: LandingStatus.DRAFT,
      data: toInputJson(defaultLandingData),
      seo: toInputJson(defaultLandingSeo),
      updatedById: admin.id,
    },
  });

  await prisma.landingPage.upsert({
    where: {
      tenantId_status: {
        tenantId: tenant.id,
        status: LandingStatus.PUBLISHED,
      },
    },
    update: {
      data: toInputJson(defaultLandingData),
      seo: toInputJson(defaultLandingSeo),
      updatedById: admin.id,
    },
    create: {
      tenantId: tenant.id,
      status: LandingStatus.PUBLISHED,
      data: toInputJson(defaultLandingData),
      seo: toInputJson(defaultLandingSeo),
      updatedById: admin.id,
    },
  });

  await prisma.landingPublish.create({
    data: {
      tenantId: tenant.id,
      publishedById: admin.id,
      data: toInputJson(defaultLandingData),
      seo: toInputJson(defaultLandingSeo),
    },
  });

  console.log(`Seed completado para tenant ${domain} con admin ${adminEmail}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
