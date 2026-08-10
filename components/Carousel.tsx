"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode;
  /** Rendered on the same row as the arrows. */
  title: ReactNode;
  /** Optional line under the title. */
  subtitle?: string;
  /** Accessible name for the scroll region. */
  label: string;
  className?: string;
}

/**
 * Horizontal card rail with native scroll-snap. Touch and trackpad swiping
 * come free; the arrows page by one viewport width and hide when there is
 * nothing to scroll (which is also the mobile case).
 */
export default function Carousel({
  children,
  title,
  subtitle,
  label,
  className,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const max = track.scrollWidth - track.clientWidth;
    setCanScrollLeft(track.scrollLeft > 8);
    setCanScrollRight(track.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    sync();
    track.addEventListener("scroll", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", sync);
      observer.disconnect();
    };
  }, [sync]);

  function page(direction: 1 | -1) {
    const track = trackRef.current;
    if (!track) return;
    // Leave a card's worth of overlap so nothing is skipped between pages.
    track.scrollBy({ left: direction * track.clientWidth * 0.92, behavior: "smooth" });
  }

  const hasArrows = canScrollLeft || canScrollRight;

  return (
    <section className={cn("relative", className)} aria-label={label}>
      <div className="mb-3 flex items-end justify-between gap-4 page-gutter">
        <div className="min-w-0">
          {title}
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>

        <div className={cn("hidden shrink-0 gap-2 md:flex", !hasArrows && "md:invisible")}>
          <RailButton
            direction="left"
            disabled={!canScrollLeft}
            onClick={() => page(-1)}
            label={`Previous ${label}`}
          />
          <RailButton
            direction="right"
            disabled={!canScrollRight}
            onClick={() => page(1)}
            label={`Next ${label}`}
          />
        </div>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-hide rail-gutter flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth"
      >
        {children}
      </div>
    </section>
  );
}

function RailButton({
  direction,
  disabled,
  onClick,
  label,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex size-7 items-center justify-center rounded-full border border-line bg-white transition",
        disabled
          ? "cursor-default text-line-strong"
          : "text-ink hover:border-line-strong hover:shadow-sm active:scale-95",
      )}
    >
      <Icon aria-hidden="true" className="size-4" />
    </button>
  );
}

/**
 * Fixed-width rail item. Widths are tuned so a desktop row shows six cards,
 * a tablet three to four, and mobile roughly one and a half.
 */
export function CarouselItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[63vw] shrink-0 snap-start sm:w-[42vw] md:w-[30vw] lg:w-[23vw] xl:w-[calc((100%-5*0.75rem)/6)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
