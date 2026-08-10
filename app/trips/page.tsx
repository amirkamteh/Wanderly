import { Briefcase } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Trips",
  description: "Your upcoming and past bookings on Wanderly.",
  robots: { index: false, follow: false },
};

export default function TripsPage() {
  return (
    <div className="mx-auto max-w-[1760px] page-gutter py-12">
      <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
        Trips
      </h1>

      <div className="mx-auto max-w-md py-20 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
          <Briefcase aria-hidden="true" className="size-7 text-line-strong" />
        </span>
        <h2 className="mt-6 text-xl font-semibold text-ink">No trips booked yet</h2>
        <p className="mt-2 text-[15px] text-muted">
          Bookings need an account and a payment provider, neither of which this
          build has. Reserving a listing shows the full price breakdown instead.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Start searching
        </Link>
      </div>
    </div>
  );
}
