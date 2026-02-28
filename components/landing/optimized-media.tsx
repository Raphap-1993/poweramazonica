import Image from "next/image";

import { isRenderableImageSrc, normalizeImageSrc } from "@/lib/media/normalize-image-src";
import { cn } from "@/lib/utils";

type OptimizedMediaProps = {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  objectPosition?: string;
  fallbackLabel?: string;
  overlayClassName?: string;
};

export function OptimizedMedia({
  src,
  alt,
  className,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  priority = false,
  quality = 76,
  objectPosition = "center",
  fallbackLabel = "Reemplazar por imagen real en /public o desde admin.",
  overlayClassName,
}: OptimizedMediaProps) {
  const normalizedSrc = normalizeImageSrc(src);
  const hasImageSource = isRenderableImageSrc(normalizedSrc);

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", className)}>
      {hasImageSource ? (
        <Image
          src={normalizedSrc}
          alt={alt}
          fill
          priority={priority}
          quality={quality}
          sizes={sizes}
          className="object-cover"
          style={{ objectPosition }}
        />
      ) : null}

      {!normalizedSrc ? (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.24),transparent_36%),radial-gradient(circle_at_82%_12%,rgba(255,255,255,0.2),transparent_30%),linear-gradient(140deg,#14532d,#3f6212)]" />
      ) : null}

      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent",
          overlayClassName,
        )}
      />

      {!normalizedSrc ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-center">
          <p className="rounded-xl border border-white/35 bg-white/20 px-4 py-3 text-sm text-white backdrop-blur-md">
            {fallbackLabel}
          </p>
        </div>
      ) : null}
    </div>
  );
}
