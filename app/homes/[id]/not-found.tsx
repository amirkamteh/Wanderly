import { House } from "lucide-react";
import Link from "next/link";

export default function HomeNotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-28 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
        <House aria-hidden="true" className="size-7 text-line-strong" />
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-ink">This stay isn&rsquo;t available</h1>
      <p className="mt-2 text-[15px] text-muted">
        The listing may have been removed, or the link may be wrong. There are
        plenty of others nearby.
      </p>
      <Link
        href="/homes"
        className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        Browse all homes
      </Link>
    </div>
  );
}
