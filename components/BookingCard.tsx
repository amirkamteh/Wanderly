"use client";

import { Check, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { formatDateRange, formatGuests, formatPrice, nightsBetween } from "@/lib/formatters";
import { useDismiss } from "@/lib/hooks";
import { emptyDates, emptyGuests } from "@/lib/searchState";
import { cn, pluralize } from "@/lib/utils";
import type { DateRange, GuestCounts } from "@/types/user";
import DatePicker from "./DatePicker";
import GuestSelector from "./GuestSelector";
import Rating from "./Rating";

interface BookingCardProps {
  /** Nightly rate for stays, or the per-guest/group rate otherwise. */
  price: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  /** Stays get a nightly breakdown; the others quote a flat rate. */
  mode: "stay" | "flat";
  /** Copy for the flat rate, e.g. "per guest". */
  unitLabel?: string;
  cleaningFee?: number;
  serviceFeeRate?: number;
}

const DEFAULT_CLEANING_FEE = 150;
const DEFAULT_SERVICE_RATE = 0.12;

export default function BookingCard({
  price,
  rating,
  reviewCount,
  maxGuests,
  mode,
  unitLabel = "per guest",
  cleaningFee = DEFAULT_CLEANING_FEE,
  serviceFeeRate = DEFAULT_SERVICE_RATE,
}: BookingCardProps) {
  const [dates, setDates] = useState<DateRange>(emptyDates);
  const [guests, setGuests] = useState<GuestCounts>(emptyGuests);
  const [openPanel, setOpenPanel] = useState<"dates" | "guests" | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const panelRef = useDismiss<HTMLDivElement>(openPanel !== null, () => setOpenPanel(null));

  const nights = nightsBetween(dates.start, dates.end);
  const people = Math.max(guests.adults + guests.children, 1);

  const totals = useMemo(() => {
    const base = mode === "stay" ? price * (nights || 0) : price * people;
    const service = Math.round(base * serviceFeeRate);
    const cleaning = mode === "stay" && nights > 0 ? cleaningFee : 0;
    return { base, service, cleaning, total: base + service + cleaning };
  }, [mode, price, nights, people, serviceFeeRate, cleaningFee]);

  const canReserve = mode === "stay" ? nights > 0 : people > 0;

  return (
    <div className="rounded-2xl border border-line bg-white p-6 shadow-pill">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[22px] font-semibold text-ink">
          {formatPrice(price)}{" "}
          <span className="text-base font-normal text-muted">
            {mode === "stay" ? "night" : unitLabel}
          </span>
        </p>
        <Rating value={rating} reviewCount={reviewCount} variant="detail" className="text-sm" />
      </div>

      <div ref={panelRef} className="relative mt-4">
        <div className="overflow-hidden rounded-xl border border-line-strong">
          {mode === "stay" && (
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
          )}

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

      <button
        type="button"
        disabled={!canReserve}
        onClick={() => {
          setConfirmed(true);
          window.setTimeout(() => setConfirmed(false), 2600);
        }}
        className={cn(
          "mt-4 w-full rounded-xl px-6 py-3.5 text-base font-semibold transition",
          canReserve
            ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.99]"
            : "cursor-default bg-line text-subtle",
        )}
      >
        {mode === "stay" && nights === 0 ? "Check availability" : "Reserve"}
      </button>

      {confirmed && (
        <p
          role="status"
          className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-800"
        >
          <Check aria-hidden="true" className="size-4" />
          Held for you — this demo does not take payment.
        </p>
      )}

      {canReserve && (mode === "flat" || nights > 0) && (
        <>
          <p className="mt-4 text-center text-sm text-muted">You won&rsquo;t be charged yet</p>

          <dl className="mt-4 space-y-3 text-sm">
            <Row
              label={
                mode === "stay"
                  ? `${formatPrice(price)} × ${pluralize(nights, "night")}`
                  : `${formatPrice(price)} × ${pluralize(people, "guest")}`
              }
              value={formatPrice(totals.base)}
            />
            {totals.cleaning > 0 && (
              <Row label="Cleaning fee" value={formatPrice(totals.cleaning)} />
            )}
            <Row label="Service fee" value={formatPrice(totals.service)} />
          </dl>

          <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatPrice(totals.total)}</span>
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
