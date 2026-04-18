import http from "http";
import { handleRequest } from "./routes.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    await handleRequest(req, res);
  } catch (error) {
    res.statusCode = 500;
    res.end(
      JSON.stringify({
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    );
  }
});

server.listen(PORT, () =>
  console.log(`Backend running on http://localhost:${PORT}`),
);
