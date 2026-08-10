/** Shared vocabulary for anything that can be shown on a card. */
export type ListingKind = "home" | "experience" | "service";

/** Badge shown in the top-left corner of a card image. */
export type BadgeLabel = "Guest favourite" | "Popular" | "New" | "Rare find";

export interface Host {
  id: string;
  name: string;
  avatar: string;
  isSuperhost: boolean;
  yearsHosting: number;
  responseRate: number;
  /** Short bio used on detail pages. */
  about: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  body: string;
}

export type PlaceType = "entire" | "room" | "shared";

export interface Amenity {
  /** Key mapped to a Lucide icon in `lib/amenities.ts`. */
  icon: AmenityIcon;
  label: string;
}

export type AmenityIcon =
  | "wifi"
  | "kitchen"
  | "parking"
  | "pool"
  | "ac"
  | "tv"
  | "washer"
  | "gym"
  | "workspace"
  | "beach"
  | "pets"
  | "breakfast";

export interface SleepingArrangement {
  room: string;
  beds: string;
}

export interface Home {
  id: string;
  kind: "home";
  /** e.g. "Apartment in Abu Dhabi" — the card headline. */
  title: string;
  /** Longer marketing name used on the detail page. */
  name: string;
  propertyType: string;
  placeType: PlaceType;
  city: string;
  area: string;
  country: string;
  /** Nightly price in AED. */
  price: number;
  /** Nights the quoted total covers on the card. */
  nights: number;
  rating: number;
  reviewCount: number;
  badge?: BadgeLabel;
  images: string[];
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: Amenity[];
  sleeping: SleepingArrangement[];
  houseRules: string[];
  description: string;
  host: Host;
  reviews: Review[];
  /** Free-text tags powering the category and filter chips. */
  tags: string[];
  coordinates: { lat: number; lng: number };
}
