import type { Experience, PricingUnit } from "@/types/experience";
import type { BadgeLabel } from "@/types/listing";
import { EXPERIENCE_PHOTOS, img } from "./images";
import { hostFor, reviewsFor } from "./people";

type PhotoKey = keyof typeof EXPERIENCE_PHOTOS;

interface ExperienceSeed {
  title: string;
  city: string;
  country: string;
  price: number;
  unit?: PricingUnit;
  rating: number;
  reviews: number;
  badge?: BadgeLabel;
  /** Chip shown on "tomorrow"-style rails. */
  time?: string;
  hours: number;
  group: number;
  category: string;
  photos: PhotoKey[];
  original?: boolean;
  /** One-line hook expanded into the detail-page description. */
  hook: string;
  highlights: string[];
}

const INCLUDED_BY_CATEGORY: Record<string, string[]> = {
  Desert: ["Hotel pickup and drop-off", "Bottled water and soft drinks", "All activity equipment"],
  Food: ["All tastings", "A drink at each stop", "Printed map of the route"],
  Culture: ["Entrance fees", "Local guide", "Small-group walking tour"],
  Water: ["Safety briefing and gear", "Life jackets", "Towels"],
  Wellness: ["Mat and props", "Herbal tea after the session", "Filtered water"],
  Nature: ["Transport to the trailhead", "Snacks", "Guided commentary"],
  Nightlife: ["Entry to each venue", "Welcome drink", "Host for the evening"],
  Craft: ["All materials", "Everything you make is yours to keep", "Refreshments"],
};

function buildExperience(seed: ExperienceSeed, index: number): Experience {
  const id = `exp-${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    kind: "experience",
    title: seed.title,
    city: seed.city,
    country: seed.country,
    price: seed.price,
    priceUnit: seed.unit ?? "guest",
    rating: seed.rating,
    reviewCount: seed.reviews,
    badge: seed.badge,
    startTime: seed.time,
    durationHours: seed.hours,
    groupSize: seed.group,
    images: seed.photos.map((key) => img(EXPERIENCE_PHOTOS[key], 1200, 900)),
    description: `${seed.hook}\n\nThe group stays small, so there is time for questions and for stopping when something catches your eye. Your host runs this regularly and knows exactly which corners are worth the detour and which are better skipped.\n\nExpect roughly ${seed.hours} ${seed.hours === 1 ? "hour" : "hours"} in total, at a pace that suits everyone who turns up.`,
    highlights: seed.highlights,
    included: INCLUDED_BY_CATEGORY[seed.category] ?? INCLUDED_BY_CATEGORY.Culture,
    meetingPoint: `Your host shares the exact meeting point in ${seed.city} once you book.`,
    languages: ["English", "Arabic"],
    host: hostFor(id, seed.rating >= 4.9),
    reviews: reviewsFor(id, 5, seed.rating),
    category: seed.category,
    isOriginal: seed.original,
  };
}

const P = "Popular" as const;

const SEEDS: ExperienceSeed[] = [
  // ------------------------------------------------- Popular experiences: Dubai
  {
    title: "Ride the dunes on a quad bike at golden hour",
    city: "Dubai", country: "United Arab Emirates", price: 149, rating: 4.97, reviews: 1840,
    badge: P, hours: 4, group: 12, category: "Desert",
    photos: ["desertDunes", "desertHorizon", "groupTravel"],
    hook: "Trade the city for open sand and ride out across the dunes as the light turns orange.",
    highlights: ["Quad bike with a full safety briefing", "Sandboarding on the big dunes", "Camel ride before sunset", "Tea and dates at the camp"],
  },
  {
    title: "Sunset desert safari with camel ride and barbecue",
    city: "Dubai", country: "United Arab Emirates", price: 149, rating: 4.91, reviews: 2260,
    badge: P, hours: 6, group: 20, category: "Desert",
    photos: ["grill", "desertDunes", "sharedTable"],
    hook: "A full evening in the desert: dune drive, camel ride, then dinner under the stars.",
    highlights: ["Dune drive in a 4x4", "Camel ride at sunset", "Barbecue dinner at camp", "Live music around the fire"],
  },
  {
    title: "Unforgettable day trip from Dubai to Abu Dhabi",
    city: "Dubai", country: "United Arab Emirates", price: 189, rating: 5, reviews: 984,
    badge: P, hours: 9, group: 14, category: "Culture",
    photos: ["mosqueDusk", "skylineDusk", "coastalWalk"],
    hook: "See the capital properly in a day, with the driving and the timing handled for you.",
    highlights: ["The Grand Mosque at its quietest", "Corniche waterfront stop", "Lunch in the old souk", "Skyline viewpoint on the way back"],
  },
  {
    title: "Desert safari with barbecue dinner and live shows",
    city: "Dubai", country: "United Arab Emirates", price: 149, rating: 4.94, reviews: 3120,
    badge: P, hours: 6, group: 25, category: "Desert",
    photos: ["liveShow", "grill", "desertDunes"],
    hook: "Dune bashing, a camp full of food, and three live performances after dark.",
    highlights: ["4x4 dune bashing", "Unlimited barbecue buffet", "Fire and dance performances", "Henna and shisha at camp"],
  },
  {
    title: "Memorable full day trip around the emirates",
    city: "Dubai", country: "United Arab Emirates", price: 200, rating: 4.96, reviews: 742,
    badge: P, hours: 10, group: 12, category: "Culture",
    photos: ["skylineDusk", "mosqueDusk", "groupTravel"],
    hook: "One long, well-paced day that covers far more ground than you could alone.",
    highlights: ["Three cities in one day", "Air-conditioned transport throughout", "Lunch included", "Photo stops at every landmark"],
  },
  {
    title: "Red dune safari at sunset with sandboarding",
    city: "Dubai", country: "United Arab Emirates", price: 125, rating: 4.94, reviews: 1520,
    badge: P, hours: 5, group: 16, category: "Desert",
    photos: ["desertHorizon", "desertDunes", "mountainHike"],
    hook: "The red dunes are the tallest near the city, and they are best in the last hour of light.",
    highlights: ["Sandboarding lesson included", "Sunset viewpoint on the ridge", "Refreshments at camp", "Hotel pickup"],
  },

  // ---------------------------------------------------------- Tomorrow in Dubai
  {
    title: "Morning desert safari with camel ride",
    city: "Dubai", country: "United Arab Emirates", price: 100, rating: 4.92, reviews: 612,
    time: "7:30 AM", hours: 4, group: 12, category: "Desert",
    photos: ["desertDunes", "desertHorizon", "grill"],
    hook: "Start before the heat arrives, when the sand still holds the cool of the night.",
    highlights: ["Sunrise over the dunes", "Camel ride", "Breakfast at camp", "Back in the city by lunchtime"],
  },
  {
    title: "Dive into the city's history and modern marvels",
    city: "Dubai", country: "United Arab Emirates", price: 475, unit: "group", rating: 4.99, reviews: 288,
    time: "9 AM", hours: 5, group: 6, category: "Culture",
    photos: ["cityStreet", "skylineDusk", "gallery"],
    hook: "Old creek neighbourhoods in the morning, glass towers by the afternoon — the whole arc in one walk.",
    highlights: ["Abra crossing on the creek", "Spice and gold souks", "Heritage district walk", "Skyline finish"],
  },
  {
    title: "Historic walking tour: food, abra ride and souq",
    city: "Dubai", country: "United Arab Emirates", price: 119, rating: 4.98, reviews: 934,
    time: "6 PM", hours: 3, group: 10, category: "Food",
    photos: ["marketFood", "sharedTable", "neonEat"],
    hook: "Eat your way through the old quarter with someone who knows every counter worth stopping at.",
    highlights: ["Six tastings across the district", "Abra ride across the creek", "Souq at its liveliest", "Finish with karak tea"],
  },
  {
    title: "Evening desert safari with dinner under the stars",
    city: "Dubai", country: "United Arab Emirates", price: 139, rating: 5, reviews: 1104,
    time: "3 PM", hours: 6, group: 18, category: "Desert",
    photos: ["desertHorizon", "grill", "liveShow"],
    hook: "The classic evening run, done without the rush that spoils most versions of it.",
    highlights: ["Dune drive", "Sunset stop", "Full dinner at camp", "Stargazing before the drive home"],
  },
  {
    title: "Private desert adventure: 4x4, camel and dinner",
    city: "Dubai", country: "United Arab Emirates", price: 650, unit: "group", rating: 4.99, reviews: 176,
    time: "3:45 PM", hours: 6, group: 6, category: "Desert",
    photos: ["groupTravel", "desertDunes", "grill"],
    hook: "Your own vehicle, your own guide, and a camp table set just for your group.",
    highlights: ["Private 4x4 and guide", "Camel ride", "Private dinner setup", "Flexible timings"],
  },
  {
    title: "Premium desert safari with barbecue dinner",
    city: "Dubai", country: "United Arab Emirates", price: 150, rating: 4.89, reviews: 858,
    time: "2:30 PM", hours: 7, group: 20, category: "Desert",
    photos: ["lagoonDusk", "grill", "liveShow"],
    hook: "The longer version, with more time at camp and a proper sit-down dinner.",
    highlights: ["Extended dune drive", "Falconry demonstration", "Barbecue dinner", "Return transfers"],
  },

  // ------------------------------------------------------ Experiences this week
  {
    title: "Kayak the mangroves at first light",
    city: "Abu Dhabi", country: "United Arab Emirates", price: 210, rating: 4.95, reviews: 421,
    hours: 3, group: 8, category: "Water",
    photos: ["coastalWalk", "poolLounge", "mountainHike"],
    hook: "Paddle quiet channels through the mangroves while the city is still waking up.",
    highlights: ["Beginner-friendly route", "Birdlife along the channels", "All gear provided", "Small group of eight"],
  },
  {
    title: "Sunrise hike to the ridge with breakfast",
    city: "Ras Al Khaimah City", country: "United Arab Emirates", price: 175, rating: 4.93, reviews: 268,
    hours: 5, group: 10, category: "Nature",
    photos: ["mountainHike", "desertHorizon", "desertDunes"],
    hook: "A steady climb up the escarpment, timed so you reach the top as the sun clears the range.",
    highlights: ["Guided ascent", "Breakfast at the summit", "Transport from the city", "Suitable for regular walkers"],
  },
  {
    title: "Old town food crawl through eight kitchens",
    city: "Istanbul", country: "Türkiye", price: 240, rating: 4.97, reviews: 1382,
    hours: 4, group: 12, category: "Food",
    photos: ["sharedTable", "marketFood", "finePlating"],
    hook: "Eight stops, two neighbourhoods, and a lot of food you would never find on your own.",
    highlights: ["Eight tastings", "Both sides of the water", "Market visit", "Dessert to finish"],
  },
  {
    title: "Wine cellars and supra table in the old quarter",
    city: "Tbilisi", country: "Georgia", price: 190, rating: 4.96, reviews: 654,
    hours: 4, group: 10, category: "Food",
    photos: ["tableSetting", "fineDining", "sharedTable"],
    hook: "Taste qvevri wines the way they are meant to be drunk — around a long table with food.",
    highlights: ["Three cellar visits", "Full supra spread", "Toastmaster tradition explained", "Vegetarian options"],
  },
  {
    title: "Mountain day trip to the alpine lakes",
    city: "Almaty", country: "Kazakhstan", price: 220, rating: 4.94, reviews: 389,
    hours: 8, group: 12, category: "Nature",
    photos: ["desertHorizon", "mountainHike", "groupTravel"],
    hook: "Up into the range for the lakes that sit above the treeline, with plenty of stops.",
    highlights: ["Two lake stops", "Easy walking sections", "Packed lunch", "Return transport"],
  },
  {
    title: "Rooftop jazz and small plates after dark",
    city: "Baku", country: "Azerbaijan", price: 165, rating: 4.9, reviews: 212,
    hours: 3, group: 14, category: "Nightlife",
    photos: ["concert", "liveShow", "neonEat"],
    hook: "Three rooftops, one long evening, and a house band that actually knows what it is doing.",
    highlights: ["Three venues", "Welcome drink at each", "Small plates included", "Skyline views throughout"],
  },
  {
    title: "Riverside cooking class with market shopping",
    city: "Bangkok", country: "Thailand", price: 195, rating: 4.98, reviews: 2104,
    hours: 5, group: 8, category: "Food",
    photos: ["chefPlating", "marketFood", "sharedTable"],
    hook: "Shop the market first, then cook four dishes properly in a kitchen by the river.",
    highlights: ["Guided market shop", "Four dishes from scratch", "Recipes to take home", "Eat what you make"],
  },
  {
    title: "Photo walk through the historic backstreets",
    city: "Paris", country: "France", price: 230, rating: 4.92, reviews: 508,
    hours: 3, group: 6, category: "Craft",
    photos: ["gallery", "cityStreet", "harbour"],
    hook: "A working photographer takes you through the streets that never make the postcards.",
    highlights: ["Composition coaching as you walk", "Any camera or phone welcome", "Edited shots afterwards", "Group of six"],
  },
  {
    title: "Pottery evening in a working studio",
    city: "London", country: "United Kingdom", price: 260, rating: 4.95, reviews: 341,
    hours: 3, group: 8, category: "Craft",
    photos: ["workshop", "artStudio", "studioClass"],
    hook: "Two hours at the wheel with a maker who will not let you leave with a wobbly bowl.",
    highlights: ["Wheel throwing from scratch", "All clay and tools included", "Two pieces fired and posted", "No experience needed"],
  },

  // ------------------------------------------- Signature collection (Originals)
  {
    title: "Carve marble with a third-generation sculptor",
    city: "Athens", country: "Greece", price: 255, rating: 5, reviews: 96,
    hours: 4, group: 6, category: "Craft", original: true,
    photos: ["artStudio", "workshop", "gallery"],
    hook: "Spend an afternoon in a family workshop where the same tools have been in use for eighty years.",
    highlights: ["Work a real block of marble", "Tools and apron provided", "Take your piece home", "Studio tour and coffee"],
  },
  {
    title: "Walk a mural tour with the artists who painted it",
    city: "San Miguel de Allende", country: "Mexico", price: 144, rating: 4.98, reviews: 128,
    hours: 3, group: 10, category: "Craft", original: true,
    photos: ["gallery", "oldQuarter", "cityStreet"],
    hook: "The people who painted these walls explain what each piece was arguing about at the time.",
    highlights: ["Six murals across the centre", "Meet two of the artists", "Sketchbook to take away", "Ends at a rooftop bar"],
  },
  {
    title: "Sit a premium matcha ceremony in a tea house",
    city: "Shibuya", country: "Japan", price: 140, rating: 5, reviews: 214,
    hours: 2, group: 6, category: "Craft", original: true,
    photos: ["tableSetting", "finePlating", "studioClass"],
    hook: "A quiet hour of the full ceremony, then a second bowl you whisk yourself.",
    highlights: ["Full ceremony explained", "Whisk your own bowl", "Seasonal sweets", "Six seats only"],
  },
  {
    title: "Learn mahjong and sip tea in a members' club",
    city: "Brooklyn", country: "United States", price: 221, rating: 5, reviews: 87,
    hours: 3, group: 8, category: "Craft", original: true,
    photos: ["studioClass", "workshop", "tableSetting"],
    hook: "Rules in twenty minutes, then real hands for the rest of the afternoon.",
    highlights: ["Taught from zero", "Full sets provided", "Tea service throughout", "Prize for the winning table"],
  },
  {
    title: "Eat your way through a market with a chef",
    city: "Philadelphia", country: "United States", price: 379, unit: "group", rating: 5, reviews: 143,
    hours: 3, group: 6, category: "Food", original: true,
    photos: ["marketFood", "chefPlating", "neonEat"],
    hook: "A working chef walks the market they actually shop at, and buys lunch along the way.",
    highlights: ["Seven stalls", "Everything tasted is included", "Shopping tips you will use", "Ends with a sit-down plate"],
  },
  {
    title: "Practise sunrise yoga in an open pavilion",
    city: "Chiang Mai", country: "Thailand", price: 134, rating: 4.95, reviews: 302,
    hours: 2, group: 12, category: "Wellness", original: true,
    photos: ["yogaMat", "poolLounge", "mountainHike"],
    hook: "An unhurried practice in an open-sided pavilion, finishing with tea as the valley clears.",
    highlights: ["All levels welcome", "Mats and props provided", "Breathwork and meditation", "Herbal tea after"],
  },
];

export const experiences: Experience[] = SEEDS.map(buildExperience);

export function getExperienceById(id: string): Experience | undefined {
  return experiences.find((experience) => experience.id === id);
}

export function experiencesInCity(city: string, limit?: number): Experience[] {
  const matches = experiences.filter((e) => e.city === city);
  return limit ? matches.slice(0, limit) : matches;
}

/** Listings that carry a start-time chip, used by the "tomorrow" rail. */
export const scheduledExperiences: Experience[] = experiences.filter((e) => e.startTime);

export const originalExperiences: Experience[] = experiences.filter((e) => e.isOriginal);
