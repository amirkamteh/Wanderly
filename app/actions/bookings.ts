"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CreateBookingState, HostActionState } from "@/lib/bookingFlow";
import { calculateStayPrice } from "@/lib/pricing";
import { createClient } from "@/lib/supabase/server";

/** Postgres error codes we translate into human messages. */
const EXCLUSION_VIOLATION = "23P01";

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

/**
 * Creates a booking request.
 *
 * Nothing the browser sends about money, ownership or availability is trusted:
 * the guest comes from the verified session, the nightly rate and host come
 * from the listing row, the totals are recomputed here, and the overlap check
 * is backed by an exclusion constraint in Postgres.
 */
export async function createBooking(
  _previous: CreateBookingState,
  formData: FormData,
): Promise<CreateBookingState> {
  const propertyId = asString(formData.get("propertyId"));
  const checkIn = asString(formData.get("checkIn"));
  const checkOut = asString(formData.get("checkOut"));
  const message = asString(formData.get("message")).slice(0, 2000);
  const guests = Number(asString(formData.get("guests")) || "1");

  const supabase = await createClient();

  // 1. Identity comes from the session, never from the form.
  const { data: claimsData } = await supabase.auth.getClaims();
  const guestId = claimsData?.claims?.sub;
  if (!guestId) {
    return {
      status: "error",
      message: "Please log in again — your session has expired.",
    };
  }

  // 2. Dates.
  if (!isIsoDate(checkIn) || !isIsoDate(checkOut)) {
    return { status: "error", message: "Choose a check-in and checkout date." };
  }
  if (checkOut <= checkIn) {
    return { status: "error", message: "Checkout must be after check-in." };
  }
  const today = new Date().toISOString().slice(0, 10);
  if (checkIn < today) {
    return { status: "error", message: "Check-in cannot be in the past." };
  }

  // 3. The property, and the figures that come with it.
  const { data: property, error: propertyError } = await supabase
    .from("homes")
    .select("id, host_id, price, guests")
    .eq("id", propertyId)
    .maybeSingle();

  if (propertyError || !property) {
    return { status: "error", message: "That property could not be found." };
  }

  // 4. Guests, bounded by what the listing actually sleeps.
  if (!Number.isInteger(guests) || guests < 1) {
    return { status: "error", message: "Choose at least one guest." };
  }
  if (guests > property.guests) {
    return {
      status: "error",
      message: `This place sleeps ${property.guests}. Reduce the number of guests.`,
    };
  }

  // 5. Availability. The exclusion constraint is the real guarantee; this
  //    check exists to produce a friendly message instead of a raw conflict.
  const { data: clashes, error: clashError } = await supabase
    .from("bookings")
    .select("id")
    .eq("property_id", propertyId)
    .eq("booking_status", "approved")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn)
    .limit(1);

  if (clashError) {
    console.error("availability check failed", clashError);
    return { status: "error", message: "We could not check availability. Try again." };
  }
  if (clashes && clashes.length > 0) {
    return {
      status: "error",
      message: "These dates are no longer available.",
      unavailable: true,
    };
  }

  // 6. Money is recomputed from the stored nightly rate.
  const price = calculateStayPrice(Number(property.price), checkIn, checkOut);

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      property_id: property.id,
      guest_id: guestId,
      host_id: property.host_id,
      check_in: checkIn,
      check_out: checkOut,
      guests,
      nights: price.nights,
      price_per_night: price.pricePerNight,
      accommodation_total: price.accommodationTotal,
      cleaning_fee: price.cleaningFee,
      service_fee: price.serviceFee,
      tax: price.tax,
      total: price.total,
      currency: price.currency,
      message: message || null,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === EXCLUSION_VIOLATION) {
      return {
        status: "error",
        message: "These dates are no longer available.",
        unavailable: true,
      };
    }
    console.error("booking insert failed", error);
    return { status: "error", message: "We could not send your request. Try again." };
  }

  revalidatePath("/trips");
  redirect(`/booking/success?id=${booking.id}`);
}

/** Guest-initiated cancellation. The database enforces who may do this. */
export async function cancelBooking(
  _previous: HostActionState,
  formData: FormData,
): Promise<HostActionState> {
  const bookingId = asString(formData.get("bookingId"));
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ booking_status: "cancelled" })
    .eq("id", bookingId);

  if (error) {
    console.error("cancel failed", error);
    return { status: "error", message: "That booking could not be cancelled." };
  }

  revalidatePath("/trips");
  return { status: "idle", message: "" };
}

/**
 * Host approves or declines a request.
 *
 * Authorisation is not checked here: RLS limits the update to bookings on
 * properties the caller's host profile owns, and a trigger rejects any
 * transition the caller is not entitled to make.
 */
export async function respondToBooking(
  _previous: HostActionState,
  formData: FormData,
): Promise<HostActionState> {
  const bookingId = asString(formData.get("bookingId"));
  const decision = asString(formData.get("decision"));

  if (decision !== "approved" && decision !== "declined") {
    return { status: "error", message: "Unknown action." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("bookings")
    .update({ booking_status: decision })
    .eq("id", bookingId);

  if (error) {
    if (error.code === EXCLUSION_VIOLATION) {
      return {
        status: "error",
        message:
          "Another booking is already approved for those dates, so this one cannot be.",
      };
    }
    console.error("host response failed", error);
    return { status: "error", message: "That request could not be updated." };
  }

  revalidatePath("/host/bookings");
  return { status: "idle", message: "" };
}
