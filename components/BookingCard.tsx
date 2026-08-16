"use client";

import { Check, ChevronDown, TriangleAlert } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitBookingRequest } from "@/app/actions/booking";
import { initialBookingState } from "@/lib/bookingState";
import { formatDateRange, formatGuests, formatPrice, nightsBetween } from "@/lib/formatters";
import { useDismiss } from "@/lib/hooks";
import { emptyDates, emptyGuests } from "@/lib/searchState";
import { cn, pluralize } from "@/lib/utils";
import type { ListingKind } from "@/types/listing";
import type { DateRange, GuestCounts } from "@/types/user";
import DatePicker from "./DatePicker";
import GuestSelector from "./GuestSelector";
import Rating from "./Rating";

interface BookingCardProps {
  /** Identifies the listing the enquiry is recorded against. */
  listingId: string;
  listingKind: ListingKind;
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
  listingId,
  listingKind,
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
  const [showDetails, setShowDetails] = useState(false);
  const [state, formAction] = useActionState(submitBookingRequest, initialBookingState);

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

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-line bg-white p-6 shadow-pill">
        <p className="flex items-start gap-3 rounded-xl bg-brand-50 p-4 text-sm text-brand-800">
          <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span role="status">{state.message}</span>
        </p>
        <p className="mt-4 text-sm text-muted">
          Nothing has been charged — this build records the request only.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="rounded-2xl border border-line bg-white p-6 shadow-pill">
      <input type="hidden" name="listingId" value={listingId} />
      <input type="hidden" name="listingKind" value={listingKind} />
      <input type="hidden" name="checkIn" value={dates.start ?? ""} />
      <input type="hidden" name="checkOut" value={dates.end ?? ""} />
      <input type="hidden" name="guests" value={people} />
      <input type="hidden" name="totalPrice" value={canReserve ? totals.total : 0} />

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

      {/* Contact fields appear once the traveller commits to enquiring. */}
      {showDetails ? (
        <fieldset className="mt-4 space-y-3">
          <legend className="sr-only">Your details</legend>

          <Field
            id="fullName"
            label="Full name"
            autoComplete="name"
            required
            error={state.errors.fullName}
          />
          <Field
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            error={state.errors.email}
          />

          <div>
            <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
              Message <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              maxLength={2000}
              placeholder="Tell the host about your trip"
              className="w-full rounded-xl border border-line-strong px-3.5 py-2.5 text-[15px] outline-none transition focus:border-ink placeholder:text-subtle"
            />
          </div>

          {(state.errors.guests || state.errors.dates) && (
            <p role="alert" className="text-xs text-red-600">
              {state.errors.guests ?? state.errors.dates}
            </p>
          )}

          <SubmitButton />
        </fieldset>
      ) : (
        <button
          type="button"
          disabled={!canReserve}
          onClick={() => setShowDetails(true)}
          className={cn(
            "mt-4 w-full rounded-xl px-6 py-3.5 text-base font-semibold transition",
            canReserve
              ? "bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.99]"
              : "cursor-default bg-line text-subtle",
          )}
        >
          {mode === "stay" && nights === 0 ? "Check availability" : "Reserve"}
        </button>
      )}

      {state.status === "error" && (
        <p
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {state.message}
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
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full rounded-xl px-6 py-3.5 text-base font-semibold transition",
        pending
          ? "cursor-wait bg-brand-400 text-white"
          : "bg-brand-600 text-white hover:bg-brand-700 active:scale-[0.99]",
      )}
    >
      {pending ? "Sending…" : "Request to book"}
    </button>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  required,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-xl border px-3.5 py-2.5 text-[15px] outline-none transition focus:border-ink",
          error ? "border-red-500" : "border-line-strong",
        )}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
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
