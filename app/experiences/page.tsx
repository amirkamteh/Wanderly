import type { Metadata } from "next";
import InspirationSection from "@/components/InspirationSection";
import ListingRow from "@/components/ListingRow";
import { BRAND } from "@/data/footer";
import {
  getExperiencesInCity,
  getOriginalExperiences,
  getScheduledExperiences,
  getWeekendExperiences,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Desert safaris, food crawls, mountain day trips and craft workshops hosted by people who live there. Book by the hour or the day.",
  alternates: { canonical: "/experiences" },
};

export default async function ExperiencesPage() {
  const [dubai, scheduled, weekend, originals] = await Promise.all([
    getExperiencesInCity("Dubai"),
    getScheduledExperiences(),
    getWeekendExperiences("Dubai"),
    getOriginalExperiences(),
  ]);

  return (
    <div className="space-y-10 py-6 sm:py-8">
      <h1 className="sr-only">Experiences on Wanderly</h1>

      <ListingRow
        kind="experiences"
        title="Popular experiences in Dubai"
        href="/search?tab=experiences&where=Dubai"
        items={dubai}
        priority
      />

      <ListingRow
        kind="experiences"
        title="Tomorrow in Dubai"
        href="/search?tab=experiences&where=Dubai"
        items={scheduled}
        showTimes
      />

      <ListingRow
        kind="experiences"
        title="Experiences this weekend"
        href="/search?tab=experiences"
        items={weekend}
      />

      <ListingRow
        kind="experiences"
        title={`${BRAND.name} Signatures`}
        href="/search?tab=experiences"
        subtitle="A small collection we produce ourselves with makers, chefs and guides."
        items={originals}
      />

      <InspirationSection />
    </div>
  );
}
