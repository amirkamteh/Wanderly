import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import BookingSteps from "@/components/booking/BookingSteps";
import PropertySummary from "@/components/booking/PropertySummary";
import { getCurrentUser } from "@/lib/auth";
import {
  isBookingStep,
  selectionFromParams,
  selectionToParams,
} from "@/lib/bookingFlow";
import { calculateStayPrice } from "@/lib/pricing";
import { getHomeById } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Request to book",
  robots: { index: false, follow: false },
};

/**
 * The booking flow.
 *
 * Everything the traveller chose on the listing page travels in the query
 * string, which is what makes refresh, the back button and the round trip
 * through login all non-destructive.
 */
export default async function BookingPage(props: PageProps<"/booking/[propertyId]">) {
  const { propertyId } = await props.params;
  const raw = await props.searchParams;

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  const [home, user] = await Promise.all([getHomeById(propertyId), getCurrentUser()]);
  if (!home) notFound();

  const selection = selectionFromParams(params);

  // Without dates there is nothing to price or book — send them back to pick.
  if (!selection.checkIn || !selection.checkOut) {
    redirect(`/homes/${propertyId}`);
  }

  const price = calculateStayPrice(home.price, selection.checkIn, selection.checkOut);
  const stepParam = params.get("step");
  const step = isBookingStep(stepParam) ? stepParam : user ? "payment" : "account";

  const userLabel = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : null;

  const backHref = `/homes/${propertyId}?${selectionToParams(selection).toString()}`;

  return (
    <div className="mx-auto max-w-[1120px] page-gutter py-6 sm:py-10">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          aria-label="Back to the listing"
          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-ink transition hover:bg-surface"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </Link>
        <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
          Request to book
        </h1>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12">
        <div className="order-2 min-w-0 lg:order-1">
          <BookingSteps
            propertyId={home.id}
            propertyName={home.name}
            maxGuests={home.guests}
            selection={selection}
            price={price}
            userLabel={userLabel}
            step={step}
          />
        </div>

        {/* Summary leads on mobile, sits alongside and sticks on desktop. */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-24 lg:h-fit">
          <PropertySummary
            home={home}
            checkIn={selection.checkIn}
            checkOut={selection.checkOut}
            guests={selection.guests}
            price={price}
          />
        </aside>
      </div>
    </div>
  );
}
