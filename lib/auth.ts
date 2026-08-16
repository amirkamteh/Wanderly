import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CurrentUser } from "@/lib/authState";

/**
 * The signed-in traveller, or null.
 *
 * Uses `getClaims()`, which verifies the JWT signature against the project's
 * published keys. `getSession()` must never be trusted on the server — it
 * reads a cookie that anyone can forge.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  if (error || !claims?.sub) return null;

  const email = typeof claims.email === "string" ? claims.email : "";

  // Names live in `profiles`, not in the JWT: user metadata is user-editable
  // and must never be treated as authoritative.
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", claims.sub)
    .maybeSingle();

  return {
    id: claims.sub,
    email,
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
  };
}
