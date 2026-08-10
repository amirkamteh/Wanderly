import { Star } from "lucide-react";
import { formatRating } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  reviewCount?: number;
  /** `inline` is the compact card form; `detail` is the larger page form. */
  variant?: "inline" | "detail";
  className?: string;
}

export default function Rating({
  value,
  reviewCount,
  variant = "inline",
  className,
}: RatingProps) {
  const label =
    reviewCount === undefined
      ? `Rated ${formatRating(value)} out of 5`
      : `Rated ${formatRating(value)} out of 5 from ${reviewCount} reviews`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap",
        variant === "detail" && "gap-1.5 font-medium",
        className,
      )}
      aria-label={label}
    >
      <Star
        aria-hidden="true"
        className={cn("shrink-0 fill-current", variant === "inline" ? "size-3" : "size-4")}
      />
      <span aria-hidden="true">{formatRating(value)}</span>
      {reviewCount !== undefined && variant === "detail" && (
        <span aria-hidden="true" className="text-muted">
          ({reviewCount})
        </span>
      )}
    </span>
  );
}
