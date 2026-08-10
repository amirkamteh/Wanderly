import type { Metadata } from "next";
import CategoryNavigation from "@/components/CategoryNavigation";
import InspirationSection from "@/components/InspirationSection";
import ListingRow from "@/components/ListingRow";
import {
  serviceCategories,
  services,
  servicesInCategory,
  servicesInCity,
} from "@/data/services";
import type { ServiceCategorySlug } from "@/types/service";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Photographers, private chefs, trainers, makeup artists, hair stylists and massage therapists who come to you, in Dubai, London, Paris, Bangkok and Tbilisi.",
  alternates: { canonical: "/services" },
};

const CITY_RAILS = ["London", "Paris", "Bangkok", "Tbilisi"];

function isCategory(value: string | undefined): value is ServiceCategorySlug {
  return serviceCategories.some((category) => category.slug === value);
}

export default async function ServicesPage(props: PageProps<"/services">) {
  const params = await props.searchParams;
  const raw = params.category;
  const selected = isCategory(typeof raw === "string" ? raw : undefined)
    ? (raw as ServiceCategorySlug)
    : undefined;

  // When a category is chosen, lead with it; otherwise lead with photography.
  const leadCategory = selected ?? "photography";
  const leadLabel =
    serviceCategories.find((category) => category.slug === leadCategory)?.label ?? "Photography";

  const dubaiRest = servicesInCity("Dubai").filter(
    (service) => service.category !== leadCategory,
  );
  const discover = services.filter((service) => service.city !== "Dubai");

  return (
    <div className="space-y-10 py-6 sm:py-8">
      <h1 className="sr-only">Services on Wanderly</h1>

      <CategoryNavigation city="Dubai" activeSlug={selected} />

      <ListingRow
        kind="services"
        title={leadLabel}
        href={`/search?tab=services&service=${leadLabel}`}
        items={servicesInCategory(leadCategory)}
        priority
      />

      <ListingRow
        kind="services"
        title="More services in Dubai"
        href="/search?tab=services&where=Dubai"
        items={dubaiRest}
      />

      <ListingRow
        kind="services"
        title="Discover services"
        href="/search?tab=services"
        items={discover}
      />

      {CITY_RAILS.map((city) => (
        <ListingRow
          key={city}
          kind="services"
          title={`Services in ${city}`}
          href={`/search?tab=services&where=${encodeURIComponent(city)}`}
          items={servicesInCity(city)}
        />
      ))}

      <InspirationSection />
    </div>
  );
}
