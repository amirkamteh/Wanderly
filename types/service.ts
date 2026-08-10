import type { BadgeLabel, Host, Review } from "./listing";
import type { PricingUnit } from "./experience";

export type ServiceCategorySlug =
  | "photography"
  | "chefs"
  | "training"
  | "makeup"
  | "hair"
  | "massage";

export interface ServiceCategory {
  slug: ServiceCategorySlug;
  label: string;
  image: string;
}

export interface Service {
  id: string;
  kind: "service";
  title: string;
  /** Person or studio delivering the service. */
  provider: string;
  category: ServiceCategorySlug;
  city: string;
  country: string;
  price: number;
  priceUnit: PricingUnit;
  minimumSpend?: number;
  rating: number;
  reviewCount: number;
  badge?: BadgeLabel;
  images: string[];
  description: string;
  includes: string[];
  durationMinutes: number;
  host: Host;
  reviews: Review[];
}
