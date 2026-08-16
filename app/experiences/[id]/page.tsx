import { Check, Clock, Languages, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingCard from "@/components/BookingCard";
import DetailTopBar from "@/components/DetailTopBar";
import HostCard from "@/components/HostCard";
import ImageGallery from "@/components/ImageGallery";
import ListingRow from "@/components/ListingRow";
import Rating from "@/components/Rating";
import ReviewList from "@/components/ReviewList";
import { getExperienceById, getExperiencesInCity } from "@/lib/queries";
import { formatDuration, formatPrice } from "@/lib/formatters";
import { pluralize } from "@/lib/utils";

export async function generateMetadata(
  props: PageProps<"/experiences/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const experience = await getExperienceById(id);
  if (!experience) return { title: "Experience not found" };

  const description = `${experience.title} in ${experience.city}. ${formatDuration(experience.durationHours)}, up to ${experience.groupSize} guests, from ${formatPrice(experience.price)} per ${experience.priceUnit}.`;

  return {
    title: experience.title,
    description,
    alternates: { canonical: `/experiences/${experience.id}` },
    openGraph: {
      title: `${experience.title} — ${experience.city}`,
      description,
      images: [
        { url: experience.images[0], width: 1200, height: 900, alt: experience.title },
      ],
      type: "website",
    },
  };
}

export default async function ExperienceDetailPage(
  props: PageProps<"/experiences/[id]">,
) {
  const { id } = await props.params;
  const experience = await getExperienceById(id);
  if (!experience) notFound();

  const facts = [
    { icon: Clock, label: "Duration", value: formatDuration(experience.durationHours) },
    { icon: Users, label: "Group size", value: `Up to ${experience.groupSize} guests` },
    { icon: Languages, label: "Hosted in", value: experience.languages.join(", ") },
    { icon: MapPin, label: "Location", value: `${experience.city}, ${experience.country}` },
  ];

  const similar = (await getExperiencesInCity(experience.city, 9)).filter(
    (other) => other.id !== experience.id,
  );

  return (
    <article className="pb-12">
      <div className="mx-auto max-w-[1280px] page-gutter pt-4">
        <DetailTopBar id={experience.id} kind="experience" title={experience.title} />

        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[26px]">
          {experience.title}
        </h1>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted">
          <Rating value={experience.rating} variant="detail" className="text-ink" />
          <span aria-hidden="true">·</span>
          <span className="underline underline-offset-2">
            {experience.reviewCount} reviews
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {experience.city}, {experience.country}
          </span>
          {experience.isOriginal && (
            <>
              <span aria-hidden="true">·</span>
              <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-800">
                Signature
              </span>
            </>
          )}
        </p>

        <div className="mt-4">
          <ImageGallery images={experience.images} alt={experience.title} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="min-w-0">
            <section className="pb-8">
              <h2 className="sr-only">Key details</h2>
              <ul className="grid gap-5 sm:grid-cols-2">
                {facts.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-4">
                    <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-ink" />
                    <span>
                      <span className="block text-[15px] font-medium text-ink">{label}</span>
                      <span className="block text-sm text-muted">{value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-line py-8">
              <h2 className="mb-4 text-xl font-semibold text-ink">
                What you&rsquo;ll do
              </h2>
              {experience.description.split("\n\n").map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-4 max-w-prose text-[15px] leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}

              <ul className="mt-2 space-y-3">
                {experience.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    <span className="text-[15px] text-ink">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-line py-8">
              <h2 className="mb-5 text-xl font-semibold text-ink">What&rsquo;s included</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {experience.included.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    <span className="text-[15px] text-muted">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-line py-8">
              <h2 className="mb-3 text-xl font-semibold text-ink">Where you&rsquo;ll meet</h2>
              <p className="max-w-prose text-[15px] leading-relaxed text-muted">
                {experience.meetingPoint}
              </p>
            </section>

            <ReviewList
              reviews={experience.reviews}
              rating={experience.rating}
              reviewCount={experience.reviewCount}
            />

            <HostCard host={experience.host} />
          </div>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <BookingCard
              listingId={experience.id}
              listingKind="experience"
              mode="flat"
              price={experience.price}
              unitLabel={`per ${experience.priceUnit}`}
              rating={experience.rating}
              reviewCount={experience.reviewCount}
              maxGuests={experience.groupSize}
              serviceFeeRate={0.1}
            />
            <p className="mt-3 text-center text-sm text-muted">
              {pluralize(experience.groupSize, "spot")} per departure
            </p>
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <ListingRow
            kind="experiences"
            title={`More experiences in ${experience.city}`}
            href={`/search?tab=experiences&where=${encodeURIComponent(experience.city)}`}
            items={similar}
          />
        </div>
      )}
    </article>
  );
}
