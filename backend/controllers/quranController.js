import {
  fetchSearchResults,
  fetchSurahById,
  fetchSurahs,
} from "../models/quranModel.js";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

export async function getSurahs(req, res) {
  try {
    const surahs = await fetchSurahs();
    sendJson(res, 200, surahs);
  } catch (error) {
    sendJson(res, 502, {
      message: "Failed to load surahs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function getSurahById(req, res) {
  try {
    const id = req.url.split("/").pop();
    const surah = await fetchSurahById(id);

    if (!surah) {
      sendJson(res, 404, { message: "Surah not found" });
      return;
    }

    sendJson(res, 200, surah);
  } catch (error) {
    sendJson(res, 502, {
      message: "Failed to load surah",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function searchAyah(req, res) {
  try {
    const params = new URL(req.url, "http://localhost").searchParams;
    const query = params.get("q") ?? "";
    const lang = params.get("lang") ?? "en";
    const results = await fetchSearchResults(query, lang);
    sendJson(res, 200, results);
  } catch (error) {
    sendJson(res, 502, {
      message: "Failed to search ayahs",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
