import type { Metadata } from "next";
import InspirationSection from "@/components/InspirationSection";
import ListingRow from "@/components/ListingRow";
import {
  experiences,
  experiencesInCity,
  originalExperiences,
  scheduledExperiences,
} from "@/data/experiences";
import { BRAND } from "@/data/footer";

export const metadata: Metadata = {
  title: "Experiences",
  description:
    "Desert safaris, food crawls, mountain day trips and craft workshops hosted by people who live there. Book by the hour or the day.",
  alternates: { canonical: "/experiences" },
};

export default function ExperiencesPage() {
  const dubai = experiencesInCity("Dubai");
  const weekend = experiences.filter(
    (experience) => !experience.startTime && !experience.isOriginal && experience.city !== "Dubai",
  );

  return (
    <div className="space-y-10 py-6 sm:py-8">
      <h1 className="sr-only">Experiences on Wanderly</h1>

      <ListingRow
        kind="experiences"
        title="Popular experiences in Dubai"
        href="/search?tab=experiences&where=Dubai"
        items={dubai.filter((experience) => !experience.startTime)}
        priority
      />

      <ListingRow
        kind="experiences"
        title="Tomorrow in Dubai"
        href="/search?tab=experiences&where=Dubai"
        items={scheduledExperiences}
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
        items={originalExperiences}
      />

      <InspirationSection />
    </div>
  );
}
