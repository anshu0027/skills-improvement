import { useCallback, useMemo, useSyncExternalStore } from "react";

type BoolMap = Record<string, boolean>;

/**
 * A boolean map persisted in localStorage, read via useSyncExternalStore so it
 * is SSR-safe and never calls setState inside an effect. Updates in the same tab
 * are broadcast with a custom event keyed by the storage key; other tabs sync via
 * the native "storage" event.
 */
export function usePersistentMap(key: string): [BoolMap, (id: string) => void] {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener("storage", onChange);
      window.addEventListener(key, onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(key, onChange);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return "{}";
    return localStorage.getItem(key) ?? "{}";
  }, [key]);

  const raw = useSyncExternalStore(subscribe, getSnapshot, () => "{}");

  const map = useMemo<BoolMap>(() => {
    try {
      return JSON.parse(raw) as BoolMap;
    } catch {
      return {};
    }
  }, [raw]);

  const toggle = useCallback(
    (id: string) => {
      const current = (() => {
        try {
          return JSON.parse(localStorage.getItem(key) ?? "{}") as BoolMap;
        } catch {
          return {};
        }
      })();
      const next = { ...current, [id]: !current[id] };
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event(key));
    },
    [key],
  );

  return [map, toggle];
}
