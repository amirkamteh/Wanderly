"use server";

import type { BookingFormState } from "@/lib/bookingState";
import { createClient } from "@/lib/supabase/server";
import type { ListingKind } from "@/types/listing";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KINDS: ListingKind[] = ["home", "experience", "service"];

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Records an enquiry against a listing.
 *
 * No authentication: anyone may submit. Everything is re-validated here
 * because client-side checks are only a convenience — the database has its own
 * constraints as the final backstop.
 */
export async function submitBookingRequest(
  _previous: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const listingKind = asString(formData.get("listingKind")) as ListingKind;
  const listingId = asString(formData.get("listingId"));
  const fullName = asString(formData.get("fullName"));
  const email = asString(formData.get("email"));
  const message = asString(formData.get("message"));
  const checkIn = asString(formData.get("checkIn"));
  const checkOut = asString(formData.get("checkOut"));
  const guests = Number(asString(formData.get("guests")) || "1");
  const totalPrice = Number(asString(formData.get("totalPrice")) || "0");

  const errors: BookingFormState["errors"] = {};

  if (!fullName || fullName.length > 120) {
    errors.fullName = "Enter your name (up to 120 characters)";
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    errors.email = "Enter a valid email address";
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 30) {
    errors.guests = "Choose between 1 and 30 guests";
  }
  if (checkIn && checkOut && checkOut <= checkIn) {
    errors.dates = "Checkout must be after check-in";
  }

  // A bad listing reference means a tampered form, not a user mistake.
  if (!listingId || !KINDS.includes(listingKind)) {
    return {
      status: "error",
      message: "That listing could not be identified. Please reload and try again.",
      errors: {},
    };
  }

  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors };
  }

  const supabase = await createClient();

  // Attach the request to the account when there is one, so it shows up under
  // Trips. Anonymous submissions stay supported and simply have no owner.
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ?? null;

  const { error } = await supabase.from("booking_requests").insert({
    user_id: userId,
    listing_kind: listingKind,
    listing_id: listingId,
    full_name: fullName,
    email,
    message: message || null,
    check_in: checkIn || null,
    check_out: checkOut || null,
    guests,
    total_price: Number.isFinite(totalPrice) && totalPrice > 0 ? totalPrice : null,
  });

  if (error) {
    console.error("booking request insert failed", error);
    return {
      status: "error",
      message: "We could not save your request. Please try again in a moment.",
      errors: {},
    };
  }

  return {
    status: "success",
    message: `Thanks ${fullName.split(" ")[0]} — your request is in. The host will reply to ${email}.`,
    errors: {},
  };
}
