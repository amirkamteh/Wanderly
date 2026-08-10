import type { AmenityIcon } from "@/types/listing";

/** Filter chips shown in the stays filter bar. */
export interface FilterChip {
  id: string;
  label: string;
}

export const placeTypes: FilterChip[] = [
  { id: "entire", label: "Entire place" },
  { id: "room", label: "Room" },
  { id: "shared", label: "Shared room" },
];

export const propertyTypes: FilterChip[] = [
  { id: "Apartment", label: "Apartment" },
  { id: "Villa", label: "Villa" },
  { id: "House", label: "House" },
  { id: "Loft", label: "Loft" },
  { id: "Studio", label: "Studio" },
  { id: "Penthouse", label: "Penthouse" },
  { id: "Guesthouse", label: "Guesthouse" },
  { id: "Cottage", label: "Cottage" },
];

export const amenityFilters: Array<{ id: string; label: string; icon: AmenityIcon }> = [
  { id: "pool", label: "Pool", icon: "pool" },
  { id: "beach", label: "Beach access", icon: "beach" },
  { id: "gym", label: "Gym", icon: "gym" },
  { id: "parking", label: "Free parking", icon: "parking" },
  { id: "workspace", label: "Workspace", icon: "workspace" },
  { id: "washer", label: "Washer", icon: "washer" },
  { id: "pets", label: "Pets allowed", icon: "pets" },
  { id: "breakfast", label: "Breakfast", icon: "breakfast" },
];

export const sortOptions: FilterChip[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
];

/** Price slider bounds, in AED per night. */
export const PRICE_MIN = 100;
export const PRICE_MAX = 6500;

/** Service types offered in the Services search field. */
export const serviceTypeOptions: string[] = [
  "Photography",
  "Chefs",
  "Training",
  "Makeup",
  "Hair",
  "Massage",
];
