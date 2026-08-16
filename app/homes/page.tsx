import type { Metadata } from "next";
import InspirationSection from "@/components/InspirationSection";
import ListingRow from "@/components/ListingRow";
import { getHomesInCity, getHomesWithTag } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Homes",
  description:
    "Apartments, villas, lofts and hotel rooms across the Gulf, the Caucasus, Europe and Southeast Asia. Compare nightly rates and guest ratings.",
  alternates: { canonical: "/homes" },
};

const CITY_RAILS: Array<{ city: string; title: string }> = [
  { city: "Abu Dhabi", title: "Popular homes in Abu Dhabi" },
  { city: "Palm Jumeirah", title: "Available in Palm Jumeirah this weekend" },
  { city: "Dubai", title: "Stay in Dubai" },
  { city: "JBR Beach", title: "Places to stay in JBR Beach" },
  { city: "Ras Al Khaimah City", title: "Popular homes in Ras Al Khaimah City" },
  { city: "Tbilisi", title: "Stay in Tbilisi" },
  { city: "Almaty", title: "Homes in Almaty" },
  { city: "Istanbul", title: "Available next month in Istanbul" },
  { city: "Baku", title: "Check out homes in Baku" },
];

export default async function HomesPage() {
  const [cityRails, hotels] = await Promise.all([
    Promise.all(CITY_RAILS.map((rail) => getHomesInCity(rail.city))),
    getHomesWithTag("hotel"),
  ]);

  return (
    <div className="space-y-10 py-6 sm:py-8">
      <h1 className="sr-only">Homes on Wanderly</h1>

      {CITY_RAILS.map((rail, index) => (
        <ListingRow
          key={rail.city}
          kind="homes"
          title={rail.title}
          href={`/search?tab=homes&where=${encodeURIComponent(rail.city)}`}
          items={cityRails[index]}
          priority={index === 0}
        />
      ))}

      <ListingRow
        kind="homes"
        title="Great hotels for your next trip"
        href="/search?tab=homes&place=room"
        subtitle="Plus, earn travel credit when you stay at a featured hotel."
        items={hotels}
      />

      <InspirationSection />
    </div>
  );
}
