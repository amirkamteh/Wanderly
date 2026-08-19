"use client";

import { ChevronDown, TriangleAlert } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { selectionToParams } from "@/lib/bookingFlow";
import { formatDateRange, formatGuests, formatPrice } from "@/lib/formatters";
import { useDismiss } from "@/lib/hooks";
import { calculateStayPrice } from "@/lib/pricing";
import { emptyGuests } from "@/lib/searchState";
import { cn, pluralize } from "@/lib/utils";
import type { DateRange, GuestCounts } from "@/types/user";
import DatePicker from "./DatePicker";
import GuestSelector from "./GuestSelector";
import Rating from "./Rating";

interface StayBookingCardProps {
  propertyId: string;
  price: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
}

/**
 * Booking card for stays. It collects dates, guests and an optional message,
 * then hands off to the multi-step flow at `/booking/[propertyId]` — it does
 * not create anything itself.
 *
 * Any selection already in the URL is restored, so returning from the flow
 * (or the back button) lands on the same choices.
 */
export default function StayBookingCard({
  propertyId,
  price,
  rating,
  reviewCount,
  maxGuests,
}: StayBookingCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dates, setDates] = useState<DateRange>({
    start: searchParams.get("checkIn"),
    end: searchParams.get("checkOut"),
  });
  const [guests, setGuests] = useState<GuestCounts>(() => {
    const fromUrl = Number(searchParams.get("guests") ?? "0");
    return Number.isInteger(fromUrl) && fromUrl > 0
      ? { ...emptyGuests, adults: Math.min(fromUrl, maxGuests) }
      : emptyGuests;
  });
  const [message, setMessage] = useState(searchParams.get("message") ?? "");
  const [openPanel, setOpenPanel] = useState<"dates" | "guests" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const panelRef = useDismiss<HTMLDivElement>(openPanel !== null, () => setOpenPanel(null));

  const breakdown = useMemo(
    () => calculateStayPrice(price, dates.start, dates.end),
    [price, dates.start, dates.end],
  );

  const people = Math.max(guests.adults + guests.children, 1);
  const hasDates = breakdown.nights > 0;

  function requestToBook() {
    // Mirrors the server's checks so the traveller is told here rather than
    // after a round trip; the server validates again regardless.
    if (!dates.start || !dates.end) {
      setError("Choose your check-in and checkout dates.");
      setOpenPanel("dates");
      return;
    }
    if (dates.end <= dates.start) {
      setError("Checkout must be after check-in.");
      setOpenPanel("dates");
      return;
    }
    if (people < 1) {
      setError("Add at least one guest.");
      setOpenPanel("guests");
      return;
    }
    if (people > maxGuests) {
      setError(`This place sleeps ${maxGuests}. Reduce the number of guests.`);
      setOpenPanel("guests");
      return;
    }

    setError(null);
    const params = selectionToParams(
      { checkIn: dates.start, checkOut: dates.end, guests: people, message },
      "account",
    );
    router.push(`/booking/${propertyId}?${params.toString()}`);
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-pill">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[22px] font-semibold text-ink">
          {formatPrice(price)} <span className="text-base font-normal text-muted">night</span>
        </p>
        <Rating value={rating} reviewCount={reviewCount} variant="detail" className="text-sm" />
      </div>

      <div ref={panelRef} className="relative mt-4">
        <div className="overflow-hidden rounded-xl border border-line-strong">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === "dates" ? null : "dates")}
            aria-expanded={openPanel === "dates"}
            className="grid w-full grid-cols-2 divide-x divide-line-strong border-b border-line-strong text-left"
          >
            <span className="px-3 py-2.5">
              <span className="block text-[10px] font-semibold tracking-wide text-ink uppercase">
                Check-in
              </span>
              <span className={cn("block text-sm", dates.start ? "text-ink" : "text-subtle")}>
                {dates.start ? formatDateRange(dates.start, null) : "Add date"}
              </span>
            </span>
            <span className="px-3 py-2.5">
              <span className="block text-[10px] font-semibold tracking-wide text-ink uppercase">
                Checkout
              </span>
              <span className={cn("block text-sm", dates.end ? "text-ink" : "text-subtle")}>
                {dates.end ? formatDateRange(dates.end, null) : "Add date"}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === "guests" ? null : "guests")}
            aria-expanded={openPanel === "guests"}
            className="flex w-full items-center justify-between px-3 py-2.5 text-left"
          >
            <span>
              <span className="block text-[10px] font-semibold tracking-wide text-ink uppercase">
                Guests
              </span>
              <span className="block text-sm text-ink">
                {formatGuests(guests) || "1 guest"}
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className={cn(
                "size-4 text-ink transition-transform",
                openPanel === "guests" && "rotate-180",
              )}
            />
          </button>
        </div>

        {openPanel === "dates" && (
          <div className="absolute top-[calc(100%+8px)] right-0 z-30 w-[min(680px,90vw)] animate-pop-in rounded-2xl border border-line bg-white p-5 shadow-pop">
            <DatePicker value={dates} onChange={setDates} months={2} />
          </div>
        )}

        {openPanel === "guests" && (
          <div className="absolute top-[calc(100%+8px)] right-0 z-30 w-full min-w-[320px] animate-pop-in rounded-2xl border border-line bg-white p-5 shadow-pop">
            <GuestSelector value={guests} onChange={setGuests} maxGuests={maxGuests} />
          </div>
        )}
      </div>

      <div className="mt-3">
        <label htmlFor="stay-message" className="mb-1.5 block text-sm font-medium text-ink">
          Message <span className="font-normal text-muted">(optional)</span>
        </label>
        <textarea
          id="stay-message"
          value={message}
          onChange={(event) => setMessage(event.target.value.slice(0, 2000))}
          rows={2}
          placeholder="Tell the host about your trip"
          className="w-full rounded-xl border border-line-strong px-3.5 py-2.5 text-[15px] outline-none transition focus:border-ink placeholder:text-subtle"
        />
      </div>

      <button
        type="button"
        onClick={requestToBook}
        className="mt-3 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700 active:scale-[0.99]"
      >
        {hasDates ? "Request to book" : "Check availability"}
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      <p className="mt-4 text-center text-sm text-muted">You won&rsquo;t be charged yet</p>

      {hasDates && (
        <>
          <dl className="mt-4 space-y-3 text-sm">
            <Row
              label={`${formatPrice(price)} × ${pluralize(breakdown.nights, "night")}`}
              value={formatPrice(breakdown.accommodationTotal)}
            />
            <Row label="Cleaning fee" value={formatPrice(breakdown.cleaningFee)} />
            <Row label="Service fee" value={formatPrice(breakdown.serviceFee)} />
            <Row label="Taxes" value={formatPrice(breakdown.tax)} />
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(breakdown.total)}</span>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted underline decoration-line underline-offset-4">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
