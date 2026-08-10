import { cn } from "@/lib/utils";

/** White pill badge shown in the top-left corner of a card image. */
export default function CardBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute top-3 left-3 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-ink shadow-sm backdrop-blur-sm sm:text-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}
