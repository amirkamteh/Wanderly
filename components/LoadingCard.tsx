import { cn } from "@/lib/utils";

/** Skeleton placeholder matching the card layout, used by `loading.tsx`. */
export default function LoadingCard({
  aspect = "aspect-square",
  className,
}: {
  aspect?: string;
  className?: string;
}) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className={cn("w-full rounded-xl bg-surface", aspect)} />
      <div className="mt-3 h-3.5 w-3/4 rounded bg-surface" />
      <div className="mt-2 h-3.5 w-1/2 rounded bg-surface" />
    </div>
  );
}

/** A full rail of skeletons, including the heading placeholder. */
export function LoadingRow({ count = 6 }: { count?: number }) {
  return (
    <section className="page-gutter">
      <div className="mb-4 h-6 w-64 animate-pulse rounded bg-surface" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {Array.from({ length: count }, (_, i) => (
          <LoadingCard key={i} className={i > 2 ? "hidden lg:block" : undefined} />
        ))}
      </div>
    </section>
  );
}
