import { readFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { getUploadStorageRoot } from "@/lib/uploads";

export const runtime = "nodejs";

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".avif": "image/avif",
};

type UploadRouteParams = {
  path?: string[];
};

function hasUnsafeSegment(segment: string): boolean {
  return !segment || segment === "." || segment === ".." || segment.includes("\\") || segment.includes("/");
}

function resolveParams(contextParams: UploadRouteParams | Promise<UploadRouteParams>) {
  if (typeof (contextParams as Promise<UploadRouteParams>).then === "function") {
    return contextParams as Promise<UploadRouteParams>;
  }

  return Promise.resolve(contextParams as UploadRouteParams);
}

export async function GET(
  _request: Request,
  context: { params: UploadRouteParams | Promise<UploadRouteParams> },
) {
  const resolvedParams = await resolveParams(context.params);
  const segments = resolvedParams.path ?? [];

  if (segments.length === 0 || segments.some(hasUnsafeSegment)) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }

  const storageRoot = path.resolve(getUploadStorageRoot());
  const absoluteFilePath = path.resolve(storageRoot, ...segments);

  if (!absoluteFilePath.startsWith(`${storageRoot}${path.sep}`)) {
    return NextResponse.json({ error: "Ruta inválida" }, { status: 400 });
  }

  try {
    const file = await readFile(absoluteFilePath);
    const ext = path.extname(absoluteFilePath).toLowerCase();
    const contentType = CONTENT_TYPE_BY_EXT[ext] ?? "application/octet-stream";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Archivo no encontrado" }, { status: 404 });
  }
}
