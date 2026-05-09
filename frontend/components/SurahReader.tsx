"use client";

import { useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Bookmark,
  Copy,
  Ellipsis,
  Heart,
  Pause,
  Play,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import type { QuranSurah } from "../type/types";
import Image from "next/image";

type SurahReaderProps = {
  surah: QuranSurah;
};

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

function toAudioUrl(surahNumber: number, ayahNumber: number) {
  return `https://everyayah.com/data/Alafasy_128kbps/${surahNumber
    .toString()
    .padStart(3, "0")}${ayahNumber.toString().padStart(3, "0")}.mp3`;
}

export default function SurahReader({ surah }: SurahReaderProps) {
  const { settings, likedAyahs, bookmarkedAyahs, toggleLike, toggleBookmark } =
    useSettings();

  const arabicFontFamily = getArabicFontFamily(settings.arabicFont);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [queue, setQueue] = useState<number[] | null>(null);

  const ayahNumbers = useMemo(
    () => surah.ayahs.map((ayah) => ayah.numberInSurah),
    [surah.ayahs],
  );

  const playAyah = async (ayahNumber: number, fromQueue = false) => {
    const audio = audioRef.current;

    if (!audio) return;

    if (playingAyah === ayahNumber && !audio.paused) {
      audio.pause();
      setPlayingAyah(null);

      if (!fromQueue) {
        setQueue(null);
      }

      return;
    }

    audio.src = toAudioUrl(surah.number, ayahNumber);

    try {
      await audio.play();
      setPlayingAyah(ayahNumber);
    } catch {
      setPlayingAyah(null);
      setQueue(null);
    }
  };

  const handlePlaySurah = async () => {
    if (queue) {
      setQueue(null);
      audioRef.current?.pause();
      setPlayingAyah(null);
      return;
    }

    setQueue(ayahNumbers);

    await playAyah(ayahNumbers[0], true);
  };

  const onEnded = async () => {
    if (!queue || playingAyah === null) {
      setPlayingAyah(null);
      return;
    }

    const index = queue.indexOf(playingAyah);
    const nextAyah = queue[index + 1];

    if (!nextAyah) {
      setQueue(null);
      setPlayingAyah(null);
      return;
    }

    await playAyah(nextAyah, true);
  };

  const getAyahKey = (ayahNumber: number) => `${surah.number}:${ayahNumber}`;

  const isAyahLiked = (ayahNumber: number) =>
    likedAyahs.has(getAyahKey(ayahNumber));

  const isAyahBookmarked = (ayahNumber: number) =>
    bookmarkedAyahs.has(getAyahKey(ayahNumber));

  return (
    <section className="w-full">
      <audio ref={audioRef} onEnded={onEnded} />

      {/* HEADER */}
      <div className="border-b border-[var(--qm-border)] bg-[var(--qm-card)]">
        <div className="grid items-center gap-5 px-4 py-6 md:grid-cols-3 md:px-8">
          {/* Left image */}
          <div className="hidden md:block">
            <Image
              src="/images/madinah.webp"
              alt="makkah"
              width={100}
              height={100}
              className="w-[150px] opacity-100"
            />
          </div>

          {/* Center */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-[var(--qm-text)] md:text-4xl">
              Surah {surah.englishName}
            </h1>

            <p className="mt-2 text-sm capitalize text-[var(--qm-muted)] md:text-base">
              Ayah-{surah.numberOfAyahs}, {surah.revelationType}
            </p>

            <button
              type="button"
              onClick={handlePlaySurah}
              className="mt-4 rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
            >
              {queue ? "Stop Surah" : "Play Surah"}
            </button>
          </div>

          <div className="flex justify-end image-in-dark justify-self-center text-subtitle-color opacity-50 max-tablet:max-w-[40cqw] tablet:justify-self-end">
            {" "}
            <Image
              src="/images/bismillah.2a2f3d14.svg"
              alt="bismillah"
              width={500}
              height={500}
              className="w-[250px] opacity-100"
            />
          </div>
        </div>
      </div>

      {/* AYAH LIST */}
      <div className="overflow-hidden">
        {surah.ayahs.map((ayah) => {
          const liked = isAyahLiked(ayah.numberInSurah);

          const bookmarked = isAyahBookmarked(ayah.numberInSurah);

          return (
            <article
              key={ayah.numberInSurah}
              className="border-b border-[var(--qm-border)] bg-[var(--qm-card)] px-4 py-6 transition-colors duration-200 hover:bg-black/[0.02] md:px-8"
            >
              {/* top */}
              <div className="mb-4 flex items-center justify-between">
                {/* mobile dots */}
                <button className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--qm-muted)] transition hover:bg-black/5 md:hidden">
                  <Ellipsis className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-[48px_minmax(0,1fr)]">
                {/* action column */}
                <div className="hidden flex-col items-center gap-2 md:flex">
                  {/* play */}

                  <div>
                    <p className="text-sm font-semibold text-emerald-500 md:text-base">
                      {surah.number}:{ayah.numberInSurah}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => playAyah(ayah.numberInSurah)}
                    className="group flex h-[34px] w-[34px] items-center justify-center rounded-full text-[var(--qm-muted)] transition hover:bg-emerald-500/10 hover:text-emerald-500"
                  >
                    {playingAyah === ayah.numberInSurah ? (
                      <Pause className="h-[18px] w-[18px]" />
                    ) : (
                      <Play className="h-[18px] w-[18px]" />
                    )}
                  </button>

                  {/* tafsir */}
                  <button className="group flex h-[34px] w-[34px] items-center justify-center rounded-full text-[var(--qm-muted)] transition hover:bg-emerald-500/10 hover:text-emerald-500">
                    <BookOpen className="h-[18px] w-[18px]" />
                  </button>

                  {/* bookmark */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleBookmark(surah.number, ayah.numberInSurah)
                    }
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full transition ${
                      bookmarked
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "text-[var(--qm-muted)] hover:bg-emerald-500/10 hover:text-emerald-500"
                    }`}
                  >
                    <Bookmark className="h-[18px] w-[18px]" />
                  </button>

                  {/* menu */}
                  <button className="group flex h-[34px] w-[34px] items-center justify-center rounded-full text-[var(--qm-muted)] transition hover:bg-black/5">
                    <Ellipsis className="h-[18px] w-[18px]" />
                  </button>
                </div>

                {/* content */}
                <div>
                  {/* arabic */}
                  <p
                    dir="rtl"
                    className="mb-5 text-right leading-[2.2] text-[var(--qm-text)]"
                    style={{
                      fontFamily: arabicFontFamily,
                      fontSize: Math.min(settings.arabicSize, 40) + "px",
                    }}
                  >
                    {ayah.text}

                    <span className="mx-3 text-emerald-500">
                      {ayah.numberInSurah}
                    </span>
                  </p>

                  {/* translation */}
                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.15em] text-[var(--qm-muted)]">
                      Saheeh International
                    </p>

                    <p
                      className="leading-8 text-[var(--qm-text)]"
                      style={{
                        fontSize: Math.min(settings.translationSize, 20) + "px",
                      }}
                    >
                      {ayah.translation}
                    </p>
                  </div>

                  {/* mobile buttons */}
                  <div className="mt-5 flex items-center gap-2 md:hidden">
                    <button
                      type="button"
                      onClick={() => playAyah(ayah.numberInSurah)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--qm-border)]"
                    >
                      {playingAyah === ayah.numberInSurah ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleLike(surah.number, ayah.numberInSurah)
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                        liked
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                          : "border-[var(--qm-border)]"
                      }`}
                    >
                      <Heart
                        className={`h-4 w-4 ${liked ? "fill-current" : ""}`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        toggleBookmark(surah.number, ayah.numberInSurah)
                      }
                      className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                        bookmarked
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                          : "border-[var(--qm-border)]"
                      }`}
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const text = `${surah.englishName} ${surah.number}:${ayah.numberInSurah}\n${ayah.text}\n\n${ayah.translation}`;

                        navigator.clipboard.writeText(text);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--qm-border)]"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
