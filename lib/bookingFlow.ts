/**
 * Shape of the booking flow's selection and action state.
 *
 * Kept out of the `"use server"` modules because those may only export async
 * functions — a plain object exported from one arrives `undefined` on the
 * client.
 */

export interface BookingSelection {
  checkIn: string | null;
  checkOut: string | null;
  guests: number;
  message: string;
}

export interface CreateBookingState {
  status: "idle" | "error";
  message: string;
  /** Set when the dates were taken while the traveller was deciding. */
  unavailable?: boolean;
}

export const initialCreateBookingState: CreateBookingState = {
  status: "idle",
  message: "",
};

export interface HostActionState {
  status: "idle" | "error";
  message: string;
}

export const initialHostActionState: HostActionState = {
  status: "idle",
  message: "",
};

export type BookingStep = "account" | "payment" | "review";

/**
 * The flow's selection lives in the query string rather than in memory, so a
 * refresh, the back button, and the round trip through login all preserve it.
 */
export function selectionToParams(
  selection: BookingSelection,
  step?: BookingStep,
): URLSearchParams {
  const params = new URLSearchParams();
  if (selection.checkIn) params.set("checkIn", selection.checkIn);
  if (selection.checkOut) params.set("checkOut", selection.checkOut);
  if (selection.guests > 0) params.set("guests", String(selection.guests));
  if (selection.message) params.set("message", selection.message);
  if (step) params.set("step", step);
  return params;
}

export function selectionFromParams(params: URLSearchParams): BookingSelection {
  const guests = Number(params.get("guests") ?? "1");
  return {
    checkIn: params.get("checkIn"),
    checkOut: params.get("checkOut"),
    guests: Number.isInteger(guests) && guests > 0 ? Math.min(guests, 30) : 1,
    message: (params.get("message") ?? "").slice(0, 2000),
  };
}

export function isBookingStep(value: string | null): value is BookingStep {
  return value === "account" || value === "payment" || value === "review";
}
