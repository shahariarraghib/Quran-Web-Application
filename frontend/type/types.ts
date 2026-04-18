export type Surah = {
  number: number;
  name: string;
  englishName: string;
};

export type Ayah = {
  numberInSurah: number;
  text: string;
  translation: string;
};

export type QuranSurah = {
  number: number;
  name: string;
  englishName: string;
  ayahs: Ayah[];
};
