/**
 * Verifies the row level security model from the outside, using the same
 * publishable key the browser gets.
 *
 * Run with:  npm run db:check
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

let failures = 0;

function report(label: string, passed: boolean, detail = "") {
  console.log(`${passed ? "  PASS" : "  FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!passed) failures += 1;
}

async function main() {
  console.log("Checking RLS as the anon role…\n");

  // Catalogue: readable.
  for (const table of ["homes", "experiences", "services", "reviews", "hosts"] as const) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    report(`read ${table}`, !error && (count ?? 0) > 0, error?.message ?? `${count} rows`);
  }

  // Catalogue: not writable.
  const { error: writeError } = await supabase
    .from("homes")
    .insert({
      id: "rls-probe",
      title: "probe",
      name: "probe",
      property_type: "Apartment",
      city: "Nowhere",
      area: "Nowhere",
      country: "Nowhere",
      price: 1,
      rating: 5,
      description: "probe",
      host_id: "host-home-001",
      guests: 1,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1,
      lat: 0,
      lng: 0,
    });
  report("catalogue write is blocked", Boolean(writeError), writeError?.message);

  // Submissions: insertable.
  const { error: insertError } = await supabase.from("booking_requests").insert({
    listing_kind: "home",
    listing_id: "home-001",
    full_name: "RLS Probe",
    email: "probe@example.com",
    guests: 1,
  });
  report("booking request insert allowed", !insertError, insertError?.message);

  // Submissions: NOT readable — this is what keeps one visitor's contact
  // details from being visible to every other visitor.
  const { data: leaked, error: readError } = await supabase
    .from("booking_requests")
    .select("email");
  report(
    "booking requests are not readable",
    (leaked?.length ?? 0) === 0,
    readError ? readError.message : `${leaked?.length ?? 0} rows returned`,
  );

  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
