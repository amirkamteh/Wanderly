import "server-only";

import type { Experience } from "@/types/experience";
import type { Home, ListingKind, Review } from "@/types/listing";
import type { Service, ServiceCategorySlug } from "@/types/service";
import { createClient } from "@/lib/supabase/server";
import { toExperience, toHome, toReview, toService } from "@/lib/mappers";
import type { Filters } from "@/lib/search";
import { PRICE_MAX, PRICE_MIN } from "@/data/categories";

/**
 * Every read the app performs. Pages call these instead of importing the
 * `data/` modules, so the catalogue is served from Postgres.
 */

/** Columns plus the joined host, which every card and detail page needs. */
const HOME_SELECT = "*, hosts(*)";
const EXPERIENCE_SELECT = "*, hosts(*)";
const SERVICE_SELECT = "*, hosts(*)";

/**
 * PostgREST's `or()` takes a comma-separated filter string, so a destination
 * containing commas, parentheses or wildcards would change the query's shape.
 * Strip those rather than trusting user input into the filter grammar.
 */
function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,()*%\\]/g, " ").trim().slice(0, 80);
}

// ------------------------------------------------------------------ homes

export async function getHomesInCity(city: string, limit = 12): Promise<Home[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homes")
    .select(HOME_SELECT)
    .eq("city", city)
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getHomesInCity(${city}): ${error.message}`);
  return (data ?? []).map((row) => toHome(row));
}

export async function getHomesWithTag(tag: string, limit = 12): Promise<Home[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("homes")
    .select(HOME_SELECT)
    .contains("tags", [tag])
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getHomesWithTag(${tag}): ${error.message}`);
  return (data ?? []).map((row) => toHome(row));
}

export async function getHomeById(id: string): Promise<Home | null> {
  const supabase = await createClient();
  const [{ data, error }, reviews] = await Promise.all([
    supabase.from("homes").select(HOME_SELECT).eq("id", id).maybeSingle(),
    getReviews("home", id),
  ]);

  if (error) throw new Error(`getHomeById(${id}): ${error.message}`);
  return data ? toHome(data, reviews) : null;
}

export async function getAllHomeIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("homes").select("id");
  if (error) throw new Error(`getAllHomeIds: ${error.message}`);
  return (data ?? []).map((row) => row.id);
}

// ------------------------------------------------------------ experiences

export async function getExperiencesInCity(
  city: string,
  limit = 12,
): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(EXPERIENCE_SELECT)
    .eq("city", city)
    .is("start_time", null)
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getExperiencesInCity(${city}): ${error.message}`);
  return (data ?? []).map((row) => toExperience(row));
}

/** Listings with a start time, used by the "Tomorrow in …" rail. */
export async function getScheduledExperiences(limit = 12): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(EXPERIENCE_SELECT)
    .not("start_time", "is", null)
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getScheduledExperiences: ${error.message}`);
  return (data ?? []).map((row) => toExperience(row));
}

export async function getOriginalExperiences(limit = 12): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(EXPERIENCE_SELECT)
    .eq("is_original", true)
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getOriginalExperiences: ${error.message}`);
  return (data ?? []).map((row) => toExperience(row));
}

/** Everything that is neither scheduled nor a Signature, outside one city. */
export async function getWeekendExperiences(
  excludeCity: string,
  limit = 12,
): Promise<Experience[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .select(EXPERIENCE_SELECT)
    .is("start_time", null)
    .eq("is_original", false)
    .neq("city", excludeCity)
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getWeekendExperiences: ${error.message}`);
  return (data ?? []).map((row) => toExperience(row));
}

export async function getExperienceById(id: string): Promise<Experience | null> {
  const supabase = await createClient();
  const [{ data, error }, reviews] = await Promise.all([
    supabase.from("experiences").select(EXPERIENCE_SELECT).eq("id", id).maybeSingle(),
    getReviews("experience", id),
  ]);

  if (error) throw new Error(`getExperienceById(${id}): ${error.message}`);
  return data ? toExperience(data, reviews) : null;
}

export async function getAllExperienceIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("experiences").select("id");
  if (error) throw new Error(`getAllExperienceIds: ${error.message}`);
  return (data ?? []).map((row) => row.id);
}

// --------------------------------------------------------------- services

export async function getServicesInCategory(
  category: ServiceCategorySlug,
  limit = 12,
): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .eq("category", category)
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getServicesInCategory(${category}): ${error.message}`);
  return (data ?? []).map((row) => toService(row));
}

export async function getServicesInCity(
  city: string,
  options: { excludeCategory?: string; limit?: number } = {},
): Promise<Service[]> {
  const { excludeCategory, limit = 12 } = options;
  const supabase = await createClient();

  let query = supabase.from("services").select(SERVICE_SELECT).eq("city", city);
  if (excludeCategory) query = query.neq("category", excludeCategory);

  const { data, error } = await query.order("id").limit(limit);
  if (error) throw new Error(`getServicesInCity(${city}): ${error.message}`);
  return (data ?? []).map((row) => toService(row));
}

export async function getServicesOutsideCity(
  city: string,
  limit = 12,
): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .neq("city", city)
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getServicesOutsideCity(${city}): ${error.message}`);
  return (data ?? []).map((row) => toService(row));
}

export async function getServiceById(id: string): Promise<Service | null> {
  const supabase = await createClient();
  const [{ data, error }, reviews] = await Promise.all([
    supabase.from("services").select(SERVICE_SELECT).eq("id", id).maybeSingle(),
    getReviews("service", id),
  ]);

  if (error) throw new Error(`getServiceById(${id}): ${error.message}`);
  return data ? toService(data, reviews) : null;
}

export async function getAllServiceIds(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select("id");
  if (error) throw new Error(`getAllServiceIds: ${error.message}`);
  return (data ?? []).map((row) => row.id);
}

/** Related listings for a detail page, excluding the one being viewed. */
export async function getRelatedServices(
  service: Pick<Service, "id" | "city" | "category">,
  limit = 8,
): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_SELECT)
    .neq("id", service.id)
    .or(`city.eq.${sanitizeSearchTerm(service.city)},category.eq.${service.category}`)
    .order("id")
    .limit(limit);

  if (error) throw new Error(`getRelatedServices: ${error.message}`);
  return (data ?? []).map((row) => toService(row));
}

// ---------------------------------------------------------------- reviews

export async function getReviews(
  kind: ListingKind,
  listingId: string,
): Promise<Review[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("listing_kind", kind)
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) throw new Error(`getReviews(${kind}, ${listingId}): ${error.message}`);
  return (data ?? []).map(toReview);
}

// ----------------------------------------------------------------- search
// Filtering happens in Postgres so the browser never receives rows it will
// not display.

type Sort = "recommended" | "price-asc" | "price-desc" | "rating";

function applySort<T extends { order: (...args: never[]) => T }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- PostgREST builder types are not generic over sort keys
  query: any,
  sort: string,
) {
  switch (sort as Sort) {
    case "price-asc":
      return query.order("price", { ascending: true });
    case "price-desc":
      return query.order("price", { ascending: false });
    case "rating":
      return query.order("rating", { ascending: false }).order("review_count", {
        ascending: false,
      });
    default:
      // "Recommended": badged listings first, then best rated.
      return query
        .order("badge", { ascending: true, nullsFirst: false })
        .order("rating", { ascending: false })
        .order("review_count", { ascending: false });
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any -- shared builder plumbing */
function applyHomeFilters(query: any, filters: Filters) {
  const term = sanitizeSearchTerm(filters.destination);
  if (term) {
    query = query.or(
      `city.ilike.%${term}%,area.ilike.%${term}%,country.ilike.%${term}%,name.ilike.%${term}%,title.ilike.%${term}%`,
    );
  }
  if (filters.placeTypes.length) query = query.in("place_type", filters.placeTypes);
  if (filters.propertyTypes.length) {
    query = query.in("property_type", filters.propertyTypes);
  }
  if (filters.amenities.length) query = query.contains("tags", filters.amenities);
  if (filters.minPrice > PRICE_MIN) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice < PRICE_MAX) query = query.lte("price", filters.maxPrice);
  if (filters.bedrooms) query = query.gte("bedrooms", filters.bedrooms);
  if (filters.beds) query = query.gte("beds", filters.beds);
  if (filters.bathrooms) query = query.gte("bathrooms", filters.bathrooms);
  if (filters.minRating) query = query.gte("rating", filters.minRating);
  if (filters.guests) query = query.gte("guests", filters.guests);
  return query;
}

function applyExperienceFilters(query: any, filters: Filters) {
  const term = sanitizeSearchTerm(filters.destination);
  if (term) {
    query = query.or(
      `city.ilike.%${term}%,country.ilike.%${term}%,title.ilike.%${term}%,category.ilike.%${term}%`,
    );
  }
  if (filters.minPrice > PRICE_MIN) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice < PRICE_MAX) query = query.lte("price", filters.maxPrice);
  if (filters.minRating) query = query.gte("rating", filters.minRating);
  if (filters.guests) query = query.gte("group_size", filters.guests);
  return query;
}

function applyServiceFilters(query: any, filters: Filters, serviceType?: string) {
  const term = sanitizeSearchTerm(filters.destination);
  if (term) {
    query = query.or(
      `city.ilike.%${term}%,country.ilike.%${term}%,title.ilike.%${term}%,provider.ilike.%${term}%,category.ilike.%${term}%`,
    );
  }
  if (serviceType) query = query.eq("category", serviceType.toLowerCase());
  if (filters.minPrice > PRICE_MIN) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice < PRICE_MAX) query = query.lte("price", filters.maxPrice);
  if (filters.minRating) query = query.gte("rating", filters.minRating);
  return query;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function searchHomes(filters: Filters, limit = 60): Promise<Home[]> {
  const supabase = await createClient();
  let query = supabase.from("homes").select(HOME_SELECT);
  query = applySort(applyHomeFilters(query, filters), filters.sort).limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`searchHomes: ${error.message}`);
  return (data ?? []).map((row) => toHome(row));
}

export async function searchExperiences(
  filters: Filters,
  limit = 60,
): Promise<Experience[]> {
  const supabase = await createClient();
  let query = supabase.from("experiences").select(EXPERIENCE_SELECT);
  query = applySort(applyExperienceFilters(query, filters), filters.sort).limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`searchExperiences: ${error.message}`);
  return (data ?? []).map((row) => toExperience(row));
}

export async function searchServices(
  filters: Filters,
  serviceType?: string,
  limit = 60,
): Promise<Service[]> {
  const supabase = await createClient();
  let query = supabase.from("services").select(SERVICE_SELECT);
  query = applySort(
    applyServiceFilters(query, filters, serviceType),
    filters.sort,
  ).limit(limit);

  const { data, error } = await query;
  if (error) throw new Error(`searchServices: ${error.message}`);
  return (data ?? []).map((row) => toService(row));
}

/** Row count for a filter set, used by the filter sheet's apply button. */
export async function countResults(
  tab: "homes" | "experiences" | "services",
  filters: Filters,
  serviceType?: string,
): Promise<number> {
  const supabase = await createClient();
  const head = { count: "exact" as const, head: true };

  if (tab === "experiences") {
    const { count, error } = await applyExperienceFilters(
      supabase.from("experiences").select("*", head),
      filters,
    );
    if (error) throw new Error(`countResults: ${error.message}`);
    return count ?? 0;
  }

  if (tab === "services") {
    const { count, error } = await applyServiceFilters(
      supabase.from("services").select("*", head),
      filters,
      serviceType,
    );
    if (error) throw new Error(`countResults: ${error.message}`);
    return count ?? 0;
  }

  const { count, error } = await applyHomeFilters(
    supabase.from("homes").select("*", head),
    filters,
  );
  if (error) throw new Error(`countResults: ${error.message}`);
  return count ?? 0;
}

/** Distinct cities across all three verticals, for search suggestions. */
export async function getDestinationCities(): Promise<string[]> {
  const supabase = await createClient();
  const [homes, experiences, services] = await Promise.all([
    supabase.from("homes").select("city"),
    supabase.from("experiences").select("city"),
    supabase.from("services").select("city"),
  ]);

  const cities = new Set<string>();
  for (const result of [homes, experiences, services]) {
    for (const row of result.data ?? []) cities.add(row.city);
  }
  return [...cities].sort();
}
