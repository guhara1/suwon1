import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out/area";
const brand = "홈타이허브";
const phone = "0508-202-4683";
const tel = "tel:05082024683";

const extraCss = `.local-intro{border-top:1px solid #1f1f1f}.local-intro-box{border:1px solid #2b2b2b;border-radius:14px;background:#101010;padding:24px}.local-intro-box p{color:#d4d4d4;line-height:1.85;font-size:17px;margin:0}.detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.detail-card{border:1px solid #2b2b2b;border-radius:14px;background:#101010;padding:22px}.detail-card h2{font-size:26px;margin:0 0 12px;color:#ff7a1a}.detail-card p,.detail-card li{color:#d2d2d2;line-height:1.75;font-size:16px}.detail-card ul{margin:12px 0 0;padding-left:18px}.faq-list{display:grid;grid-template-columns:1fr;gap:10px}.faq-item{border:1px solid #2b2b2b;border-radius:12px;background:#101010;padding:18px}.faq-item h3{margin:0 0 8px;color:#ff7a1a;font-size:19px}.faq-item p{margin:0;color:#d2d2d2;line-height:1.7}@media(max-width:900px){.detail-grid{grid-template-columns:1fr}.local-intro-box{padding:20px}.local-intro-box p{font-size:16px}}`;

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function decode(value) {
  try { return decodeURIComponent(value); } catch { return value; }
}

function partsFromFile(file) {
  const normalized = file.replaceAll("\\", "/");
  const marker = "/out/area/";
  const start = normalized.includes(marker) ? normalized.split(marker)[1] : normalized.replace(/^out\/area\//, "");
  const parts = start.split("/");
  if (parts.length < 4 || parts.at(-1) !== "index.html") return null;
  return parts.slice(0, -1).map(decode);
}

function cityTone(city) {
  if (city === "수원") return "수원은 수원역, 인계동, 광교, 영통처럼 상권과 주거지가 함께 발달한 지역이라 시간대별 이동 흐름이 뚜렷합니다.";
  if (city === "용인") return "용인은 처인구, 기흥구, 수지구 사이 이동 거리가 있어 상담 시 위치와 가능 시간을 먼저 확인하는 것이 중요합니다.";
  return "성남은 분당, 판교, 위례, 모란 생활권이 나뉘어 같은 시 안에서도 방문 가능 흐름이 달라질 수 있습니다.";
}

function makeIntro(city, district, dong) {
  return `${city} ${district} ${dong} 출장마사지를 알아볼 때는 지역명만 보고 바로 예약하기보다 현재 위치, 희망 시간, 코스 종류, 이동 가능 범위를 함께 확인하는 것이 좋습니다. ${cityTone(city)} ${dong} 주변도 숙소, 주거지, 상권, 업무지구 이용 흐름에 따라 배정 가능한 시간과 안내 조건이 달라질 수 있습니다. ${brand}는 ${city} ${district} ${dong} 홈타이와 출장마사지 정보를 동 단위로 나누어 정리하고, 이용자가 상담 전에 요금표, 코스 범위, 후불 안내, 관리사 배정 가능 여부, 주의사항을 먼저 확인할 수 있도록 구성했습니다. 표기된 금액은 참고 기준이며 실제 가능 여부는 상담 시점의 업체 배정 상황과 이동 조건에 따라 달라질 수 있습니다. 부적절하거나 위법한 요청은 안내 대상에서 제외되며, 예약 전에는 총 금액과 방문 가능 시간, 코스 범위를 전화로 확인하는 것을 권장합니다.`;
}

function makeContent(city, district, dong) {
  const place = `${city} ${district} ${dong}`;
  return `<section class="section local-intro" data-third-rich="true"><p class="eyebrow">${place} 지역 안내</p><h2>${dong} 출장마사지 소개</h2><div class="local-intro-box"><p>${makeIntro(city, district, dong)}</p></div></section><section class="section" data-third-details="true"><div class="detail-grid"><article class="detail-card"><h2>공지사항</h2><p>${dong} 예약은 시간대, 이동 거리, 업체 배정 상황에 따라 가능 여부가 달라질 수 있습니다. 상담 전 현재 위치와 희망 시간을 알려주면 안내가 더 빠릅니다.</p><ul><li>예약 전 총 금액과 코스 시간 확인</li><li>심야 및 외곽 이동 조건 확인</li><li>방문 주소와 연락 가능 시간 사전 전달</li></ul></article><article class="detail-card"><h2>업체소개</h2><p>${brand}는 ${place} 주변 홈타이와 출장마사지 상담 가능 흐름을 정리하는 지역 전문 안내 플랫폼입니다. 특정 업체를 과장해 노출하기보다 이용 전 확인해야 할 요금, 시간, 코스, 주의사항을 기준으로 정보를 구성합니다.</p><ul><li>도시·구·동 기준 지역 분류</li><li>상담 가능 시간 중심 안내</li><li>건전한 방문 케어 기준 운영</li></ul></article><article class="detail-card"><h2>기타사항</h2><p>${dong} 주변은 도로 상황, 주차 가능 여부, 숙소 또는 주거지 출입 조건에 따라 실제 방문 안내가 달라질 수 있습니다. 예약 확정 전에는 주소 전달 방식과 도착 예상 시간을 함께 확인하는 것이 좋습니다.</p><ul><li>결제 방식은 상담 단계에서 확인</li><li>요청 코스와 실제 제공 범위 비교</li><li>변경 또는 취소 가능 기준 확인</li></ul></article><article class="detail-card"><h2>관리사정보</h2><p>관리사 경력, 성별, 가능 코스, 배정 시간은 업체별 상황에 따라 달라질 수 있습니다. 원하는 관리 스타일이 있다면 상담 시 미리 전달하고, 가능 여부를 확인한 뒤 예약하는 것이 좋습니다.</p><ul><li>코스별 배정 가능 여부 확인</li><li>초보 이용자를 위한 기본 안내</li><li>장시간 코스는 사전 상담 권장</li></ul></article><article class="detail-card"><h2>주의사항</h2><p>부적절하거나 위법한 요청은 안내 대상에서 제외됩니다. 이용 전 코스 범위, 총 금액, 결제 방식, 방문 가능 시간을 명확히 확인해야 하며, 과도한 음주 상태에서는 이용이 제한될 수 있습니다.</p><ul><li>위법·부적절한 요청 안내 불가</li><li>예약 전 코스 범위와 금액 확인</li><li>상담 내용과 다른 요청 시 중단 가능</li></ul></article><article class="detail-card"><h2>전화예약</h2><p>${place} 출장마사지와 홈타이 상담은 전화로 가장 빠르게 확인할 수 있습니다. 현재 가능 지역, 예상 도착 시간, 코스별 요금, 후불 안내를 상담 시점 기준으로 확인하세요.</p><p><a class="primary-btn" href="${tel}">${phone}</a></p></article></div></section><section class="section" data-third-faq="true"><h2>${dong} 자주 묻는 질문</h2><div class="faq-list"><article class="faq-item"><h3>1. ${dong}에서 바로 예약할 수 있나요?</h3><p>현재 시간대와 업체 배정 상황에 따라 달라집니다. 전화 상담으로 위치와 희망 코스를 전달하면 가능 여부를 확인할 수 있습니다.</p></article><article class="faq-item"><h3>2. 출장마사지 요금은 고정인가요?</h3><p>기본 요금표는 참고 기준입니다. 이동 거리, 시간대, 코스 선택, 추가 조건에 따라 상담 중 최종 금액을 확인합니다.</p></article><article class="faq-item"><h3>3. 홈타이와 출장마사지는 어떻게 다른가요?</h3><p>현장 방문형 케어라는 점은 비슷하지만 업체마다 코스명과 운영 기준이 다를 수 있습니다. 예약 전 관리 범위와 시간을 확인하는 것이 좋습니다.</p></article><article class="faq-item"><h3>4. 관리사 정보는 미리 알 수 있나요?</h3><p>가능한 범위 안에서 경력, 코스 가능 여부, 배정 시간을 상담 단계에서 확인합니다. 세부 조건은 업체별 배정 상황에 따라 달라집니다.</p></article><article class="faq-item"><h3>5. 예약 전 꼭 확인할 것은 무엇인가요?</h3><p>총 금액, 코스 시간, 방문 가능 시간, 결제 방식, 주의사항을 확인해야 합니다. 부적절하거나 위법한 요청은 안내되지 않습니다.</p></article></div></section>`;
}

for (const file of walk(outDir)) {
  if (!file.endsWith("index.html")) continue;
  const parts = partsFromFile(file);
  if (!parts || parts.length !== 3) continue;
  const [city, district, dong] = parts;

  let html = readFileSync(file, "utf8");
  if (!html.includes(".local-intro")) {
    html = html.replace("</style>", `${extraCss}</style>`);
  }

  html = html.replace(/<section class="section"><div class="grid-2"><article class="card"><h2>공지사항<\/h2>[\s\S]*?<\/section>/, "");
  html = html.replace("</main>", `${makeContent(city, district, dong)}</main>`);
  writeFileSync(file, html, "utf8");
}
