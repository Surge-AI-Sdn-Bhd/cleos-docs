import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, sep } from "node:path";

const root = resolve("out");
const prefix = process.env.CLEOS_DOCS_BASE_PATH ?? "/cleos-docs";
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain" };

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    if (prefix && pathname !== prefix && !pathname.startsWith(`${prefix}/`)) { response.writeHead(404); response.end(); return; }
    const relative = (prefix ? pathname.slice(prefix.length) : pathname).replace(/^\/+/, "");
    let file = resolve(root, relative);
    if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403); response.end(); return; }
    if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
    const extension = file.slice(file.lastIndexOf("."));
    response.writeHead(200, { "Content-Type": `${types[extension] ?? "application/octet-stream"}${[".html", ".css", ".js", ".json", ".txt"].includes(extension) ? "; charset=utf-8" : ""}` });
    response.end(await readFile(file));
  } catch {
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    response.end(await readFile(resolve(root, "404.html")));
  }
}).listen(3108, "127.0.0.1", () => console.log("Static preview at http://127.0.0.1:3108"));
