"use client";

import { useSettings } from "../context/SettingsContext";
import type { ReaderSettings } from "../type/types";

const arabicFonts: ReaderSettings["arabicFont"][] = [
  "KFGQ",
  "Amiri",
  "Scheherazade New",
  "Noto Naskh Arabic",
  "Lateef",
];

type ReadingSettingsPanelProps = {
  className?: string;
};

export default function ReadingSettingsPanel({
  className = "",
}: ReadingSettingsPanelProps) {
  const { settings, updateSetting } = useSettings();

  return (
    <aside
      className={`rounded-lg border border-[var(--qm-border)] bg-[var(--qm-surface)] p-2 text-[var(--qm-text)] sm:p-3 sm:rounded-xl ${className}`}
    >
      <div className="mb-2 flex items-center justify-between border-b border-[var(--qm-border)] pb-2 sm:mb-3 sm:pb-2">
        <h3 className="text-xs font-semibold text-emerald-700 sm:text-sm">
          Font Settings
        </h3>
        <span className="text-xs text-[var(--qm-muted)]">⚙</span>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs text-[var(--qm-text)] sm:mb-2">
            Arabic Font Size
          </span>
          <div className="flex items-center justify-between gap-2">
            <input
              type="range"
              min={24}
              max={56}
              value={settings.arabicSize}
              onChange={(event) =>
                updateSetting("arabicSize", Number(event.target.value))
              }
              className="flex-1 accent-emerald-500"
            />
            <span className="w-8 text-right text-xs text-[var(--qm-muted)] tabular-nums sm:text-sm">
              {settings.arabicSize}
            </span>
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-[var(--qm-text)] sm:mb-2">
            Translation Font Size
          </span>
          <div className="flex items-center justify-between gap-2">
            <input
              type="range"
              min={14}
              max={30}
              value={settings.translationSize}
              onChange={(event) =>
                updateSetting("translationSize", Number(event.target.value))
              }
              className="flex-1 accent-emerald-500"
            />
            <span className="w-8 text-right text-xs text-[var(--qm-muted)] tabular-nums sm:text-sm">
              {settings.translationSize}
            </span>
          </div>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs text-[var(--qm-text)] sm:mb-2">
            Arabic Font Face
          </span>
          <select
            className="w-full rounded-md border border-[var(--qm-border)] bg-[var(--qm-card)] px-2 py-1.5 text-xs text-[var(--qm-text)] sm:rounded-lg sm:px-3 sm:py-2 sm:text-sm"
            value={settings.arabicFont}
            onChange={(event) =>
              updateSetting(
                "arabicFont",
                event.target.value as ReaderSettings["arabicFont"],
              )
            }
          >
            {arabicFonts.map((font) => (
              <option key={font} value={font}>
                {font === "KFGQ" ? "KFGQ" : font}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 rounded-lg border border-[var(--qm-border)] bg-[var(--qm-card)] p-2 sm:mt-5 sm:rounded-xl sm:p-3">
        <p className="text-xs font-semibold sm:text-sm">
          Help spread the knowledge of Islam
        </p>
        <p className="mt-1 text-xs text-[var(--qm-muted)] sm:mt-2 sm:text-sm">
          Your regular support helps us reach our religious brothers and
          sisters.
        </p>
        <button className="mt-2 w-full rounded-md bg-emerald-600 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 sm:mt-3 sm:py-2 sm:text-sm">
          Support Us
        </button>
      </div>
    </aside>
  );
}
