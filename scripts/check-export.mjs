import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve("out");
const prefix = process.env.CLEOS_DOCS_BASE_PATH ?? "";
const articles = readdirSync(join(root, "articles"), { withFileTypes: true }).filter((entry) => entry.isDirectory());
const topics = readdirSync(join(root, "topics"), { withFileTypes: true }).filter((entry) => entry.isDirectory());
const pages = [join(root, "index.html"), ...articles.map((entry) => join(root, "articles", entry.name, "index.html")), ...topics.map((entry) => join(root, "topics", entry.name, "index.html"))];
const broken = [];

for (const page of pages) {
  if (!existsSync(page)) { broken.push(`Missing page: ${page}`); continue; }
  const html = readFileSync(page, "utf8");
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    if (!href.startsWith("/")) continue;
    if (prefix && href !== prefix && !href.startsWith(`${prefix}/`)) { broken.push(`${page}: path lacks ${prefix}: ${href}`); continue; }
    const relative = (prefix ? href.slice(prefix.length) : href).split(/[?#]/)[0].replace(/^\/+/, "");
    const target = /\.[a-z0-9]+$/i.test(relative) ? join(root, relative) : join(root, relative, "index.html");
    if (!existsSync(target)) broken.push(`${page}: broken link ${href}`);
  }
  for (const [, src] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    if (!src.startsWith("/")) continue;
    if (prefix && !src.startsWith(`${prefix}/`)) { broken.push(`${page}: image path lacks ${prefix}: ${src}`); continue; }
    const relative = (prefix ? src.slice(prefix.length) : src).split(/[?#]/)[0].replace(/^\/+/, "");
    if (!existsSync(join(root, relative))) broken.push(`${page}: missing image ${src}`);
  }
}

if (articles.length !== 65 || topics.length !== 10) broken.push(`Expected 65 articles and 10 topics; found ${articles.length} and ${topics.length}`);
if (broken.length) { console.error(broken.join("\n")); process.exitCode = 1; }
else console.log(`Checked ${pages.length} exported pages, ${articles.length} articles, ${topics.length} topics, internal links, and images.`);
