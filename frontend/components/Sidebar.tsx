"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import ReadingSettingsPanel from "./ReadingSettingsPanel";
import { JUZ_DATA } from "../utils/quranData";
import type { SurahSummary } from "../type/types";

type SidebarProps = {
  surahs: SurahSummary[];
  searchQuery: string;
  activeTab: TabType;
  onActiveTabChange: (tab: TabType) => void;
  isDrawerOpen: boolean;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
};

type TabType = "surah" | "juz" | "page";

export default function Sidebar({
  surahs,
  searchQuery,
  activeTab,
  onActiveTabChange,
  isDrawerOpen,
  onOpenDrawer,
  onCloseDrawer,
}: SidebarProps) {
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const currentSurah = useMemo(() => {
    const match = pathname?.match(/^\/surah\/(\d+)/);
    return match ? Number(match[1]) : null;
  }, [pathname]);

  const filteredSurahs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return surahs;
    }
    return surahs.filter((surah) => {
      return (
        surah.englishName.toLowerCase().includes(query) ||
        surah.englishNameTranslation.toLowerCase().includes(query) ||
        surah.name.includes(searchQuery) ||
        String(surah.number).includes(query)
      );
    });
  }, [searchQuery, surahs]);

  const filteredJuz = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return JUZ_DATA;
    }
    return JUZ_DATA.filter((juz) => {
      return String(juz.number).includes(query);
    });
  }, [searchQuery]);

  const sidebarContent = (
    <div className="flex h-full min-h-0">
      <div className="flex w-12 shrink-0 flex-col items-center gap-3 border-r border-[var(--qm-border)] bg-[var(--qm-surface)] px-1 py-4">
        {" "}
        <div className="flex h-full w-full items-center max-lg:justify-center lg:flex-col">
          {/* Logo */}
          <Link href="/" className="hidden lg:py-3 xl:block">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.99183 0H29.0082C32.8696 0 36 3.13043 36 6.99183V29.0082C36 32.8696 32.8696 36 29.0082 36H6.99183C3.13043 36 0 32.8696 0 29.0082V6.99183C0 3.13043 3.13043 0 6.99183 0Z"
                  className="fill-primary"
                ></path>
                <path
                  d="M26.0687 24.5654V28.2374C26.0688 28.3545 26.0389 28.4696 25.9818 28.5717C25.9247 28.6739 25.8424 28.7597 25.7427 28.821C25.6429 28.8822 25.5292 28.9168 25.4122 28.9215C25.2953 28.9263 25.1791 28.9009 25.0748 28.8479L18 25.2596"
                  stroke="#E2E2E2"
                  stroke-width="0.782609"
                ></path>
                <path
                  d="M9.92969 24.5654V28.2374C9.92957 28.3545 9.95949 28.4696 10.0166 28.5717C10.0737 28.6739 10.156 28.7597 10.2557 28.821C10.3554 28.8822 10.4692 28.9168 10.5861 28.9215C10.7031 28.9263 10.8193 28.9009 10.9236 28.8479L17.9976 25.2596"
                  stroke="#E2E2E2"
                  stroke-width="0.782609"
                ></path>
                <path
                  opacity="0.35"
                  d="M17.5839 24.1444C17.5839 24.3737 17.7733 24.5591 18.0018 24.5591V25.5405L8.60421 23.6114L7.45143 23.3821C7.093 23.3109 6.77034 23.1177 6.53844 22.8353C6.30654 22.5528 6.17975 22.1987 6.17969 21.8333V10.8729C6.17969 9.90245 7.04838 9.16131 8.00708 9.31392L18.001 10.9026V11.884C17.8908 11.8842 17.7852 11.9279 17.7071 12.0056C17.629 12.0833 17.5847 12.1886 17.5839 12.2988V24.1436V24.1444Z"
                  fill="#E2E2E2"
                ></path>
                <path
                  opacity="0.35"
                  d="M18.4171 24.1444C18.4171 24.3737 18.2293 24.5591 18 24.5591V25.5405L27.3976 23.6114L28.5503 23.3821C28.9088 23.3109 29.2314 23.1177 29.4633 22.8353C29.6952 22.5528 29.822 22.1987 29.8221 21.8333V10.8729C29.8221 9.90245 28.9534 9.16131 27.9947 9.31392L18 10.9018V11.8832C18.2285 11.8832 18.4171 12.0687 18.4171 12.298V24.1436V24.1444Z"
                  fill="#E2E2E2"
                ></path>
                <path
                  d="M17.5806 24.1443C17.5806 24.3736 17.77 24.5591 17.9986 24.5591V25.5405L9.92986 22.0383L8.60099 21.4623C8.29824 21.3311 8.04048 21.1142 7.85944 20.8383C7.6784 20.5624 7.58197 20.2396 7.58203 19.9096V9.37417C7.58187 9.09963 7.64851 8.82918 7.7762 8.58615C7.9039 8.34312 8.08881 8.13482 8.31498 7.97921C8.54116 7.8236 8.8018 7.72536 9.07441 7.69297C9.34703 7.66058 9.62343 7.69501 9.87977 7.7933L17.9986 10.9026V11.884C17.8883 11.884 17.7824 11.9276 17.7041 12.0053C17.6259 12.083 17.5815 12.1885 17.5806 12.2988V24.1436V24.1443Z"
                  fill="white"
                ></path>
                <path
                  d="M28.0252 9.37374V9.37397V19.9095C28.0252 20.4269 27.7175 20.8958 27.2417 21.1032C27.2416 21.1033 27.2415 21.1033 27.2413 21.1034L25.9131 21.6791L25.9129 21.6792L18.3913 24.9439V24.8493C18.4568 24.8131 18.517 24.7678 18.5702 24.7147C18.6452 24.6398 18.7048 24.5509 18.7454 24.453C18.786 24.3551 18.8069 24.2501 18.8069 24.1441V12.2986C18.8069 12.0848 18.7219 11.8798 18.5708 11.7286C18.5173 11.6751 18.4571 11.6299 18.3921 11.5938V11.1708L26.2587 8.15774L26.2589 8.15769C26.4559 8.08214 26.6684 8.05567 26.878 8.08056C27.0875 8.10546 27.2879 8.18098 27.4618 8.3006C27.6356 8.42023 27.7778 8.58036 27.876 8.76718C27.974 8.95384 28.0253 9.16251 28.0252 9.37374Z"
                  fill="#E2E2E2"
                  stroke="#E2E2E2"
                  stroke-width="0.782609"
                ></path>
              </svg>
            </div>
          </Link>

          {/* Menu */}
          <div className="flex items-center justify-between gap-6 md:gap-8 lg:h-[calc(100%-110px)] lg:flex-col lg:justify-center lg:gap-6">
            {/* Home */}
            <Link href="/" className="hidden xl:block">
              <button className="group flex h-9 w-9 items-center justify-center rounded-sm border-2 border-transparent transition-all duration-300 hover:border-zinc-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M9.23051 2.58494L2.87801 7.67243C2.16301 8.24076 1.70467 9.44163 1.86051 10.34L3.07968 17.6366C3.29968 18.9383 4.54634 19.9924 5.86634 19.9924H16.133C17.4438 19.9924 18.6997 18.9291 18.9197 17.6366L20.1388 10.34C20.2855 9.44163 19.8272 8.24076 19.1213 7.67243L12.7688 2.59411C11.788 1.80578 10.2022 1.80577 9.23051 2.58494Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M11.0007 14.2083C12.2663 14.2083 13.2923 13.1823 13.2923 11.9167C13.2923 10.651 12.2663 9.625 11.0007 9.625C9.735 9.625 8.70898 10.651 8.70898 11.9167C8.70898 13.1823 9.735 14.2083 11.0007 14.2083Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
            </Link>

            {/* Send */}
            <button
              data-state="closed"
              type="button"
              aria-haspopup="dialog"
              aria-expanded="false"
              aria-controls="radix-:r0:"
              className="flex size-9 items-center justify-center rounded-sm border-2 border-transparent transition-all duration-300 [&amp;_svg]:size-[22px] [&amp;_svg]:text-icon-color"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M6.78305 5.79323L14.5655 3.19906C18.058 2.0349 19.9555 3.94156 18.8005 7.43406L16.2064 15.2166C14.4647 20.4507 11.6047 20.4507 9.86305 15.2166L9.09305 12.9066L6.78305 12.1366C1.54888 10.3949 1.54888 7.54406 6.78305 5.79323Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M9.26758 12.5125L12.5492 9.22168"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
              </svg>
            </button>

            {/* Bookmark */}
            <a href="/profile/bookmarks">
              <button className="group flex h-9 w-9 items-center justify-center rounded-sm border-2 border-transparent transition-all duration-300 hover:border-zinc-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="18"
                  viewBox="0 0 16 18"
                  fill="none"
                  className="text-zinc-400 transition group-hover:text-white"
                >
                  <path
                    d="M1.64453 13.7513V7.17862C1.64453 4.29211 1.64453 2.84886 2.57528 1.95214C3.50603 1.05542 5.00405 1.05542 8.00009 1.05542C10.9961 1.05542 12.4942 1.05542 13.4249 1.95214C14.3556 2.84886 14.3556 4.29211 14.3556 7.17862V13.7513C14.3556 15.5832 14.3556 16.4991 13.7417 16.827C12.5527 17.4618 10.3224 15.3437 9.26325 14.7059C8.64899 14.336 8.34186 14.151 8.00009 14.151C7.65832 14.151 7.35118 14.336 6.73692 14.7059C5.67777 15.3437 3.4475 17.4618 2.25852 16.827C1.64453 16.4991 1.64453 15.5832 1.64453 13.7513Z"
                    stroke="currentColor"
                    strokeWidth="1.38569"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </a>

            <button
              type="button"
              id="radix-:Rb6fldsva:"
              aria-haspopup="menu"
              aria-expanded="false"
              data-state="closed"
              className="flex size-9 items-center justify-center rounded-sm border-2 border-transparent transition-all duration-300 [&amp;_svg]:size-[22px] [&amp;_svg]:text-icon-color"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M20.1667 7.58075V3.87742C20.1667 2.41992 19.58 1.83325 18.1225 1.83325H14.4192C12.9617 1.83325 12.375 2.41992 12.375 3.87742V7.58075C12.375 9.03825 12.9617 9.62492 14.4192 9.62492H18.1225C19.58 9.62492 20.1667 9.03825 20.1667 7.58075Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M9.62565 7.80992V3.64825C9.62565 2.35575 9.03898 1.83325 7.58148 1.83325H3.87815C2.42065 1.83325 1.83398 2.35575 1.83398 3.64825V7.80075C1.83398 9.10242 2.42065 9.61575 3.87815 9.61575H7.58148C9.03898 9.62492 9.62565 9.10242 9.62565 7.80992Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M9.62565 18.1225V14.4192C9.62565 12.9617 9.03898 12.375 7.58148 12.375H3.87815C2.42065 12.375 1.83398 12.9617 1.83398 14.4192V18.1225C1.83398 19.58 2.42065 20.1667 3.87815 20.1667H7.58148C9.03898 20.1667 9.62565 19.58 9.62565 18.1225Z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M13.75 14.2083H19.25"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                ></path>
                <path
                  d="M13.75 17.875H19.25"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-r border-[var(--qm-border)] bg-[var(--qm-panel)] mt-0 lg:mt-20">
        {/* Tabs */}
        <div className="p-4">
          <div className="relative flex h-11 items-center rounded-full border-4 border-[var(--qm-card)] bg-[var(--qm-card)]">
            <button
              type="button"
              onClick={() => onActiveTabChange("surah")}
              className={`z-10 h-full w-full text-sm font-semibold transition ${
                activeTab === "surah"
                  ? "text-[var(--qm-text)]"
                  : "text-[var(--qm-muted)]"
              }`}
            >
              Surah
            </button>

            <button
              type="button"
              onClick={() => onActiveTabChange("juz")}
              className={`z-10 h-full w-full text-sm font-semibold transition ${
                activeTab === "juz"
                  ? "text-[var(--qm-text)]"
                  : "text-[var(--qm-muted)]"
              }`}
            >
              Juz
            </button>

            <button
              type="button"
              onClick={() => onActiveTabChange("page")}
              className={`z-10 h-full w-full text-sm font-semibold transition ${
                activeTab === "page"
                  ? "text-[var(--qm-text)]"
                  : "text-[var(--qm-muted)]"
              }`}
            >
              Page
            </button>

            {/* Active tab background */}
            <div
              className={`absolute top-0 h-full w-1/3 rounded-full bg-emerald-500 transition-all duration-300 ${
                activeTab === "surah"
                  ? "left-0"
                  : activeTab === "juz"
                    ? "left-1/3"
                    : "left-2/3"
              }`}
            />
          </div>

          {/* Search */}
          {/* Search moved to Top Navbar */}
        </div>

        {/* List */}
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          {activeTab === "surah" && (
            <>
              {filteredSurahs.map((surah) => {
                const isActive = currentSurah === surah.number;

                return (
                  <Link
                    key={surah.number}
                    href={`/surah/${surah.number}`}
                    onClick={onCloseDrawer}
                    className={`mb-2 block rounded-xl border px-4 py-3 transition-all ${
                      isActive
                        ? "border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10"
                        : "border-[var(--qm-border)] hover:bg-black/5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 group">
                      {/* left */}
                      <div className="flex items-center gap-4">
                        {/* diamond number */}
                        <div
                          className={`flex h-9 w-9 rotate-45 items-center justify-center rounded-md transition-colors  group-hover:bg-emerald-600   ${
                            isActive ? "bg-emerald-600" : "bg-[var(--qm-card)]"
                          }`}
                        >
                          <span
                            className={`-rotate-45 text-xs font-semibold ${
                              isActive ? "text-white " : "text-[var(--qm-text)]"
                            }`}
                          >
                            {surah.number}
                          </span>
                        </div>

                        {/* text */}
                        <div>
                          <p className="text-sm font-semibold text-[var(--qm-text)]">
                            {surah.englishName}
                          </p>

                          <p className="text-xs text-[var(--qm-muted)]">
                            {surah.englishNameTranslation}
                          </p>
                        </div>
                      </div>

                      {/* right number */}
                      <span
                        className="text-right font-calligraphy text-heading-5 text-subtitle-color block laptop:hidden desktop:block"
                        dir="rtl"
                      >
                        {surah.number.toString().padStart(3, "0")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </>
          )}

          {activeTab === "juz" && (
            <>
              {filteredJuz.map((juz) => {
                const startSurah = surahs.find(
                  (s) => s.number === juz.startSurah,
                );

                const endSurah = surahs.find((s) => s.number === juz.endSurah);

                return (
                  <Link
                    key={juz.number}
                    href={`/surah/${juz.startSurah}`}
                    className="mb-2 block rounded-xl border border-[var(--qm-border)] px-4 py-3 transition hover:bg-black/5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-9 w-9 rotate-45 items-center justify-center rounded-md bg-[var(--qm-card)]">
                          <span className="-rotate-45 text-xs font-semibold text-[var(--qm-text)]">
                            {juz.number}
                          </span>
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-[var(--qm-text)]">
                            Juz {juz.number}
                          </p>

                          <p className="text-xs text-[var(--qm-muted)]">
                            {startSurah?.englishName}
                            {startSurah?.number !== endSurah?.number &&
                              ` - ${endSurah?.englishName}`}
                          </p>
                        </div>
                      </div>

                      <span className="text-lg font-semibold text-[var(--qm-muted)]">
                        {juz.number.toString().padStart(2, "0")}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </>
          )}

          {activeTab === "page" && (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-[var(--qm-muted)]">
                Page view coming soon
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[20.5rem] border-r border-[var(--qm-border)] lg:block">
        {sidebarContent}
      </aside>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/70"
            aria-label="Close menu"
            onClick={onCloseDrawer}
          />
          <aside className="absolute inset-y-0 left-0 w-[20rem] max-w-[90vw] border-r border-[var(--qm-border)]">
            {sidebarContent}
          </aside>
        </div>
      ) : null}

      {isSettingsOpen ? (
        <div className="fixed inset-0 z-[60]">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/75"
            aria-label="Close settings"
            onClick={() => setIsSettingsOpen(false)}
          />
          <section className="absolute right-0 top-0 h-full w-[22rem] max-w-[95vw] border-l border-[var(--qm-border)] bg-[var(--qm-surface)] p-4 text-[var(--qm-text)]">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                className="rounded-md border border-[var(--qm-border)] px-3 py-1 text-sm"
                onClick={() => setIsSettingsOpen(false)}
              >
                Close
              </button>
            </div>
            <ReadingSettingsPanel />
          </section>
        </div>
      ) : null}
    </>
  );
}
