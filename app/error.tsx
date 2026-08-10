"use client";

import { RotateCcw, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the failure for whatever error reporting is wired up in prod.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md px-6 py-28 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
        <TriangleAlert aria-hidden="true" className="size-7 text-line-strong" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-2 text-[15px] text-muted">
        This page failed to load. Trying again usually sorts it.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-subtle">Reference: {error.digest}</p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Try again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Back to explore
        </Link>
      </div>
    </div>
  );
}
