import { Compass } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-28 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
        <Compass aria-hidden="true" className="size-7 text-line-strong" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-ink">
        We can&rsquo;t find that page
      </h1>
      <p className="mt-2 text-[15px] text-muted">
        The link may be out of date, or the listing may no longer be available.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Back to explore
        </Link>
        <Link
          href="/search?tab=homes"
          className="rounded-xl border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Search all stays
        </Link>
      </div>
    </div>
  );
}
