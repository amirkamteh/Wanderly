import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { formatLongDate, formatPrice } from "@/lib/formatters";
import { getBookingForGuest } from "@/lib/queries";
import { getCurrentUser } from "@/lib/auth";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Request sent",
  robots: { index: false, follow: false },
};

export default async function BookingSuccessPage(props: PageProps<"/booking/success">) {
  const params = await props.searchParams;
  const id = typeof params.id === "string" ? params.id : "";

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/trips");

  // RLS scopes this to the signed-in guest, so another id returns nothing.
  const booking = id ? await getBookingForGuest(id) : null;
  if (!booking) notFound();

  return (
    <div className="mx-auto max-w-[720px] page-gutter py-12">
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand-50">
          <CheckCircle2 aria-hidden="true" className="size-7 text-brand-600" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
          Request sent
        </h1>
        <p className="mt-2 text-[15px] text-muted">
          Your booking request has been sent to the host. They have 24 hours to
          reply, and you have not been charged.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 shadow-pill">
        <div className="flex gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface">
            {booking.image && (
              <Image src={booking.image} alt="" fill sizes="80px" className="object-cover" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-ink">{booking.propertyName}</p>
            <p className="mt-0.5 text-sm text-muted">{booking.location}</p>
            <span className="mt-2 inline-block rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
              Pending host approval
            </span>
          </div>
        </div>

        <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
          <Row
            label="Dates"
            value={`${formatLongDate(booking.check_in)} → ${formatLongDate(booking.check_out)}`}
          />
          <Row label="Guests" value={pluralize(booking.guests, "guest")} />
          <Row label="Total" value={formatPrice(booking.total)} emphasis />
          <Row label="Request ID" value={booking.id} mono />
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/trips"
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          View my trips
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-ink px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Back to Wanderly
        </Link>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  emphasis = false,
  mono = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd
        className={[
          "text-right",
          emphasis ? "font-semibold text-ink" : "text-ink",
          mono ? "font-mono text-xs" : "",
        ].join(" ")}
      >
        {value}
      </dd>
    </div>
  );
}
