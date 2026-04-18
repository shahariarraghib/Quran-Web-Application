"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const SettingsContext = createContext(null);
const STORAGE_KEY = "quran-reader-settings";
const SETTINGS_EVENT = "quran-settings-change";

const defaultSettings = {
  arabicFont: "Amiri",
  arabicSize: 28,
  translationSize: 16,
};

function parseSettings(rawValue) {
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

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const syncSettings = () => {
      setSettings(parseSettings(window.localStorage.getItem(STORAGE_KEY)));
    };

    const handleStorageChange = (event) => {
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

  const updateSetting = useCallback((key, value) => {
    setSettings((currentSettings) => {
      const nextSettings = {
        ...currentSettings,
        [key]: value,
      };

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSettings));
        window.dispatchEvent(new Event(SETTINGS_EVENT));
      } catch {}

      return nextSettings;
    });
  }, []);

  const contextValue = useMemo(
    () => ({ settings, updateSetting }),
    [settings, updateSetting],
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
