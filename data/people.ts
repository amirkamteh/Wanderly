import type { Host, Review } from "@/types/listing";
import { avatarFor } from "./images";
import { seededRandom } from "@/lib/utils";

const HOST_NAMES = [
  "Layla",
  "Omar",
  "Nino",
  "Aigerim",
  "Deniz",
  "Rashid",
  "Mariam",
  "Elene",
  "Timur",
  "Yasmin",
  "Kerem",
  "Farid",
  "Sofia",
  "Giorgi",
  "Amina",
  "Bilal",
  "Leyla",
  "Arman",
  "Zeynep",
  "Hassan",
  "Nurlan",
  "Dana",
  "Emre",
  "Salma",
];

const HOST_BIOS = [
  "I have been welcoming travellers for years and love helping guests find the quiet corners of my city.",
  "Former hotelier turned host. I care about crisp linen, good coffee and check-ins that just work.",
  "I renovated this place myself and still get a kick out of seeing guests enjoy the light in the mornings.",
  "Local guide by day, host by night. Ask me for restaurant recommendations — I have a very long list.",
  "I look after a small handful of homes so each one gets proper attention between stays.",
];

const REVIEW_AUTHORS = [
  "Marta",
  "Daniel",
  "Priya",
  "Jonas",
  "Aisha",
  "Tom",
  "Chloe",
  "Ravi",
  "Elif",
  "Noah",
  "Hana",
  "Lucas",
  "Sara",
  "Nikolai",
  "Grace",
  "Adam",
];

const REVIEW_BODIES = [
  "Exactly as pictured and spotlessly clean. Check-in was effortless and the location made everything walkable.",
  "One of the most comfortable places we have stayed. The beds are excellent and the water pressure is genuinely great.",
  "Our host replied within minutes every time. Small touches like the welcome basket made the trip feel special.",
  "Great value for the space you get. We cooked most nights and the kitchen had everything we needed.",
  "Quiet at night despite being central. We slept well and woke up to a lovely view every morning.",
  "The photos do not do the terrace justice. We spent every evening out there watching the sun go down.",
  "Would happily book again. Clear directions, easy parking and the neighbourhood has excellent coffee.",
  "Perfect for a long weekend. Everything worked, everything was clean, and the host left brilliant local tips.",
];

const REVIEW_DATES = [
  "March 2026",
  "April 2026",
  "May 2026",
  "June 2026",
  "July 2026",
  "February 2026",
  "January 2026",
  "December 2025",
];

function pick<T>(items: readonly T[], seed: string): T {
  return items[Math.floor(seededRandom(seed) * items.length) % items.length];
}

/** Builds a deterministic host profile for a listing id. */
export function hostFor(listingId: string, isSuperhost = true): Host {
  const name = pick(HOST_NAMES, `${listingId}-host`);
  return {
    id: `host-${listingId}`,
    name,
    avatar: avatarFor(`${name}${listingId}`),
    isSuperhost,
    yearsHosting: 2 + Math.floor(seededRandom(`${listingId}-years`) * 9),
    responseRate: 96 + Math.floor(seededRandom(`${listingId}-rate`) * 5),
    about: pick(HOST_BIOS, `${listingId}-bio`),
  };
}

/** Builds a deterministic set of reviews for a listing id. */
export function reviewsFor(listingId: string, count = 6, baseRating = 4.9): Review[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = `${listingId}-review-${i}`;
    const author = pick(REVIEW_AUTHORS, seed);
    // Ratings hover just under the headline average so the maths looks honest.
    const jitter = seededRandom(`${seed}-r`) > 0.75 ? -1 : 0;
    return {
      id: seed,
      author,
      avatar: avatarFor(`${author}${seed}`),
      date: pick(REVIEW_DATES, `${seed}-d`),
      rating: Math.max(4, Math.min(5, Math.round(baseRating) + jitter)),
      body: pick(REVIEW_BODIES, seed),
    };
  });
}
