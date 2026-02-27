import { LandingStatus, Prisma } from "@prisma/client";

import { defaultLandingData, defaultLandingSeo } from "@/lib/content/defaults";
import { landingDataSchema, landingSeoSchema } from "@/lib/content/schemas";
import { prisma } from "@/lib/db";
import type {
  LandingData,
  LandingDraftPayload,
  LandingPageRecord,
  LandingPublishRecord,
  LandingSeo,
} from "@/lib/content/types";

function toInputJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

function parseLandingData(value: Prisma.JsonValue | null | undefined): LandingData {
  const parsed = landingDataSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultLandingData;
}

function parseLandingSeo(value: Prisma.JsonValue | null | undefined): LandingSeo {
  const parsed = landingSeoSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultLandingSeo;
}

const landingPageSelect = {
  id: true,
  status: true,
  data: true,
  seo: true,
  updatedAt: true,
  updatedBy: {
    select: {
      id: true,
      email: true,
    },
  },
} satisfies Prisma.LandingPageSelect;

const landingPublishSelect = {
  id: true,
  publishedAt: true,
  data: true,
  seo: true,
  publishedBy: {
    select: {
      id: true,
      email: true,
    },
  },
} satisfies Prisma.LandingPublishSelect;

function mapLandingPageRecord(
  page: Prisma.LandingPageGetPayload<{ select: typeof landingPageSelect }>,
): LandingPageRecord {
  return {
    id: page.id,
    status: page.status,
    data: parseLandingData(page.data),
    seo: parseLandingSeo(page.seo),
    updatedAt: page.updatedAt,
    updatedBy: page.updatedBy,
  };
}

function mapLandingPublishRecord(
  publish: Prisma.LandingPublishGetPayload<{ select: typeof landingPublishSelect }>,
): LandingPublishRecord {
  return {
    id: publish.id,
    publishedAt: publish.publishedAt,
    data: parseLandingData(publish.data),
    seo: parseLandingSeo(publish.seo),
    publishedBy: publish.publishedBy,
  };
}

async function getOrCreateLandingPage(
  tenantId: string,
  status: LandingStatus,
): Promise<LandingPageRecord> {
  const page = await prisma.landingPage.upsert({
    where: {
      tenantId_status: {
        tenantId,
        status,
      },
    },
    update: {},
    create: {
      tenantId,
      status,
      data: toInputJson(defaultLandingData),
      seo: toInputJson(defaultLandingSeo),
    },
    select: landingPageSelect,
  });

  return mapLandingPageRecord(page);
}

export async function getLandingDraft(tenantId: string): Promise<LandingPageRecord> {
  return getOrCreateLandingPage(tenantId, LandingStatus.DRAFT);
}

export async function getLandingPublished(tenantId: string): Promise<LandingPageRecord | null> {
  const page = await prisma.landingPage.findUnique({
    where: {
      tenantId_status: {
        tenantId,
        status: LandingStatus.PUBLISHED,
      },
    },
    select: landingPageSelect,
  });

  return page ? mapLandingPageRecord(page) : null;
}

export async function saveLandingDraft(args: {
  tenantId: string;
  payload: LandingDraftPayload;
  updatedById: string;
}): Promise<LandingPageRecord> {
  const page = await prisma.landingPage.upsert({
    where: {
      tenantId_status: {
        tenantId: args.tenantId,
        status: LandingStatus.DRAFT,
      },
    },
    create: {
      tenantId: args.tenantId,
      status: LandingStatus.DRAFT,
      data: toInputJson(args.payload.data),
      seo: toInputJson(args.payload.seo),
      updatedById: args.updatedById,
    },
    update: {
      data: toInputJson(args.payload.data),
      seo: toInputJson(args.payload.seo),
      updatedById: args.updatedById,
    },
    select: landingPageSelect,
  });

  return mapLandingPageRecord(page);
}

export async function publishLanding(args: {
  tenantId: string;
  publishedById: string;
}): Promise<{
  published: LandingPageRecord;
  snapshot: LandingPublishRecord;
}> {
  const result = await prisma.$transaction(async (tx) => {
    const draft = await tx.landingPage.findUnique({
      where: {
        tenantId_status: {
          tenantId: args.tenantId,
          status: LandingStatus.DRAFT,
        },
      },
      select: {
        data: true,
        seo: true,
      },
    });

    const data = parseLandingData(draft?.data);
    const seo = parseLandingSeo(draft?.seo);

    const published = await tx.landingPage.upsert({
      where: {
        tenantId_status: {
          tenantId: args.tenantId,
          status: LandingStatus.PUBLISHED,
        },
      },
      create: {
        tenantId: args.tenantId,
        status: LandingStatus.PUBLISHED,
        data: toInputJson(data),
        seo: toInputJson(seo),
        updatedById: args.publishedById,
      },
      update: {
        data: toInputJson(data),
        seo: toInputJson(seo),
        updatedById: args.publishedById,
      },
      select: landingPageSelect,
    });

    const snapshot = await tx.landingPublish.create({
      data: {
        tenantId: args.tenantId,
        publishedById: args.publishedById,
        data: toInputJson(data),
        seo: toInputJson(seo),
      },
      select: landingPublishSelect,
    });

    return { published, snapshot };
  });

  return {
    published: mapLandingPageRecord(result.published),
    snapshot: mapLandingPublishRecord(result.snapshot),
  };
}

export async function listLandingPublishes(
  tenantId: string,
  limit = 20,
): Promise<LandingPublishRecord[]> {
  const publishes = await prisma.landingPublish.findMany({
    where: { tenantId },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: landingPublishSelect,
  });

  return publishes.map(mapLandingPublishRecord);
}

export async function ensureLandingDraftExists(tenantId: string): Promise<LandingPageRecord> {
  return getOrCreateLandingPage(tenantId, LandingStatus.DRAFT);
}
