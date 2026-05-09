import type { QuranSurah, SearchResult, SurahSummary } from "../type/types";

const API =
  process.env.NEXT_PUBLIC_QURAN_API_URL ??
  "https://quran-web-application-backend.vercel.app/api";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function readJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, options);

      if (response.ok) {
        return response.json() as Promise<T>;
      }

      if (response.status < 500 || response.status >= 600) {
        throw new Error(`Request failed: ${response.status}`);
      }

      lastError = new Error(`Request failed: ${response.status}`);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Request failed");
    }

    if (attempt < 3) {
      await sleep(350 * (attempt + 1));
    }
  }

  throw lastError ?? new Error("Request failed");
}

export async function getSurahList(): Promise<SurahSummary[]> {
  return readJson<SurahSummary[]>(`${API}/surahs`, {
    next: { revalidate: 86_400 },
  });
}

export async function getSurahDetails(id: string | number): Promise<QuranSurah | null> {
  try {
    return await readJson<QuranSurah>(`${API}/surah/${id}`, {
      next: { revalidate: 86_400 },
    });
  } catch {
    return null;
  }
}

export async function searchAyahs(query: string): Promise<SearchResult[]> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return readJson<SearchResult[]>(
    `${API}/search?q=${encodeURIComponent(trimmedQuery)}&lang=en`,
    { cache: "no-store" },
  );
}
