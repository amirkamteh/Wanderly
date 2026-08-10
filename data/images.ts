/**
 * Centralised image configuration.
 *
 * Every photo in the app resolves through this file so that swapping the
 * image source (or moving to local assets) is a one-file change. Photos are
 * from Unsplash, which permits free commercial and non-commercial use.
 *
 * Each entry is an Unsplash photo id; `img()` turns it into a sized URL.
 */

const UNSPLASH = "https://images.unsplash.com";

/** Builds a cropped, sized Unsplash URL for a photo id. */
export function img(id: string, width = 1200, height?: number): string {
  const params = new URLSearchParams({
    auto: "format",
    fit: "crop",
    q: "80",
    w: String(width),
  });
  if (height) params.set("h", String(height));
  return `${UNSPLASH}/${id}?${params.toString()}`;
}

/** Interiors and exteriors used for stays. */
export const PROPERTY_PHOTOS = {
  livingBright: "photo-1493809842364-78817add7ffb",
  livingSofa: "photo-1493663284031-b7e3aefcae8e",
  livingPlants: "photo-1502672023488-70e25813eb80",
  livingWood: "photo-1502672260266-1c1ef2d93688",
  livingGrey: "photo-1560448204-e02f11c3d0e2",
  livingWarm: "photo-1600210492486-724fe5c67fb0",
  livingOpen: "photo-1600566753086-00f18fb6b3ea",
  livingStone: "photo-1600607687920-4e2a09cf159d",
  livingTan: "photo-1554995207-c18c203602cb",
  livingCoastal: "photo-1560448204-603b3fc33ddc",
  livingNordic: "photo-1583847268964-b28dc8f51f92",
  livingLoft: "photo-1600607687939-ce8a6c25118c",
  livingMinimal: "photo-1618221195710-dd6b41faaea6",
  livingGallery: "photo-1600566752355-35792bedcfea",
  livingSunlit: "photo-1631049307264-da0ec9d70304",
  livingCurated: "photo-1600585152915-d208bec867a1",
  loungeHotel: "photo-1600880292089-90a7e086ee0c",

  kitchenWhite: "photo-1484154218962-a197022b5858",
  kitchenIsland: "photo-1507089947368-19c1da9775ae",
  kitchenMarble: "photo-1556909212-d5b604d0c90d",
  kitchenChef: "photo-1556911220-bff31c812dba",
  kitchenTimber: "photo-1600585152220-90363fe7e115",
  kitchenGalley: "photo-1502005097973-6a7082348e28",

  bedroomLinen: "photo-1505693416388-ac5ce068fe85",
  bedroomWhite: "photo-1512918728675-ed5a9ecdebfd",
  bedroomLamp: "photo-1522771739844-6a9f6d5f14af",
  bedroomHotel: "photo-1590490360182-c33d57733427",
  bedroomTeak: "photo-1582719478250-c89cae4dc85b",
  bedroomSuite: "photo-1607990281513-2c110a25bd8c",
  bedroomCity: "photo-1578683010236-d716f9a3f461",
  bedroomCalm: "photo-1560185893-a55cbc8c57e8",
  bedroomOrange: "photo-1540518614846-7eded433c457",
  bedroomVilla: "photo-1611892440504-42a792e24d32",

  bathSpa: "photo-1600566753190-17f0baa2a6c3",
  bathClassic: "photo-1560448075-bb485b067938",
  bathStone: "photo-1600607688066-890987f18a86",

  diningRoom: "photo-1600585154340-be6161a56a0c",
  diningLong: "photo-1600607687920-4e2a09cf159d",
  studioApartment: "photo-1522708323590-d24dbb6b0267",
  studioDesk: "photo-1522444195799-478538b28823",
  atriumGreen: "photo-1522798514-97ceb8c4f1c8",

  exteriorPoolVilla: "photo-1512917774080-9991f1c4c750",
  exteriorModern: "photo-1600596542815-ffad4c1539a9",
  exteriorTimber: "photo-1600573472550-8090b5e0745e",
  exteriorNight: "photo-1600585154526-990dced4db0d",
  exteriorGarden: "photo-1600607688969-a5bfcd646154",
  exteriorAngular: "photo-1600047509807-ba8f99d2cdde",
  exteriorCourtyard: "photo-1600573472592-401b489a3cdc",
  exteriorTower: "photo-1515263487990-61b07816b324",
  exteriorLodge: "photo-1566073771259-6a8506099945",
  exteriorPoolDeck: "photo-1613490493576-7fde63acd811",
  exteriorSunset: "photo-1584132967334-10e028bd69f7",
  exteriorResort: "photo-1571896349842-33c89424de2d",
  exteriorPalms: "photo-1596178065887-1198b6148b2b",
  exteriorCabana: "photo-1596436889106-be35e843f974",
  exteriorInfinity: "photo-1520250497591-112f2f40a3f4",
  exteriorLagoon: "photo-1571003123894-1f0594d2b5d9",
  exteriorTropical: "photo-1527142879-95b61a0b8226",
  exteriorPoolside: "photo-1551882547-ff40c63fe5fa",
  exteriorRiad: "photo-1560750588-73207b1ef5b8",
  exteriorTerrace: "photo-1568605114967-8130f3a36994",
} as const;

/** Landmarks and skylines used for destination and city imagery. */
export const CITY_PHOTOS = {
  dubaiSkyline: "photo-1512453979798-5ea266f8880c",
  dubaiMarina: "photo-1546412414-8035e1776c9a",
  burjAlArab: "photo-1546412414-e1885259563a",
  burjAlArabAerial: "photo-1518684079-3c830dcef090",
  grandMosque: "photo-1512632578888-169bbbc64f33",
  desertSunset: "photo-1547471080-7cc2caa01a7e",
  coastalTown: "photo-1533105079780-92b9be482077",
  mountains: "photo-1526772662000-3f88f10405ff",
  mountainDusk: "photo-1516117172878-fd2c41f4a759",
  oldCity: "photo-1580418827493-f2b22c0a76cb",
  cityStreet: "photo-1449824913935-59a10b8d2000",
  modernTower: "photo-1487958449943-2429e8be8625",
  bridge: "photo-1449034446853-66c86144b0ad",
} as const;

/**
 * Activity photography for experiences.
 *
 * Every key resolves to a distinct photo — duplicates here show up as the same
 * picture repeated across a rail, which is the fastest way to make a
 * marketplace look fake.
 */
export const EXPERIENCE_PHOTOS = {
  desertDunes: "photo-1547471080-7cc2caa01a7e",
  desertHorizon: "photo-1516117172878-fd2c41f4a759",
  mountainHike: "photo-1526772662000-3f88f10405ff",
  groupTravel: "photo-1529156069898-49953e39b3ac",
  coastalWalk: "photo-1533105079780-92b9be482077",
  concert: "photo-1492684223066-81342ee5ff30",
  liveShow: "photo-1533174072545-7a4b6ad7a6c3",
  finePlating: "photo-1414235077428-338989a2e8c0",
  chefPlating: "photo-1571805529673-0f56b922b359",
  sharedTable: "photo-1466978913421-dad2ebd01d17",
  marketFood: "photo-1504674900247-0877df9cc836",
  grill: "photo-1555939594-58d7cb561ad1",
  fineDining: "photo-1467003909585-2f8a72700288",
  tableSetting: "photo-1511795409834-ef04bbd61622",
  neonEat: "photo-1527224538127-2104bb71c51b",
  runningTrail: "photo-1552674605-db6ffd4facb5",
  runningGroup: "photo-1607962837359-5e7e89f86776",
  workshop: "photo-1556761175-5973dc0f32e7",
  studioClass: "photo-1524178232363-1fb2b075b655",
  artStudio: "photo-1556761175-b413da4baf72",
  gallery: "photo-1518998053901-5348d3961a04",
  yogaMat: "photo-1518611012118-696072aa579a",
  poolLounge: "photo-1527142879-95b61a0b8226",
  lagoonDusk: "photo-1571003123894-1f0594d2b5d9",
  mosqueDusk: "photo-1512632578888-169bbbc64f33",
  skylineDusk: "photo-1512453979798-5ea266f8880c",
  cityStreet: "photo-1546412414-8035e1776c9a",
  oldQuarter: "photo-1580418827493-f2b22c0a76cb",
  harbour: "photo-1449034446853-66c86144b0ad",
} as const;

/** Category tiles and provider photography for services. */
export const SERVICE_PHOTOS = {
  cameraFlatlay: "photo-1516035069371-29a1b244cc32",
  photographerAtWork: "photo-1554048612-b6a482bc67e5",
  photographerPortrait: "photo-1552058544-f2b08422138a",
  deskNotes: "photo-1454165804606-c3d57bc86b40",
  // Sample output, which is what a photography listing actually sells.
  portraitOutdoor: "photo-1508214751196-bcfd4ca60f91",
  portraitStudio: "photo-1524504388940-b1c1722653e1",
  portraitNatural: "photo-1489424731084-a5d8b219a5bb",
  coupleWedding: "photo-1519741497674-611481863552",
  familyGroup: "photo-1529156069898-49953e39b3ac",
  travelPortrait: "photo-1503104834685-7205e8607eb9",
  eventTable: "photo-1511795409834-ef04bbd61622",
  nightStreet: "photo-1527224538127-2104bb71c51b",

  chefPlate: "photo-1571805529673-0f56b922b359",
  chefTable: "photo-1467003909585-2f8a72700288",
  chefGrill: "photo-1555939594-58d7cb561ad1",
  chefKitchen: "photo-1556911220-bff31c812dba",
  chefIngredients: "photo-1504674900247-0877df9cc836",

  gymWeights: "photo-1534438327276-14e5300c3a48",
  gymFloor: "photo-1540497077202-7c8a3999166f",
  lifting: "photo-1517836357463-d25dfeac3438",
  liftingClose: "photo-1517963879433-6ad2b056d712",
  groupFitness: "photo-1518310383802-640c2de311b2",
  pilates: "photo-1518611012118-696072aa579a",
  boxing: "photo-1581009146145-b5ef050c2e1e",
  personalTrainer: "photo-1571019614242-c5c5dee9f50b",
  coreWorkout: "photo-1571019613454-1cb2f99b2d8b",
  sprint: "photo-1534258936925-c58bed479fcb",
  athleteRun: "photo-1526506118085-60ce8714f8c5",

  makeupBrushes: "photo-1596462502278-27bfdc403348",
  makeupPalette: "photo-1596704017254-9b121068fb31",
  makeupFlatlay: "photo-1522335789203-aabd1fc54bc9",
  makeupApplication: "photo-1487412947147-5cebf100ffc2",
  beautyPortrait: "photo-1519699047748-de8e457a634e",
  beautyEditorial: "photo-1502823403499-6ccfcf4fb453",
  nailPolish: "photo-1522337660859-02fbefca4702",
  facial: "photo-1570172619644-dfd03ed5d881",
  skincare: "photo-1552693673-1bf958298935",

  hairSalonChairs: "photo-1560066984-138dadb4c035",
  hairWash: "photo-1595476108010-b4d1f102b1b1",
  hairStyling: "photo-1562322140-8baeececf3df",
  barber: "photo-1605497788044-5a32c7078486",
  salonInterior: "photo-1600948836101-f9ffda59d250",
  longHair: "photo-1522337360788-8b13dee7a37e",

  massage: "photo-1544161515-4ab6ce6db874",
  spaOils: "photo-1540555700478-4be289fbecef",
  spaMinimal: "photo-1545241047-6083a3684587",
} as const;

/** Portraits used for hosts, providers and review authors. */
export const PEOPLE_PHOTOS = [
  "photo-1438761681033-6461ffad8d80",
  "photo-1463453091185-61582044d556",
  "photo-1487412720507-e7ab37603c6f",
  "photo-1489424731084-a5d8b219a5bb",
  "photo-1492562080023-ab3db95bfbce",
  "photo-1494790108377-be9c29b29330",
  "photo-1500648767791-00dcc994a43e",
  "photo-1503104834685-7205e8607eb9",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1507003211169-0a1dd7228f2d",
  "photo-1508214751196-bcfd4ca60f91",
  "photo-1517841905240-472988babdf9",
  "photo-1519345182560-3f2917c472ef",
  "photo-1521737604893-d14cc237f11d",
  "photo-1524504388940-b1c1722653e1",
  "photo-1531123897727-8f129e1688ce",
  "photo-1544005313-94ddf0286df2",
  "photo-1556157382-97eda2d62296",
  "photo-1560250097-0b93528c311a",
  "photo-1573497019940-1c28c88b4f3e",
  "photo-1580489944761-15a19d654956",
  "photo-1583864697784-a0efc8379f70",
  "photo-1607346256330-dee7af15f7c5",
  "photo-1618077360395-f3068be8e001",
] as const;

/** Stable avatar for a given person name, so re-renders never reshuffle. */
export function avatarFor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return img(PEOPLE_PHOTOS[hash % PEOPLE_PHOTOS.length], 160, 160);
}

/** Neutral gradient shown behind an image while it loads or if it fails. */
export const IMAGE_FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="#eceded"/></svg>`,
  );
