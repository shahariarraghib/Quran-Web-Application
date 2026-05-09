"use client";

import Link from "next/link";
import { Moon, Search, Sun, Heart } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function TopNavbar() {
  const { settings, updateSetting } = useSettings();
  const isLight = settings.theme === "light";

  return (
    <header
      className={`sticky top-0 z-20 h-[72px] border-b backdrop-blur-md transition-all duration-300 ${
        isLight
          ? "border-[var(--qm-border)] bg-[var(--qm-panel)]/95"
          : "border-[var(--qm-border)] bg-[var(--qm-panel)]/95"
      }`}
    >
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="hidden items-center gap-2.5 sm:flex">
            <div className="select-none">
              <p className="text-xl font-bold leading-none text-[var(--qm-text)]">
                Quran Mazid
              </p>

              <p className="mt-1 text-[10px] tracking-tight text-[var(--qm-muted)]">
                Read, Study, and Learn The Quran
              </p>
            </div>
          </Link>

          <Link href="/" className="sm:hidden">
            <p className="text-sm font-bold text-[var(--qm-text)]">
              Quran Mazid
            </p>
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            className={`group flex h-[36px] w-[36px] items-center justify-center rounded-full transition active:scale-90 ${
              isLight
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-[#15202b] text-emerald-400 hover:bg-[#1b2836]"
            }`}
          >
            <Search size={18} />
          </button>

          {/* Theme Toggle */}
          <button
            type="button"
            aria-label="Toggle Theme"
            onClick={() => updateSetting("theme", isLight ? "dark" : "light")}
            className={`flex h-[36px] w-[36px] items-center justify-center rounded-full transition active:scale-90 ${
              isLight
                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                : "bg-[#15202b] text-emerald-400 hover:bg-[#1b2836]"
            }`}
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Support Button */}
          <a
            href="https://irdfoundation.com/sadaqa-jaria"
            target="_blank"
            rel="noreferrer"
            className="hidden h-[38px] min-w-[140px] items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-sm font-medium text-white transition hover:bg-emerald-700 lg:flex"
          >
            <span>Support Us</span>

            <Heart size={16} className="fill-white text-white" />
          </a>
        </div>
      </div>
    </header>
  );
}
