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
