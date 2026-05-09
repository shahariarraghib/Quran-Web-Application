import Link from "next/link";
import type { SurahSummary } from "../type/types";

type HomePageProps = {
  surahs: SurahSummary[];
};

export default function HomePage({ surahs }: HomePageProps) {
  return (
    <section className="mx-auto max-w-6xl">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 px-5 py-7 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
              Quran Reader
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-100 sm:text-4xl">
              Read, search and listen to every surah.
            </h1>
            <p className="mt-3 max-w-2xl text-slate-400">
              Inspired by QuranMazid UI with dark theme, typography controls and
              per-ayah recitation.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            Search Ayahs
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0d141d] p-4 text-sm text-slate-300">
        Pick a surah from the left sidebar to open the ayah reader.
      </div>
    </section>
  );
}
