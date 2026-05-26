import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const siteUrl = process.env.SITE_URL || "https://homethaihub.netlify.app";
const brand = "홈타이허브";
const phone = "0508-202-4683";
const tel = "tel:05082024683";
const today = new Date().toISOString().slice(0, 10);

const areas = {
  "수원": {
    "장안구": ["파장동", "율천동", "정자동", "영화동", "송죽동", "조원동", "연무동"],
    "권선구": ["세류동", "평동", "서둔동", "구운동", "금곡동", "호매실동", "권선동", "곡선동", "입북동"],
    "팔달구": ["행궁동", "매교동", "매산동", "고등동", "화서동", "지동", "우만동", "인계동"],
    "영통구": ["매탄동", "원천동", "광교동", "영통동", "망포동"]
  },
  "용인": {
    "처인구": ["포곡읍", "모현읍", "이동읍", "남사읍", "원삼면", "백암면", "중앙동", "역북동", "유림동"],
    "기흥구": ["신갈동", "영덕동", "구갈동", "상갈동", "보라동", "기흥동", "서농동", "구성동", "마북동", "동백동", "상하동", "보정동"],
    "수지구": ["풍덕천동", "신봉동", "죽전동", "동천동", "상현동", "성복동"]
  },
  "성남": {
    "수정구": ["신흥동", "태평동", "수진동", "단대동", "산성동", "양지동", "복정동", "위례동", "고등동", "시흥동"],
    "중원구": ["성남동", "중앙동", "금광동", "은행동", "상대원동", "하대원동", "도촌동"],
    "분당구": ["분당동", "수내동", "정자동", "서현동", "이매동", "야탑동", "금곡동", "구미동", "판교동", "삼평동", "백현동", "운중동"]
  }
};

const prices = [
  ["타이 건식", "60분 80,000원", "90분 100,000원", "120분 120,000원"],
  ["아로마 습식", "60분 90,000원", "90분 110,000원", "120분 130,000원"],
  ["감성케어 오일", "60분 100,000원", "90분 120,000원", "120분 140,000원"],
  ["VVIP 전신케어", "60분 110,000원", "90분 130,000원", "120분 150,000원", "150분 180,000원"],
  ["한국인 스웨디시", "60분 150,000원", "90분 190,000원"],
  ["남성 스웨디시", "60분 100,000원", "90분 130,000원", "120분 160,000원"]
];

const typeCopy = [
  ["타이마사지", "건식 스트레칭과 압 중심으로 안내되는 기본 관리입니다. 활동량이 많거나 뻐근함을 느끼는 이용자가 상담 시 자주 비교합니다."],
  ["아로마 마사지", "오일을 활용한 부드러운 케어로 안내되는 대표 코스입니다. 향, 피부 마찰 부담, 이완감을 함께 확인하는 것이 좋습니다."],
  ["스웨디시 마사지", "리듬감 있는 오일 관리 흐름을 중심으로 설명되는 코스입니다. 강한 압보다 편안한 관리감을 선호할 때 비교합니다."],
  ["VIP 마사지", "일반 코스보다 시간, 관리 구성, 배정 조건을 세밀하게 확인하는 프리미엄 안내 코스입니다."],
  ["로미로미 마사지", "부드럽고 길게 이어지는 케어 흐름으로 설명되는 경우가 많으며, 편안한 분위기와 전신 이완을 중시합니다."],
  ["슈얼마사지", "업체마다 명칭과 범위가 다를 수 있어 이름만 보고 판단하지 말고 상담에서 운영 기준과 주의사항을 확인해야 합니다."]
];

const css = `:root{--bg:#050505;--panel:#111;--line:#2b2b2b;--text:#fff;--muted:#c5c5c5;--orange:#ff7a1a;--orange2:#ff9b3d}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:Arial,"Malgun Gothic",sans-serif}a{color:inherit;text-decoration:none}.topbar{position:sticky;top:0;z-index:20;background:rgba(5,5,5,.94);border-bottom:1px solid var(--line);backdrop-filter:blur(12px)}.top-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:14px 0;display:flex;justify-content:space-between;align-items:center}.brand{display:flex;align-items:center;gap:10px;font-weight:900;font-size:21px}.brand-mark{width:38px;height:38px;border-radius:8px;background:linear-gradient(135deg,var(--orange),#ff4f1f);display:grid;place-items:center}.nav{display:flex;gap:18px;font-size:14px}.call-btn,.primary-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border-radius:8px;background:var(--orange);padding:0 16px;font-weight:900}.section{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:48px 0}.hero{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(340px,.95fr);gap:32px;align-items:center;min-height:590px}.eyebrow{color:var(--orange);font-weight:900;margin:0 0 12px}h1{font-size:clamp(42px,7vw,76px);line-height:1.05;margin:0}h2{font-size:34px;color:var(--orange);margin:0 0 18px}h3{font-size:22px;margin:0 0 12px}.lead,.card p,.muted{color:var(--muted);line-height:1.75;font-size:18px}.hero-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}.outline-btn{display:inline-flex;align-items:center;justify-content:center;min-height:42px;border:1px solid var(--line);border-radius:8px;padding:0 16px;font-weight:900}.panel,.card,.price-card{border:1px solid var(--line);border-radius:14px;background:var(--panel);padding:22px}.grid-2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.grid-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.grid-4{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.area-card h3,.region-card h3,.dong-link strong,.price-card h3,.type-card h3{color:var(--orange)}.link-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.dong-link{border:1px solid #3a2a1d;border-radius:12px;background:linear-gradient(180deg,#171717,#0f0f0f);padding:15px 16px;font-weight:900;display:flex;justify-content:space-between}.dong-link:after{content:'›';color:var(--orange2);font-size:22px}.price-row{display:flex;justify-content:space-between;border-bottom:1px dashed #333;padding:10px 0}.shop-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.shop-card{aspect-ratio:1/1;border:1px solid var(--line);border-radius:14px;background:linear-gradient(180deg,#151515,#0d0d0d);padding:18px;display:flex;flex-direction:column;justify-content:space-between}.shop-card span{color:var(--orange2);font-size:13px;font-weight:900}.footer{border-top:1px solid #252525;margin-top:56px;background:#070707}.footer-inner{width:min(1180px,calc(100% - 32px));margin:0 auto;padding:36px 0 24px}.footer-top{display:grid;grid-template-columns:1.2fr .9fr .9fr;gap:18px}.footer-card{border:1px solid #252525;border-radius:12px;background:#101010;padding:18px}.footer-card h3{color:var(--orange);font-size:15px}.footer-links{display:flex;flex-wrap:wrap;gap:8px;border-top:1px solid #222;margin-top:22px;padding-top:18px}.footer-links a{border:1px solid #3a2a1d;border-radius:999px;padding:9px 13px;background:#0d0d0d;font-weight:800;font-size:13px}.mobile-call{display:none}@media(max-width:1000px){.hero,.grid-2,.grid-3,.grid-4,.shop-grid{grid-template-columns:1fr 1fr}.link-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:760px){.nav{display:none}.hero,.grid-2,.grid-3,.grid-4,.shop-grid,.link-grid,.footer-top{grid-template-columns:1fr}body{padding-bottom:82px}.mobile-call{position:fixed;left:12px;right:12px;bottom:12px;z-index:50;display:flex;justify-content:center;align-items:center;gap:10px;min-height:58px;border-radius:8px;background:var(--orange);font-weight:900}.section{padding:36px 0}h1{font-size:40px}}`;

function enc(value){return encodeURIComponent(value)}
function pathFor(...parts){return parts.map(enc).join("/")}
function write(path, html){const file=join("out", path); mkdirSync(dirname(file),{recursive:true}); writeFileSync(file, html, "utf8")}
function areaUrl(...parts){return `/area/${pathFor(...parts)}/`}

function seo(title, description, url){
  const canonical = `${siteUrl}${url}`;
  const graph = {"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":`${siteUrl}/#org`,name:brand,url:siteUrl,telephone:phone,areaServed:["수원","용인","성남"]},{"@type":"WebPage",url:canonical,name:title,description,inLanguage:"ko-KR",publisher:{"@id":`${siteUrl}/#org`},dateModified:today}]};
  return `<title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}"><meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large"><meta name="author" content="홈타이허브 운영팀"><meta property="og:site_name" content="${brand}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${canonical}"><script type="application/ld+json">${JSON.stringify(graph)}</script>`;
}

function nav(){return `<header class="topbar"><div class="top-inner"><a class="brand" href="/"><span class="brand-mark">H</span>${brand}</a><nav class="nav"><a href="/#price">요금표</a><a href="/#types">마사지 종류</a><a href="/#areas">서비스 지역</a><a href="/#faq">FAQ</a><a href="${tel}">전화예약</a></nav><a class="call-btn" href="${tel}">${phone}</a></div></header>`}
function layout({title,description,url,body}){return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${seo(title,description,url)}<link rel="icon" type="image/svg+xml" href="/favicon.svg"><style>${css}</style></head><body>${nav()}${body}${footer(url)}<a class="mobile-call" href="${tel}"><span>전화예약</span><strong>${phone}</strong></a></body></html>`}

function priceCards(){return prices.map(([title,...rows])=>`<article class="price-card"><h3>${title}</h3>${rows.map(row=>{const [a,...b]=row.split(" ");return `<div class="price-row"><span>${a}</span><strong>${b.join(" ")}</strong></div>`}).join("")}</article>`).join("")}
function typeCards(){return typeCopy.map(([t,p])=>`<article class="type-card card"><h3>${t}</h3><p>${p}</p></article>`).join("")}
function areaSummary(city,district="",dong=""){
  const place = dong || district || city;
  if(city === "수원") return `${place} 권역은 수원역, 광교, 영통, 인계동 등 생활권별 이동 흐름이 달라 상담 시 현재 위치와 가능 시간을 함께 확인하는 것이 좋습니다.`;
  if(city === "용인") return `${place} 지역은 처인, 기흥, 수지 권역 간 거리가 있어 코스 시간과 이동 조건을 상담 단계에서 먼저 확인하도록 안내합니다.`;
  return `${place} 일대는 분당, 판교, 위례, 모란 생활권 수요가 나뉘므로 세부 동 기준으로 방문 가능 범위와 예약 흐름을 확인하세요.`;
}
function shops(place){const names=["프리미엄 홈타이","힐링 아로마","VIP 방문케어","시그니처 케어"];return `<section class="section"><h2>${place} 추천 업체</h2><div class="shop-grid">${names.map((name,i)=>`<article class="shop-card"><div><span>${["빠른 상담","요금 확인","배정 안내","코스 비교"][i]}</span><h3>${place} ${name}</h3></div><p class="muted">상담 후 가능 시간, 코스 구성, 이동 조건, 결제 안내를 확인할 수 있습니다.</p></article>`).join("")}</div></section>`}

function footer(){
  const links = [["수원 출장마사지", areaUrl("수원")],["용인 출장마사지", areaUrl("용인")],["성남 출장마사지", areaUrl("성남")],["영통 출장마사지", areaUrl("수원","영통구")],["분당 출장마사지", areaUrl("성남","분당구")],["수지 출장마사지", areaUrl("용인","수지구")],["사이트맵","/sitemap.xml"]];
  return `<footer class="footer"><div class="footer-inner"><div class="footer-top"><section class="footer-card"><div class="brand"><span class="brand-mark">H</span>${brand}</div><p class="muted">${brand}는 수원, 용인, 성남 출장마사지와 홈타이 가능 지역을 도시, 구, 동 기준으로 정리하는 지역 전문 예약 안내 플랫폼입니다.</p></section><section class="footer-card"><h3>고객센터</h3><p class="muted"><a href="${tel}">${phone}</a><br>전화 상담 기준으로 가능 시간과 코스를 안내합니다.</p></section><section class="footer-card"><h3>운영시간</h3><p class="muted">오전 11시 ~ 익일 오전 8시<br>연중무휴</p></section></div><nav class="footer-links">${links.map(([label,href])=>`<a href="${href}">${label}</a>`).join("")}</nav><p class="muted">부적절하거나 위법한 요청은 안내 대상에서 제외합니다. 최종 이용 조건은 상담 시점의 지역 배정 상황을 기준으로 확인해 주세요.</p></div></footer>`
}

const cityCards = Object.entries(areas).map(([city,districts])=>`<a class="region-card card" href="${areaUrl(city)}"><h3>${city} 홈타이</h3><p>${areaSummary(city)} 대표 구역: ${Object.keys(districts).join(", ")}</p></a>`).join("");
const serviceCards = Object.entries(areas).flatMap(([city,districts])=>Object.keys(districts).map(d=>`<a class="area-card card" href="${areaUrl(city,d)}"><h3>${city} ${d}</h3><p>${areaSummary(city,d)}</p></a>`)).join("");

const home = `<main><section class="section hero"><div><p class="eyebrow">수원 · 용인 · 성남 지역 전문</p><h1>${brand} 출장마사지 & 홈타이</h1><p class="lead">${brand}는 수원, 용인, 성남 지역의 출장마사지와 홈타이 가능 구역을 도시, 구, 동 기준으로 정리합니다. 예약 전 요금, 이동 가능 범위, 코스 차이, 상담 시 확인할 내용을 한 번에 살펴볼 수 있습니다.</p><div class="hero-actions"><a class="primary-btn" href="${areaUrl("수원")}">수원 지역 보기</a><a class="outline-btn" href="${areaUrl("용인")}">용인 지역 보기</a><a class="outline-btn" href="${areaUrl("성남")}">성남 지역 보기</a></div></div><div class="panel"><h2>빠른 지역 선택</h2><div class="grid-3">${cityCards}</div></div></section><section class="section" id="areas"><h2>서비스 지역</h2><div class="grid-3">${serviceCards}</div></section><section class="section" id="price"><h2>마사지 코스 및 요금</h2><div class="grid-4">${priceCards()}</div></section><section class="section" id="types"><h2>마사지 종류</h2><div class="grid-3">${typeCards()}</div></section><section class="section" id="faq"><h2>자주 묻는 질문</h2><div class="grid-3"><article class="card"><h3>바로 예약 가능한가요?</h3><p>현재 위치, 시간대, 코스에 따라 달라지므로 전화 상담으로 가능 범위를 확인합니다.</p></article><article class="card"><h3>요금은 어떻게 확인하나요?</h3><p>표기 금액은 참고 기준이며 최종 금액은 이동 조건과 코스 선택에 따라 상담 중 확인합니다.</p></article><article class="card"><h3>주의사항은 무엇인가요?</h3><p>부적절하거나 위법한 요청은 안내하지 않으며, 이용 전 코스 범위와 결제 방식을 확인합니다.</p></article></div></section></main>`;
write("index.html", layout({title:`${brand} | 수원 용인 성남 출장마사지 홈타이 지역 안내`, description:`${brand} 수원, 용인, 성남 출장마사지와 홈타이 지역 전문 안내. 구별, 동별 가능 지역, 요금표, 마사지 종류, 예약 전 확인사항 정리.`, url:"/", body:home}));

for (const [city,districts] of Object.entries(areas)) {
  const districtLinks = Object.keys(districts).map(d=>`<a class="area-card card" href="${areaUrl(city,d)}"><h3>${d}</h3><p>${areaSummary(city,d)}</p></a>`).join("");
  write(`area/${city}/index.html`, layout({title:`${city} 출장마사지 홈타이 | ${brand}`, description:`${city} 출장마사지와 홈타이 가능 구역, 구별 상세 지역, 요금표, 예약 전 확인사항 안내.`, url:areaUrl(city), body:`<main><section class="section"><p class="eyebrow">1차 지역</p><h1>${city} 출장마사지 홈타이</h1><p class="lead">${areaSummary(city)} 아래에서 구 단위 2차 지역을 선택하세요.</p></section><section class="section"><h2>${city} 구 선택</h2><div class="grid-3">${districtLinks}</div></section></main>`}));
  for (const [district,dongs] of Object.entries(districts)) {
    const dongLinks = dongs.map(dong=>`<a class="dong-link" href="${areaUrl(city,district,dong)}"><strong>${dong}</strong></a>`).join("");
    write(`area/${city}/${district}/index.html`, layout({title:`${city} ${district} 출장마사지 홈타이 | ${brand}`, description:`${city} ${district} 출장마사지와 홈타이 가능 동별 지역, 코스 요금, 예약 전 확인사항 안내.`, url:areaUrl(city,district), body:`<main><section class="section"><p class="eyebrow">2차 지역</p><h1>${city} ${district} 출장마사지 홈타이</h1><p class="lead">${areaSummary(city,district)} 아래에서 세부 동을 선택하세요.</p></section><section class="section"><h2>${district} 동 선택</h2><div class="link-grid">${dongLinks}</div></section><section class="section"><h2>${district} 코스 및 요금</h2><div class="grid-4">${priceCards()}</div></section></main>`}));
    for (const dong of dongs) {
      const info = `<section class="section"><div class="grid-2"><article class="card"><h2>공지사항</h2><p>${dong} 예약은 시간대와 이동 배정 상황에 따라 달라집니다. 상담 전 주소, 원하는 시간, 희망 코스를 정리하면 안내가 빠릅니다.</p></article><article class="card"><h2>업체소개</h2><p>${brand}는 ${city} ${district} ${dong} 주변의 홈타이와 출장마사지 상담 가능 흐름을 지역 기준으로 정리합니다.</p></article><article class="card"><h2>관리사정보</h2><p>관리사 경력, 가능 코스, 배정 시간은 업체별 상황에 따라 달라지므로 상담 단계에서 확인합니다.</p></article><article class="card"><h2>주의사항</h2><p>부적절하거나 위법한 요청은 안내 대상에서 제외되며, 예약 전 코스 범위와 결제 기준을 먼저 확인합니다.</p></article></div></section>`;
      const body = `<main><section class="section"><p class="eyebrow">3차 지역</p><h1>${city} ${district} ${dong} 출장마사지 홈타이</h1><p class="lead">${areaSummary(city,district,dong)} 전화 상담으로 가능 시간, 요금, 코스 범위, 이동 조건을 확인하세요.</p><div class="hero-actions"><a class="primary-btn" href="${tel}">전화예약</a><a class="outline-btn" href="/#price">요금표 보기</a></div></section><section class="section"><h2>${dong} 코스 및 요금</h2><div class="grid-4">${priceCards()}</div></section>${shops(dong)}${info}</main>`;
      write(`area/${city}/${district}/${dong}/index.html`, layout({title:`${city} ${district} ${dong} 출장마사지 홈타이 | ${brand}`, description:`${city} ${district} ${dong} 출장마사지와 홈타이 예약 가능 시간, 요금표, 추천 업체, 관리사 정보, 주의사항 안내.`, url:areaUrl(city,district,dong), body}));
    }
  }
}

const urls = ["/", ...Object.entries(areas).flatMap(([city,districts])=>[areaUrl(city), ...Object.entries(districts).flatMap(([district,dongs])=>[areaUrl(city,district), ...dongs.map(dong=>areaUrl(city,district,dong))])])];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url=>`<url><loc>${siteUrl}${url}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${url==="/"?"1.0":"0.7"}</priority></url>`).join("")}</urlset>`);
write("robots.txt", `User-agent: Googlebot\nAllow: /\n\nUser-agent: NaverBot\nAllow: /\n\nUser-agent: Yeti\nAllow: /\n\nUser-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
write("rss.xml", `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${brand}</title><link>${siteUrl}/</link><description>수원 용인 성남 출장마사지 홈타이 지역 안내</description><language>ko-KR</language>${urls.slice(0,80).map(url=>`<item><title>${brand} ${decodeURIComponent(url)}</title><link>${siteUrl}${url}</link><guid>${siteUrl}${url}</guid></item>`).join("")}</channel></rss>`);
write("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#050505"/><path d="M14 17h10v13h16V17h10v30H40V36H24v11H14z" fill="#ff7a1a"/><path d="M14 52h36" stroke="#ff9b3d" stroke-width="4" stroke-linecap="round"/></svg>`);

