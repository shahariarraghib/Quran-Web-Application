"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";

const navigationItems = [
  { href: "/", label: "Surah List" },
  { href: "/search", label: "Search Ayah" },
];

const arabicFonts = ["Amiri", "Scheherazade New"];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
  const { settings, updateSetting } = useSettings();
  const fontMenuRef = useRef(null);

  useEffect(() => {
    setIsOpen(false);
    setIsFontMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (!fontMenuRef.current?.contains(event.target)) {
        setIsFontMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 inline-flex h-11 p-4 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-lg backdrop-blur lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open settings"
      >
        Menu
      </button>

      {isOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/45 lg:hidden"
          onClick={() => setIsOpen(false)}
          aria-label="Close settings"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[18.5rem] flex-col border-r border-white/60 bg-[#f6f1e7]/95 px-5 pb-6 pt-5 shadow-2xl backdrop-blur transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-start justify-between gap-3 ">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-800/80">
              Reader
            </p>
            <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-2xl font-bold text-slate-900">
              Quran Web Application
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Read surahs, browse ayahs, and tune the recitation layout the way
              you like.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex left-4 top-4 z-50 inline-flex h-11 p-4 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-900 shadow-lg backdrop-blur lg:hidden"
            onClick={() => setIsOpen(false)}
            aria-label="Dismiss settings"
          >
            Close
          </button>
        </div>

        <nav className="mb-8 grid gap-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-amber-800/80 !text-white"
                    : "bg-white/90  !text-black"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-[1.75rem] border border-white/60 bg-white/75 p-4 shadow-sm">
          <h2 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-slate-900">
            Settings
          </h2>

          <div className="mt-5 space-y-5">
            <div className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Arabic Font
              </span>
              <div
                className={`relative transition-all duration-200 ${
                  isFontMenuOpen ? "pb-2" : ""
                }`}
                ref={fontMenuRef}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-amber-800/80 px-4 py-3 text-left text-sm font-medium text-white outline-none transition "
                  onClick={() => setIsFontMenuOpen((current) => !current)}
                  aria-haspopup="listbox"
                  aria-expanded={isFontMenuOpen}
                >
                  <span>{settings.arabicFont}</span>
                  <span className="text-base leading-none">
                    {isFontMenuOpen ? "▲" : "▼"}
                  </span>
                </button>

                {isFontMenuOpen ? (
                  <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                    <div
                      className="grid gap-2"
                      role="listbox"
                      aria-label="Arabic Font"
                    >
                      {arabicFonts.map((fontName) => {
                        const isActive = settings.arabicFont === fontName;

                        return (
                          <button
                            key={fontName}
                            type="button"
                            className={`rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                              isActive
                                ? "bg-amber-800/80 !text-white"
                                : "bg-white/90  !text-black"
                            }`}
                            onClick={() => {
                              updateSetting("arabicFont", fontName);
                              setIsFontMenuOpen(false);
                            }}
                            role="option"
                            aria-selected={isActive}
                          >
                            {fontName}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                Arabic Font Size
                <span>{settings.arabicSize}px</span>
              </span>
              <input
                type="range"
                min="24"
                max="48"
                value={settings.arabicSize}
                onChange={(event) =>
                  updateSetting("arabicSize", Number(event.target.value))
                }
                className="h-2 w-full accent-amber-800/80"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center justify-between text-sm font-medium text-slate-700">
                Translation Font Size
                <span>{settings.translationSize}px</span>
              </span>
              <input
                type="range"
                min="14"
                max="28"
                value={settings.translationSize}
                onChange={(event) =>
                  updateSetting("translationSize", Number(event.target.value))
                }
                className="h-2 w-full accent-amber-800/80"
              />
            </label>
          </div>
        </div>
      </aside>
    </>
  );
}
