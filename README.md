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
