import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import {
  getUploadMaxBytes,
  getUploadStorageRoot,
  getUploadTransformOptions,
  SUPPORTED_IMAGE_MIME_TYPES,
  type UploadKind,
} from "@/lib/uploads/config";

export class UploadValidationError extends Error {}

type StoreOptimizedImageArgs = {
  tenantDomain: string;
  mimeType: string;
  sizeBytes: number;
  inputBuffer: Buffer;
  kind: UploadKind;
};

export type StoredImage = {
  url: string;
  contentType: "image/webp";
  sizeBytes: number;
  width: number;
  height: number;
};

function slugifyDomain(domain: string): string {
  const normalized = domain.trim().toLowerCase();
  const slug = normalized.replace(/[^a-z0-9.-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return slug || "default";
}

function ensureMimeTypeAllowed(mimeType: string) {
  if (!SUPPORTED_IMAGE_MIME_TYPES.has(mimeType)) {
    throw new UploadValidationError("Formato no soportado. Usa JPG, PNG, WebP o AVIF.");
  }
}

function ensureFileSizeAllowed(sizeBytes: number) {
  const maxBytes = getUploadMaxBytes();
  if (sizeBytes <= 0) {
    throw new UploadValidationError("Archivo vacío.");
  }

  if (sizeBytes > maxBytes) {
    throw new UploadValidationError(
      `Archivo demasiado grande. Máximo ${(maxBytes / (1024 * 1024)).toFixed(0)} MB.`,
    );
  }
}

export async function storeOptimizedImage(args: StoreOptimizedImageArgs): Promise<StoredImage> {
  ensureMimeTypeAllowed(args.mimeType);
  ensureFileSizeAllowed(args.sizeBytes);

  const options = getUploadTransformOptions(args.kind);

  const result = await sharp(args.inputBuffer)
    .rotate()
    .resize({
      width: options.maxWidth,
      height: options.maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({
      quality: options.quality,
      effort: 4,
      smartSubsample: true,
    })
    .toBuffer({ resolveWithObject: true });

  const width = result.info.width ?? options.maxWidth;
  const height = result.info.height ?? options.maxHeight;

  const now = new Date();
  const year = now.getUTCFullYear().toString();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const fileName = `${randomUUID().replaceAll("-", "")}.webp`;

  const tenantSlug = slugifyDomain(args.tenantDomain);
  const relativePath = path.posix.join(tenantSlug, year, month, fileName);

  const storageRoot = getUploadStorageRoot();
  const absolutePath = path.join(storageRoot, tenantSlug, year, month, fileName);

  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, result.data);

  return {
    url: `/uploads/${relativePath}`,
    contentType: "image/webp",
    sizeBytes: result.data.byteLength,
    width,
    height,
  };
}
