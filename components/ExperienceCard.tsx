import Link from "next/link";
import type { Experience } from "@/types/experience";
import { formatPrice } from "@/lib/formatters";
import CardBadge from "./CardBadge";
import CardImage from "./CardImage";
import FavoriteButton from "./FavoriteButton";
import PriceDisplay from "./PriceDisplay";
import Rating from "./Rating";

interface ExperienceCardProps {
  experience: Experience;
  /** Shows the start-time chip instead of the badge (used by "tomorrow" rails). */
  showTime?: boolean;
  priority?: boolean;
  sizes?: string;
}

export default function ExperienceCard({
  experience,
  showTime = false,
  priority,
  sizes,
}: ExperienceCardProps) {
  const chip = showTime ? experience.startTime : experience.badge;

  return (
    <article className="group relative">
      <FavoriteButton
        id={experience.id}
        kind="experience"
        label={experience.title}
        className="absolute top-2.5 right-2.5 z-10"
      />
      {chip && <CardBadge>{chip}</CardBadge>}

      <Link
        href={`/experiences/${experience.id}`}
        aria-label={`${experience.title} in ${experience.city}, from ${formatPrice(experience.price)} per ${experience.priceUnit}, rated ${experience.rating}`}
        className="block rounded-xl"
      >
        <CardImage
          src={experience.images[0]}
          alt={`${experience.title} in ${experience.city}`}
          aspect={showTime ? "aspect-[4/3]" : "aspect-square"}
          priority={priority}
          sizes={sizes}
        />

        <div className="pt-2.5">
          <h3 className="line-clamp-fix text-[15px] leading-tight font-medium text-ink [-webkit-line-clamp:2]">
            {experience.title}
          </h3>
          <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-sm leading-snug text-muted">
            <PriceDisplay
              mode="from"
              price={experience.price}
              unit={experience.priceUnit}
            />
            <span aria-hidden="true">·</span>
            <Rating value={experience.rating} />
          </p>
        </div>
      </Link>
    </article>
  );
}
