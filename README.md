# Wanderly

An original travel marketplace front end — homes, experiences and services —
built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Lucide icons.

The UX patterns (header, search pill, card rails, filters, detail pages) are
modelled on the layout language of modern travel marketplaces. All branding,
copy, data and components are original to this project. No third-party
trademarks, logos or proprietary assets are used.

## Getting started

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000.

Other scripts:

```bash
npm run build
```

```bash
npm run lint
```

```bash
npx tsc --noEmit
```

## Supabase

The catalogue lives in Postgres; pages read it on every request, so edits in
the database show up on reload with no rebuild.

Copy `.env.example` to `.env` and fill in your project's URL and publishable
key, then:

```bash
npm run db:seed
```

```bash
npm run db:check
```

`db:seed` pushes `data/*.ts` into Postgres (idempotent — every write is an
upsert). `db:check` verifies row level security from the outside using the same
key the browser gets.

### Access model

Browsing, searching and sending a booking request all work **signed out**.
Accounts are optional and only add Trips history.

| Table | `anon` may | `authenticated` may |
| --- | --- | --- |
| `hosts`, `homes`, `experiences`, `services`, `reviews` | `SELECT` | `SELECT` |
| `booking_requests` | `INSERT` only | `INSERT`, plus `SELECT` of **own** rows |
| `profiles` | nothing | `SELECT`/`UPDATE` of **own** row |

Anonymous submissions are write-only: without a login there is no way to prove
a row belongs to you, so a blanket read policy would expose every visitor's
name, email and travel dates to every other visitor. Signing in attaches
`user_id`, and the select policy is scoped to `auth.uid()`.

Seeding needs write access the app does not have, so it runs behind a
temporary policy that is dropped again immediately afterwards.

## Booking flow

Stays use a three-step flow at `/booking/[propertyId]`: log in or sign up,
add a payment method, review and send. Experiences and services keep their
inline enquiry form — they have no nightly rate or calendar, so the stay flow
does not apply to them.

The traveller's selection lives in the query string, which is what makes a
refresh, the back button and the round trip through login all non-destructive.

```bash
npm run db:check-bookings
```

### What the server does not trust

| Input | Where the truth comes from |
| --- | --- |
| Price | recomputed by `lib/pricing.ts` from `homes.price` |
| Guest identity | the verified session, never the form |
| Host | `homes.host_id`, read at creation |
| Availability | an exclusion constraint over approved date ranges |
| Status changes | a trigger that permits only legal transitions |

`bookings_totals_consistent` rejects any row whose breakdown does not add up,
so even a direct API call with a forged total fails.

### Payments

No payment provider is connected. The payment step is UI and architecture
only — nothing is charged and no card details are collected, let alone stored.
`payment_status` is on the table ready for a provider. To add Stripe, create a
PaymentIntent server-side at the payment step, keep the card fields inside
Stripe Elements so they never reach this app, and move `payment_status` to
`authorized` on the host's approval.

### Hosts

`hosts` rows are seeded catalogue data, not accounts. `hosts.owner_id` links a
host profile to a real user; only then does `/host/bookings` show anything.
Link one with SQL:

```sql
update public.hosts set owner_id = '<auth-user-uuid>' where id = 'host-home-001';
```

## Auth

Email and password via Supabase Auth.

- `proxy.ts` (Next 16 renamed `middleware`) refreshes the session cookie on
  every request. It never redirects — the app is public by default.
- Sessions are read with `getClaims()`, which verifies the JWT signature.
  `getSession()` is never trusted server-side.
- A `profiles` row is created by an `on auth.users` trigger. The function
  lives in the unexposed `private` schema, because a `SECURITY DEFINER`
  function in `public` is a callable REST endpoint for every role.
- Names come from `profiles`, never from JWT user metadata, which is
  user-editable and unsafe for anything but display.

Email confirmation is enabled on the project, so signup shows a "check your
inbox" state rather than logging straight in.

Seeding needs write access the app does not have, so it runs behind a
temporary policy that is dropped again immediately afterwards.

## Project layout

```
app/            routes (App Router), error/loading/not-found boundaries
components/     all UI, one component per file
data/           listings, destinations, categories, footer, image registry
lib/            formatters, search/filter engine, hooks, wishlist store
types/          domain types (listing, experience, service, user)
reference/      the source screenshots used as the visual reference
```

## Notes

- **Images** are Unsplash URLs resolved through `data/images.ts`. Swapping the
  image source is a one-file change. Failed loads fall back to a neutral tile.
- **Wishlist** is a `localStorage`-backed external store
  (`lib/wishlist.tsx`), read via `useSyncExternalStore` so SSR and hydration
  agree. It syncs across tabs.
- **Search and filters** are pure functions in `lib/search.ts`, driven entirely
  by the URL query string, so results are shareable and back/forward works.
- **No backend.** Auth forms validate on the client and say so; Reserve shows a
  full price breakdown but takes no payment.
