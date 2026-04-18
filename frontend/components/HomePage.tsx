import Link from "next/link";

type Surah = {
  englishName: string;
  englishNameTranslation: string;
  name: string;
  number: number;
  numberOfAyahs: number;
  revelationType: string;
};

type HomePageProps = {
  surahs: Surah[];
};

export default function HomePage({ surahs }: HomePageProps) {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="rounded-[2rem] border border-white/70 bg-white/70 px-6 py-8 shadow-xl shadow-amber-950/5 backdrop-blur sm:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
              Surah Index
            </p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Explore all 114 surahs in one calm, readable layout.
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
              Open any surah to read the Arabic ayahs alongside translation,
              then fine tune the typography from the settings panel.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold !text-white bg-amber-800/80"
          >
            Search Translation
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {surahs.map((surah) => (
          <Link
            key={surah.number}
            href={`/surah/${surah.number}`}
            className="group rounded-[1.75rem] border border-white/80 bg-white/80 p-5 shadow-lg shadow-amber-950/5 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-base font-bold text-amber-800">
                {surah.number}
              </div>
              <p
                className="text-right text-3xl leading-none text-slate-900"
                style={{ fontFamily: "var(--font-amiri), serif" }}
              >
                {surah.name}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-bold text-slate-900">
                {surah.englishName}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {surah.englishNameTranslation}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              <span className="rounded-full bg-slate-100 px-3 py-2">
                {surah.numberOfAyahs} Ayahs
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
                {surah.revelationType}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
