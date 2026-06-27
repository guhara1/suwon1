import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const outDir = "out";
const siteUrl = "https://homethaihub1.netlify.app";
const brand = "홈타이허브";
const phone = "0508-202-4683";
const today = new Date().toISOString().slice(0, 10);

const eeatCss = `.trust-section{border-top:1px solid #1f1f1f}.trust-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.trust-card{border:1px solid #2b2b2b;border-radius:14px;background:#101010;padding:18px}.trust-card h3{margin:0 0 10px;color:#ff7a1a;font-size:18px}.trust-card p{margin:0;color:#d2d2d2;line-height:1.7}.trust-note{margin-top:16px;color:#aaa;line-height:1.65;font-size:14px}@media(max-width:900px){.trust-grid{grid-template-columns:1fr}}`;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function decodeHtml(value = "") {
  return value.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
}

function stripTags(value = "") {
  return decodeHtml(value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
}

function match(html, pattern) {
  return html.match(pattern)?.[1] || "";
}

function pageUrl(file) {
  const rel = relative(outDir, file).replaceAll("\\", "/");
  if (rel === "index.html") return "/";
  return `/${rel.replace(/index\.html$/, "")}`;
}

function breadcrumb(url) {
  const parts = url.split("/").filter(Boolean);
  const items = [{ name: "홈", item: `${siteUrl}/` }];
  let path = "";
  for (const part of parts) {
    path += `/${part}`;
    items.push({ name: part === "area" ? "지역" : decodeURIComponent(part), item: `${siteUrl}${path}/` });
  }
  return items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.item }));
}

function jsonLd({ title, description, canonical, url }) {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: brand, url: siteUrl, telephone: phone, areaServed: ["수원", "용인", "성남"] },
      { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: brand, inLanguage: "ko-KR", publisher: { "@id": `${siteUrl}/#organization` } },
      { "@type": "WebPage", "@id": `${canonical}#webpage`, url: canonical, name: title, description, inLanguage: "ko-KR", isPartOf: { "@id": `${siteUrl}/#website` }, dateModified: today, about: "수원 용인 성남 홈타이 및 출장마사지 지역 안내" },
      { "@type": "BreadcrumbList", "@id": `${canonical}#breadcrumb`, itemListElement: breadcrumb(url) }
    ]
  };
  return `<script type="application/ld+json" data-hub-seo="true">${JSON.stringify(graph)}</script>`;
}

function trustSection(title, url) {
  const parts = url.split("/").filter(Boolean).map((part) => part === "area" ? "" : decodeURIComponent(part)).filter(Boolean);
  const place = parts.length ? parts.join(" ") : "수원·용인·성남";
  return `<section class="section trust-section" data-hub-eeat="true"><p class="eyebrow">홈타이허브 검수 기준</p><h2>${place} 이용 전 신뢰 기준</h2><div class="trust-grid"><article class="trust-card"><h3>지역 확인</h3><p>${place} 생활권 기준으로 이동 가능 시간, 세부 위치, 상담 가능한 코스를 먼저 확인하도록 안내합니다.</p></article><article class="trust-card"><h3>요금 확인</h3><p>표기 금액은 기본 참고용이며 실제 조건은 시간대, 거리, 코스 구성, 후불 안내를 통화에서 다시 점검합니다.</p></article><article class="trust-card"><h3>안전 확인</h3><p>건전한 방문 케어 기준을 벗어나는 요청은 제외하고, 이용 전 주의사항과 관리 범위를 확인하도록 구성합니다.</p></article></div><p class="trust-note">작성 기준: ${brand} 운영팀이 ${today} 기준으로 지역 페이지, 내부 링크, 메타 정보, 상담 전 확인 항목을 점검했습니다.</p></section>`;
}

for (const file of walk(outDir)) {
  if (!file.endsWith(".html")) continue;
  let html = readFileSync(file, "utf8");
  const url = pageUrl(file);
  const canonical = `${siteUrl}${url}`;
  const title = stripTags(match(html, /<title>([\s\S]*?)<\/title>/)) || brand;
  const description = decodeHtml(match(html, /<meta name="description" content="([^"]*)"/)) || `${brand} 지역 안내`;

  html = html.replace(/<link rel="canonical" href="[^"]*">/g, `<link rel="canonical" href="${canonical}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/g, `<meta property="og:url" content="${canonical}">`);

  if (!html.includes('name="theme-color"')) {
    html = html.replace("<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">", `<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#050505"><meta name="format-detection" content="telephone=yes">`);
  }
  if (!html.includes('data-hub-seo="true"')) {
    html = html.replace("</head>", `${jsonLd({ title, description, canonical, url })}</head>`);
  }
  if (!html.includes(".trust-section")) {
    html = html.replace("</style>", `${eeatCss}</style>`);
  }
  if (!html.includes('data-hub-eeat="true"')) {
    html = html.replace("<footer class=\"footer\">", `${trustSection(title, url)}<footer class="footer">`);
  }
  writeFileSync(file, html, "utf8");
}
