"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { ListingKind } from "@/types/listing";
import type { WishlistItem } from "@/types/user";

const STORAGE_KEY = "wanderly.wishlist.v1";

/**
 * The wishlist lives in localStorage, which makes it an external store rather
 * than React state. Reading it through `useSyncExternalStore` avoids both the
 * hydration mismatch and the set-state-in-effect pattern.
 */

/** Stable sentinel returned during SSR and the hydration render. */
const SERVER_SNAPSHOT: WishlistItem[] = [];

let snapshot: WishlistItem[] = SERVER_SNAPSHOT;
let listeners: Array<() => void> = [];

function isWishlistItem(value: unknown): value is WishlistItem {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as WishlistItem).id === "string" &&
    typeof (value as WishlistItem).kind === "string"
  );
}

function readStorage(): WishlistItem[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isWishlistItem) : [];
  } catch {
    // Private mode or corrupted data: start from an empty wishlist.
    return [];
  }
}

function emit() {
  for (const listener of listeners) listener();
}

/** Replaces the snapshot, persists it, and notifies subscribers. */
function commit(next: WishlistItem[]) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked — the wishlist still works for this session.
  }
  emit();
}

function subscribe(listener: () => void): () => void {
  // The first subscriber pulls the real value out of storage.
  if (snapshot === SERVER_SNAPSHOT) {
    snapshot = readStorage();
  }
  listeners = [...listeners, listener];

  function onStorage(event: StorageEvent) {
    // Keep multiple open tabs in sync.
    if (event.key === STORAGE_KEY) {
      snapshot = readStorage();
      emit();
    }
  }
  window.addEventListener("storage", onStorage);

  return () => {
    listeners = listeners.filter((entry) => entry !== listener);
    window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => SERVER_SNAPSHOT;

export interface WishlistApi {
  items: WishlistItem[];
  /** False during SSR and the hydration render, true once storage is read. */
  ready: boolean;
  isSaved: (id: string) => boolean;
  toggle: (id: string, kind: ListingKind) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export function useWishlist(): WishlistApi {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = items !== SERVER_SNAPSHOT;

  const isSaved = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items],
  );

  const toggle = useCallback((id: string, kind: ListingKind) => {
    commit(
      snapshot.some((item) => item.id === id)
        ? snapshot.filter((item) => item.id !== id)
        : [{ id, kind, savedAt: Date.now() }, ...snapshot],
    );
  }, []);

  const remove = useCallback((id: string) => {
    commit(snapshot.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => commit([]), []);

  return useMemo(
    () => ({ items, ready, isSaved, toggle, remove, clear }),
    [items, ready, isSaved, toggle, remove, clear],
  );
}
