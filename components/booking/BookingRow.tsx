import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Users } from "lucide-react";
import { formatDateRange, formatPrice } from "@/lib/formatters";
import type { GuestBooking } from "@/lib/queries";
import { cn, pluralize } from "@/lib/utils";

const STATUS_STYLES: Record<GuestBooking["booking_status"], string> = {
  pending: "bg-amber-50 text-amber-800",
  approved: "bg-brand-50 text-brand-800",
  declined: "bg-red-50 text-red-700",
  cancelled: "bg-surface text-muted",
  completed: "bg-surface text-ink",
};

const STATUS_LABELS: Record<GuestBooking["booking_status"], string> = {
  pending: "Pending",
  approved: "Approved",
  declined: "Declined",
  cancelled: "Cancelled",
  completed: "Completed",
};

/** One booking, shared by the traveller's Trips and the host's dashboard. */
export default function BookingRow({
  booking,
  children,
}: {
  booking: GuestBooking;
  /** Host actions, rendered under the details when present. */
  children?: React.ReactNode;
}) {
  return (
    <li className="rounded-2xl border border-line p-4 sm:p-5">
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface">
          {booking.image && (
            <Image src={booking.image} alt="" fill sizes="80px" className="object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <Link
                href={`/homes/${booking.property_id}`}
                className="text-[15px] font-semibold text-ink hover:underline"
              >
                {booking.propertyName}
              </Link>
              {booking.location && (
                <p className="text-sm text-muted">{booking.location}</p>
              )}
            </div>

            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                STATUS_STYLES[booking.booking_status],
              )}
            >
              {STATUS_LABELS[booking.booking_status]}
            </span>
          </div>

          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays aria-hidden="true" className="size-3.5" />
              {formatDateRange(booking.check_in, booking.check_out)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users aria-hidden="true" className="size-3.5" />
              {pluralize(booking.guests, "guest")}
            </span>
            <span>{pluralize(booking.nights, "night")}</span>
            <span className="font-semibold text-ink">{formatPrice(booking.total)}</span>
          </p>

          {booking.message && (
            <p className="mt-2 max-w-prose rounded-lg bg-surface px-3 py-2 text-sm text-muted">
              {booking.message}
            </p>
          )}

          {children}
        </div>
      </div>
    </li>
  );
}
