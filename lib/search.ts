import { PRICE_MAX, PRICE_MIN } from "@/data/categories";

/**
 * Filter state and its URL encoding.
 *
 * The filtering itself runs in Postgres (see `lib/queries.ts`); this module
 * only defines the shape and keeps it in sync with the query string so results
 * are shareable and the back button works.
 */

export type SearchTab = "homes" | "experiences" | "services";

export interface Filters {
  destination: string;
  placeTypes: string[];
  propertyTypes: string[];
  amenities: string[];
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  minRating: number;
  sort: string;
  guests: number;
}

export const emptyFilters: Filters = {
  destination: "",
  placeTypes: [],
  propertyTypes: [],
  amenities: [],
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  bedrooms: 0,
  beds: 0,
  bathrooms: 0,
  minRating: 0,
  sort: "recommended",
  guests: 0,
};

/** Counts only the filters a traveller has actually changed. */
export function activeFilterCount(filters: Filters): number {
  let count = 0;
  if (filters.placeTypes.length) count += 1;
  if (filters.propertyTypes.length) count += 1;
  if (filters.amenities.length) count += 1;
  if (filters.minPrice > PRICE_MIN || filters.maxPrice < PRICE_MAX) count += 1;
  if (filters.bedrooms || filters.beds || filters.bathrooms) count += 1;
  if (filters.minRating > 0) count += 1;
  return count;
}

export function isSearchTab(value: string | undefined | null): value is SearchTab {
  return value === "homes" || value === "experiences" || value === "services";
}

/** Reads filters out of a URL query string. */
export function filtersFromParams(params: URLSearchParams): Filters {
  const list = (key: string) => {
    const raw = params.get(key);
    return raw ? raw.split(",").filter(Boolean) : [];
  };
  const num = (key: string, fallback: number) => {
    const raw = params.get(key);
    const parsed = raw === null ? NaN : Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  return {
    destination: params.get("where") ?? "",
    placeTypes: list("place"),
    propertyTypes: list("type"),
    amenities: list("amenities"),
    minPrice: num("minPrice", PRICE_MIN),
    maxPrice: num("maxPrice", PRICE_MAX),
    bedrooms: num("bedrooms", 0),
    beds: num("beds", 0),
    bathrooms: num("bathrooms", 0),
    minRating: num("rating", 0),
    sort: params.get("sort") ?? "recommended",
    guests: num("guests", 0),
  };
}

/** Writes non-default filters back into a query string. */
export function filtersToParams(
  filters: Filters,
  base?: URLSearchParams,
): URLSearchParams {
  const params = new URLSearchParams(base?.toString() ?? "");
  const setOrDelete = (key: string, value: string, isDefault: boolean) => {
    if (isDefault) params.delete(key);
    else params.set(key, value);
  };

  setOrDelete("where", filters.destination, !filters.destination);
  setOrDelete("place", filters.placeTypes.join(","), !filters.placeTypes.length);
  setOrDelete("type", filters.propertyTypes.join(","), !filters.propertyTypes.length);
  setOrDelete("amenities", filters.amenities.join(","), !filters.amenities.length);
  setOrDelete("minPrice", String(filters.minPrice), filters.minPrice === PRICE_MIN);
  setOrDelete("maxPrice", String(filters.maxPrice), filters.maxPrice === PRICE_MAX);
  setOrDelete("bedrooms", String(filters.bedrooms), !filters.bedrooms);
  setOrDelete("beds", String(filters.beds), !filters.beds);
  setOrDelete("bathrooms", String(filters.bathrooms), !filters.bathrooms);
  setOrDelete("rating", String(filters.minRating), !filters.minRating);
  setOrDelete("sort", filters.sort, filters.sort === "recommended");
  setOrDelete("guests", String(filters.guests), !filters.guests);

  return params;
}
