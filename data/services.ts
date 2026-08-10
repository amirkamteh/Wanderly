import type { PricingUnit } from "@/types/experience";
import type { BadgeLabel } from "@/types/listing";
import type { Service, ServiceCategory, ServiceCategorySlug } from "@/types/service";
import { SERVICE_PHOTOS, img } from "./images";
import { hostFor, reviewsFor } from "./people";

type PhotoKey = keyof typeof SERVICE_PHOTOS;

/** Category tiles shown at the top of the Services page. */
export const serviceCategories: ServiceCategory[] = [
  { slug: "photography", label: "Photography", image: img(SERVICE_PHOTOS.cameraFlatlay, 600, 600) },
  { slug: "chefs", label: "Chefs", image: img(SERVICE_PHOTOS.chefIngredients, 600, 600) },
  { slug: "training", label: "Training", image: img(SERVICE_PHOTOS.gymWeights, 600, 600) },
  { slug: "makeup", label: "Makeup", image: img(SERVICE_PHOTOS.makeupBrushes, 600, 600) },
  { slug: "hair", label: "Hair", image: img(SERVICE_PHOTOS.hairSalonChairs, 600, 600) },
  { slug: "massage", label: "Massage", image: img(SERVICE_PHOTOS.massage, 600, 600) },
];

interface ServiceSeed {
  title: string;
  provider: string;
  category: ServiceCategorySlug;
  city: string;
  country: string;
  price: number;
  unit?: PricingUnit;
  minimum?: number;
  rating: number;
  reviews: number;
  badge?: BadgeLabel;
  minutes: number;
  photos: PhotoKey[];
  hook: string;
  includes: string[];
}

function buildService(seed: ServiceSeed, index: number): Service {
  const id = `svc-${String(index + 1).padStart(3, "0")}`;
  return {
    id,
    kind: "service",
    title: seed.title,
    provider: seed.provider,
    category: seed.category,
    city: seed.city,
    country: seed.country,
    price: seed.price,
    priceUnit: seed.unit ?? "guest",
    minimumSpend: seed.minimum,
    rating: seed.rating,
    reviewCount: seed.reviews,
    badge: seed.badge,
    images: seed.photos.map((key) => img(SERVICE_PHOTOS[key], 1200, 900)),
    description: `${seed.hook}\n\n${seed.provider} works across ${seed.city} and travels to you, so you do not lose half the booking to getting somewhere. Sessions run about ${seed.minutes} minutes and can be adjusted if you need more or less time.\n\nBooking confirms instantly and you can message directly beforehand to talk through what you want.`,
    includes: seed.includes,
    durationMinutes: seed.minutes,
    host: hostFor(id, seed.rating >= 4.9),
    reviews: reviewsFor(id, 5, seed.rating),
  };
}

const P = "Popular" as const;

const SEEDS: ServiceSeed[] = [
  // -------------------------------------------------------- Photography: Dubai
  {
    title: "Dazzling photo shoots around the old quarter", provider: "Rami",
    category: "photography", city: "Dubai", country: "United Arab Emirates",
    price: 1200, rating: 5, reviews: 214, minutes: 90,
    photos: ["photographerAtWork", "cameraFlatlay", "portraitOutdoor"],
    hook: "A relaxed shoot through the lanes of the old quarter, shot on location in natural light.",
    includes: ["90-minute shoot", "40 edited images", "Two locations", "Delivered within 72 hours"],
  },
  {
    title: "Turn your city moments into stunning photos", provider: "Nadia",
    category: "photography", city: "Dubai", country: "United Arab Emirates",
    price: 599, unit: "group", rating: 5, reviews: 168, minutes: 60,
    photos: ["portraitOutdoor", "travelPortrait", "photographerAtWork"],
    hook: "One hour, one location, and a set of images that actually look like your trip.",
    includes: ["60-minute shoot", "25 edited images", "Location scouting", "Online gallery"],
  },
  {
    title: "Photo shooting pro: your city souvenir", provider: "Karim",
    category: "photography", city: "Dubai", country: "United Arab Emirates",
    price: 99, minimum: 100, rating: 5, reviews: 402, minutes: 45,
    photos: ["cameraFlatlay", "photographerPortrait", "portraitStudio"],
    hook: "Per-person pricing for groups who want good pictures without a studio budget.",
    includes: ["45-minute shoot", "15 edited images per person", "Central meeting point", "Same-week delivery"],
  },
  {
    title: "Stunning portraits across the marina", provider: "Solomon",
    category: "photography", city: "Dubai", country: "United Arab Emirates",
    price: 700, rating: 4.96, reviews: 121, minutes: 75,
    photos: ["portraitStudio", "portraitNatural", "photographerAtWork"],
    hook: "Marina backdrops at the hour when the light does most of the work for you.",
    includes: ["75-minute shoot", "35 edited images", "Golden-hour slot", "Print-ready files"],
  },
  {
    title: "Couple and family portraits on location", provider: "Achraf",
    category: "photography", city: "Dubai", country: "United Arab Emirates",
    price: 500, unit: "group", rating: 4.94, reviews: 96, minutes: 60,
    photos: ["familyGroup", "coupleWedding", "portraitOutdoor"],
    hook: "Family shoots that stay light and quick, which is the only way they ever work.",
    includes: ["60-minute shoot", "30 edited images", "Props for children", "Two outfit changes"],
  },
  {
    title: "Vacation and property photography", provider: "Louie",
    category: "photography", city: "Dubai", country: "United Arab Emirates",
    price: 499, unit: "group", rating: 4.92, reviews: 87, minutes: 120,
    photos: ["travelPortrait", "portraitOutdoor", "cameraFlatlay"],
    hook: "Interiors and exteriors shot properly, whether it is for a listing or for memory.",
    includes: ["Up to 2 hours on site", "40 edited images", "Wide-angle interior kit", "Commercial licence"],
  },

  // ------------------------------------------------------- More services: Dubai
  {
    title: "Braids and protective styling at your place", provider: "Amara",
    category: "hair", city: "Dubai", country: "United Arab Emirates",
    price: 420, rating: 4.97, reviews: 233, badge: P, minutes: 180,
    photos: ["hairStyling", "hairSalonChairs", "longHair"],
    hook: "Protective styles done at home, with the time and patience the job actually needs.",
    includes: ["Consultation first", "All hair extensions", "Wash and treatment", "Aftercare guidance"],
  },
  {
    title: "Strength and conditioning coaching", provider: "Mateo",
    category: "training", city: "Dubai", country: "United Arab Emirates",
    price: 260, rating: 4.93, reviews: 174, minutes: 60,
    photos: ["personalTrainer", "gymFloor", "lifting"],
    hook: "Programmed sessions rather than random workouts, built around what you can actually commit to.",
    includes: ["60-minute session", "Written programme", "Form coaching", "Progress tracking"],
  },
  {
    title: "Boxing and kickboxing personal training", provider: "Nasser",
    category: "training", city: "Dubai", country: "United Arab Emirates",
    price: 300, rating: 4.95, reviews: 142, minutes: 60,
    photos: ["boxing", "gymWeights", "liftingClose"],
    hook: "Pads, technique and conditioning with a coach who has actually cornered fights.",
    includes: ["Gloves and wraps provided", "Technique drills", "Conditioning finisher", "Beginners welcome"],
  },
  {
    title: "Editorial makeup for events and shoots", provider: "Dina",
    category: "makeup", city: "Dubai", country: "United Arab Emirates",
    price: 480, rating: 4.98, reviews: 311, badge: P, minutes: 75,
    photos: ["makeupApplication", "beautyEditorial", "makeupPalette"],
    hook: "Camera-ready makeup that holds through a long evening without needing rescuing.",
    includes: ["Skin prep", "Full face application", "Lashes included", "Touch-up kit to take away"],
  },
  {
    title: "Bridal hair and makeup, on location", provider: "Hala",
    category: "makeup", city: "Dubai", country: "United Arab Emirates",
    price: 1400, unit: "group", rating: 5, reviews: 88, minutes: 180,
    photos: ["beautyPortrait", "makeupBrushes", "hairStyling"],
    hook: "A trial, a plan, and a calm morning-of that runs exactly to the schedule you agreed.",
    includes: ["Trial session included", "Hair and makeup", "Travel to your venue", "Touch-ups until you leave"],
  },
  {
    title: "Private chef dinners at your rental", provider: "Youssef",
    category: "chefs", city: "Dubai", country: "United Arab Emirates",
    price: 380, rating: 4.96, reviews: 156, minutes: 210,
    photos: ["chefPlate", "chefTable", "chefKitchen"],
    hook: "A four-course dinner cooked in your kitchen, with the washing-up handled before we leave.",
    includes: ["Menu planning", "All ingredients", "Service throughout", "Full clean-down"],
  },

  // ------------------------------------------------------ Discover: mixed cities
  {
    title: "Deep tissue and sports massage", provider: "Elena",
    category: "massage", city: "Dubai", country: "United Arab Emirates",
    price: 340, rating: 4.94, reviews: 198, minutes: 60,
    photos: ["massage", "spaOils", "spaMinimal"],
    hook: "Proper deep tissue work for people who sit at a desk and then train hard at 6pm.",
    includes: ["Portable table brought to you", "60 minutes hands-on", "Oils included", "Stretching advice"],
  },
  {
    title: "Barbering and beard shaping at home", provider: "Idris",
    category: "hair", city: "Dubai", country: "United Arab Emirates",
    price: 180, rating: 4.91, reviews: 264, minutes: 45,
    photos: ["barber", "salonInterior", "hairSalonChairs"],
    hook: "Skin fades and beard work without the wait, done wherever you are staying.",
    includes: ["Cut and style", "Beard shape and line-up", "Hot towel finish", "Everything cleaned up"],
  },
  {
    title: "Postnatal recovery training", provider: "Wren",
    category: "training", city: "Dubai", country: "United Arab Emirates",
    price: 240, rating: 5, reviews: 74, minutes: 55,
    photos: ["pilates", "coreWorkout", "gymFloor"],
    hook: "A careful rebuild of core and pelvic floor strength, at whatever pace your body allows.",
    includes: ["Assessment session", "Home programme", "Equipment provided", "Babies welcome"],
  },

  // ------------------------------------------------------------------- London
  {
    title: "Documentary family photography", provider: "Beatrice",
    category: "photography", city: "London", country: "United Kingdom",
    price: 640, unit: "group", rating: 4.97, reviews: 182, badge: P, minutes: 120,
    photos: ["coupleWedding", "familyGroup", "portraitStudio"],
    hook: "No posing, no forced smiles — just a couple of hours documenting what your family is like.",
    includes: ["2-hour session", "60 edited images", "Your home or a park", "Print box option"],
  },
  {
    title: "Private chef supper clubs at home", provider: "Marcus",
    category: "chefs", city: "London", country: "United Kingdom",
    price: 420, rating: 4.95, reviews: 137, minutes: 240,
    photos: ["chefTable", "chefPlate", "chefIngredients"],
    hook: "Seasonal five-course menus cooked in front of you, with wine pairings if you want them.",
    includes: ["Five courses", "All shopping", "Optional pairings", "Kitchen left spotless"],
  },
  {
    title: "Strength coaching for beginners", provider: "Priya",
    category: "training", city: "London", country: "United Kingdom",
    price: 310, rating: 4.92, reviews: 209, minutes: 60,
    photos: ["gymFloor", "personalTrainer", "lifting"],
    hook: "The first twelve weeks of lifting, taught properly so nothing hurts and nothing sticks.",
    includes: ["Technique from scratch", "12-week plan", "Gym or home options", "Weekly check-ins"],
  },
  {
    title: "Event makeup and grooming", provider: "Talia",
    category: "makeup", city: "London", country: "United Kingdom",
    price: 380, rating: 4.9, reviews: 154, minutes: 60,
    photos: ["makeupPalette", "makeupApplication", "makeupFlatlay"],
    hook: "Party and occasion makeup with a light hand — recognisably you, just sharper.",
    includes: ["Skin prep", "Full application", "Lashes optional", "Travels to you"],
  },
  {
    title: "Colour correction and balayage", provider: "Sonia",
    category: "hair", city: "London", country: "United Kingdom",
    price: 560, rating: 4.94, reviews: 121, minutes: 210,
    photos: ["hairWash", "longHair", "salonInterior"],
    hook: "Colour work that fixes what a previous salon got wrong, done in one long sitting.",
    includes: ["Strand test first", "Full colour service", "Bond treatment", "Blow-dry finish"],
  },
  {
    title: "Sports and remedial massage", provider: "Callum",
    category: "massage", city: "London", country: "United Kingdom",
    price: 300, rating: 4.93, reviews: 176, minutes: 60,
    photos: ["spaOils", "massage", "spaMinimal"],
    hook: "Treatment-led massage for specific complaints, not a spa experience with candles.",
    includes: ["Assessment", "60 minutes treatment", "Rehab exercises", "Follow-up plan"],
  },

  // -------------------------------------------------------------------- Paris
  {
    title: "Portrait sessions along the riverbanks", provider: "Camille",
    category: "photography", city: "Paris", country: "France",
    price: 720, unit: "group", rating: 4.98, reviews: 264, badge: P, minutes: 90,
    photos: ["photographerPortrait", "eventTable", "portraitNatural"],
    hook: "Riverside and rooftop backdrops shot early, before the bridges fill up.",
    includes: ["90-minute shoot", "45 edited images", "Three locations", "Sunrise slots available"],
  },
  {
    title: "Private chef: classic bistro menus", provider: "Étienne",
    category: "chefs", city: "Paris", country: "France",
    price: 460, rating: 4.96, reviews: 118, minutes: 240,
    photos: ["chefPlate", "chefKitchen", "chefTable"],
    hook: "The bistro classics done properly, cooked at your table rather than a restaurant's.",
    includes: ["Four courses", "Market shopping", "Wine advice", "Clean-down included"],
  },
  {
    title: "Makeup lessons and event application", provider: "Margaux",
    category: "makeup", city: "Paris", country: "France",
    price: 400, rating: 4.91, reviews: 143, minutes: 90,
    photos: ["makeupFlatlay", "beautyEditorial", "makeupBrushes"],
    hook: "Learn to do your own face properly, using the products you already own.",
    includes: ["Kit audit", "Step-by-step lesson", "Written routine", "Application on the day"],
  },
  {
    title: "Cut and styling in a private studio", provider: "Léa",
    category: "hair", city: "Paris", country: "France",
    price: 340, rating: 4.89, reviews: 97, minutes: 90,
    photos: ["salonInterior", "hairWash", "hairStyling"],
    hook: "One client at a time in a small studio, so nothing is rushed.",
    includes: ["Consultation", "Wash and cut", "Style finish", "Product recommendations"],
  },
  {
    title: "Mobility and conditioning coaching", provider: "Hugo",
    category: "training", city: "Paris", country: "France",
    price: 280, rating: 4.9, reviews: 88, minutes: 55,
    photos: ["coreWorkout", "pilates", "athleteRun"],
    hook: "Sessions built around getting your hips and shoulders working again.",
    includes: ["Movement screen", "55-minute session", "Home mobility plan", "Equipment provided"],
  },
  {
    title: "Relaxation massage at your apartment", provider: "Inès",
    category: "massage", city: "Paris", country: "France",
    price: 320, rating: 4.95, reviews: 132, minutes: 75,
    photos: ["spaMinimal", "massage", "spaOils"],
    hook: "Slow, full-body work with no upselling and no packages to sign up to.",
    includes: ["Table and linens", "75 minutes", "Choice of oils", "Evening slots"],
  },

  // ------------------------------------------------------------------ Bangkok
  {
    title: "Street food and portrait photo walk", provider: "Ploy",
    category: "photography", city: "Bangkok", country: "Thailand",
    price: 380, rating: 4.97, reviews: 342, badge: P, minutes: 120,
    photos: ["nightStreet", "travelPortrait", "cameraFlatlay"],
    hook: "Neon, night markets and portraits, shot across two hours after dark.",
    includes: ["2-hour walk", "50 edited images", "Night-shoot lighting", "Route planned around you"],
  },
  {
    title: "Private chef: regional Thai menus", provider: "Anong",
    category: "chefs", city: "Bangkok", country: "Thailand",
    price: 260, rating: 4.98, reviews: 421, minutes: 210,
    photos: ["chefIngredients", "chefPlate", "chefKitchen"],
    hook: "Regional dishes cooked from scratch, with heat levels set to whatever you can handle.",
    includes: ["Five dishes", "Market shopping", "Dessert included", "Kitchen cleaned"],
  },
  {
    title: "Muay Thai private coaching", provider: "Kiet",
    category: "training", city: "Bangkok", country: "Thailand",
    price: 190, rating: 4.96, reviews: 288, minutes: 60,
    photos: ["boxing", "liftingClose", "sprint"],
    hook: "Technique-first sessions at a working gym with a coach who fought professionally.",
    includes: ["Wraps and gloves", "Pad work", "Conditioning", "All levels"],
  },
  {
    title: "Traditional Thai massage", provider: "Sunisa",
    category: "massage", city: "Bangkok", country: "Thailand",
    price: 150, rating: 4.94, reviews: 512, minutes: 90,
    photos: ["massage", "spaMinimal", "spaOils"],
    hook: "The real thing — stretching and pressure work, done on a mat, fully clothed.",
    includes: ["90 minutes", "Mat and clothing provided", "At your accommodation", "Herbal compress option"],
  },
  {
    title: "Bridal and event hair styling", provider: "Ratana",
    category: "hair", city: "Bangkok", country: "Thailand",
    price: 420, unit: "group", rating: 4.92, reviews: 104, minutes: 150,
    photos: ["hairStyling", "longHair", "hairWash"],
    hook: "Styling that survives humidity, which is the only test that matters here.",
    includes: ["Trial available", "Full styling", "Travel included", "Pins and accessories"],
  },

  // ------------------------------------------------------------------ Tbilisi
  {
    title: "Old town couples photography", provider: "Nino",
    category: "photography", city: "Tbilisi", country: "Georgia",
    price: 340, unit: "group", rating: 4.96, reviews: 156, badge: P, minutes: 90,
    photos: ["portraitNatural", "coupleWedding", "photographerAtWork"],
    hook: "Balconies, backstreets and the sulphur baths district, shot in the late afternoon.",
    includes: ["90-minute shoot", "40 edited images", "Three districts", "Gallery within a week"],
  },
  {
    title: "Private chef: supra feasts at home", provider: "Giorgi",
    category: "chefs", city: "Tbilisi", country: "Georgia",
    price: 220, rating: 4.97, reviews: 189, minutes: 240,
    photos: ["chefTable", "chefIngredients", "chefPlate"],
    hook: "A full supra table cooked in your apartment, with far too much food, as intended.",
    includes: ["Eight dishes", "All shopping", "Wine suggestions", "Clean-down"],
  },
  {
    title: "Hair colour and treatment studio", provider: "Tamar",
    category: "hair", city: "Tbilisi", country: "Georgia",
    price: 260, rating: 4.9, reviews: 112, minutes: 150,
    photos: ["hairWash", "salonInterior", "longHair"],
    hook: "Colour and repair work in a small studio, with honest advice about what your hair can take.",
    includes: ["Consultation", "Colour service", "Bond treatment", "Blow-dry"],
  },
  {
    title: "Makeup for events and photoshoots", provider: "Salome",
    category: "makeup", city: "Tbilisi", country: "Georgia",
    price: 240, rating: 4.93, reviews: 96, minutes: 60,
    photos: ["makeupBrushes", "makeupApplication", "beautyPortrait"],
    hook: "Clean, photograph-friendly makeup for shoots and evenings out.",
    includes: ["Skin prep", "Full application", "Lashes optional", "Travels to you"],
  },
  {
    title: "Personal training in the park", provider: "Levan",
    category: "training", city: "Tbilisi", country: "Georgia",
    price: 160, rating: 4.88, reviews: 78, minutes: 55,
    photos: ["athleteRun", "gymFloor", "groupFitness"],
    hook: "Outdoor sessions in the park through the warmer months, indoors when it turns.",
    includes: ["55-minute session", "All equipment", "Programme included", "Pairs welcome"],
  },
  {
    title: "Sports massage and recovery", provider: "Ana",
    category: "massage", city: "Tbilisi", country: "Georgia",
    price: 180, rating: 4.95, reviews: 134, minutes: 60,
    photos: ["spaOils", "spaMinimal", "massage"],
    hook: "Recovery work for hikers and runners, especially after a week in the mountains.",
    includes: ["60 minutes", "Table brought to you", "Targeted treatment", "Stretch routine"],
  },
];

export const services: Service[] = SEEDS.map(buildService);

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function servicesInCity(city: string, limit?: number): Service[] {
  const matches = services.filter((s) => s.city === city);
  return limit ? matches.slice(0, limit) : matches;
}

export function servicesInCategory(
  category: ServiceCategorySlug,
  city?: string,
  limit?: number,
): Service[] {
  const matches = services.filter(
    (s) => s.category === category && (!city || s.city === city),
  );
  return limit ? matches.slice(0, limit) : matches;
}
