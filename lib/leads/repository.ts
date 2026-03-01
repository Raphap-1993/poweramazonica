import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";

export type LeadListItem = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  source: string | null;
  createdAt: Date;
};

type ListLeadsArgs = {
  tenantId: string;
  search?: string;
  source?: string;
  limit?: number;
};

const leadSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  message: true,
  source: true,
  createdAt: true,
} satisfies Prisma.LeadSelect;

function clampLimit(limit?: number): number {
  if (!Number.isFinite(limit)) {
    return 100;
  }

  const normalized = Math.trunc(limit as number);
  return Math.max(1, Math.min(500, normalized));
}

function normalizeFilter(value?: string): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function buildWhere(args: ListLeadsArgs): Prisma.LeadWhereInput {
  const search = normalizeFilter(args.search);
  const source = normalizeFilter(args.source);

  const where: Prisma.LeadWhereInput = {
    tenantId: args.tenantId,
  };

  if (source) {
    where.source = {
      contains: source,
      mode: "insensitive",
    };
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        phone: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        message: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        source: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  return where;
}

export async function listLeadsByTenant(args: ListLeadsArgs): Promise<LeadListItem[]> {
  const where = buildWhere(args);

  return prisma.lead.findMany({
    where,
    orderBy: {
      createdAt: "desc",
    },
    take: clampLimit(args.limit),
    select: leadSelect,
  });
}
