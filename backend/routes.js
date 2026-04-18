import {
  getSurahs,
  getSurahById,
  searchAyah,
} from "./controllers/quranController.js";

export function handleRequest(req, res) {
  const url = req.url;
  const method = req.method;

  if (method === "GET" && url === "/api/surahs") {
    return getSurahs(req, res);
  }

  if (method === "GET" && url.startsWith("/api/surah/")) {
    return getSurahById(req, res);
  }

  if (method === "GET" && url.startsWith("/api/search")) {
    return searchAyah(req, res);
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ message: "Not Found" }));
}