import type { BadgeLabel, Host, Review } from "./listing";

/** Whether the quoted price is charged per person or for the whole party. */
export type PricingUnit = "guest" | "group";

export interface Experience {
  id: string;
  kind: "experience";
  title: string;
  city: string;
  country: string;
  /** Starting price in AED. */
  price: number;
  priceUnit: PricingUnit;
  /** Some listings quote a minimum spend instead of a flat rate. */
  minimumSpend?: number;
  rating: number;
  reviewCount: number;
  badge?: BadgeLabel;
  /** Start time shown as a chip on "tomorrow"-style rails, e.g. "7:30 AM". */
  startTime?: string;
  durationHours: number;
  groupSize: number;
  images: string[];
  description: string;
  /** Bullet list of what the guest will do. */
  highlights: string[];
  included: string[];
  meetingPoint: string;
  languages: string[];
  host: Host;
  reviews: Review[];
  category: string;
  /** Marks the in-house curated collection (our "Originals" equivalent). */
  isOriginal?: boolean;
}
