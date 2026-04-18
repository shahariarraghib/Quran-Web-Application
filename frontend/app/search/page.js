"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useSettings } from "../../context/SettingsContext";
import { searchTranslation } from "../../utils/api";

function getArabicFontFamily(fontName) {
  return fontName === "Scheherazade New"
    ? "var(--font-scheherazade), serif"
    : "var(--font-amiri), serif";
}

export default function SearchPage() {
  const { settings } = useSettings();
  const arabicFontFamily = getArabicFontFamily(settings.arabicFont);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setHasSearched(true);
      setError(
        "Type a word or phrase from the translation to begin searching.",
      );
      return;
    }

    startTransition(async () => {
      try {
        setError("");
        const matches = await searchTranslation(trimmedQuery);
        setResults(matches);
        setHasSearched(true);
      } catch {
        setResults([]);
        setHasSearched(true);
        setError(
          "Search is unavailable right now. Please try again in a moment.",
        );
      }
    });
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="rounded-[2rem] border border-white/80 bg-white/75 px-6 py-8 shadow-xl shadow-amber-950/5 backdrop-blur sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          Search Ayah
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
          Find ayahs by translation text.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Search across English translation, then jump straight into the surah
          to continue reading with your saved typography settings.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            className="w-full rounded-[1.25rem] border border-slate-200 bg-white px-5 py-4 text-base text-slate-900 outline-none transition focus:border-amber-500"
            placeholder="Search in translation, e.g. mercy, guidance, patience"
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
            onClick={handleSearch}
            className="rounded-[1.25rem]  px-6 py-4 text-sm font-semibold text-white bg-amber-800/80 shadow-lg shadow-slate-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {hasSearched && !error && results.length === 0 ? (
        <div className="mt-5 rounded-[1.5rem] border border-slate-200 bg-white/75 px-5 py-6 text-slate-600 shadow-lg shadow-amber-950/5">
          No ayahs matched this translation search. Try a broader keyword.
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {results.map((result) => (
          <Link
            key={result.id}
            href={`/surah/${result.surahNumber}`}
            className="block rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-lg shadow-amber-950/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
                  Surah {result.surahNumber} | Ayah {result.ayahNumber}
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {result.surahName}
                </h2>
                <p
                  className="mt-2 text-right text-3xl leading-none text-slate-900"
                  style={{
                    fontFamily: arabicFontFamily,
                    fontSize: `${Math.max(settings.arabicSize - 2, 24)}px`,
                  }}
                >
                  {result.surahArabicName}
                </p>
              </div>

              <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Open Surah
              </span>
            </div>

            <p
              className="mt-5 leading-8 text-slate-700"
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
