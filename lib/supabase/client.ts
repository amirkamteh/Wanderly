import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

/**
 * Supabase client for browser/client components.
 *
 * `createBrowserClient` is a singleton internally, so calling this repeatedly
 * is cheap. The publishable key is scoped to the `anon` role — row level
 * security decides what that role can actually read or write.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  );
}
