import { Briefcase, LogIn } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import BookingRow from "@/components/booking/BookingRow";
import { getCurrentUser } from "@/lib/auth";
import { getMyBookings, type GuestBooking } from "@/lib/queries";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Trips",
  description: "Your bookings and requests on Wanderly.",
  robots: { index: false, follow: false },
};

/** Groups bookings the way a traveller thinks about them. */
function group(bookings: GuestBooking[]) {
  const today = new Date().toISOString().slice(0, 10);
  return {
    pending: bookings.filter((b) => b.booking_status === "pending"),
    upcoming: bookings.filter(
      (b) => b.booking_status === "approved" && b.check_out >= today,
    ),
    past: bookings.filter(
      (b) =>
        b.booking_status === "completed" ||
        (b.booking_status === "approved" && b.check_out < today),
    ),
    cancelled: bookings.filter(
      (b) => b.booking_status === "cancelled" || b.booking_status === "declined",
    ),
  };
}

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
          Your bookings are tied to your account, so you and the host can follow
          them in one place.
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

  const bookings = await getMyBookings();
  const groups = group(bookings);

  return (
    <div className="mx-auto max-w-[900px] page-gutter py-10">
      <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
        Trips
      </h1>
      <p className="mt-1 text-[15px] text-muted">
        {bookings.length > 0
          ? pluralize(bookings.length, "booking")
          : "Your bookings will appear here"}
      </p>

      {bookings.length === 0 ? (
        <div className="mx-auto max-w-md py-20 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
            <Briefcase aria-hidden="true" className="size-7 text-line-strong" />
          </span>
          <h2 className="mt-6 text-xl font-semibold text-ink">No trips yet</h2>
          <p className="mt-2 text-[15px] text-muted">
            Find somewhere you like, pick your dates and send a request.
          </p>
          <Link
            href="/homes"
            className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Start searching
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          <Section title="Pending requests" bookings={groups.pending} />
          <Section title="Upcoming trips" bookings={groups.upcoming} />
          <Section title="Past trips" bookings={groups.past} />
          <Section title="Cancelled and declined" bookings={groups.cancelled} />
        </div>
      )}
    </div>
  );
}

function Section({ title, bookings }: { title: string; bookings: GuestBooking[] }) {
  if (bookings.length === 0) return null;
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-ink">
        {title}{" "}
        <span className="text-sm font-normal text-muted">({bookings.length})</span>
      </h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <BookingRow key={booking.id} booking={booking} />
        ))}
      </ul>
    </section>
  );
}
