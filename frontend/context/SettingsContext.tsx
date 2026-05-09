"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ReaderSettings } from "../type/types";

type SettingsContextType = {
  settings: ReaderSettings;
  updateSetting: <K extends keyof ReaderSettings>(
    key: K,
    value: ReaderSettings[K],
  ) => void;
  likedAyahs: Set<string>;
  bookmarkedAyahs: Set<string>;
  toggleLike: (surah: number, ayah: number) => void;
  toggleBookmark: (surah: number, ayah: number) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);
const STORAGE_KEY = "quran-reader-settings";
const ACTIONS_STORAGE_KEY = "quran-reader-actions";
const SETTINGS_EVENT = "quran-settings-change";
const ACTIONS_EVENT = "quran-actions-change";

const defaultSettings: ReaderSettings = {
  theme: "light",
  arabicFont: "KFGQ",
  arabicSize: 34,
  translationSize: 18,
};

function parseSettings(rawValue: string | null): ReaderSettings {
  if (!rawValue) {
    return defaultSettings;
  }

  try {
    return {
      ...defaultSettings,
      ...JSON.parse(rawValue),
    };
  } catch {
    return defaultSettings;
  }
}

function parseActions(rawValue: string | null): {
  liked: Set<string>;
  bookmarked: Set<string>;
} {
  if (!rawValue) {
    return { liked: new Set(), bookmarked: new Set() };
  }

  try {
    const parsed = JSON.parse(rawValue);
    return {
      liked: new Set(parsed.liked ?? []),
      bookmarked: new Set(parsed.bookmarked ?? []),
    };
  } catch {
    return { liked: new Set(), bookmarked: new Set() };
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  const [likedAyahs, setLikedAyahs] = useState<Set<string>>(new Set());
  const [bookmarkedAyahs, setBookmarkedAyahs] = useState<Set<string>>(
    new Set(),
  );

  // Load settings from localStorage
  useEffect(() => {
    const syncSettings = () => {
      setSettings(parseSettings(window.localStorage.getItem(STORAGE_KEY)));
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || event.key === STORAGE_KEY) {
        syncSettings();
      }
    };

    syncSettings();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(SETTINGS_EVENT, syncSettings);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(SETTINGS_EVENT, syncSettings);
    };
  }, []);

  // Load actions from localStorage
  useEffect(() => {
    const syncActions = () => {
      const actions = parseActions(
        window.localStorage.getItem(ACTIONS_STORAGE_KEY),
      );
      setLikedAyahs(actions.liked);
      setBookmarkedAyahs(actions.bookmarked);
    };

    const handleStorageChange = (event: StorageEvent) => {
      if (!event.key || event.key === ACTIONS_STORAGE_KEY) {
        syncActions();
      }
    };

    syncActions();
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(ACTIONS_EVENT, syncActions);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(ACTIONS_EVENT, syncActions);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings.theme]);

  const updateSetting = useCallback(
    <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
      setSettings((currentSettings) => {
        const nextSettings = {
          ...currentSettings,
          [key]: value,
        };

        try {
          window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(nextSettings),
          );
          window.dispatchEvent(new Event(SETTINGS_EVENT));
        } catch {}

        return nextSettings;
      });
    },
    [],
  );

  const toggleLike = useCallback(
    (surah: number, ayah: number) => {
      const key = `${surah}:${ayah}`;
      setLikedAyahs((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }

        try {
          const bookmarked = Array.from(bookmarkedAyahs);
          window.localStorage.setItem(
            ACTIONS_STORAGE_KEY,
            JSON.stringify({
              liked: Array.from(next),
              bookmarked,
            }),
          );
          window.dispatchEvent(new Event(ACTIONS_EVENT));
        } catch {}

        return next;
      });
    },
    [bookmarkedAyahs],
  );

  const toggleBookmark = useCallback(
    (surah: number, ayah: number) => {
      const key = `${surah}:${ayah}`;
      setBookmarkedAyahs((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          next.add(key);
        }

        try {
          const liked = Array.from(likedAyahs);
          window.localStorage.setItem(
            ACTIONS_STORAGE_KEY,
            JSON.stringify({
              liked,
              bookmarked: Array.from(next),
            }),
          );
          window.dispatchEvent(new Event(ACTIONS_EVENT));
        } catch {}

        return next;
      });
    },
    [likedAyahs],
  );

  const contextValue = useMemo(
    () => ({
      settings,
      updateSetting,
      likedAyahs,
      bookmarkedAyahs,
      toggleLike,
      toggleBookmark,
    }),
    [
      settings,
      updateSetting,
      likedAyahs,
      bookmarkedAyahs,
      toggleLike,
      toggleBookmark,
    ],
  );

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return context;
}
