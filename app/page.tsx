import type { Metadata } from "next";
import InspirationSection from "@/components/InspirationSection";
import ListingRow from "@/components/ListingRow";
import { experiencesInCity } from "@/data/experiences";
import { homesInCity, homesWithTag } from "@/data/homes";
import { servicesInCategory } from "@/data/services";

export const metadata: Metadata = {
  title: "Homes, experiences and services worth the trip",
  description:
    "Browse popular homes in Abu Dhabi, Palm Jumeirah, Tbilisi, Almaty, Istanbul, Baku and Ras Al Khaimah, plus experiences and local services.",
  alternates: { canonical: "/" },
};

/**
 * Landing page. Mirrors the section order of the reference: stay rails
 * interleaved with one experiences rail and one services rail, closing with
 * the inspiration grid.
 */
export default function HomePage() {
  return (
    <div className="space-y-10 py-6 sm:py-8">
      <h1 className="sr-only">
        Wanderly — homes, experiences and services worth the trip
      </h1>

      <ListingRow
        kind="homes"
        title="Popular homes in Abu Dhabi"
        href="/search?tab=homes&where=Abu%20Dhabi"
        items={homesInCity("Abu Dhabi")}
        priority
      />

      <ListingRow
        kind="homes"
        title="Great hotels for your next trip"
        href="/search?tab=homes&place=room"
        subtitle="Plus, earn travel credit when you stay at a featured hotel."
        items={homesWithTag("hotel")}
      />

      <ListingRow
        kind="homes"
        title="Available in Palm Jumeirah this weekend"
        href="/search?tab=homes&where=Palm%20Jumeirah"
        items={homesInCity("Palm Jumeirah")}
      />

      <ListingRow
        kind="homes"
        title="Stay in Tbilisi"
        href="/search?tab=homes&where=Tbilisi"
        items={homesInCity("Tbilisi").slice(0, 7)}
      />

      <ListingRow
        kind="homes"
        title="Available next month in Tbilisi"
        href="/search?tab=homes&where=Tbilisi"
        items={homesInCity("Tbilisi").slice(7)}
      />

      <ListingRow
        kind="experiences"
        title="Popular experiences in Dubai"
        href="/experiences"
        items={experiencesInCity("Dubai").slice(0, 6)}
      />

      <ListingRow
        kind="services"
        title="Capture memories nearby"
        href="/services?category=photography"
        items={servicesInCategory("photography")}
      />

      <ListingRow
        kind="homes"
        title="Homes in Almaty"
        href="/search?tab=homes&where=Almaty"
        items={homesInCity("Almaty")}
      />

      <ListingRow
        kind="homes"
        title="Available next month in Istanbul"
        href="/search?tab=homes&where=Istanbul"
        items={homesInCity("Istanbul")}
      />

      <ListingRow
        kind="homes"
        title="Places to stay in JBR Beach"
        href="/search?tab=homes&where=JBR%20Beach"
        items={homesInCity("JBR Beach")}
      />

      <ListingRow
        kind="homes"
        title="Check out homes in Baku"
        href="/search?tab=homes&where=Baku"
        items={homesInCity("Baku")}
      />

      <ListingRow
        kind="homes"
        title="Popular homes in Ras Al Khaimah City"
        href="/search?tab=homes&where=Ras%20Al%20Khaimah%20City"
        items={homesInCity("Ras Al Khaimah City")}
      />

      <InspirationSection />
    </div>
  );
}
