"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);
const STORAGE_KEY = "quran-reader-settings";

const defaultSettings = {
  arabicFont: "Amiri",
  arabicSize: 28,
  translationSize: 16,
};

// safe localStorage read (SSR safe)
function getInitialSettings() {
  if (typeof window === "undefined") {
    return defaultSettings;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

export function SettingsProvider({ children }) {
  // 👇 IMPORTANT: lazy init (NO useEffect needed)
  const [settings, setSettings] = useState(getInitialSettings);

  // save only when settings changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, updateSetting }}>
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
