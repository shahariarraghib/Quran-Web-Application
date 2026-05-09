export type SurahSummary = {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export type Ayah = {
  numberInSurah: number;
  text: string;
  translation: string;
};

export type QuranSurah = SurahSummary & {
  ayahs: Ayah[];
};

export type SearchResult = {
  id: string | number;
  surahNumber: number;
  surahName: string;
  surahArabicName: string;
  ayahNumber: number;
  ayahArabic?: string;
  translation: string;
};

export type ReaderSettings = {
  theme: "dark" | "light";
  arabicFont:
    | "KFGQ"
    | "Amiri"
    | "Scheherazade New"
    | "Noto Naskh Arabic"
    | "Lateef";
  arabicSize: number;
  translationSize: number;
};

export type AyahAction = {
  likedAyahs: Set<string>; // format: "surah:ayah"
  bookmarkedAyahs: Set<string>; // format: "surah:ayah"
};
