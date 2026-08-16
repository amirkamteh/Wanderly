import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

/**
 * Refreshes the Supabase auth session on every matched request and writes the
 * rotated cookies onto the response.
 *
 * Wanderly is public by default — browsing, searching and submitting a booking
 * request all work signed out — so this deliberately does not redirect anyone.
 * Pages that need a user check for themselves.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Created per request on purpose: a shared client would leak one visitor's
  // session into another's response.
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not put code between createServerClient and getClaims(). Anything that
  // touches cookies in between can log users out at random.
  // getClaims() verifies the JWT signature, so its result is safe to trust.
  await supabase.auth.getClaims();

  // Must be returned as-is so the refreshed cookies survive.
  return supabaseResponse;
}
