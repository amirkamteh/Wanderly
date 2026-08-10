import { CalendarDays, HandHeart, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { BRAND } from "@/data/footer";

export const metadata: Metadata = {
  title: "Become a host",
  description:
    "List a home, an experience or a service on Wanderly. Set your own availability, pricing and house rules.",
  alternates: { canonical: "/host" },
};

const PATHS = [
  {
    id: "homes",
    title: "Host a home",
    body: "Rent a spare room, a whole apartment or a villa. You choose the calendar, the nightly rate and who can book.",
    icon: HandHeart,
  },
  {
    id: "experiences",
    title: "Host an experience",
    body: "Turn what you already know — a walk, a kitchen, a workshop — into something travellers can book by the hour.",
    icon: Sparkles,
  },
  {
    id: "services",
    title: "Offer a service",
    body: "Photographers, chefs, trainers and stylists who travel to the guest. Set your radius and your rates.",
    icon: CalendarDays,
  },
];

const SECTIONS = [
  { id: "cover", title: "Wanderly Cover for Hosts", body: "Damage protection and liability cover included on every confirmed booking, at no extra cost." },
  { id: "resources", title: "Hosting resources", body: "Pricing guidance, photography tips and templates for house manuals and check-in instructions." },
  { id: "community", title: "Community forum", body: "Ask questions and compare notes with hosts in your city and further afield." },
  { id: "responsibly", title: "Hosting responsibly", body: "Local rules, taxes and safety requirements, summarised for each city we operate in." },
  { id: "classes", title: "Join a free hosting class", body: "Live sessions covering your first listing, your first guest and your first review." },
  { id: "co-hosts", title: "Find a co-host", body: "Bring in someone local to handle check-ins, cleaning and messages while you are away." },
  { id: "refer", title: "Refer a host", body: "Invite someone you know to list their place and you both get travel credit on their first booking." },
];

export default function HostPage() {
  return (
    <div className="mx-auto max-w-[1100px] page-gutter py-12">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl">
          Host on {BRAND.name}
        </h1>
        <p className="mt-3 text-[17px] leading-relaxed text-muted">
          Whether you have a spare room, a skill worth sharing or a service travellers
          keep asking for, listing takes about twenty minutes.
        </p>
        <Link
          href="/signup"
          className="mt-6 inline-block rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700"
        >
          Get started
        </Link>
      </header>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        {PATHS.map(({ id, title, body, icon: Icon }) => (
          <section key={id} id={id} className="rounded-2xl border border-line p-6">
            <Icon aria-hidden="true" className="size-6 text-brand-600" />
            <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{body}</p>
          </section>
        ))}
      </div>

      <div className="mt-14 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-32">
            <h2 className="flex items-center gap-2 text-base font-semibold text-ink">
              <ShieldCheck aria-hidden="true" className="size-4 text-brand-600" />
              {section.title}
            </h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
