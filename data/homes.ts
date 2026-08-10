import type { Amenity, Home, PlaceType, BadgeLabel } from "@/types/listing";
import { hostFor, reviewsFor } from "./people";
import { propertyGallery } from "./photoSets";
import { seededRandom } from "@/lib/utils";

/**
 * Compact seed for a stay. Everything a listing needs that cannot be derived
 * lives here; the rest (gallery, host, reviews, amenities, sleeping plan) is
 * built by `buildHome` so the file stays readable.
 */
interface HomeSeed {
  /** Card headline, e.g. "Apartment in Abu Dhabi". */
  type: string;
  city: string;
  area: string;
  country: string;
  /** Marketing name shown on the detail page. */
  name: string;
  /** Nightly rate in AED. */
  price: number;
  rating: number;
  reviews: number;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  place?: PlaceType;
  badge?: BadgeLabel;
  tags?: string[];
}

const CITY_COORDS: Record<string, [number, number]> = {
  "Abu Dhabi": [24.4539, 54.3773],
  Dubai: [25.2048, 55.2708],
  "Palm Jumeirah": [25.1124, 55.139],
  "JBR Beach": [25.0785, 55.1338],
  "Ras Al Khaimah City": [25.7895, 55.9432],
  Tbilisi: [41.7151, 44.8271],
  Almaty: [43.222, 76.8512],
  Istanbul: [41.0082, 28.9784],
  Baku: [40.4093, 49.8671],
  London: [51.5072, -0.1276],
  Paris: [48.8566, 2.3522],
  Bangkok: [13.7563, 100.5018],
};

/** Small jitter so map pins are not all stacked on the city centre. */
function coordsFor(city: string, index: number): { lat: number; lng: number } {
  const [lat, lng] = CITY_COORDS[city] ?? [25.2048, 55.2708];
  return {
    lat: lat + (seededRandom(`${city}${index}lat`) - 0.5) * 0.08,
    lng: lng + (seededRandom(`${city}${index}lng`) - 0.5) * 0.08,
  };
}

const BASE_AMENITIES: Amenity[] = [
  { icon: "wifi", label: "Fast wifi" },
  { icon: "kitchen", label: "Kitchen" },
  { icon: "ac", label: "Air conditioning" },
  { icon: "tv", label: "TV with streaming" },
];

const TAG_AMENITIES: Record<string, Amenity> = {
  pool: { icon: "pool", label: "Shared pool" },
  beach: { icon: "beach", label: "Beach access" },
  gym: { icon: "gym", label: "Gym" },
  parking: { icon: "parking", label: "Free parking" },
  workspace: { icon: "workspace", label: "Dedicated workspace" },
  washer: { icon: "washer", label: "Washer" },
  pets: { icon: "pets", label: "Pets allowed" },
  breakfast: { icon: "breakfast", label: "Breakfast included" },
};

const HOUSE_RULES = [
  "Check-in after 3:00 pm",
  "Checkout before 11:00 am",
  "No smoking",
  "No parties or events",
  "Quiet hours after 10:00 pm",
];

function describe(seed: HomeSeed): string {
  const setting = seed.tags?.includes("beach")
    ? "steps from the water"
    : seed.tags?.includes("hotel")
      ? "in the middle of everything"
      : "in a quiet pocket of the neighbourhood";
  return [
    `${seed.name} sits ${setting} in ${seed.area}, ${seed.city}. The space was designed for slow mornings and easy evenings, with plenty of natural light and room to spread out.`,
    `You get ${seed.bedrooms} ${seed.bedrooms === 1 ? "bedroom" : "bedrooms"}, ${seed.beds} ${seed.beds === 1 ? "bed" : "beds"} and ${seed.baths} ${seed.baths === 1 ? "bathroom" : "bathrooms"}, so up to ${seed.guests} guests can settle in without anyone drawing the short straw.`,
    `Everything you need day to day is within a short walk, and getting across ${seed.city} from here is straightforward whether you drive or not.`,
  ].join("\n\n");
}

function sleepingFor(seed: HomeSeed) {
  const rooms = [];
  for (let i = 0; i < seed.bedrooms; i += 1) {
    rooms.push({
      room: `Bedroom ${i + 1}`,
      beds: i === 0 ? "1 king bed" : i === 1 ? "1 queen bed" : "2 single beds",
    });
  }
  if (seed.beds > seed.bedrooms) {
    rooms.push({ room: "Living room", beds: "1 sofa bed" });
  }
  return rooms.length ? rooms : [{ room: "Studio", beds: "1 queen bed" }];
}

function buildHome(seed: HomeSeed, index: number): Home {
  const id = `home-${String(index + 1).padStart(3, "0")}`;
  const tags = seed.tags ?? [];
  const amenities = [
    ...BASE_AMENITIES,
    ...tags.map((t) => TAG_AMENITIES[t]).filter((a): a is Amenity => Boolean(a)),
  ];

  return {
    id,
    kind: "home",
    title: `${seed.type} in ${seed.city}`,
    name: seed.name,
    propertyType: seed.type,
    placeType: seed.place ?? "entire",
    city: seed.city,
    area: seed.area,
    country: seed.country,
    price: seed.price,
    // Card totals in the reference are quoted for a two-night stay.
    nights: 2,
    rating: seed.rating,
    reviewCount: seed.reviews,
    badge: seed.badge,
    images: propertyGallery(index),
    guests: seed.guests,
    bedrooms: seed.bedrooms,
    beds: seed.beds,
    bathrooms: seed.baths,
    amenities,
    sleeping: sleepingFor(seed),
    houseRules: HOUSE_RULES,
    description: describe(seed),
    host: hostFor(id, seed.rating >= 4.9),
    reviews: reviewsFor(id, 6, seed.rating),
    tags,
    coordinates: coordsFor(seed.city, index),
  };
}

const G = "Guest favourite" as const;

const SEEDS: HomeSeed[] = [
  // ---------------------------------------------------------------- Abu Dhabi
  { type: "Apartment", city: "Abu Dhabi", area: "Corniche", country: "United Arab Emirates", name: "Corniche apartment with sea views", price: 740, rating: 5, reviews: 148, guests: 4, bedrooms: 2, beds: 2, baths: 2, badge: G, tags: ["pool", "gym", "parking"] },
  { type: "Farm stay", city: "Abu Dhabi", area: "Al Khatim", country: "United Arab Emirates", name: "Desert farm retreat with fire pit", price: 3000, rating: 4.96, reviews: 62, guests: 8, bedrooms: 3, beds: 5, baths: 3, badge: G, tags: ["parking", "pets"] },
  { type: "Apartment", city: "Abu Dhabi", area: "Al Reem Island", country: "United Arab Emirates", name: "Bright island apartment near the marina", price: 515, rating: 5, reviews: 91, guests: 3, bedrooms: 1, beds: 2, baths: 1, badge: G, tags: ["pool", "gym", "workspace"] },
  { type: "Apartment", city: "Abu Dhabi", area: "Yas Island", country: "United Arab Emirates", name: "Yas Island flat by the waterfront", price: 1440, rating: 4.93, reviews: 210, guests: 6, bedrooms: 3, beds: 4, baths: 2, tags: ["pool", "beach", "parking"] },
  { type: "Apartment", city: "Abu Dhabi", area: "Saadiyat Island", country: "United Arab Emirates", name: "Saadiyat retreat near the museums", price: 786, rating: 4.85, reviews: 74, guests: 4, bedrooms: 2, beds: 3, baths: 2, tags: ["beach", "pool"] },
  { type: "Apartment", city: "Abu Dhabi", area: "Al Bateen", country: "United Arab Emirates", name: "Quiet Al Bateen two-bedroom", price: 1012, rating: 4.93, reviews: 55, guests: 5, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["parking", "washer"] },
  { type: "Villa", city: "Abu Dhabi", area: "Khalifa City", country: "United Arab Emirates", name: "Family villa with private garden", price: 1680, rating: 4.88, reviews: 39, guests: 10, bedrooms: 4, beds: 6, baths: 4, tags: ["pool", "parking", "pets"] },
  { type: "Loft", city: "Abu Dhabi", area: "Al Maryah Island", country: "United Arab Emirates", name: "Designer loft above the promenade", price: 960, rating: 4.97, reviews: 128, guests: 2, bedrooms: 1, beds: 1, baths: 1, badge: G, tags: ["gym", "workspace"] },

  // -------------------------------------------------------------------- Hotels
  { type: "Room in boutique hotel", city: "London", area: "Shoreditch", country: "United Kingdom", name: "Sun Street Hotel Shoreditch", price: 1338, rating: 5, reviews: 402, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", badge: G, tags: ["hotel", "breakfast", "gym"] },
  { type: "Room in hotel", city: "London", area: "Canary Wharf", country: "United Kingdom", name: "Point A Hotel Canary Wharf", price: 632, rating: 4.76, reviews: 918, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", tags: ["hotel", "gym"] },
  { type: "Room in aparthotel", city: "London", area: "Dalston", country: "United Kingdom", name: "Staycity Aparthotel Dalston", price: 673, rating: 4.69, reviews: 640, guests: 4, bedrooms: 1, beds: 2, baths: 1, place: "room", tags: ["hotel", "kitchen", "washer"] },
  { type: "Room in hotel", city: "Paris", area: "Le Marais", country: "France", name: "Regency House Hotel Marais", price: 706, rating: 4.62, reviews: 512, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", tags: ["hotel", "breakfast"] },
  { type: "Room in hotel", city: "Paris", area: "Saint-Germain", country: "France", name: "Sir Devonshire Square Hotel", price: 834, rating: 4.92, reviews: 288, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", badge: G, tags: ["hotel", "breakfast"] },
  { type: "Room in hotel", city: "Dubai", area: "Downtown", country: "United Arab Emirates", name: "Kings Cross Hotel Downtown", price: 795, rating: 4.8, reviews: 733, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", tags: ["hotel", "pool", "gym"] },
  { type: "Room in hotel", city: "Bangkok", area: "Sukhumvit", country: "Thailand", name: "Riverside Suites Sukhumvit", price: 402, rating: 4.87, reviews: 1204, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", badge: G, tags: ["hotel", "pool", "breakfast"] },
  { type: "Room in hotel", city: "Istanbul", area: "Karaköy", country: "Türkiye", name: "Karaköy Grand Hotel", price: 548, rating: 4.74, reviews: 866, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", tags: ["hotel", "breakfast"] },

  // ----------------------------------------------------------- Palm Jumeirah
  { type: "Apartment", city: "Palm Jumeirah", area: "Shoreline", country: "United Arab Emirates", name: "Shoreline apartment with beach access", price: 1225, rating: 4.94, reviews: 176, guests: 4, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["beach", "pool", "gym"] },
  { type: "Villa", city: "Palm Jumeirah", area: "Frond K", country: "United Arab Emirates", name: "Private frond villa with pool", price: 4600, rating: 5, reviews: 48, guests: 12, bedrooms: 5, beds: 7, baths: 5, badge: G, tags: ["beach", "pool", "parking"] },
  { type: "Apartment", city: "Palm Jumeirah", area: "Palm Tower", country: "United Arab Emirates", name: "High-floor flat above the Palm", price: 1890, rating: 4.91, reviews: 132, guests: 4, bedrooms: 2, beds: 2, baths: 2, tags: ["pool", "gym", "workspace"] },
  { type: "Apartment", city: "Palm Jumeirah", area: "Marina Residences", country: "United Arab Emirates", name: "Marina-facing two bedroom", price: 1340, rating: 4.86, reviews: 97, guests: 5, bedrooms: 2, beds: 3, baths: 2, tags: ["beach", "pool"] },
  { type: "Penthouse", city: "Palm Jumeirah", area: "Crescent", country: "United Arab Emirates", name: "Crescent penthouse with wraparound terrace", price: 6200, rating: 5, reviews: 26, guests: 8, bedrooms: 4, beds: 5, baths: 4, badge: G, tags: ["beach", "pool", "gym", "parking"] },
  { type: "Studio", city: "Palm Jumeirah", area: "Golden Mile", country: "United Arab Emirates", name: "Golden Mile studio near the boardwalk", price: 620, rating: 4.79, reviews: 214, guests: 2, bedrooms: 1, beds: 1, baths: 1, tags: ["pool", "gym"] },
  { type: "Apartment", city: "Palm Jumeirah", area: "Azure Residences", country: "United Arab Emirates", name: "Azure flat with direct beach path", price: 1580, rating: 4.95, reviews: 88, guests: 6, bedrooms: 3, beds: 4, baths: 3, badge: G, tags: ["beach", "pool", "parking"] },
  { type: "Villa", city: "Palm Jumeirah", area: "Garden Homes", country: "United Arab Emirates", name: "Garden Homes villa with private beach", price: 5400, rating: 4.98, reviews: 41, guests: 10, bedrooms: 4, beds: 6, baths: 5, badge: G, tags: ["beach", "pool", "parking", "pets"] },

  // ------------------------------------------------------------------ Tbilisi
  { type: "Apartment", city: "Tbilisi", area: "Sololaki", country: "Georgia", name: "Restored Sololaki apartment with balcony", price: 268, rating: 4.94, reviews: 312, guests: 4, bedrooms: 2, beds: 2, baths: 1, badge: G, tags: ["workspace", "washer"] },
  { type: "Apartment", city: "Tbilisi", area: "Vera", country: "Georgia", name: "Vera flat with a leafy courtyard", price: 214, rating: 4.89, reviews: 187, guests: 3, bedrooms: 1, beds: 2, baths: 1, tags: ["workspace"] },
  { type: "Loft", city: "Tbilisi", area: "Chugureti", country: "Georgia", name: "Brick loft near the river", price: 340, rating: 5, reviews: 96, guests: 4, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["workspace", "washer", "parking"] },
  { type: "Apartment", city: "Tbilisi", area: "Old Town", country: "Georgia", name: "Old Town apartment under the fortress", price: 296, rating: 4.91, reviews: 244, guests: 4, bedrooms: 2, beds: 2, baths: 1, tags: ["washer"] },
  { type: "Guest suite", city: "Tbilisi", area: "Mtatsminda", country: "Georgia", name: "Hillside suite with city views", price: 188, rating: 4.87, reviews: 141, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", tags: ["breakfast"] },
  { type: "Apartment", city: "Tbilisi", area: "Saburtalo", country: "Georgia", name: "Modern Saburtalo two bedroom", price: 232, rating: 4.83, reviews: 168, guests: 5, bedrooms: 2, beds: 3, baths: 2, tags: ["parking", "gym", "workspace"] },
  { type: "Townhouse", city: "Tbilisi", area: "Avlabari", country: "Georgia", name: "Avlabari townhouse with roof terrace", price: 452, rating: 4.97, reviews: 73, guests: 7, bedrooms: 3, beds: 4, baths: 2, badge: G, tags: ["parking", "washer", "pets"] },
  { type: "Apartment", city: "Tbilisi", area: "Rustaveli", country: "Georgia", name: "Rustaveli flat above the boulevard", price: 305, rating: 4.92, reviews: 203, guests: 4, bedrooms: 2, beds: 2, baths: 2, badge: G, tags: ["workspace", "gym"] },
  { type: "Cottage", city: "Tbilisi", area: "Kojori", country: "Georgia", name: "Wooden cottage in the hills", price: 386, rating: 4.9, reviews: 58, guests: 6, bedrooms: 3, beds: 4, baths: 2, tags: ["parking", "pets"] },
  { type: "Studio", city: "Tbilisi", area: "Marjanishvili", country: "Georgia", name: "Compact studio by the metro", price: 152, rating: 4.81, reviews: 289, guests: 2, bedrooms: 1, beds: 1, baths: 1, tags: ["workspace", "washer"] },
  { type: "Apartment", city: "Tbilisi", area: "Didube", country: "Georgia", name: "Sunny Didube apartment", price: 176, rating: 4.85, reviews: 122, guests: 4, bedrooms: 2, beds: 2, baths: 1, tags: ["parking"] },
  { type: "Villa", city: "Tbilisi", area: "Tskneti", country: "Georgia", name: "Tskneti villa with mountain views", price: 690, rating: 5, reviews: 37, guests: 9, bedrooms: 4, beds: 5, baths: 3, badge: G, tags: ["pool", "parking", "pets"] },
  { type: "Apartment", city: "Tbilisi", area: "Vake", country: "Georgia", name: "Vake apartment near the park", price: 284, rating: 4.88, reviews: 156, guests: 4, bedrooms: 2, beds: 3, baths: 2, tags: ["workspace", "gym"] },
  { type: "Guesthouse", city: "Tbilisi", area: "Abanotubani", country: "Georgia", name: "Guesthouse by the sulphur baths", price: 246, rating: 4.93, reviews: 209, guests: 3, bedrooms: 1, beds: 2, baths: 1, badge: G, tags: ["breakfast", "washer"] },

  // ------------------------------------------------------------------- Almaty
  { type: "Apartment", city: "Almaty", area: "Medeu", country: "Kazakhstan", name: "Mountain-facing flat near Medeu", price: 298, rating: 4.98, reviews: 84, guests: 4, bedrooms: 2, beds: 2, baths: 1, badge: G, tags: ["parking", "workspace"] },
  { type: "Apartment", city: "Almaty", area: "Bostandyk", country: "Kazakhstan", name: "Bright apartment near Kok Tobe", price: 236, rating: 4.9, reviews: 147, guests: 3, bedrooms: 1, beds: 2, baths: 1, tags: ["workspace", "washer"] },
  { type: "Chalet", city: "Almaty", area: "Shymbulak", country: "Kazakhstan", name: "Ski chalet above the tree line", price: 780, rating: 5, reviews: 42, guests: 8, bedrooms: 3, beds: 5, baths: 3, badge: G, tags: ["parking", "pets"] },
  { type: "Apartment", city: "Almaty", area: "Almaly", country: "Kazakhstan", name: "Central Almaly one bedroom", price: 194, rating: 4.86, reviews: 233, guests: 2, bedrooms: 1, beds: 1, baths: 1, tags: ["workspace"] },
  { type: "Loft", city: "Almaty", area: "Panfilov", country: "Kazakhstan", name: "Industrial loft near the park", price: 352, rating: 4.94, reviews: 91, guests: 5, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["gym", "workspace", "parking"] },
  { type: "House", city: "Almaty", area: "Gorny Gigant", country: "Kazakhstan", name: "Hillside house with wide terrace", price: 640, rating: 4.92, reviews: 66, guests: 8, bedrooms: 4, beds: 5, baths: 3, tags: ["parking", "pets", "washer"] },
  { type: "Apartment", city: "Almaty", area: "Samal", country: "Kazakhstan", name: "Samal flat with balcony views", price: 268, rating: 4.89, reviews: 118, guests: 4, bedrooms: 2, beds: 2, baths: 2, tags: ["gym", "pool"] },
  { type: "Studio", city: "Almaty", area: "Zhetysu", country: "Kazakhstan", name: "Neat studio near the metro", price: 142, rating: 4.8, reviews: 276, guests: 2, bedrooms: 1, beds: 1, baths: 1, tags: ["washer", "workspace"] },

  // ----------------------------------------------------------------- Istanbul
  { type: "Apartment", city: "Istanbul", area: "Beyoğlu", country: "Türkiye", name: "Beyoğlu apartment off İstiklal", price: 412, rating: 4.91, reviews: 384, guests: 4, bedrooms: 2, beds: 3, baths: 1, badge: G, tags: ["workspace", "washer"] },
  { type: "Apartment", city: "Istanbul", area: "Cihangir", country: "Türkiye", name: "Cihangir flat with Bosphorus glimpse", price: 528, rating: 4.95, reviews: 221, guests: 3, bedrooms: 1, beds: 2, baths: 1, badge: G, tags: ["workspace"] },
  { type: "Apartment", city: "Istanbul", area: "Kadıköy", country: "Türkiye", name: "Kadıköy apartment near the ferry", price: 336, rating: 4.87, reviews: 297, guests: 4, bedrooms: 2, beds: 2, baths: 1, tags: ["washer", "pets"] },
  { type: "Loft", city: "Istanbul", area: "Galata", country: "Türkiye", name: "Galata loft under the tower", price: 604, rating: 4.97, reviews: 164, guests: 4, bedrooms: 2, beds: 2, baths: 2, badge: G, tags: ["workspace", "gym"] },
  { type: "Apartment", city: "Istanbul", area: "Beşiktaş", country: "Türkiye", name: "Beşiktaş flat by the waterfront", price: 468, rating: 4.84, reviews: 208, guests: 5, bedrooms: 2, beds: 3, baths: 2, tags: ["gym", "parking"] },
  { type: "Guest suite", city: "Istanbul", area: "Sultanahmet", country: "Türkiye", name: "Suite steps from the old city", price: 380, rating: 4.79, reviews: 452, guests: 2, bedrooms: 1, beds: 1, baths: 1, place: "room", tags: ["breakfast"] },
  { type: "Penthouse", city: "Istanbul", area: "Nişantaşı", country: "Türkiye", name: "Nişantaşı penthouse with roof deck", price: 1120, rating: 5, reviews: 63, guests: 6, bedrooms: 3, beds: 4, baths: 3, badge: G, tags: ["gym", "parking", "workspace"] },
  { type: "Apartment", city: "Istanbul", area: "Ortaköy", country: "Türkiye", name: "Ortaköy apartment under the bridge", price: 592, rating: 4.93, reviews: 139, guests: 4, bedrooms: 2, beds: 3, baths: 2, tags: ["washer", "workspace"] },

  // ---------------------------------------------------------------- JBR Beach
  { type: "Apartment", city: "JBR Beach", area: "The Walk", country: "United Arab Emirates", name: "Beachfront flat on The Walk", price: 1180, rating: 4.92, reviews: 268, guests: 4, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["beach", "pool", "gym"] },
  { type: "Apartment", city: "JBR Beach", area: "Sadaf", country: "United Arab Emirates", name: "Sadaf apartment with sea balcony", price: 940, rating: 4.86, reviews: 194, guests: 4, bedrooms: 2, beds: 2, baths: 2, tags: ["beach", "pool"] },
  { type: "Apartment", city: "JBR Beach", area: "Rimal", country: "United Arab Emirates", name: "Rimal flat one street from the sand", price: 860, rating: 4.81, reviews: 312, guests: 3, bedrooms: 1, beds: 2, baths: 1, tags: ["beach", "gym"] },
  { type: "Apartment", city: "JBR Beach", area: "Bahar", country: "United Arab Emirates", name: "Bahar two bedroom with marina view", price: 1320, rating: 4.95, reviews: 121, guests: 5, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["beach", "pool", "parking"] },
  { type: "Penthouse", city: "JBR Beach", area: "Murjan", country: "United Arab Emirates", name: "Murjan penthouse over the beach", price: 3400, rating: 5, reviews: 44, guests: 8, bedrooms: 4, beds: 5, baths: 4, badge: G, tags: ["beach", "pool", "gym", "parking"] },
  { type: "Studio", city: "JBR Beach", area: "Amwaj", country: "United Arab Emirates", name: "Amwaj studio by the promenade", price: 580, rating: 4.77, reviews: 401, guests: 2, bedrooms: 1, beds: 1, baths: 1, tags: ["beach", "gym"] },
  { type: "Apartment", city: "JBR Beach", area: "Shams", country: "United Arab Emirates", name: "Shams apartment with sunset terrace", price: 1050, rating: 4.9, reviews: 158, guests: 4, bedrooms: 2, beds: 2, baths: 2, tags: ["beach", "pool", "workspace"] },
  { type: "Loft", city: "JBR Beach", area: "Marina Gate", country: "United Arab Emirates", name: "Marina Gate loft with skyline view", price: 1460, rating: 4.94, reviews: 87, guests: 4, bedrooms: 2, beds: 2, baths: 2, badge: G, tags: ["pool", "gym", "workspace"] },

  // -------------------------------------------------------------------- Baku
  { type: "Apartment", city: "Baku", area: "Icherisheher", country: "Azerbaijan", name: "Old city apartment inside the walls", price: 322, rating: 4.93, reviews: 176, guests: 4, bedrooms: 2, beds: 2, baths: 1, badge: G, tags: ["workspace", "washer"] },
  { type: "Apartment", city: "Baku", area: "Nizami", country: "Azerbaijan", name: "Nizami flat on the pedestrian street", price: 268, rating: 4.88, reviews: 242, guests: 3, bedrooms: 1, beds: 2, baths: 1, tags: ["workspace"] },
  { type: "Apartment", city: "Baku", area: "Boulevard", country: "Azerbaijan", name: "Seafront apartment on the Boulevard", price: 486, rating: 4.96, reviews: 108, guests: 5, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["gym", "parking", "workspace"] },
  { type: "Loft", city: "Baku", area: "Yasamal", country: "Azerbaijan", name: "Yasamal loft with tall windows", price: 364, rating: 4.85, reviews: 93, guests: 4, bedrooms: 2, beds: 2, baths: 2, tags: ["workspace", "washer"] },
  { type: "Villa", city: "Baku", area: "Mardakan", country: "Azerbaijan", name: "Mardakan villa with garden pool", price: 890, rating: 4.97, reviews: 51, guests: 10, bedrooms: 4, beds: 6, baths: 4, badge: G, tags: ["pool", "parking", "pets"] },
  { type: "Studio", city: "Baku", area: "Sahil", country: "Azerbaijan", name: "Sahil studio near the metro", price: 178, rating: 4.79, reviews: 318, guests: 2, bedrooms: 1, beds: 1, baths: 1, tags: ["washer", "workspace"] },
  { type: "Apartment", city: "Baku", area: "Flame Towers", country: "Azerbaijan", name: "High-floor flat facing the Flame Towers", price: 620, rating: 5, reviews: 67, guests: 4, bedrooms: 2, beds: 2, baths: 2, badge: G, tags: ["pool", "gym", "parking"] },
  { type: "Guesthouse", city: "Baku", area: "Bilgah", country: "Azerbaijan", name: "Seaside guesthouse north of the city", price: 412, rating: 4.83, reviews: 74, guests: 6, bedrooms: 3, beds: 4, baths: 2, tags: ["beach", "parking", "breakfast"] },

  // ------------------------------------------------------- Ras Al Khaimah City
  { type: "Villa", city: "Ras Al Khaimah City", area: "Al Hamra", country: "United Arab Emirates", name: "Al Hamra villa on the lagoon", price: 2640, rating: 4.89, reviews: 82, guests: 8, bedrooms: 4, beds: 5, baths: 4, badge: G, tags: ["beach", "pool", "parking"] },
  { type: "Apartment", city: "Ras Al Khaimah City", area: "Al Marjan Island", country: "United Arab Emirates", name: "Marjan Island flat with sea terrace", price: 1694, rating: 4.93, reviews: 143, guests: 5, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["beach", "pool", "gym"] },
  { type: "Apartment", city: "Ras Al Khaimah City", area: "Mina Al Arab", country: "United Arab Emirates", name: "Mina Al Arab waterfront apartment", price: 2945, rating: 4.99, reviews: 61, guests: 6, bedrooms: 3, beds: 4, baths: 3, badge: G, tags: ["beach", "pool", "parking"] },
  { type: "Villa", city: "Ras Al Khaimah City", area: "Jebel Jais", country: "United Arab Emirates", name: "Mountain villa near Jebel Jais", price: 2360, rating: 5, reviews: 34, guests: 9, bedrooms: 4, beds: 6, baths: 4, badge: G, tags: ["parking", "pets"] },
  { type: "Apartment", city: "Ras Al Khaimah City", area: "Al Nakheel", country: "United Arab Emirates", name: "Al Nakheel apartment in the centre", price: 720, rating: 4.82, reviews: 188, guests: 4, bedrooms: 2, beds: 2, baths: 2, tags: ["pool", "gym", "parking"] },
  { type: "Home", city: "Ras Al Khaimah City", area: "Khuzam", country: "United Arab Emirates", name: "Family home with shaded courtyard", price: 3984, rating: 5, reviews: 29, guests: 12, bedrooms: 5, beds: 7, baths: 5, badge: G, tags: ["pool", "parking", "pets", "washer"] },
  { type: "Barn", city: "Ras Al Khaimah City", area: "Wadi Shawka", country: "United Arab Emirates", name: "Converted barn in the wadi", price: 2360, rating: 5, reviews: 22, guests: 6, bedrooms: 3, beds: 4, baths: 2, badge: G, tags: ["parking", "pets"] },
  { type: "Vacation home", city: "Ras Al Khaimah City", area: "Al Rams", country: "United Arab Emirates", name: "Coastal vacation home in Al Rams", price: 2696, rating: 4.89, reviews: 45, guests: 8, bedrooms: 4, beds: 5, baths: 3, tags: ["beach", "pool", "parking"] },

  // ---------------------------------------------------------- Extra city depth
  { type: "Apartment", city: "Dubai", area: "Downtown", country: "United Arab Emirates", name: "Downtown flat facing the fountain", price: 1290, rating: 4.94, reviews: 356, guests: 4, bedrooms: 2, beds: 2, baths: 2, badge: G, tags: ["pool", "gym", "workspace"] },
  { type: "Apartment", city: "Dubai", area: "Business Bay", country: "United Arab Emirates", name: "Business Bay canal apartment", price: 880, rating: 4.87, reviews: 274, guests: 4, bedrooms: 2, beds: 3, baths: 2, tags: ["pool", "gym", "parking"] },
  { type: "Villa", city: "Dubai", area: "Al Barsha", country: "United Arab Emirates", name: "Al Barsha villa with pool and garden", price: 2480, rating: 4.91, reviews: 96, guests: 10, bedrooms: 5, beds: 6, baths: 4, tags: ["pool", "parking", "pets"] },
  { type: "Studio", city: "Dubai", area: "Al Quoz", country: "United Arab Emirates", name: "Artist studio in the warehouse district", price: 470, rating: 4.84, reviews: 132, guests: 2, bedrooms: 1, beds: 1, baths: 1, tags: ["workspace", "parking"] },
  { type: "Apartment", city: "London", area: "Notting Hill", country: "United Kingdom", name: "Notting Hill garden flat", price: 1140, rating: 4.9, reviews: 187, guests: 4, bedrooms: 2, beds: 2, baths: 1, badge: G, tags: ["washer", "workspace"] },
  { type: "Apartment", city: "Paris", area: "Montmartre", country: "France", name: "Montmartre apartment with rooftop view", price: 980, rating: 4.93, reviews: 241, guests: 3, bedrooms: 1, beds: 2, baths: 1, badge: G, tags: ["washer", "workspace"] },
  { type: "Apartment", city: "Bangkok", area: "Thonglor", country: "Thailand", name: "Thonglor apartment with pool deck", price: 386, rating: 4.88, reviews: 329, guests: 4, bedrooms: 2, beds: 2, baths: 2, tags: ["pool", "gym", "workspace"] },
  { type: "Apartment", city: "Bangkok", area: "Riverside", country: "Thailand", name: "Riverside flat facing the Chao Phraya", price: 442, rating: 4.95, reviews: 158, guests: 4, bedrooms: 2, beds: 3, baths: 2, badge: G, tags: ["pool", "gym"] },
];

export const homes: Home[] = SEEDS.map(buildHome);

export function getHomeById(id: string): Home | undefined {
  return homes.find((home) => home.id === id);
}

export function homesInCity(city: string, limit?: number): Home[] {
  const matches = homes.filter((home) => home.city === city);
  return limit ? matches.slice(0, limit) : matches;
}

export function homesWithTag(tag: string, limit?: number): Home[] {
  const matches = homes.filter((home) => home.tags.includes(tag));
  return limit ? matches.slice(0, limit) : matches;
}

/** Distinct cities that currently have stays, for search suggestions. */
export const homeCities: string[] = Array.from(new Set(homes.map((h) => h.city)));
