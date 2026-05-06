import { readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const outDir = "out";
const siteUrl = "https://homethaihub.netlify.app";
const brand = "홈타이허브";
const today = new Date().toISOString().slice(0, 10);

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function urlFromFile(file) {
  const rel = relative(outDir, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

function priority(url) {
  const depth = url.split("/").filter(Boolean).length;
  if (url === "/") return "1.0";
  if (depth === 2) return "0.85";
  if (depth === 3) return "0.75";
  return "0.65";
}

const urls = walk(outDir)
  .filter((file) => file.endsWith("index.html"))
  .map(urlFromFile)
  .sort((a, b) => a.localeCompare(b, "ko"));

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${siteUrl}${url}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority(url)}</priority></url>`).join("\n")}\n</urlset>\n`;

const rssItems = urls.slice(0, 80).map((url) => {
  const title = decodeURIComponent(url === "/" ? brand : `${brand} ${url.replaceAll("/", " ").trim()}`);
  return `<item><title>${title}</title><link>${siteUrl}${url}</link><guid>${siteUrl}${url}</guid><pubDate>${new Date().toUTCString()}</pubDate></item>`;
}).join("");

const rss = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${brand}</title><link>${siteUrl}/</link><description>수원 용인 성남 출장마사지 홈타이 지역 안내</description><language>ko-KR</language>${rssItems}</channel></rss>\n`;

const robots = `User-agent: Googlebot\nAllow: /\n\nUser-agent: NaverBot\nAllow: /\n\nUser-agent: Yeti\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

writeFileSync(join(outDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(outDir, "rss.xml"), rss, "utf8");
writeFileSync(join(outDir, "robots.txt"), robots, "utf8");
