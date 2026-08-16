import type { Metadata } from "next";
import InspirationSection from "@/components/InspirationSection";
import ListingRow from "@/components/ListingRow";
import {
  getExperiencesInCity,
  getHomesInCity,
  getHomesWithTag,
  getServicesInCategory,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Homes, experiences and services worth the trip",
  description:
    "Browse popular homes in Abu Dhabi, Palm Jumeirah, Tbilisi, Almaty, Istanbul, Baku and Ras Al Khaimah, plus experiences and local services.",
  alternates: { canonical: "/" },
};

/**
 * Landing page. Every rail is a live query against Postgres, issued in
 * parallel so the page costs one round trip rather than a dozen.
 */
export default async function HomePage() {
  const [
    abuDhabi,
    hotels,
    palmJumeirah,
    tbilisi,
    dubaiExperiences,
    photography,
    almaty,
    istanbul,
    jbr,
    baku,
    rasAlKhaimah,
  ] = await Promise.all([
    getHomesInCity("Abu Dhabi"),
    getHomesWithTag("hotel"),
    getHomesInCity("Palm Jumeirah"),
    getHomesInCity("Tbilisi", 14),
    getExperiencesInCity("Dubai", 6),
    getServicesInCategory("photography"),
    getHomesInCity("Almaty"),
    getHomesInCity("Istanbul"),
    getHomesInCity("JBR Beach"),
    getHomesInCity("Baku"),
    getHomesInCity("Ras Al Khaimah City"),
  ]);

  return (
    <div className="space-y-10 py-6 sm:py-8">
      <h1 className="sr-only">
        Wanderly — homes, experiences and services worth the trip
      </h1>

      <ListingRow
        kind="homes"
        title="Popular homes in Abu Dhabi"
        href="/search?tab=homes&where=Abu%20Dhabi"
        items={abuDhabi}
        priority
      />

      <ListingRow
        kind="homes"
        title="Great hotels for your next trip"
        href="/search?tab=homes&place=room"
        subtitle="Plus, earn travel credit when you stay at a featured hotel."
        items={hotels}
      />

      <ListingRow
        kind="homes"
        title="Available in Palm Jumeirah this weekend"
        href="/search?tab=homes&where=Palm%20Jumeirah"
        items={palmJumeirah}
      />

      <ListingRow
        kind="homes"
        title="Stay in Tbilisi"
        href="/search?tab=homes&where=Tbilisi"
        items={tbilisi.slice(0, 7)}
      />

      <ListingRow
        kind="homes"
        title="Available next month in Tbilisi"
        href="/search?tab=homes&where=Tbilisi"
        items={tbilisi.slice(7)}
      />

      <ListingRow
        kind="experiences"
        title="Popular experiences in Dubai"
        href="/experiences"
        items={dubaiExperiences}
      />

      <ListingRow
        kind="services"
        title="Capture memories nearby"
        href="/services?category=photography"
        items={photography}
      />

      <ListingRow
        kind="homes"
        title="Homes in Almaty"
        href="/search?tab=homes&where=Almaty"
        items={almaty}
      />

      <ListingRow
        kind="homes"
        title="Available next month in Istanbul"
        href="/search?tab=homes&where=Istanbul"
        items={istanbul}
      />

      <ListingRow
        kind="homes"
        title="Places to stay in JBR Beach"
        href="/search?tab=homes&where=JBR%20Beach"
        items={jbr}
      />

      <ListingRow
        kind="homes"
        title="Check out homes in Baku"
        href="/search?tab=homes&where=Baku"
        items={baku}
      />

      <ListingRow
        kind="homes"
        title="Popular homes in Ras Al Khaimah City"
        href="/search?tab=homes&where=Ras%20Al%20Khaimah%20City"
        items={rasAlKhaimah}
      />

      <InspirationSection />
    </div>
  );
}
