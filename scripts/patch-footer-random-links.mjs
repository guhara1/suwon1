import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const outDir = "out";

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function decode(value) {
  try { return decodeURIComponent(value); } catch { return value; }
}

function hrefFromFile(file) {
  const rel = relative(outDir, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

function hashText(text) {
  return [...text].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

function labelFromHref(href) {
  const parts = href.split("/").filter(Boolean).map(decode);
  if (parts[0] !== "area") return "홈타이허브";
  if (parts.length === 2) return `${parts[1]} 출장마사지`;
  if (parts.length === 3) return `${parts[1]} ${parts[2]} 출장마사지`;
  return `${parts[2]} ${parts[3]} 출장마사지`;
}

const htmlFiles = walk(outDir).filter((file) => file.endsWith("index.html"));
const areaLinks = htmlFiles
  .map((file) => hrefFromFile(file))
  .filter((href) => href.startsWith("/area/"));
const thirdLinks = areaLinks.filter((href) => href.split("/").filter(Boolean).length === 4);
const secondLinks = areaLinks.filter((href) => href.split("/").filter(Boolean).length === 3);

function pickLinks(currentHref) {
  const currentParts = currentHref.split("/").filter(Boolean).map(decode);
  const city = currentParts[1] || "";
  const district = currentParts[2] || "";
  const seed = hashText(currentHref);
  const pool = [...thirdLinks].filter((href) => href !== currentHref);

  pool.sort((a, b) => {
    const ap = a.split("/").filter(Boolean).map(decode);
    const bp = b.split("/").filter(Boolean).map(decode);
    const aScore = (ap[1] === city ? 0 : 5) + (ap[2] === district ? 0 : 2) + ((hashText(a) + seed) % 17);
    const bScore = (bp[1] === city ? 0 : 5) + (bp[2] === district ? 0 : 2) + ((hashText(b) + seed) % 17);
    return aScore - bScore;
  });

  const selected = [];
  for (const href of pool) {
    if (!selected.includes(href)) selected.push(href);
    if (selected.length >= 5) break;
  }

  if (selected.length < 5) {
    for (const href of secondLinks) {
      if (href !== currentHref && !selected.includes(href)) selected.push(href);
      if (selected.length >= 5) break;
    }
  }

  return selected.slice(0, 5);
}

for (const file of htmlFiles) {
  let html = readFileSync(file, "utf8");
  const currentHref = hrefFromFile(file);
  const links = pickLinks(currentHref);
  const title = currentHref.split("/").filter(Boolean).length === 4 ? "연관 동네" : "인기 지역";
  const linkHtml = `<nav class="footer-links"><span style="color:#ff7a1a;font-weight:900;margin-right:4px">${title}</span>${links.map((href) => `<a href="${href}">${labelFromHref(href)}</a>`).join("")}<a href="/sitemap.xml">사이트맵</a></nav>`;

  html = html.replace(/<nav class="footer-links">[\s\S]*?<\/nav>/, linkHtml);
  writeFileSync(file, html, "utf8");
}
