import { Check, Clock, MapPin, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingCard from "@/components/BookingCard";
import DetailTopBar from "@/components/DetailTopBar";
import HostCard from "@/components/HostCard";
import ImageGallery from "@/components/ImageGallery";
import ListingRow from "@/components/ListingRow";
import Rating from "@/components/Rating";
import ReviewList from "@/components/ReviewList";
import { serviceCategories } from "@/data/services";
import { getRelatedServices, getServiceById } from "@/lib/queries";
import { formatMinutes, formatPrice } from "@/lib/formatters";

export async function generateMetadata(
  props: PageProps<"/services/[id]">,
): Promise<Metadata> {
  const { id } = await props.params;
  const service = await getServiceById(id);
  if (!service) return { title: "Service not found" };

  const description = `${service.title} by ${service.provider} in ${service.city}. ${formatMinutes(service.durationMinutes)}, from ${formatPrice(service.price)} per ${service.priceUnit}.`;

  return {
    title: `${service.title} by ${service.provider}`,
    description,
    alternates: { canonical: `/services/${service.id}` },
    openGraph: {
      title: `${service.title} — ${service.city}`,
      description,
      images: [{ url: service.images[0], width: 1200, height: 900, alt: service.title }],
      type: "website",
    },
  };
}

export default async function ServiceDetailPage(props: PageProps<"/services/[id]">) {
  const { id } = await props.params;
  const service = await getServiceById(id);
  if (!service) notFound();

  const categoryLabel =
    serviceCategories.find((category) => category.slug === service.category)?.label ??
    service.category;

  const facts = [
    { icon: Clock, label: "Session length", value: formatMinutes(service.durationMinutes) },
    { icon: MapPin, label: "Serves", value: `${service.city}, ${service.country}` },
    { icon: ShieldCheck, label: "Category", value: categoryLabel },
  ];

  const similar = await getRelatedServices(service);

  return (
    <article className="pb-12">
      <div className="mx-auto max-w-[1280px] page-gutter pt-4">
        <DetailTopBar id={service.id} kind="service" title={service.title} />

        <h1 className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-ink sm:text-[26px]">
          {service.title}
        </h1>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] text-muted">
          <span className="font-medium text-ink">by {service.provider}</span>
          <span aria-hidden="true">·</span>
          <Rating value={service.rating} variant="detail" className="text-ink" />
          <span aria-hidden="true">·</span>
          <span className="underline underline-offset-2">
            {service.reviewCount} reviews
          </span>
          <span aria-hidden="true">·</span>
          <span>
            {service.city}, {service.country}
          </span>
        </p>

        <div className="mt-4">
          <ImageGallery images={service.images} alt={service.title} />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div className="min-w-0">
            <section className="pb-8">
              <h2 className="sr-only">Key details</h2>
              <ul className="grid gap-5 sm:grid-cols-3">
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
              <h2 className="mb-4 text-xl font-semibold text-ink">About this service</h2>
              {service.description.split("\n\n").map((paragraph) => (
                <p
                  key={paragraph}
                  className="mb-4 max-w-prose text-[15px] leading-relaxed text-muted"
                >
                  {paragraph}
                </p>
              ))}
            </section>

            <section className="border-t border-line py-8">
              <h2 className="mb-5 text-xl font-semibold text-ink">What&rsquo;s included</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-600" />
                    <span className="text-[15px] text-muted">{item}</span>
                  </li>
                ))}
              </ul>

              {service.minimumSpend && (
                <p className="mt-5 rounded-xl border border-line bg-surface p-4 text-sm text-muted">
                  A minimum spend of {formatPrice(service.minimumSpend)} applies to this
                  booking.
                </p>
              )}
            </section>

            <ReviewList
              reviews={service.reviews}
              rating={service.rating}
              reviewCount={service.reviewCount}
            />

            <HostCard host={service.host} role="Provider" />
          </div>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <BookingCard
              listingId={service.id}
              listingKind="service"
              mode="flat"
              price={service.price}
              unitLabel={`per ${service.priceUnit}`}
              rating={service.rating}
              reviewCount={service.reviewCount}
              maxGuests={10}
              serviceFeeRate={0.1}
            />
          </aside>
        </div>
      </div>

      {similar.length > 0 && (
        <div className="mt-12">
          <ListingRow
            kind="services"
            title={`More services in ${service.city}`}
            href={`/search?tab=services&where=${encodeURIComponent(service.city)}`}
            items={similar}
          />
        </div>
      )}
    </article>
  );
}
