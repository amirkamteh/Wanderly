import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import ExperienceCard from "@/components/ExperienceCard";
import ListingCard from "@/components/ListingCard";
import ListingGrid from "@/components/ListingGrid";
import SearchControls from "@/components/SearchControls";
import ServiceCard from "@/components/ServiceCard";
import { formatDateRange } from "@/lib/formatters";
import { searchExperiences, searchHomes, searchServices } from "@/lib/queries";
import { filtersFromParams, isSearchTab } from "@/lib/search";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Filter homes, experiences and services by destination, dates, guests, price, rooms, amenities and rating.",
  robots: { index: false, follow: true },
};

const GRID_SIZES =
  "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, (max-width: 1280px) 31vw, 23vw";

/**
 * Results are rendered on the server from a filtered Postgres query, so the
 * browser only ever receives the rows it displays.
 */
export default async function SearchPage(props: PageProps<"/search">) {
  const raw = await props.searchParams;

  // `searchParams` values may be arrays; flatten to the first value.
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  const tabParam = params.get("tab");
  const tab = isSearchTab(tabParam) ? tabParam : "homes";
  const serviceType = params.get("service") ?? undefined;
  const filters = filtersFromParams(params);

  const [homes, experiences, services] = await Promise.all([
    tab === "homes" ? searchHomes(filters) : Promise.resolve([]),
    tab === "experiences" ? searchExperiences(filters) : Promise.resolve([]),
    tab === "services" ? searchServices(filters, serviceType) : Promise.resolve([]),
  ]);

  const total =
    tab === "homes"
      ? homes.length
      : tab === "experiences"
        ? experiences.length
        : services.length;

  const noun = tab === "homes" ? "stay" : tab === "experiences" ? "experience" : "service";
  const dates = formatDateRange(params.get("checkIn"), params.get("checkOut"));
  const guests = Number(params.get("guests") ?? 0);
  const summary = [
    dates || null,
    guests ? pluralize(guests, "guest") : null,
    serviceType ?? null,
  ].filter(Boolean);

  return (
    <div className="mx-auto max-w-[1760px] page-gutter py-6">
      <header className="mb-5">
        <h1 className="text-xl font-semibold tracking-[-0.01em] text-ink sm:text-2xl">
          {`${total} ${total === 1 ? noun : `${noun}s`}${
            filters.destination ? ` in ${filters.destination}` : " worldwide"
          }`}
        </h1>
        {summary.length > 0 && (
          <p className="mt-1 text-[15px] text-muted">{summary.join(" · ")}</p>
        )}
      </header>

      <Suspense fallback={<div className="mb-8 h-24" />}>
        <SearchControls tab={tab} />
      </Suspense>

      <div className="mt-8">
        {total === 0 ? (
          <EmptyResults />
        ) : (
          <ListingGrid>
            {homes.map((home, index) => (
              <ListingCard
                key={home.id}
                home={home}
                priority={index < 4}
                sizes={GRID_SIZES}
              />
            ))}
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                priority={index < 4}
                sizes={GRID_SIZES}
              />
            ))}
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                priority={index < 4}
                sizes={GRID_SIZES}
              />
            ))}
          </ListingGrid>
        )}
      </div>
    </div>
  );
}

function EmptyResults() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <SearchX aria-hidden="true" className="mx-auto size-10 text-line-strong" />
      <h2 className="mt-4 text-lg font-semibold text-ink">No exact matches</h2>
      <p className="mt-2 text-[15px] text-muted">
        Try removing a filter or searching a wider area — there is plenty available
        nearby.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/search?tab=homes"
          className="rounded-xl border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface"
        >
          Search everywhere
        </Link>
        <Link
          href="/"
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Back to explore
        </Link>
      </div>
    </div>
  );
}
