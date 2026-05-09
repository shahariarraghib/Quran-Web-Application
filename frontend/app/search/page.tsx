"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useSettings } from "../../context/SettingsContext";
import type { SearchResult } from "../../type/types";
import { searchAyahs } from "../../utils/api";

function getArabicFontFamily(fontName: string) {
  switch (fontName) {
    case "KFGQ":
      return "var(--font-scheherazade), serif";
    case "Scheherazade New":
      return "var(--font-scheherazade), serif";
    case "Noto Naskh Arabic":
      return "var(--font-noto-naskh), serif";
    case "Lateef":
      return "var(--font-lateef), serif";
    case "Amiri":
    default:
      return "var(--font-amiri), serif";
  }
}

export default function SearchPage() {
  const { settings } = useSettings();
  const arabicFontFamily = getArabicFontFamily(settings.arabicFont);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (incomingQuery?: string) => {
    const trimmedQuery = (incomingQuery ?? query).trim();

    if (!trimmedQuery) {
      setResults([]);
      setHasSearched(true);
      setError("Type a word or phrase to begin searching.");
      return;
    }

    startTransition(async () => {
      try {
        setError("");
        const matches = await searchAyahs(trimmedQuery);
        setResults(matches);
        setHasSearched(true);
      } catch {
        setResults([]);
        setHasSearched(true);
        setError("Search is unavailable right now. Please try again in a moment.");
      }
    });
  };

  useEffect(() => {
    const q = (new URLSearchParams(window.location.search).get("q") ?? "").trim();
    if (!q) {
      return;
    }
    setQuery(q);
    handleSearch(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-card)] px-6 py-8 sm:px-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--qm-muted)]">Search Ayah</p>
        <h1 className="mt-3 text-3xl font-bold text-[var(--qm-text)]">
          Find ayahs by translation text.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-[var(--qm-muted)]">
          Search across the Quran and jump directly to the matched surah.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-xl border border-[var(--qm-border)] bg-[var(--qm-surface)] px-5 py-4 text-base text-[var(--qm-text)] outline-none transition focus:border-emerald-400"
            placeholder="Search translation text (e.g. mercy, guidance)"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />

          <button
            type="button"
            onClick={() => handleSearch()}
            className="rounded-xl bg-emerald-500 px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
          {error}
        </div>
      ) : null}

      {hasSearched && !error && results.length === 0 ? (
        <div className="mt-5 rounded-xl border border-[var(--qm-border)] bg-[var(--qm-card)] px-5 py-6 text-[var(--qm-muted)]">
          No ayahs matched this query. Try a broader keyword.
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <Link
            key={result.id}
            href={`/surah/${result.surahNumber}`}
            className="block rounded-2xl border border-[var(--qm-border)] bg-[var(--qm-card)] p-5 transition hover:border-emerald-500/40"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--qm-muted)]">
                  Surah {result.surahNumber} | Ayah {result.ayahNumber}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--qm-text)]">{result.surahName}</h2>
                <p
                  className="mt-2 p-2 text-right text-3xl leading-none text-[var(--qm-text)]"
                  style={{
                    fontFamily: arabicFontFamily,
                    fontSize: `${Math.max(settings.arabicSize - 2, 24)}px`,
                  }}
                  dir="rtl"
                >
                  {result.surahArabicName}
                </p>
              </div>

              <span className="inline-flex rounded-full bg-black/5 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--qm-muted)]">
                Open Surah
              </span>
            </div>

            {result.ayahArabic ? (
              <p
                className="mt-3 text-right leading-[2.1] text-[var(--qm-text)]"
                style={{
                  fontFamily: arabicFontFamily,
                  fontSize: `${Math.max(settings.arabicSize - 2, 24)}px`,
                }}
                dir="rtl"
              >
                {result.ayahArabic}
              </p>
            ) : null}

            <p
              className="mt-5 border-t border-[var(--qm-border)] pt-4 leading-8 text-[var(--qm-text)]"
              style={{ fontSize: `${settings.translationSize}px` }}
            >
              {result.translation}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
