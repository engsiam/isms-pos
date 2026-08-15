// Zero-dependency static server for the /docs HTML documentation.
// Usage: npm run docs  ->  http://localhost:4400
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DOCS_DIR = join(__dirname, "..", "docs");
const PORT = Number(process.env.PORT || 4400);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".md": "text/plain; charset=utf-8",
};

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    let filePath = urlPath === "/" ? "index.html" : urlPath.replace(/^\/+/, "");
    // prevent path traversal
    const safePath = normalize(join(DOCS_DIR, filePath));
    if (!safePath.startsWith(DOCS_DIR)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    const data = await readFile(safePath);
    const type = MIME[extname(safePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`\n  ISM POS documentation server running:`);
  console.log(`    -> http://localhost:${PORT}/\n`);
  console.log("  Press Ctrl+C to stop.\n");
});