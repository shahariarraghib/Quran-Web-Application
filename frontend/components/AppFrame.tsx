"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSettings } from "../context/SettingsContext";
import Sidebar from "./Sidebar";
import ReadingSettingsPanel from "./ReadingSettingsPanel";
import type { SurahSummary } from "../type/types";
import Link from "next/link";
import { Menu } from "lucide-react";

type AppFrameProps = {
  surahs: SurahSummary[];
  children: ReactNode;
};

export default function AppFrame({ surahs, children }: AppFrameProps) {
  const { settings, updateSetting } = useSettings();
  const isLight = settings.theme === "light";
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"surah" | "juz" | "page">("surah");
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState(false);

  const searchPlaceholder =
    activeTab === "surah"
      ? "Search Surah"
      : activeTab === "juz"
        ? "Search Juz"
        : "Search Page";

  useEffect(() => {
    if (pathname !== "/search") {
      return;
    }
    const q = (
      new URLSearchParams(window.location.search).get("q") ?? ""
    ).trim();
    if (q && q !== searchQuery.trim()) {
      setSearchQuery(q);
    }
  }, [pathname, searchQuery]);

  const submitNavbarSearch = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar - Spans all columns */}
      <header className="sticky top-0 z-30 border-b border-[var(--qm-border)] bg-[var(--qm-surface)]/95 px-3 py-2 backdrop-blur sm:px-4 sm:py-3 lg:px-10">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Logo/Title */}
          <div className="min-w-0 flex-1 sm:flex-none pl-10">
            <p className="truncate text-xs font-semibold text-[var(--qm-text)] sm:text-sm">
              Quran Mazid
            </p>
            <p className="hidden text-[10px] text-[var(--qm-muted)] sm:block">
              Read, Study, and Learn The Quran
            </p>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search (moved from Sidebar) */}
            <div className="group flex size-[34px] min-w-[34px] cursor-pointer items-center justify-center rounded-full bg-primary-7 active:scale-90  text-emerald-500">
              <Link href="/search" className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                >
                  <path
                    d="M18.3789 18.3721L14.7539 14.7471M16.7122 10.0387C16.7122 13.7206 13.7275 16.7054 10.0456 16.7054C6.36367 16.7054 3.37891 13.7206 3.37891 10.0387C3.37891 6.35684 6.36367 3.37207 10.0456 3.37207C13.7275 3.37207 16.7122 6.35684 16.7122 10.0387Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </Link>
            </div>
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--qm-border)] text-[var(--qm-muted)] text-xs transition hover:bg-black/5 sm:h-8 sm:w-8"
              onClick={() => updateSetting("theme", isLight ? "dark" : "light")}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isLight ? "☀" : "☾"}
            </button>
            <button className="rounded-full bg-emerald-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-emerald-700 sm:px-4 sm:py-2 sm:text-xs">
              Support
            </button>

            <button
              type="button"
              aria-label="Open menu"
              title="Open menu"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--qm-border)] bg-[var(--qm-card)] text-[var(--qm-text)] transition hover:bg-black/5 active:scale-95 lg:hidden"
              onClick={() => setIsSidebarDrawerOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Sidebar + Content + Right Panel */}
      <div className="flex flex-1 overflow-hidden lg:pl-[20.5rem]">
        {/* Left Sidebar */}
        <Sidebar
          surahs={surahs}
          searchQuery={searchQuery}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          isDrawerOpen={isSidebarDrawerOpen}
          onOpenDrawer={() => setIsSidebarDrawerOpen(true)}
          onCloseDrawer={() => setIsSidebarDrawerOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-3 pb-10 pt-3 sm:px-4 sm:pt-4 lg:px-10">
          <div className="mx-auto max-w-[88rem] w-full">{children}</div>
        </main>

        {/* Right Sidebar - Reading Settings Panel (Desktop Only) */}
        <aside className="hidden w-64 border-l border-[var(--qm-border)] bg-[var(--qm-surface)] overflow-y-auto lg:flex lg:w-80">
          <div className="sticky top-[44px] sm:top-[56px] w-full p-3 sm:p-4 max-h-[calc(100vh-44px)] sm:max-h-[calc(100vh-56px)] overflow-y-auto">
            <ReadingSettingsPanel />
          </div>
        </aside>
      </div>
    </div>
  );
}
