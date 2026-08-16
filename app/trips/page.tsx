import { Briefcase, CalendarDays, LogIn } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { formatDateRange, formatPrice } from "@/lib/formatters";
import { getMyBookingRequests } from "@/lib/queries";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trips",
  description: "Your booking requests on Wanderly.",
  robots: { index: false, follow: false },
};

const KIND_PATH = {
  home: "/homes",
  experience: "/experiences",
  service: "/services",
} as const;

export default async function TripsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
          <LogIn aria-hidden="true" className="size-7 text-line-strong" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-ink">Log in to see your trips</h1>
        <p className="mt-2 text-[15px] text-muted">
          Your booking requests are tied to your account. You can keep browsing and
          enquiring without one — but they will not show up here.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/login?next=/trips"
            className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Log in
          </Link>
          <Link
            href="/signup?next=/trips"
            className="rounded-xl border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
          >
            Sign up
          </Link>
        </div>
      </div>
    );
  }

  const trips = await getMyBookingRequests();

  return (
    <div className="mx-auto max-w-[900px] page-gutter py-10">
      <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
        Trips
      </h1>
      <p className="mt-1 text-[15px] text-muted">
        {trips.length > 0
          ? `${pluralize(trips.length, "request")} sent from this account`
          : "Requests you send while logged in will appear here"}
      </p>

      {trips.length === 0 ? (
        <div className="mx-auto max-w-md py-20 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
            <Briefcase aria-hidden="true" className="size-7 text-line-strong" />
          </span>
          <h2 className="mt-6 text-xl font-semibold text-ink">No requests yet</h2>
          <p className="mt-2 text-[15px] text-muted">
            Find somewhere you like and hit Reserve — the host replies by email.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {trips.map((trip) => (
            <li
              key={trip.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-line p-5"
            >
              <div className="min-w-0">
                <Link
                  href={`${KIND_PATH[trip.listing_kind]}/${trip.listing_id}`}
                  className="text-[15px] font-semibold text-ink hover:underline"
                >
                  {trip.listing_title}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted">
                  <span className="capitalize">{trip.listing_kind}</span>
                  <span aria-hidden="true">·</span>
                  <span>{pluralize(trip.guests, "guest")}</span>
                  {trip.check_in && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays aria-hidden="true" className="size-3.5" />
                        {formatDateRange(trip.check_in, trip.check_out)}
                      </span>
                    </>
                  )}
                </p>
                {trip.message && (
                  <p className="mt-2 max-w-prose text-sm text-muted">{trip.message}</p>
                )}
              </div>

              <div className="text-right">
                {trip.total_price !== null && (
                  <p className="text-[15px] font-semibold text-ink">
                    {formatPrice(trip.total_price)}
                  </p>
                )}
                <p className="text-xs text-muted">
                  Sent {new Date(trip.created_at).toLocaleDateString("en-GB")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
