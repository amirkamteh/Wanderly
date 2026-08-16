/**
 * Seeds the Supabase catalogue from the local data modules.
 *
 * The files under `data/` remain the source of record for demo content; this
 * script pushes them into Postgres so the app can read them dynamically.
 *
 * Run with:  npm run db:seed
 *
 * Requires a temporary "seed" RLS policy allowing inserts (see
 * `scripts/seed-policy.sql`). Re-runnable: every write is an upsert on the
 * primary key.
 */

import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { experiences } from "../data/experiences";
import { homes } from "../data/homes";
import { services } from "../data/services";
import type { Database, TablesInsert } from "../lib/supabase/types";
import type { Host, Review } from "../types/listing";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.\n" +
      "Run via `npm run db:seed`, which loads .env.",
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, key);

/** Inserts in batches so a single request never carries the whole table. */
async function upsertAll<T extends object>(
  table: "hosts" | "homes" | "experiences" | "services" | "reviews",
  rows: T[],
  conflictTarget = "id",
  batchSize = 100,
) {
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase
      .from(table)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- batch shape is validated by the caller's types
      .upsert(batch as any, { onConflict: conflictTarget });

    if (error) {
      throw new Error(
        `${table}: ${error.message}${error.hint ? ` (${error.hint})` : ""}`,
      );
    }
  }
  console.log(`  ${table}: ${rows.length} rows`);
}

function hostRow(host: Host): TablesInsert<"hosts"> {
  return {
    id: host.id,
    name: host.name,
    avatar: host.avatar,
    is_superhost: host.isSuperhost,
    years_hosting: host.yearsHosting,
    response_rate: host.responseRate,
    about: host.about,
  };
}

function reviewRows(
  kind: "home" | "experience" | "service",
  listingId: string,
  reviews: Review[],
): TablesInsert<"reviews">[] {
  return reviews.map((review) => ({
    // Deterministic id keeps re-runs idempotent instead of duplicating rows.
    id: uuidFromSeed(review.id),
    listing_kind: kind,
    listing_id: listingId,
    author: review.author,
    avatar: review.avatar,
    review_date: review.date,
    rating: review.rating,
    body: review.body,
  }));
}

/**
 * Stable UUID derived from a seed string, so re-running the seed updates the
 * same review rows instead of appending duplicates. Shaped as a v5 UUID:
 * version nibble 5, RFC 4122 variant bits.
 */
function uuidFromSeed(seed: string): string {
  const h = createHash("sha1").update(seed).digest("hex");
  const variant = ((parseInt(h.slice(16, 18), 16) & 0x3f) | 0x80)
    .toString(16)
    .padStart(2, "0");
  return [
    h.slice(0, 8),
    h.slice(8, 12),
    `5${h.slice(13, 16)}`,
    `${variant}${h.slice(18, 20)}`,
    h.slice(20, 32),
  ].join("-");
}

async function main() {
  console.log("Seeding Wanderly catalogue…\n");

  // Hosts first: every listing carries a foreign key to one.
  const hosts = new Map<string, TablesInsert<"hosts">>();
  for (const listing of [...homes, ...experiences, ...services]) {
    hosts.set(listing.host.id, hostRow(listing.host));
  }
  await upsertAll("hosts", [...hosts.values()]);

  await upsertAll(
    "homes",
    homes.map(
      (home): TablesInsert<"homes"> => ({
        id: home.id,
        title: home.title,
        name: home.name,
        property_type: home.propertyType,
        place_type: home.placeType,
        city: home.city,
        area: home.area,
        country: home.country,
        price: home.price,
        nights: home.nights,
        rating: home.rating,
        review_count: home.reviewCount,
        badge: home.badge ?? null,
        images: home.images,
        guests: home.guests,
        bedrooms: home.bedrooms,
        beds: home.beds,
        bathrooms: home.bathrooms,
        amenities: home.amenities as unknown as TablesInsert<"homes">["amenities"],
        sleeping: home.sleeping as unknown as TablesInsert<"homes">["sleeping"],
        house_rules: home.houseRules,
        description: home.description,
        host_id: home.host.id,
        tags: home.tags,
        lat: home.coordinates.lat,
        lng: home.coordinates.lng,
      }),
    ),
  );

  await upsertAll(
    "experiences",
    experiences.map(
      (experience): TablesInsert<"experiences"> => ({
        id: experience.id,
        title: experience.title,
        city: experience.city,
        country: experience.country,
        price: experience.price,
        price_unit: experience.priceUnit,
        minimum_spend: experience.minimumSpend ?? null,
        rating: experience.rating,
        review_count: experience.reviewCount,
        badge: experience.badge ?? null,
        start_time: experience.startTime ?? null,
        duration_hours: experience.durationHours,
        group_size: experience.groupSize,
        images: experience.images,
        description: experience.description,
        highlights: experience.highlights,
        included: experience.included,
        meeting_point: experience.meetingPoint,
        languages: experience.languages,
        category: experience.category,
        is_original: experience.isOriginal ?? false,
        host_id: experience.host.id,
      }),
    ),
  );

  await upsertAll(
    "services",
    services.map(
      (service): TablesInsert<"services"> => ({
        id: service.id,
        title: service.title,
        provider: service.provider,
        category: service.category,
        city: service.city,
        country: service.country,
        price: service.price,
        price_unit: service.priceUnit,
        minimum_spend: service.minimumSpend ?? null,
        rating: service.rating,
        review_count: service.reviewCount,
        badge: service.badge ?? null,
        images: service.images,
        description: service.description,
        includes: service.includes,
        duration_minutes: service.durationMinutes,
        host_id: service.host.id,
      }),
    ),
  );

  const reviews = [
    ...homes.flatMap((h) => reviewRows("home", h.id, h.reviews)),
    ...experiences.flatMap((e) => reviewRows("experience", e.id, e.reviews)),
    ...services.flatMap((s) => reviewRows("service", s.id, s.reviews)),
  ];
  await upsertAll("reviews", reviews, "id", 200);

  console.log("\nDone.");
}

main().catch((error: unknown) => {
  console.error("\nSeed failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
