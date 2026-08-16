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

There is **no authentication**. Every visitor is the `anon` role, and RLS is
what keeps that safe:

| Table | `anon` may |
| --- | --- |
| `hosts`, `homes`, `experiences`, `services`, `reviews` | `SELECT` only |
| `booking_requests` | `INSERT` only |

`booking_requests` deliberately has **no** select policy. Without a login there
is no way to prove a row belongs to you, so allowing reads would expose every
visitor's name, email and travel dates to every other visitor. Submissions are
write-only from the app and readable only with a privileged key.

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
