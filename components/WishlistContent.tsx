"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import ListingCard from "@/components/ListingCard";
import ListingGrid from "@/components/ListingGrid";
import LoadingCard from "@/components/LoadingCard";
import ServiceCard from "@/components/ServiceCard";
import { experiences } from "@/data/experiences";
import { homes } from "@/data/homes";
import { services } from "@/data/services";
import { useWishlist } from "@/lib/wishlist";
import { pluralize } from "@/lib/utils";

const GRID_SIZES =
  "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, (max-width: 1280px) 31vw, 23vw";

export default function WishlistContent() {
  const { items, ready, clear } = useWishlist();

  // Resolve saved ids back to listings, newest first.
  const saved = useMemo(() => {
    const ids = new Set(items.map((item) => item.id));
    const order = new Map(items.map((item, index) => [item.id, index]));
    const by = <T extends { id: string }>(list: T[]) =>
      list.filter((entry) => ids.has(entry.id)).sort(
        (a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0),
      );

    return {
      homes: by(homes),
      experiences: by(experiences),
      services: by(services),
    };
  }, [items]);

  const total = saved.homes.length + saved.experiences.length + saved.services.length;

  if (!ready) {
    return (
      <div className="mx-auto max-w-[1760px] page-gutter py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-surface" />
        <ListingGrid className="mt-8">
          {Array.from({ length: 4 }, (_, i) => (
            <LoadingCard key={i} />
          ))}
        </ListingGrid>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-surface">
          <Heart aria-hidden="true" className="size-7 text-line-strong" />
        </span>
        <h1 className="mt-6 text-2xl font-semibold text-ink">Your wishlist is empty</h1>
        <p className="mt-2 text-[15px] text-muted">
          Tap the heart on any home, experience or service and it will be waiting
          here when you come back.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Start exploring
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1760px] page-gutter py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[28px]">
            Wishlist
          </h1>
          <p className="mt-1 text-[15px] text-muted">{pluralize(total, "saved item")}</p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink transition hover:border-ink"
        >
          Clear all
        </button>
      </div>

      <div className="mt-10 space-y-12">
        {saved.homes.length > 0 && (
          <section aria-labelledby="saved-homes">
            <h2 id="saved-homes" className="mb-5 text-xl font-semibold text-ink">
              Homes
            </h2>
            <ListingGrid>
              {saved.homes.map((home) => (
                <ListingCard key={home.id} home={home} sizes={GRID_SIZES} />
              ))}
            </ListingGrid>
          </section>
        )}

        {saved.experiences.length > 0 && (
          <section aria-labelledby="saved-experiences">
            <h2 id="saved-experiences" className="mb-5 text-xl font-semibold text-ink">
              Experiences
            </h2>
            <ListingGrid>
              {saved.experiences.map((experience) => (
                <ExperienceCard
                  key={experience.id}
                  experience={experience}
                  sizes={GRID_SIZES}
                />
              ))}
            </ListingGrid>
          </section>
        )}

        {saved.services.length > 0 && (
          <section aria-labelledby="saved-services">
            <h2 id="saved-services" className="mb-5 text-xl font-semibold text-ink">
              Services
            </h2>
            <ListingGrid>
              {saved.services.map((service) => (
                <ServiceCard key={service.id} service={service} sizes={GRID_SIZES} />
              ))}
            </ListingGrid>
          </section>
        )}
      </div>
    </div>
  );
}
