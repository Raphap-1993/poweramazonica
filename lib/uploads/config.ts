import path from "node:path";

export const SUPPORTED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

export type UploadKind = "hero" | "generic";

const DEFAULT_UPLOAD_MAX_MB = 8;
const DEFAULT_QUALITY = 82;

function parseEnvInt(input: string | undefined, fallback: number, min: number, max: number): number {
  if (!input) {
    return fallback;
  }

  const parsed = Number.parseInt(input, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, parsed));
}

export function getUploadMaxBytes(): number {
  const maxMb = parseEnvInt(process.env.UPLOAD_MAX_FILE_MB, DEFAULT_UPLOAD_MAX_MB, 1, 30);
  return maxMb * 1024 * 1024;
}

function getImageQuality(): number {
  return parseEnvInt(process.env.UPLOAD_IMAGE_QUALITY, DEFAULT_QUALITY, 50, 90);
}

export function getUploadTransformOptions(kind: UploadKind) {
  const quality = getImageQuality();

  if (kind === "hero") {
    return {
      maxWidth: 1920,
      maxHeight: 1080,
      quality,
    };
  }

  return {
    maxWidth: 1600,
    maxHeight: 1600,
    quality,
  };
}

export function getUploadStorageRoot(): string {
  const configured = process.env.UPLOAD_STORAGE_DIR?.trim();
  if (configured) {
    return configured;
  }

  if (process.env.NODE_ENV === "production") {
    return path.resolve(process.cwd(), "..", "shared", "uploads");
  }

  return path.resolve(process.cwd(), ".data", "uploads");
}
