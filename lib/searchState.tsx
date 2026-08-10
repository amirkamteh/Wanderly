"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DateRange, GuestCounts, SearchQuery } from "@/types/user";

export const emptyGuests: GuestCounts = { adults: 0, children: 0, infants: 0, pets: 0 };
export const emptyDates: DateRange = { start: null, end: null };

/**
 * Same shape as `SearchQuery`, except `serviceType` is always present — the
 * provider defaults it to an empty string rather than leaving it undefined.
 */
interface SearchStateValue extends Omit<SearchQuery, "serviceType"> {
  serviceType: string;
  setDestination: (value: string) => void;
  setDates: (value: DateRange) => void;
  setGuests: (value: GuestCounts) => void;
  setServiceType: (value: string) => void;
  reset: () => void;
  /** Builds the `/search` querystring for the current selection. */
  toQueryString: (tab: string) => string;
}

const SearchStateContext = createContext<SearchStateValue | null>(null);

/**
 * Holds what the search bar has collected so the pill, the modal and the
 * mobile sheet all read and write the same selection.
 */
export function SearchStateProvider({ children }: { children: ReactNode }) {
  const [destination, setDestination] = useState("");
  const [dates, setDates] = useState<DateRange>(emptyDates);
  const [guests, setGuests] = useState<GuestCounts>(emptyGuests);
  const [serviceType, setServiceType] = useState("");

  const reset = useCallback(() => {
    setDestination("");
    setDates(emptyDates);
    setGuests(emptyGuests);
    setServiceType("");
  }, []);

  const toQueryString = useCallback(
    (tab: string) => {
      const params = new URLSearchParams({ tab });
      if (destination) params.set("where", destination);
      if (dates.start) params.set("checkIn", dates.start);
      if (dates.end) params.set("checkOut", dates.end);
      const people = guests.adults + guests.children;
      if (people) params.set("guests", String(people));
      if (guests.infants) params.set("infants", String(guests.infants));
      if (guests.pets) params.set("pets", String(guests.pets));
      if (serviceType) params.set("service", serviceType);
      return params.toString();
    },
    [destination, dates, guests, serviceType],
  );

  const value = useMemo(
    () => ({
      destination,
      dates,
      guests,
      serviceType,
      setDestination,
      setDates,
      setGuests,
      setServiceType,
      reset,
      toQueryString,
    }),
    [destination, dates, guests, serviceType, reset, toQueryString],
  );

  return <SearchStateContext.Provider value={value}>{children}</SearchStateContext.Provider>;
}

export function useSearchState(): SearchStateValue {
  const context = useContext(SearchStateContext);
  if (!context) {
    throw new Error("useSearchState must be used inside a SearchStateProvider");
  }
  return context;
}
