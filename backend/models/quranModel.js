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

export async function fetchSearchResults(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const payload = await readJson(
    `${UPSTREAM_API}/search/${encodeURIComponent(trimmedQuery)}/all/en.asad`,
  );

  const matches = Array.isArray(payload?.data?.matches)
    ? payload.data.matches
    : Array.isArray(payload?.data)
      ? payload.data
      : [];

  return matches.map((match, index) => ({
    id:
      match.number ??
      `${match.surah?.number ?? match.surah}-${match.numberInSurah ?? index + 1}`,
    surahNumber: match.surah?.number ?? match.surah,
    surahName: match.surah?.englishName ?? "",
    surahArabicName: match.surah?.name ?? "",
    ayahNumber: match.numberInSurah ?? match.ayah,
    translation: match.text ?? "",
  }));
}
