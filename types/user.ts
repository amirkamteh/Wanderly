import type { ListingKind } from "./listing";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

/** A single saved item. Kind is stored so the wishlist can group by section. */
export interface WishlistItem {
  id: string;
  kind: ListingKind;
  savedAt: number;
}

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface DateRange {
  /** ISO `yyyy-mm-dd`, or null when not chosen yet. */
  start: string | null;
  end: string | null;
}

/** Everything the search bar collects, shared across the three verticals. */
export interface SearchQuery {
  destination: string;
  dates: DateRange;
  guests: GuestCounts;
  /** Only used by the Services vertical. */
  serviceType?: string;
}
