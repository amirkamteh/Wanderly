import type { GuestCounts } from "@/types/user";
import { nightsBetween, pluralize } from "./utils";

export const CURRENCY = "AED";

const numberFormatter = new Intl.NumberFormat("en-AE");

/** `1480` → `"AED 1,480"`. */
export function formatPrice(amount: number): string {
  return `${CURRENCY} ${numberFormatter.format(Math.round(amount))}`;
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Card meta line for homes: `"AED 1,480 · 2 nights"`. */
export function formatStayPrice(price: number, nights: number): string {
  return `${formatPrice(price * nights)} · ${pluralize(nights, "night")}`;
}

/**
 * Card meta line for experiences and services: `"From AED 149/guest"`.
 * The slash is unspaced so price, unit and rating still fit on one card line.
 */
export function formatFromPrice(price: number, unit: "guest" | "group"): string {
  return `From ${formatPrice(price)}/${unit}`;
}

/**
 * Ratings show at least one decimal and at most two, with trailing zeros
 * trimmed: `5 → "5.0"`, `4.9 → "4.9"`, `4.97 → "4.97"`, `4.90 → "4.9"`.
 */
export function formatRating(rating: number): string {
  const twoDecimals = rating.toFixed(2);
  return twoDecimals.endsWith("0") ? rating.toFixed(1) : twoDecimals;
}

/** `"2026-08-12"` → `"12 Aug"`. */
export function formatShortDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

/** `"2026-08-12"` → `"12 August 2026"`. */
export function formatLongDate(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Compact range for the search pill: `"12 – 16 Aug"`. */
export function formatDateRange(start: string | null, end: string | null): string {
  if (!start && !end) return "";
  if (start && !end) return formatShortDate(start);
  if (!start && end) return formatShortDate(end);
  return `${formatShortDate(start)} – ${formatShortDate(end)}`;
}

export function totalGuests(guests: GuestCounts): number {
  return guests.adults + guests.children;
}

/** `"3 guests, 1 infant"` — infants and pets are listed separately. */
export function formatGuests(guests: GuestCounts): string {
  const parts: string[] = [];
  const people = totalGuests(guests);
  if (people > 0) parts.push(pluralize(people, "guest"));
  if (guests.infants > 0) parts.push(pluralize(guests.infants, "infant"));
  if (guests.pets > 0) parts.push(pluralize(guests.pets, "pet"));
  return parts.join(", ");
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} minutes`;
  const whole = Math.floor(hours);
  const minutes = Math.round((hours - whole) * 60);
  return minutes ? `${whole}.${minutes === 30 ? "5" : minutes} hours` : pluralize(whole, "hour");
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? pluralize(hours, "hour") : `${hours.toFixed(1)} hours`;
}

export { nightsBetween };
