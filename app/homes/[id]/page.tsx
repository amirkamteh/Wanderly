import { BedDouble, DoorOpen, Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingCard from "@/components/BookingCard";
import DetailTopBar from "@/components/DetailTopBar";
import HostCard from "@/components/HostCard";
import ImageGallery from "@/components/ImageGallery";
import ListingRow from "@/components/ListingRow";
import LocationSection from "@/components/LocationSection";
import Rating from "@/components/Rating";
import ReviewList from "@/components/ReviewList";
import { getHomeById, homes } from "@/data/homes";
import { amenityIcons } from "@/lib/amenities";
import { formatPrice } from "@/lib/formatters";
import { pluralize } from "@/lib/utils";

/** Pre-render every stay at build time — the catalogue is fully static. */
export function generateStaticParams() {
  return homes.map((home) => ({ id: home.id }));
}

export async function generateMetadata(
  props: PageProps<"/homes/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const home = getHomeById(id);
  if (!home) return { title: "Home not found" };

  const description = `${home.name} in ${home.area}, ${home.city}. Sleeps ${home.guests} across ${pluralize(home.bedrooms, "bedroom")}. ${formatPrice(home.price)} per night, rated ${home.rating} from ${home.reviewCount} reviews.`;

  return {
    title: `${home.title} · ${home.name}`,
    description,
    alternates: { canonical: `/homes/${home.id}` },
    openGraph: {
      title: `${home.name} — ${home.city}`,
      description,
      images: [{ url: home.images[0], width: 1200, height: 900, alt: home.name }],
      type: "website",
    },
  };
}

export default async function HomeDetailPage(props: PageProps<"/homes/[id]">) {
  const { id } = await props.params;
  const home = getHomeById(id);
  if (!home) notFound();

  const placeLabel =
    home.placeType === "entire"
      ? `Entire ${home.propertyType.toLowerCase()}`
      : home.placeType === "room"
        ? "Room"
        : "Shared room";

  const similar = homes
    .filter((other) => other.city === home.city && other.id !== home.id)
    .slice(0, 8);

  return (
    <article className="pb-12">
      <div className="mx-auto max-w-[1280px] page-gutter pt-4">
        <DetailTopBar id={home.id} kind="home" title={home.name} />

        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[26px]">
          {home.name}
        </h1>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted">
          <Rating value={home.rating} variant="detail" className="text-ink" />
          <span aria-hidden="true">·</span>
          <span className="underline underline-offset-2">
            {home.reviewCount} reviews
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {home.area}, {home.city}, {home.country}
          </span>
        </p>

        <div className="mt-4">
          <ImageGallery images={home.images} alt={home.name} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="min-w-0">
            <section className="pb-8">
              <h2 className="text-xl font-semibold text-ink">
                {placeLabel} in {home.city}
              </h2>
              <p className="mt-1 text-[15px] text-muted">
                {pluralize(home.guests, "guest")} ·{" "}
                {pluralize(home.bedrooms, "bedroom")} · {pluralize(home.beds, "bed")} ·{" "}
                {pluralize(home.bathrooms, "bathroom")}
              </p>

              {home.badge && (
                <p className="mt-5 flex items-start gap-3 rounded-2xl border border-line p-4">
                  <Star aria-hidden="true" className="mt-0.5 size-5 shrink-0 fill-current" />
                  <span>
                    <span className="block text-[15px] font-semibold text-ink">
                      {home.badge}
                    </span>
                    <span className="block text-sm text-muted">
                      One of the most loved homes in {home.city}, based on ratings and
                      reliability.
                    </span>
                  </span>
                </p>
              )}
            </section>

            <section className="border-t border-line py-8">
              <h2 className="mb-4 text-xl font-semibold text-ink">About this place</h2>
              {home.description.split("\n\n").map((paragraph) => (
                <p key={paragraph} className="mb-4 max-w-prose text-[15px] leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="border-t border-line py-8">
              <h2 className="mb-5 text-xl font-semibold text-ink">Where you&rsquo;ll sleep</h2>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {home.sleeping.map((arrangement) => (
                  <li
                    key={arrangement.room}
                    className="rounded-2xl border border-line p-5"
                  >
                    <BedDouble aria-hidden="true" className="mb-3 size-6 text-ink" />
                    <p className="text-[15px] font-medium text-ink">{arrangement.room}</p>
                    <p className="text-sm text-muted">{arrangement.beds}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-line py-8">
              <h2 className="mb-5 text-xl font-semibold text-ink">What this place offers</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {home.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity.icon];
                  return (
                    <li key={amenity.label} className="flex items-center gap-4">
                      <Icon aria-hidden="true" className="size-5 shrink-0 text-ink" />
                      <span className="text-[15px] text-ink">{amenity.label}</span>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="border-t border-line py-8">
              <h2 className="mb-5 text-xl font-semibold text-ink">House rules</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {home.houseRules.map((rule) => (
                  <li key={rule} className="flex items-center gap-4">
                    <DoorOpen aria-hidden="true" className="size-5 shrink-0 text-ink" />
                    <span className="text-[15px] text-muted">{rule}</span>
                  </li>
                ))}
              </ul>
            </section>

            <ReviewList
              reviews={home.reviews}
              rating={home.rating}
              reviewCount={home.reviewCount}
            />

            <LocationSection
              area={home.area}
              city={home.city}
              country={home.country}
              coordinates={home.coordinates}
            />

            <HostCard host={home.host} />
          </div>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <BookingCard
              mode="stay"
              price={home.price}
              rating={home.rating}
              reviewCount={home.reviewCount}
              maxGuests={home.guests}
            />
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <ListingRow
            kind="homes"
            title={`More places to stay in ${home.city}`}
            href={`/search?tab=homes&where=${encodeURIComponent(home.city)}`}
            items={similar}
          />
        </div>
      )}
    </article>
  );
}
