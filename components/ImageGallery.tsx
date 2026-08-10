"use client";

import { ChevronLeft, ChevronRight, Grid2X2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

/**
 * Detail-page gallery: a mosaic on desktop, a swipeable strip on mobile, and
 * a lightbox for both.
 */
export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const shots = images.slice(0, 5);

  const close = useCallback(() => setLightboxIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setLightboxIndex((current) =>
        current === null ? null : (current + delta + images.length) % images.length,
      ),
    [images.length],
  );

  useScrollLock(lightboxIndex !== null);
  const lightboxRef = useFocusTrap<HTMLDivElement>(lightboxIndex !== null);

  useEffect(() => {
    if (lightboxIndex === null) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxIndex, close, step]);

  return (
    <>
      {/* Mobile: horizontal snap strip. */}
      <div className="scrollbar-hide -mx-6 flex snap-x snap-mandatory overflow-x-auto md:hidden">
        {shots.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxIndex(index)}
            className="relative aspect-[4/3] w-full shrink-0 snap-center"
          >
            <Image
              src={src}
              alt={`${alt} — photo ${index + 1}`}
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Desktop: one hero plus a 2×2 mosaic. */}
      <div className="relative hidden gap-2 overflow-hidden rounded-2xl md:grid md:grid-cols-4 md:grid-rows-2">
        {shots.map((src, index) => (
          <button
            key={src}
            type="button"
            onClick={() => setLightboxIndex(index)}
            aria-label={`Open photo ${index + 1} of ${images.length}`}
            className={cn(
              "group relative overflow-hidden bg-surface",
              index === 0 ? "col-span-2 row-span-2 aspect-[4/3]" : "aspect-[4/3]",
            )}
          >
            <Image
              src={src}
              alt={`${alt} — photo ${index + 1}`}
              fill
              sizes={index === 0 ? "50vw" : "25vw"}
              priority={index === 0}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}

        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-lg border border-ink bg-white px-3.5 py-2 text-sm font-medium text-ink shadow-sm transition hover:bg-surface"
        >
          <Grid2X2 aria-hidden="true" className="size-4" />
          Show all photos
        </button>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[110] bg-black"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} photo gallery`}
        >
          <div ref={lightboxRef} className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 py-3 text-white">
              <button
                type="button"
                onClick={close}
                aria-label="Close gallery"
                className="flex size-10 items-center justify-center rounded-full transition hover:bg-white/10"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
              <p className="text-sm" aria-live="polite">
                {lightboxIndex + 1} / {images.length}
              </p>
              <span className="size-10" aria-hidden="true" />
            </div>

            <div className="relative flex-1">
              <Image
                src={images[lightboxIndex]}
                alt={`${alt} — photo ${lightboxIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <div className="flex items-center justify-center gap-4 py-5">
              <LightboxArrow direction="left" onClick={() => step(-1)} />
              <LightboxArrow direction="right" onClick={() => step(1)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function LightboxArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Previous photo" : "Next photo"}
      className="flex size-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
    >
      <Icon aria-hidden="true" className="size-5" />
    </button>
  );
}
