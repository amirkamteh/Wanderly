export interface InspirationEntry {
  /** Destination name, e.g. "Dallas". */
  place: string;
  /** Rental type line, e.g. "Monthly rentals". */
  kind: string;
}

export interface InspirationTab {
  id: string;
  label: string;
  entries: InspirationEntry[];
}

/**
 * Data behind the "Inspiration for future getaways" section. Each tab renders
 * as a multi-column grid of destination + rental-type pairs.
 */
export const inspirationTabs: InspirationTab[] = [
  {
    id: "popular",
    label: "Popular",
    entries: [
      { place: "Dallas", kind: "Monthly rentals" },
      { place: "North Myrtle Beach", kind: "Condo rentals" },
      { place: "Portland", kind: "Cottage rentals" },
      { place: "Nice", kind: "House rentals" },
      { place: "Philadelphia", kind: "Apartment rentals" },
      { place: "Orange Beach", kind: "House rentals" },
      { place: "Cleveland", kind: "House rentals" },
      { place: "Traverse City", kind: "Condo rentals" },
      { place: "Tokyo", kind: "Apartment rentals" },
      { place: "Charlotte", kind: "House rentals" },
      { place: "Raleigh", kind: "Condo rentals" },
      { place: "Galveston", kind: "Villa rentals" },
      { place: "Portland", kind: "Apartment rentals" },
      { place: "Minneapolis", kind: "Condo rentals" },
      { place: "San Diego", kind: "Vacation rentals" },
      { place: "Pocono Mountains", kind: "House rentals" },
      { place: "San Antonio", kind: "Apartment rentals" },
      { place: "Scottsdale", kind: "Villa rentals" },
    ],
  },
  {
    id: "arts-culture",
    label: "Arts & culture",
    entries: [
      { place: "Florence", kind: "Apartment rentals" },
      { place: "Kyoto", kind: "House rentals" },
      { place: "Vienna", kind: "Apartment rentals" },
      { place: "Mexico City", kind: "Loft rentals" },
      { place: "Istanbul", kind: "Apartment rentals" },
      { place: "New Orleans", kind: "Cottage rentals" },
      { place: "Berlin", kind: "Loft rentals" },
      { place: "Lisbon", kind: "Apartment rentals" },
      { place: "Seville", kind: "House rentals" },
      { place: "Edinburgh", kind: "Flat rentals" },
      { place: "Prague", kind: "Apartment rentals" },
      { place: "Buenos Aires", kind: "Apartment rentals" },
    ],
  },
  {
    id: "beach",
    label: "Beach",
    entries: [
      { place: "Gulf Shores", kind: "House rentals" },
      { place: "Destin", kind: "Condo rentals" },
      { place: "Phuket", kind: "Villa rentals" },
      { place: "Algarve", kind: "House rentals" },
      { place: "Tulum", kind: "Villa rentals" },
      { place: "Bali", kind: "Villa rentals" },
      { place: "Outer Banks", kind: "House rentals" },
      { place: "Corfu", kind: "Apartment rentals" },
      { place: "Maui", kind: "Condo rentals" },
      { place: "Costa Brava", kind: "Villa rentals" },
      { place: "Zanzibar", kind: "Bungalow rentals" },
      { place: "Da Nang", kind: "Apartment rentals" },
    ],
  },
  {
    id: "mountains",
    label: "Mountains",
    entries: [
      { place: "Aspen", kind: "Cabin rentals" },
      { place: "Chamonix", kind: "Chalet rentals" },
      { place: "Banff", kind: "Cabin rentals" },
      { place: "Queenstown", kind: "House rentals" },
      { place: "Zermatt", kind: "Chalet rentals" },
      { place: "Almaty", kind: "Apartment rentals" },
      { place: "Gatlinburg", kind: "Cabin rentals" },
      { place: "Innsbruck", kind: "Apartment rentals" },
      { place: "Big Bear Lake", kind: "Cabin rentals" },
      { place: "Bansko", kind: "Apartment rentals" },
      { place: "Whistler", kind: "Condo rentals" },
      { place: "Gudauri", kind: "Chalet rentals" },
    ],
  },
  {
    id: "outdoors",
    label: "Outdoors",
    entries: [
      { place: "Moab", kind: "Camper rentals" },
      { place: "Sedona", kind: "House rentals" },
      { place: "Jackson", kind: "Cabin rentals" },
      { place: "Torres del Paine", kind: "Lodge rentals" },
      { place: "Lake Tahoe", kind: "Cabin rentals" },
      { place: "Ras Al Khaimah City", kind: "Villa rentals" },
      { place: "Interlaken", kind: "Apartment rentals" },
      { place: "Kruger", kind: "Lodge rentals" },
      { place: "Yosemite", kind: "Cabin rentals" },
      { place: "Snowdonia", kind: "Cottage rentals" },
      { place: "Dolomites", kind: "Chalet rentals" },
      { place: "Wadi Rum", kind: "Camp rentals" },
    ],
  },
  {
    id: "things-to-do",
    label: "Things to do",
    entries: [
      { place: "Dubai", kind: "Desert safaris" },
      { place: "Istanbul", kind: "Food tours" },
      { place: "Bangkok", kind: "Cooking classes" },
      { place: "Paris", kind: "Photo walks" },
      { place: "Tbilisi", kind: "Wine tastings" },
      { place: "Almaty", kind: "Mountain day trips" },
      { place: "London", kind: "Pottery classes" },
      { place: "Abu Dhabi", kind: "Kayaking" },
      { place: "Baku", kind: "Live music nights" },
      { place: "Chiang Mai", kind: "Yoga sessions" },
      { place: "Athens", kind: "Craft workshops" },
      { place: "Brooklyn", kind: "Game nights" },
    ],
  },
  {
    id: "travel-friendly",
    label: "Travel-friendly apartments",
    entries: [
      { place: "Dubai", kind: "Monthly rentals" },
      { place: "Tbilisi", kind: "Monthly rentals" },
      { place: "Lisbon", kind: "Monthly rentals" },
      { place: "Bangkok", kind: "Monthly rentals" },
      { place: "Mexico City", kind: "Monthly rentals" },
      { place: "Istanbul", kind: "Monthly rentals" },
      { place: "Almaty", kind: "Monthly rentals" },
      { place: "Buenos Aires", kind: "Monthly rentals" },
      { place: "Medellín", kind: "Monthly rentals" },
      { place: "Baku", kind: "Monthly rentals" },
      { place: "Warsaw", kind: "Monthly rentals" },
      { place: "Da Nang", kind: "Monthly rentals" },
    ],
  },
];
