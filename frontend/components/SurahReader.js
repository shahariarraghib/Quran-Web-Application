"use client";

import Link from "next/link";
import { useSettings } from "../context/SettingsContext";

function getArabicFontFamily(fontName) {
  return fontName === "Scheherazade New"
    ? "var(--font-scheherazade), serif"
    : "var(--font-amiri), serif";
}

export default function SurahReader({ surah }) {
  const { settings } = useSettings();
  const arabicFontFamily = getArabicFontFamily(settings.arabicFont);

  return (
    <section className="mx-auto max-w-5xl">
      <Link
        href="/"
        className="inline-flex items-center rounded-full border border-slate-300/70 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
      >
        Back to Surah List
      </Link>

      <div className="mt-5 rounded-[2rem] border border-white/80 bg-white/75 px-6 py-8 shadow-xl shadow-amber-950/5 backdrop-blur sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
              Surah {surah.number}
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
              {surah.englishName}
            </h1>
            <p className="mt-3 text-lg text-slate-600">
              {surah.englishNameTranslation}
            </p>
          </div>

          <div className="rounded-[1.5rem] px-5 py-4 text-black">
            <p
              className="text-right text-4xl leading-none"
              style={{ fontFamily: arabicFontFamily }}
            >
              {surah.name}
            </p>
            <p className="mt-3 text-sm text-black">
              {surah.numberOfAyahs} ayahs | {surah.revelationType}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {surah.ayahs.map((ayah) => (
          <article
            key={ayah.numberInSurah}
            className="rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-lg shadow-amber-950/5"
          >
            <div className="mb-4 inline-flex h-10 min-w-10 items-center justify-center rounded-2xl bg-amber-100 px-3 text-sm font-bold text-amber-800">
              {ayah.numberInSurah}
            </div>

            <p
              className="leading-[2.1] text-slate-950"
              style={{
                fontFamily: arabicFontFamily,
                fontSize: `${settings.arabicSize}px`,
                textAlign: "right",
              }}
              dir="rtl"
            >
              {ayah.text}
            </p>

            <div className="mt-5 h-px bg-slate-200" />

            <p
              className="mt-5 leading-8 text-slate-700"
              style={{ fontSize: `${settings.translationSize}px` }}
            >
              {ayah.translation}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
