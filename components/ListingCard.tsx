import Link from "next/link";
import type { Home } from "@/types/listing";
import { formatPrice } from "@/lib/formatters";
import CardBadge from "./CardBadge";
import CardImage from "./CardImage";
import FavoriteButton from "./FavoriteButton";
import PriceDisplay from "./PriceDisplay";
import Rating from "./Rating";

interface ListingCardProps {
  home: Home;
  /** Above-the-fold cards skip lazy loading. */
  priority?: boolean;
  sizes?: string;
}

/** Card for a stay: square photo, badge, heart, then title, price and rating. */
export default function ListingCard({ home, priority, sizes }: ListingCardProps) {
  return (
    <article className="group relative">
      <FavoriteButton
        id={home.id}
        kind="home"
        label={home.title}
        className="absolute top-2.5 right-2.5 z-10"
      />
      {home.badge && <CardBadge>{home.badge}</CardBadge>}

      <Link
        href={`/homes/${home.id}`}
        aria-label={`${home.name} — ${home.title}, ${formatPrice(home.price)} per night, rated ${home.rating}`}
        className="block rounded-xl"
      >
        <CardImage
          src={home.images[0]}
          alt={`${home.name} — ${home.propertyType.toLowerCase()} in ${home.city}`}
          priority={priority}
          sizes={sizes}
        />

        <div className="pt-2.5">
          <h3 className="truncate text-[15px] leading-tight font-medium text-ink">
            {home.title}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm leading-snug text-muted">
            <PriceDisplay mode="stay" price={home.price} nights={home.nights} />
            <span aria-hidden="true">·</span>
            <Rating value={home.rating} />
          </p>
        </div>
      </Link>
    </article>
  );
}
