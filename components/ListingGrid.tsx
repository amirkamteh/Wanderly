import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Responsive results grid: one column on mobile, two on small tablets,
 * three on large tablets and four on desktop.
 */
export default function ListingGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
