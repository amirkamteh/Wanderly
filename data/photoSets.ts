import { PROPERTY_PHOTOS, img } from "./images";

/**
 * Coherent five-shot galleries (living → bedroom → kitchen → bath → exterior)
 * so every stay detail page tells the same visual story. Homes cycle through
 * these, which keeps consecutive cards in a rail visually distinct.
 */
const SETS: Array<Array<keyof typeof PROPERTY_PHOTOS>> = [
  ["livingBright", "bedroomLinen", "kitchenWhite", "bathClassic", "exteriorPoolVilla"],
  ["livingSofa", "bedroomWhite", "kitchenIsland", "bathSpa", "exteriorModern"],
  ["livingPlants", "bedroomLamp", "kitchenMarble", "bathStone", "exteriorTimber"],
  ["livingWood", "bedroomHotel", "kitchenChef", "bathClassic", "exteriorNight"],
  ["livingGrey", "bedroomTeak", "kitchenTimber", "bathSpa", "exteriorGarden"],
  ["livingWarm", "bedroomSuite", "kitchenGalley", "bathStone", "exteriorAngular"],
  ["livingOpen", "bedroomCity", "kitchenWhite", "bathClassic", "exteriorCourtyard"],
  ["livingStone", "bedroomCalm", "kitchenIsland", "bathSpa", "exteriorTower"],
  ["livingTan", "bedroomOrange", "kitchenMarble", "bathStone", "exteriorLodge"],
  ["livingCoastal", "bedroomVilla", "kitchenChef", "bathClassic", "exteriorPoolDeck"],
  ["livingNordic", "bedroomLinen", "kitchenTimber", "bathSpa", "exteriorSunset"],
  ["livingLoft", "bedroomWhite", "kitchenGalley", "bathStone", "exteriorResort"],
  ["livingMinimal", "bedroomLamp", "kitchenWhite", "bathClassic", "exteriorPalms"],
  ["livingGallery", "bedroomHotel", "kitchenIsland", "bathSpa", "exteriorCabana"],
  ["livingSunlit", "bedroomTeak", "kitchenMarble", "bathStone", "exteriorInfinity"],
  ["livingCurated", "bedroomSuite", "kitchenChef", "bathClassic", "exteriorLagoon"],
  ["loungeHotel", "bedroomCity", "kitchenGalley", "bathSpa", "exteriorTropical"],
  ["studioApartment", "bedroomCalm", "kitchenWhite", "bathStone", "exteriorPoolside"],
  ["diningRoom", "bedroomOrange", "kitchenTimber", "bathClassic", "exteriorRiad"],
  ["atriumGreen", "bedroomVilla", "kitchenIsland", "bathSpa", "exteriorTerrace"],
];

/** Returns a five-image gallery for the nth home. */
export function propertyGallery(index: number): string[] {
  const set = SETS[index % SETS.length];
  return set.map((key) => img(PROPERTY_PHOTOS[key], 1200, 900));
}
