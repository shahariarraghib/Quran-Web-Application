const UPSTREAM_API = "https://api.alquran.cloud/v1";

async function readJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Upstream request failed: ${response.status}`);
  }

  return response.json();
}

export async function fetchSurahs() {
  const payload = await readJson(`${UPSTREAM_API}/surah`);

  return Array.isArray(payload?.data)
    ? payload.data.map((surah) => ({
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        numberOfAyahs: surah.numberOfAyahs,
        revelationType: surah.revelationType,
      }))
    : [];
}

export async function fetchSurahById(id) {
  const payload = await readJson(
    `${UPSTREAM_API}/surah/${id}/editions/quran-uthmani,en.asad`,
  );

  const editions = Array.isArray(payload?.data) ? payload.data : [];
  const arabicEdition =
    editions.find((edition) => edition?.edition?.identifier === "quran-uthmani") ??
    editions[0];
  const translationEdition =
    editions.find((edition) => edition?.edition?.identifier === "en.asad") ??
    editions[1];

  if (!arabicEdition) {
    return null;
  }

  const translationAyahs = translationEdition?.ayahs ?? [];

  return {
    number: arabicEdition.number,
    name: arabicEdition.name,
    englishName: arabicEdition.englishName,
    englishNameTranslation: arabicEdition.englishNameTranslation,
    revelationType: arabicEdition.revelationType,
    numberOfAyahs: arabicEdition.numberOfAyahs,
    ayahs: (arabicEdition.ayahs ?? []).map((ayah, index) => ({
      numberInSurah: ayah.numberInSurah ?? index + 1,
      text: ayah.text ?? "",
      translation: translationAyahs[index]?.text ?? "",
    })),
  };
}

function normalizeMatch(match, index) {
  return {
    id:
      match.number ??
      `${match.surah?.number ?? match.surah}-${match.numberInSurah ?? index + 1}`,
    surahNumber: Number(match.surah?.number ?? match.surah ?? 0),
    surahName: match.surah?.englishName ?? "",
    surahArabicName: match.surah?.name ?? "",
    ayahNumber: Number(match.numberInSurah ?? match.ayah ?? index + 1),
    ayahArabic: match.text ?? "",
    translation: "",
  };
}

export async function fetchSearchResults(query, lang = "en") {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const target = encodeURIComponent(trimmedQuery);

  if (lang === "ar") {
    const payload = await readJson(`${UPSTREAM_API}/search/${target}/all/quran-uthmani`);
    const matches = Array.isArray(payload?.data?.matches)
      ? payload.data.matches
      : Array.isArray(payload?.data)
        ? payload.data
        : [];
    return matches.map((match, index) => normalizeMatch(match, index));
  }

  const englishPayload = await readJson(`${UPSTREAM_API}/search/${target}/all/en.asad`);
  const englishMatches = Array.isArray(englishPayload?.data?.matches)
    ? englishPayload.data.matches
    : Array.isArray(englishPayload?.data)
      ? englishPayload.data
      : [];

  if (lang === "en") {
    return englishMatches.map((match, index) => ({
      ...normalizeMatch(match, index),
      translation: match.text ?? "",
    }));
  }

  const arabicPayload = await readJson(`${UPSTREAM_API}/search/${target}/all/quran-uthmani`);
  const arabicMatches = Array.isArray(arabicPayload?.data?.matches)
    ? arabicPayload.data.matches
    : Array.isArray(arabicPayload?.data)
      ? arabicPayload.data
      : [];

  const byKey = new Map();

  for (let index = 0; index < englishMatches.length; index += 1) {
    const match = englishMatches[index];
    const item = normalizeMatch(match, index);
    item.translation = match.text ?? "";
    const key = `${item.surahNumber}-${item.ayahNumber}`;
    byKey.set(key, item);
  }

  for (let index = 0; index < arabicMatches.length; index += 1) {
    const match = arabicMatches[index];
    const item = normalizeMatch(match, index);
    const key = `${item.surahNumber}-${item.ayahNumber}`;
    const existing = byKey.get(key);
    if (existing) {
      existing.ayahArabic = item.ayahArabic;
    } else {
      byKey.set(key, item);
    }
  }

  return [...byKey.values()];
}
