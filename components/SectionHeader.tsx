import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  /** When set, the whole title becomes a link with a trailing arrow. */
  href?: string;
  as?: "h2" | "h3";
  className?: string;
}

/**
 * Rail heading: title plus a circular arrow affordance, matching the
 * "Popular homes in Abu Dhabi →" pattern from the reference.
 */
export default function SectionHeader({
  title,
  href,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  const heading = (
    <Heading
      className={cn(
        "text-[19px] leading-tight font-semibold tracking-[-0.01em] text-ink sm:text-[22px]",
        className,
      )}
    >
      {title}
    </Heading>
  );

  if (!href) return heading;

  return (
    <Link href={href} className="group inline-flex items-center gap-2">
      {heading}
      <span
        aria-hidden="true"
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-surface text-ink transition group-hover:bg-line"
      >
        <ArrowRight className="size-3.5" />
      </span>
    </Link>
  );
}
