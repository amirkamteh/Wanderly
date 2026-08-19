import { Inbox, LogIn } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import BookingRow from "@/components/booking/BookingRow";
import HostActions from "@/components/booking/HostActions";
import { getCurrentUser } from "@/lib/auth";
import { getHostBookings, type HostBooking } from "@/lib/queries";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Booking requests",
  description: "Requests for the properties you host on Wanderly.",
  robots: { index: false, follow: false },
};

export default async function HostBookingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
          <LogIn aria-hidden="true" className="size-7 text-line-strong" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-ink">Log in to manage requests</h1>
        <Link
          href="/login?next=/host/bookings"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Log in
        </Link>
      </div>
    );
  }

  // Returns nothing unless the account owns a host profile — enforced by RLS.
  const bookings = await getHostBookings();
  const pending = bookings.filter((b) => b.booking_status === "pending");
  const decided = bookings.filter((b) => b.booking_status !== "pending");

  return (
    <div className="mx-auto max-w-[900px] page-gutter py-10">
      <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
        Booking requests
      </h1>
      <p className="mt-1 text-[15px] text-muted">
        {bookings.length > 0
          ? `${pluralize(pending.length, "request")} awaiting your reply`
          : "Requests for your properties will appear here"}
      </p>

      {bookings.length === 0 ? (
        <div className="mx-auto max-w-md py-20 text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
            <Inbox aria-hidden="true" className="size-7 text-line-strong" />
          </span>
          <h2 className="mt-6 text-xl font-semibold text-ink">Nothing here yet</h2>
          <p className="mt-2 text-[15px] text-muted">
            This page lists requests for properties your account hosts. If you
            expected to see something, your account may not be linked to a host
            profile yet.
          </p>
          <Link
            href="/host"
            className="mt-6 inline-block rounded-xl border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
          >
            About hosting
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          <Section title="Pending" bookings={pending} actionable />
          <Section title="Decided" bookings={decided} />
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  bookings,
  actionable = false,
}: {
  title: string;
  bookings: HostBooking[];
  actionable?: boolean;
}) {
  if (bookings.length === 0) return null;
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-ink">
        {title} <span className="text-sm font-normal text-muted">({bookings.length})</span>
      </h2>
      <ul className="space-y-4">
        {bookings.map((booking) => (
          <BookingRow key={booking.id} booking={booking}>
            <p className="mt-2 text-sm text-muted">
              Requested by <span className="font-medium text-ink">{booking.guestName}</span>{" "}
              on {new Date(booking.created_at).toLocaleDateString("en-GB")}
            </p>
            {actionable && <HostActions bookingId={booking.id} />}
          </BookingRow>
        ))}
      </ul>
    </section>
  );
}
