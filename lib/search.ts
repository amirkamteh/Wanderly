import type { Experience } from "@/types/experience";
import type { Home } from "@/types/listing";
import type { Service } from "@/types/service";
import { experiences } from "@/data/experiences";
import { homes } from "@/data/homes";
import { services } from "@/data/services";
import { PRICE_MAX, PRICE_MIN } from "@/data/categories";

export type SearchTab = "homes" | "experiences" | "services";

/** Every filter the results page understands. Serialised into the URL. */
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

function matchesText(haystack: string[], needle: string): boolean {
  if (!needle.trim()) return true;
  const q = needle.trim().toLowerCase();
  return haystack.some((value) => value.toLowerCase().includes(q));
}

export function filterHomes(filters: Filters): Home[] {
  const results = homes.filter((home) => {
    if (!matchesText([home.city, home.area, home.country, home.name, home.title], filters.destination)) {
      return false;
    }
    if (filters.placeTypes.length && !filters.placeTypes.includes(home.placeType)) return false;
    if (filters.propertyTypes.length && !filters.propertyTypes.includes(home.propertyType)) return false;
    if (filters.amenities.length && !filters.amenities.every((a) => home.tags.includes(a))) return false;
    if (home.price < filters.minPrice || home.price > filters.maxPrice) return false;
    if (filters.bedrooms && home.bedrooms < filters.bedrooms) return false;
    if (filters.beds && home.beds < filters.beds) return false;
    if (filters.bathrooms && home.bathrooms < filters.bathrooms) return false;
    if (filters.minRating && home.rating < filters.minRating) return false;
    if (filters.guests && home.guests < filters.guests) return false;
    return true;
  });

  return sortHomes(results, filters.sort);
}

function sortHomes(list: Home[], sort: string): Home[] {
  const sorted = [...list];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    default:
      // "Recommended" favours well-reviewed guest favourites.
      return sorted.sort(
        (a, b) =>
          Number(Boolean(b.badge)) - Number(Boolean(a.badge)) ||
          b.rating - a.rating ||
          b.reviewCount - a.reviewCount,
      );
  }
}

export function filterExperiences(filters: Filters): Experience[] {
  const results = experiences.filter((experience) => {
    if (!matchesText([experience.city, experience.country, experience.title, experience.category], filters.destination)) {
      return false;
    }
    if (experience.price < filters.minPrice || experience.price > filters.maxPrice) return false;
    if (filters.minRating && experience.rating < filters.minRating) return false;
    if (filters.guests && experience.groupSize < filters.guests) return false;
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return results.sort((a, b) => a.price - b.price);
    case "price-desc":
      return results.sort((a, b) => b.price - a.price);
    case "rating":
      return results.sort((a, b) => b.rating - a.rating);
    default:
      return results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }
}

export function filterServices(filters: Filters, serviceType?: string): Service[] {
  const results = services.filter((service) => {
    if (!matchesText([service.city, service.country, service.title, service.provider, service.category], filters.destination)) {
      return false;
    }
    if (serviceType && service.category !== serviceType.toLowerCase()) return false;
    if (service.price < filters.minPrice || service.price > filters.maxPrice) return false;
    if (filters.minRating && service.rating < filters.minRating) return false;
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return results.sort((a, b) => a.price - b.price);
    case "price-desc":
      return results.sort((a, b) => b.price - a.price);
    case "rating":
      return results.sort((a, b) => b.rating - a.rating);
    default:
      return results.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
  }
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
export function filtersToParams(filters: Filters, base?: URLSearchParams): URLSearchParams {
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

/** Typeahead suggestions for the destination field. */
export function suggestDestinations(query: string, limit = 6): string[] {
  const all = new Set<string>();
  homes.forEach((h) => all.add(h.city));
  experiences.forEach((e) => all.add(e.city));
  services.forEach((s) => all.add(s.city));

  const q = query.trim().toLowerCase();
  const list = Array.from(all);
  if (!q) return list.slice(0, limit);
  return list.filter((city) => city.toLowerCase().includes(q)).slice(0, limit);
}
