export const API = "http://localhost:5000/api";

async function readJson(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export async function getSurahList() {
  return readJson(`${API}/surahs`, {
    cache: "no-store",
  });
}

export async function getSurahDetails(id) {
  return readJson(`${API}/surah/${id}`, {
    cache: "no-store",
  });
}

export async function searchTranslation(query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  return readJson(`${API}/search?q=${encodeURIComponent(trimmedQuery)}`, {
    cache: "no-store",
  });
}
