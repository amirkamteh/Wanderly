import Link from "next/link";
import { BRAND } from "@/data/footer";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** `full` shows the wordmark; `mark` is the glyph only (mobile header). */
  variant?: "full" | "mark";
  className?: string;
}

/**
 * Original Wanderly brand mark: a compass needle folded into a location pin.
 * Drawn inline so it scales cleanly and inherits the brand colour.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("text-brand-600", className)}
    >
      <path
        d="M16 2.5c-5.8 0-10.5 4.6-10.5 10.3 0 7.4 9.1 16.1 9.5 16.5a1.4 1.4 0 0 0 2 0c.4-.4 9.5-9.1 9.5-16.5C26.5 7.1 21.8 2.5 16 2.5Z"
        fill="currentColor"
      />
      <path
        d="m21 8-7.1 3.3a1.5 1.5 0 0 0-.73.73L9.9 19.1a.5.5 0 0 0 .66.66l7.07-3.26a1.5 1.5 0 0 0 .73-.73L21.66 8.7A.5.5 0 0 0 21 8Z"
        fill="#fff"
      />
    </svg>
  );
}

export default function Logo({ variant = "full", className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${BRAND.name} home`}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-lg transition-opacity hover:opacity-85",
        className,
      )}
    >
      <LogoMark className="h-8 w-8" />
      {variant === "full" && (
        <span className="hidden text-[21px] font-bold tracking-tight text-brand-600 sm:inline">
          {BRAND.name}
        </span>
      )}
    </Link>
  );
}
