/**
 * Shape of the booking form's action state.
 *
 * This lives outside `app/actions/booking.ts` because a `"use server"` module
 * may only export async functions — exporting a plain object from one leaves
 * it `undefined` on the client.
 */
export interface BookingFormState {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level messages, keyed by input name. */
  errors: Partial<Record<"fullName" | "email" | "guests" | "dates", string>>;
}

export const initialBookingState: BookingFormState = {
  status: "idle",
  message: "",
  errors: {},
};
