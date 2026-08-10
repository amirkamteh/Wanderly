import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/data/footer";

export const metadata: Metadata = {
  title: "Help Centre",
  description:
    "Answers on bookings, cancellations, safety, accessibility and how Wanderly works.",
  alternates: { canonical: "/help" },
};

const TOPICS = [
  { id: "safety", title: "Get help with a safety issue", body: "If you feel unsafe during a stay or an experience, contact local emergency services first, then our safety line, which is staffed around the clock." },
  { id: "cover", title: "Wanderly Cover", body: "Every confirmed booking includes damage protection for hosts and rebooking help for guests if a listing is not as described." },
  { id: "anti-discrimination", title: "Anti-discrimination", body: "Hosts and guests agree to treat everyone on the platform without bias. Reports are reviewed by a dedicated team." },
  { id: "accessibility", title: "Disability support", body: "Listings can record step-free access, wide doorways and accessible bathrooms. Filter for them before you book, and message the host to confirm." },
  { id: "cancellations", title: "Cancellation options", body: "Each listing states its own policy — flexible, moderate or strict — on the booking card before you confirm." },
  { id: "neighbourhood", title: "Report a neighbourhood concern", body: "Concerns about noise, parties or unsafe behaviour at a nearby listing can be reported without having an account." },
  { id: "release", title: "2026 Summer Release", body: "The release that introduced services alongside homes and experiences, plus a redesigned search across all three." },
  { id: "newsroom", title: "Newsroom", body: "Announcements, product releases and data on how travel patterns are shifting across our regions." },
  { id: "careers", title: "Careers", body: "We hire across engineering, design, trust and safety, and city operations." },
  { id: "investors", title: "Investors", body: "Quarterly results, filings and the annual letter." },
  { id: "emergency", title: "Emergency stays", body: "Free, temporary housing for people displaced by conflict or disaster, funded by us and hosted by volunteers." },
  { id: "privacy", title: "Privacy", body: "What we collect, why we collect it and how to request a copy or deletion of your data." },
  { id: "terms", title: "Terms", body: "The agreement between you and Wanderly covering bookings, payments, cancellations and disputes." },
  { id: "sitemap", title: "Sitemap", body: "Every public section of the site in one list." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-[900px] page-gutter py-12">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
        Help Centre
      </h1>
      <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-muted">
        This is a portfolio build of {BRAND.name}, so there is no live support desk
        behind these pages — but here is how each area is meant to work.
      </p>

      <div className="mt-10 divide-y divide-line border-t border-line">
        {TOPICS.map((topic) => (
          <section key={topic.id} id={topic.id} className="scroll-mt-32 py-6">
            <h2 className="text-lg font-semibold text-ink">{topic.title}</h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{topic.body}</p>
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="mt-10 inline-block rounded-xl border border-ink px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface"
      >
        Back to explore
      </Link>
    </div>
  );
}
