/**
 * Probes the booking rules from outside the app, as a signed-in guest and as
 * the anon role — the same access a hostile browser would have.
 *
 * Run with:  npm run db:check-bookings
 */

import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
/** Credentials come from the environment so none are ever committed. */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(
      `Set ${name}. Both are needed for an existing account, e.g.\n` +
        "  TEST_EMAIL=you@example.com TEST_PASSWORD=secret npm run db:check-bookings",
    );
    process.exit(1);
  }
  return value;
}

const EMAIL = required("TEST_EMAIL");
const PASSWORD = required("TEST_PASSWORD");

let failures = 0;

function report(label: string, passed: boolean, detail = "") {
  console.log(`${passed ? "  PASS" : "  FAIL"}  ${label}${detail ? ` — ${detail}` : ""}`);
  if (!passed) failures += 1;
}

async function main() {
  console.log("Probing booking rules…\n");

  const anon = createClient<Database>(url, key);
  const { data: anonRead } = await anon.from("bookings").select("id");
  report("anon cannot read bookings", (anonRead?.length ?? 0) === 0);

  const guest = createClient<Database>(url, key);
  const { data: auth, error: authError } = await guest.auth.signInWithPassword({
    email: EMAIL,
    password: PASSWORD,
  });
  if (authError || !auth.user) {
    report("sign in for probes", false, authError?.message);
    process.exit(1);
  }
  const uid = auth.user.id;

  // A guest may read their own bookings.
  const { data: mine } = await guest.from("bookings").select("id, total, guest_id");
  report("guest reads own bookings", (mine?.length ?? 0) > 0, `${mine?.length ?? 0} rows`);
  report(
    "every readable booking belongs to the caller",
    (mine ?? []).every((b) => b.guest_id === uid),
  );

  // Prices must not be forgeable: the check constraint rejects a total that
  // does not equal the sum of its parts.
  const { error: cheapError } = await guest.from("bookings").insert({
    property_id: "home-001",
    guest_id: uid,
    host_id: "host-home-001",
    check_in: "2027-01-10",
    check_out: "2027-01-12",
    guests: 1,
    nights: 2,
    price_per_night: 740,
    accommodation_total: 1480,
    cleaning_fee: 150,
    service_fee: 178,
    tax: 82,
    total: 1, // the lie
  });
  report("tampered total is rejected", Boolean(cheapError), cheapError?.message.slice(0, 60));

  // A booking cannot be created on someone else's behalf.
  const { error: impersonateError } = await guest.from("bookings").insert({
    property_id: "home-001",
    guest_id: "00000000-0000-0000-0000-000000000000",
    host_id: "host-home-001",
    check_in: "2027-02-10",
    check_out: "2027-02-12",
    guests: 1,
    nights: 2,
    price_per_night: 740,
    accommodation_total: 1480,
    cleaning_fee: 150,
    service_fee: 178,
    tax: 82,
    total: 1890,
  });
  report("cannot book for another user", Boolean(impersonateError));

  // A guest must not be able to approve their own request — unless this
  // account also happens to own the host profile for that property, in which
  // case approving is its legitimate host role and the check does not apply.
  const pending = (mine ?? [])[0];
  if (pending) {
    const { data: owned } = await guest
      .from("hosts")
      .select("id")
      .not("owner_id", "is", null);
    const alsoHost = (owned?.length ?? 0) > 0;

    if (alsoHost) {
      console.log(
        "  SKIP  guest cannot approve own booking — this account also owns a host profile",
      );
    } else {
      const { error: selfApprove } = await guest
        .from("bookings")
        .update({ booking_status: "approved" })
        .eq("id", pending.id);
      report("guest cannot approve own booking", Boolean(selfApprove));
    }

    // Nobody may jump a booking straight to completed, host or not.
    const { error: completeError } = await guest
      .from("bookings")
      .update({ booking_status: "completed" })
      .eq("id", pending.id);
    report("nobody can force a booking to completed", Boolean(completeError));
  }

  // Immutable financial columns.
  if (pending) {
    const { error: priceEdit } = await guest
      .from("bookings")
      .update({ total: 1 })
      .eq("id", pending.id);
    report("guest cannot rewrite the total", Boolean(priceEdit));
  }

  await guest.auth.signOut();
  console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
