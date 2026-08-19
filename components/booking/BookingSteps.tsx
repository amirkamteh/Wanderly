"use client";

import { Check, CreditCard, Lock, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createBooking } from "@/app/actions/bookings";
import {
  initialCreateBookingState,
  selectionToParams,
  type BookingSelection,
  type BookingStep,
} from "@/lib/bookingFlow";
import { formatLongDate, formatPrice } from "@/lib/formatters";
import type { PriceBreakdown } from "@/lib/pricing";
import { cn, pluralize } from "@/lib/utils";

interface BookingStepsProps {
  propertyId: string;
  propertyName: string;
  maxGuests: number;
  selection: BookingSelection;
  price: PriceBreakdown;
  /** Null when signed out — step one then becomes the blocking step. */
  userLabel: string | null;
  step: BookingStep;
}

/**
 * The three-step accordion. Exactly one step is open at a time; completed
 * steps collapse to a summary line with a tick, matching the reference UX.
 *
 * The current step lives in the URL, so the browser's back button walks back
 * through the flow and a refresh lands on the same place.
 */
export default function BookingSteps({
  propertyId,
  propertyName,
  maxGuests,
  selection,
  price,
  userLabel,
  step,
}: BookingStepsProps) {
  const router = useRouter();
  const [paymentReady, setPaymentReady] = useState(false);
  const [state, formAction] = useActionState(createBooking, initialCreateBookingState);

  const accountDone = Boolean(userLabel);
  // Step one must be done before the rest are reachable at all.
  const active: BookingStep = !accountDone ? "account" : step;

  function goTo(next: BookingStep) {
    const params = selectionToParams(selection, next);
    router.replace(`/booking/${propertyId}?${params.toString()}`, { scroll: false });
  }

  const loginHref = `/login?next=${encodeURIComponent(
    `/booking/${propertyId}?${selectionToParams(selection, "payment").toString()}`,
  )}`;
  const signupHref = loginHref.replace("/login?", "/signup?");

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------ 1. account */}
      <StepCard
        index={1}
        title="Log in or sign up"
        done={accountDone}
        open={active === "account"}
        summary={userLabel ?? undefined}
        onReopen={accountDone ? undefined : () => goTo("account")}
      >
        {accountDone ? (
          <div>
            <p className="text-sm text-muted">
              You are signed in as{" "}
              <span className="font-medium text-ink">{userLabel}</span>.
            </p>
            <button
              type="button"
              onClick={() => goTo("payment")}
              className="mt-4 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Continue
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted">
              Requests are tied to an account so you and the host can follow them.
              Your dates and guests are kept while you sign in.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={loginHref}
                className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Continue
              </Link>
              <Link
                href={signupHref}
                className="rounded-xl border border-ink px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
              >
                Create an account
              </Link>
            </div>
          </div>
        )}
      </StepCard>

      {/* ------------------------------------------------ 2. payment */}
      <StepCard
        index={2}
        title="Add a payment method"
        done={paymentReady}
        open={active === "payment"}
        locked={!accountDone}
        summary={paymentReady ? "Pay when the host approves" : undefined}
        onReopen={accountDone ? () => goTo("payment") : undefined}
      >
        <div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <p className="flex items-start gap-2.5 text-sm">
              <CreditCard aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink" />
              <span>
                <span className="block font-medium text-ink">
                  No card required to request
                </span>
                <span className="mt-1 block text-muted">
                  Wanderly asks the host first. No payment provider is connected to
                  this deployment, so no card is collected and nothing is charged —
                  card details would go straight to the provider and never touch
                  Wanderly&rsquo;s database.
                </span>
              </span>
            </p>
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs text-muted">
            <Lock aria-hidden="true" className="size-3.5" />
            You won&rsquo;t be charged yet.
          </p>

          <button
            type="button"
            onClick={() => {
              setPaymentReady(true);
              goTo("review");
            }}
            className="mt-4 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Continue
          </button>
        </div>
      </StepCard>

      {/* ------------------------------------------------- 3. review */}
      <StepCard
        index={3}
        title="Review your request"
        done={false}
        open={active === "review"}
        locked={!accountDone}
        onReopen={accountDone ? () => goTo("review") : undefined}
      >
        <form action={formAction}>
          <input type="hidden" name="propertyId" value={propertyId} />
          <input type="hidden" name="checkIn" value={selection.checkIn ?? ""} />
          <input type="hidden" name="checkOut" value={selection.checkOut ?? ""} />
          <input type="hidden" name="guests" value={selection.guests} />
          <input type="hidden" name="message" value={selection.message} />

          <dl className="space-y-3 text-sm">
            <ReviewRow label="Property" value={propertyName} />
            <ReviewRow
              label="Dates"
              value={
                selection.checkIn && selection.checkOut
                  ? `${formatLongDate(selection.checkIn)} → ${formatLongDate(selection.checkOut)}`
                  : "Not selected"
              }
            />
            <ReviewRow
              label="Guests"
              value={`${pluralize(selection.guests, "guest")} (sleeps ${maxGuests})`}
            />
            <ReviewRow label="Total" value={formatPrice(price.total)} emphasis />
          </dl>

          {selection.message && (
            <p className="mt-4 rounded-xl border border-line bg-surface p-3 text-sm text-muted">
              <span className="block font-medium text-ink">Your message</span>
              {selection.message}
            </p>
          )}

          {state.status === "error" && (
            <p
              role="alert"
              className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <span>
                {state.message}
                {state.unavailable && (
                  <Link
                    href={`/homes/${propertyId}`}
                    className="mt-1 block font-semibold underline underline-offset-2"
                  >
                    Choose different dates
                  </Link>
                )}
              </span>
            </p>
          )}

          <p className="mt-4 text-xs text-muted">
            The host has 24 hours to reply. You won&rsquo;t be charged yet.
          </p>

          <SubmitButton />
        </form>
      </StepCard>
    </div>
  );
}

/** Disabled while the action runs, which also blocks double submission. */
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "mt-4 w-full rounded-xl px-6 py-3.5 text-base font-semibold text-white transition sm:w-auto",
        pending
          ? "cursor-wait bg-brand-400"
          : "bg-brand-600 hover:bg-brand-700 active:scale-[0.99]",
      )}
    >
      {pending ? "Sending request…" : "Request to book"}
    </button>
  );
}

function StepCard({
  index,
  title,
  done,
  open,
  locked = false,
  summary,
  onReopen,
  children,
}: {
  index: number;
  title: string;
  done: boolean;
  open: boolean;
  locked?: boolean;
  summary?: string;
  onReopen?: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      aria-current={open ? "step" : undefined}
      className={cn(
        "rounded-2xl border bg-white transition",
        open ? "border-ink shadow-pill" : "border-line",
        locked && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between gap-4 p-5">
        <h2 className="flex items-center gap-3 text-[17px] font-semibold text-ink">
          <span
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              done
                ? "bg-brand-600 text-white"
                : open
                  ? "bg-ink text-white"
                  : "bg-surface text-muted",
            )}
          >
            {done ? <Check aria-hidden="true" className="size-3.5" /> : index}
          </span>
          {title}
        </h2>

        {!open && !locked && onReopen && (
          <button
            type="button"
            onClick={onReopen}
            className="shrink-0 text-sm font-semibold text-ink underline underline-offset-2"
          >
            {done ? "Change" : "Open"}
          </button>
        )}
      </div>

      {!open && summary && (
        <p className="px-5 pb-5 -mt-2 text-sm text-muted">{summary}</p>
      )}

      {open && <div className="border-t border-line p-5">{children}</div>}
    </section>
  );
}

function ReviewRow({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("text-right", emphasis ? "font-semibold text-ink" : "text-ink")}>
        {value}
      </dd>
    </div>
  );
}
