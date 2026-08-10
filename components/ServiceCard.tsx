import Link from "next/link";
import type { Service } from "@/types/service";
import { formatPrice } from "@/lib/formatters";
import CardBadge from "./CardBadge";
import CardImage from "./CardImage";
import FavoriteButton from "./FavoriteButton";
import PriceDisplay from "./PriceDisplay";
import Rating from "./Rating";

interface ServiceCardProps {
  service: Service;
  priority?: boolean;
  sizes?: string;
}

export default function ServiceCard({ service, priority, sizes }: ServiceCardProps) {
  return (
    <article className="group relative">
      <FavoriteButton
        id={service.id}
        kind="service"
        label={service.title}
        className="absolute top-2.5 right-2.5 z-10"
      />
      {service.badge && <CardBadge>{service.badge}</CardBadge>}

      <Link
        href={`/services/${service.id}`}
        aria-label={`${service.title} by ${service.provider} in ${service.city}, from ${formatPrice(service.price)} per ${service.priceUnit}, rated ${service.rating}`}
        className="block rounded-xl"
      >
        <CardImage
          src={service.images[0]}
          alt={`${service.title} by ${service.provider} in ${service.city}`}
          aspect="aspect-[11/10]"
          priority={priority}
          sizes={sizes}
        />

        <div className="pt-2.5">
          <h3 className="line-clamp-fix text-[15px] leading-tight font-medium text-ink [-webkit-line-clamp:2]">
            {service.title} by {service.provider}
          </h3>
          <p className="mt-1 text-sm leading-snug text-muted">
            <PriceDisplay mode="from" price={service.price} unit={service.priceUnit} />
          </p>
          {service.minimumSpend ? (
            <p className="text-sm leading-snug text-muted">
              Minimum {formatPrice(service.minimumSpend)} to book ·{" "}
              <Rating value={service.rating} />
            </p>
          ) : (
            <p className="text-sm leading-snug text-muted">
              <Rating value={service.rating} />
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
