import { CITY_PHOTOS, img } from "./images";

export interface Destination {
  name: string;
  country: string;
  /** Short line shown under the name in the destination dropdown. */
  hint: string;
  image: string;
}

/** Destinations offered as suggestions in the search bar. */
export const destinations: Destination[] = [
  { name: "Dubai", country: "United Arab Emirates", hint: "Popular with travellers near you", image: img(CITY_PHOTOS.dubaiSkyline, 200, 200) },
  { name: "Abu Dhabi", country: "United Arab Emirates", hint: "For its beaches and museums", image: img(CITY_PHOTOS.grandMosque, 200, 200) },
  { name: "Palm Jumeirah", country: "United Arab Emirates", hint: "Known for its resorts", image: img(CITY_PHOTOS.burjAlArabAerial, 200, 200) },
  { name: "JBR Beach", country: "United Arab Emirates", hint: "Beachfront apartments and cafés", image: img(CITY_PHOTOS.burjAlArab, 200, 200) },
  { name: "Ras Al Khaimah City", country: "United Arab Emirates", hint: "Mountains and quiet coastline", image: img(CITY_PHOTOS.desertSunset, 200, 200) },
  { name: "Tbilisi", country: "Georgia", hint: "Great for food and wine", image: img(CITY_PHOTOS.oldCity, 200, 200) },
  { name: "Almaty", country: "Kazakhstan", hint: "For the mountains on the doorstep", image: img(CITY_PHOTOS.mountains, 200, 200) },
  { name: "Istanbul", country: "Türkiye", hint: "A city on two continents", image: img(CITY_PHOTOS.oldCity, 200, 200) },
  { name: "Baku", country: "Azerbaijan", hint: "Old walls and new towers", image: img(CITY_PHOTOS.modernTower, 200, 200) },
  { name: "London", country: "United Kingdom", hint: "For its museums and markets", image: img(CITY_PHOTOS.cityStreet, 200, 200) },
  { name: "Paris", country: "France", hint: "A classic for a long weekend", image: img(CITY_PHOTOS.bridge, 200, 200) },
  { name: "Bangkok", country: "Thailand", hint: "Street food and river life", image: img(CITY_PHOTOS.coastalTown, 200, 200) },
];

/** Regions offered before the traveller starts typing. */
export const flexibleRegions: string[] = [
  "I'm flexible",
  "Middle East",
  "Europe",
  "Southeast Asia",
  "Central Asia",
  "Caucasus",
];

export function findDestination(name: string): Destination | undefined {
  return destinations.find((d) => d.name.toLowerCase() === name.toLowerCase());
}
