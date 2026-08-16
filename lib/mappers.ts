import type { Experience } from "@/types/experience";
import type {
  Amenity,
  Home,
  Host,
  Review,
  SleepingArrangement,
} from "@/types/listing";
import type { Service, ServiceCategorySlug } from "@/types/service";
import type { Tables } from "@/lib/supabase/types";

/**
 * Maps database rows (snake_case, numeric-as-string) onto the domain types the
 * components already use. Keeping this in one place means the UI never has to
 * know what the schema looks like.
 */

type HostRow = Tables<"hosts">;
type ReviewRow = Tables<"reviews">;

/** Postgres `numeric` arrives as a string over the wire; coerce defensively. */
function num(value: number | string | null | undefined, fallback = 0): number {
  if (value === null || value === undefined) return fallback;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toHost(row: HostRow): Host {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    isSuperhost: row.is_superhost,
    yearsHosting: row.years_hosting,
    responseRate: row.response_rate,
    about: row.about,
  };
}

export function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    author: row.author,
    avatar: row.avatar,
    date: row.review_date,
    rating: row.rating,
    body: row.body,
  };
}

/** Rows come back with the joined host, and optionally joined reviews. */
type WithRelations<T> = T & { hosts: HostRow | null };

export function toHome(
  row: WithRelations<Tables<"homes">>,
  reviews: Review[] = [],
): Home {
  return {
    id: row.id,
    kind: "home",
    title: row.title,
    name: row.name,
    propertyType: row.property_type,
    placeType: row.place_type,
    city: row.city,
    area: row.area,
    country: row.country,
    price: num(row.price),
    nights: row.nights,
    rating: num(row.rating),
    reviewCount: row.review_count,
    badge: (row.badge as Home["badge"]) ?? undefined,
    images: row.images,
    guests: row.guests,
    bedrooms: row.bedrooms,
    beds: row.beds,
    bathrooms: row.bathrooms,
    amenities: (row.amenities as unknown as Amenity[]) ?? [],
    sleeping: (row.sleeping as unknown as SleepingArrangement[]) ?? [],
    houseRules: row.house_rules,
    description: row.description,
    host: row.hosts ? toHost(row.hosts) : fallbackHost(row.host_id),
    reviews,
    tags: row.tags,
    coordinates: { lat: num(row.lat), lng: num(row.lng) },
  };
}

export function toExperience(
  row: WithRelations<Tables<"experiences">>,
  reviews: Review[] = [],
): Experience {
  return {
    id: row.id,
    kind: "experience",
    title: row.title,
    city: row.city,
    country: row.country,
    price: num(row.price),
    priceUnit: row.price_unit,
    minimumSpend: row.minimum_spend === null ? undefined : num(row.minimum_spend),
    rating: num(row.rating),
    reviewCount: row.review_count,
    badge: (row.badge as Experience["badge"]) ?? undefined,
    startTime: row.start_time ?? undefined,
    durationHours: num(row.duration_hours),
    groupSize: row.group_size,
    images: row.images,
    description: row.description,
    highlights: row.highlights,
    included: row.included,
    meetingPoint: row.meeting_point,
    languages: row.languages,
    host: row.hosts ? toHost(row.hosts) : fallbackHost(row.host_id),
    reviews,
    category: row.category,
    isOriginal: row.is_original,
  };
}

export function toService(
  row: WithRelations<Tables<"services">>,
  reviews: Review[] = [],
): Service {
  return {
    id: row.id,
    kind: "service",
    title: row.title,
    provider: row.provider,
    category: row.category as ServiceCategorySlug,
    city: row.city,
    country: row.country,
    price: num(row.price),
    priceUnit: row.price_unit,
    minimumSpend: row.minimum_spend === null ? undefined : num(row.minimum_spend),
    rating: num(row.rating),
    reviewCount: row.review_count,
    badge: (row.badge as Service["badge"]) ?? undefined,
    images: row.images,
    description: row.description,
    includes: row.includes,
    durationMinutes: row.duration_minutes,
    host: row.hosts ? toHost(row.hosts) : fallbackHost(row.host_id),
    reviews,
  };
}

/**
 * Only reachable if a host row were deleted out from under a listing, which
 * the `on delete restrict` foreign key prevents. Present so a card never
 * crashes the page over missing join data.
 */
function fallbackHost(id: string): Host {
  return {
    id,
    name: "Wanderly host",
    avatar: "",
    isSuperhost: false,
    yearsHosting: 1,
    responseRate: 100,
    about: "",
  };
}
