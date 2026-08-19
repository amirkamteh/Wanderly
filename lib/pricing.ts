import { nightsBetween } from "./utils";

/**
 * The single source of truth for what a stay costs.
 *
 * Both the browser and the server call this. The browser's result is only ever
 * a preview — `createBooking` recomputes from the price stored in Postgres and
 * ignores whatever the form submitted, and the `bookings_totals_consistent`
 * check constraint rejects any row whose figures do not add up.
 */

export const PRICING = {
  /** Flat per-stay cleaning fee, in AED. */
  cleaningFee: 150,
  /** Share of the accommodation subtotal taken as a service fee. */
  serviceFeeRate: 0.12,
  /** Tourism tax applied to accommodation plus cleaning. */
  taxRate: 0.05,
  currency: "AED",
} as const;

export interface PriceBreakdown {
  nights: number;
  pricePerNight: number;
  accommodationTotal: number;
  cleaningFee: number;
  serviceFee: number;
  tax: number;
  total: number;
  currency: string;
}

/**
 * Rounds to whole dirhams.
 *
 * Every price in Wanderly is displayed as a whole number (`formatPrice` rounds
 * for display), so the stored figures round the same way. Keeping fractions
 * here instead would make the line items visibly fail to add up: a 177.60
 * service fee and an 81.50 tax display as 178 and 82, so the rows would sum to
 * one dirham more than the total.
 *
 * Rounding at every step also keeps JS and Postgres in agreement, which is
 * what the `bookings_totals_consistent` check constraint requires.
 */
function money(value: number): number {
  return Math.round(value);
}

/** Computes the full breakdown for a stay. */
export function calculateStayPrice(
  pricePerNight: number,
  checkIn: string | null,
  checkOut: string | null,
): PriceBreakdown {
  const nights = nightsBetween(checkIn, checkOut);
  const accommodationTotal = money(pricePerNight * nights);

  // No nights means nothing is owed yet — do not levy fees on an empty stay.
  if (nights <= 0) {
    return {
      nights: 0,
      pricePerNight,
      accommodationTotal: 0,
      cleaningFee: 0,
      serviceFee: 0,
      tax: 0,
      total: 0,
      currency: PRICING.currency,
    };
  }

  const cleaningFee = money(PRICING.cleaningFee);
  const serviceFee = money(accommodationTotal * PRICING.serviceFeeRate);
  const tax = money((accommodationTotal + cleaningFee) * PRICING.taxRate);
  const total = money(accommodationTotal + cleaningFee + serviceFee + tax);

  return {
    nights,
    pricePerNight: money(pricePerNight),
    accommodationTotal,
    cleaningFee,
    serviceFee,
    tax,
    total,
    currency: PRICING.currency,
  };
}
