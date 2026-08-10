import {
  AirVent,
  Bath,
  Bike,
  Car,
  ChefHat,
  Coffee,
  Dumbbell,
  Laptop,
  PawPrint,
  Tv,
  Umbrella,
  Waves,
  Wifi,
  WashingMachine,
  type LucideIcon,
} from "lucide-react";
import type { AmenityIcon } from "@/types/listing";

/** Maps amenity keys in the data files to Lucide icons. */
export const amenityIcons: Record<AmenityIcon, LucideIcon> = {
  wifi: Wifi,
  kitchen: ChefHat,
  parking: Car,
  pool: Waves,
  ac: AirVent,
  tv: Tv,
  washer: WashingMachine,
  gym: Dumbbell,
  workspace: Laptop,
  beach: Umbrella,
  pets: PawPrint,
  breakfast: Coffee,
};

/** Fallbacks kept around for detail-page extras that are not filterable. */
export const extraIcons = { bath: Bath, bike: Bike };
