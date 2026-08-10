"use client";

import Image from "next/image";
import { useState } from "react";
import { IMAGE_FALLBACK } from "@/data/images";
import { cn } from "@/lib/utils";

interface CardImageProps {
  src: string;
  alt: string;
  /** Tailwind aspect utility, e.g. `aspect-square`. */
  aspect?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Rounded card image with a neutral placeholder. If a remote photo fails to
 * load we fall back to a flat grey tile rather than showing a broken image.
 */
export default function CardImage({
  src,
  alt,
  aspect = "aspect-square",
  sizes = "(max-width: 640px) 63vw, (max-width: 768px) 42vw, (max-width: 1024px) 30vw, (max-width: 1280px) 23vw, 17vw",
  priority = false,
  className,
}: CardImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-xl bg-surface",
        aspect,
        className,
      )}
    >
      <Image
        src={failed ? IMAGE_FALLBACK : src}
        alt={alt}
        fill
        sizes={sizes}
        // `priority` alone drives loading: eager + preload when set, lazy
        // otherwise. Passing `loading` as well would override that default.
        priority={priority}
        onError={() => setFailed(true)}
        className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035]"
        unoptimized={failed}
      />
    </div>
  );
}
