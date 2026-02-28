function trim(value?: string | null): string {
  return (value ?? "").trim();
}

export function normalizeImageSrc(value?: string | null): string {
  const raw = trim(value);
  if (!raw) {
    return "";
  }

  if (/^data:/i.test(raw) || /^blob:/i.test(raw)) {
    return "";
  }

  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }

  if (raw.startsWith("//")) {
    return `https:${raw}`;
  }

  if (raw.startsWith("/")) {
    return raw;
  }

  const normalizedPath = raw.replace(/^\.?\/*/, "");
  return normalizedPath ? `/${normalizedPath}` : "";
}

export function isRenderableImageSrc(value?: string | null): boolean {
  const src = normalizeImageSrc(value);
  return Boolean(src) && (src.startsWith("/") || /^https?:\/\//i.test(src));
}
