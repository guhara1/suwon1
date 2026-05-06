import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out/area";
const brand = "홈타이허브";
const phone = "0508-202-4683";
const tel = "tel:05082024683";

const extraCss = `.local-intro{border-top:1px solid #1f1f1f}.local-intro-box{border:1px solid #2b2b2b;border-radius:14px;background:#101010;padding:24px}.local-intro-box p{color:#d4d4d4;line-height:1.85;font-size:17px;margin:0}.detail-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.detail-card{border:1px solid #2b2b2b;border-radius:14px;background:#101010;padding:22px}.detail-card h2{font-size:26px;margin:0 0 12px;color:#ff7a1a}.detail-card p,.detail-card li{color:#d2d2d2;line-height:1.75;font-size:16px}.detail-card ul{margin:12px 0 0;padding-left:18px}.faq-list{display:grid;grid-template-columns:1fr;gap:10px}.faq-item{border:1px solid #2b2b2b;border-radius:12px;background:#101010;padding:18px}.faq-item h3{margin:0 0 8px;color:#ff7a1a;font-size:19px}.faq-item p{margin:0;color:#d2d2d2;line-height:1.7}@media(max-width:900px){.detail-grid{grid-template-columns:1fr}.local-intro-box{padding:20px}.local-intro-box p{font-size:16px}}`;

const districtTraits = {
  "장안구": ["주거지와 오래된 상권이 함께 있어 저녁 시간대 상담이 많은 편", "북수원 생활권 이동이 많아 주소 확인이 중요"],
  "권선구": ["호매실과 권선동, 세류동처럼 생활권 폭이 넓은 편", "서수원 이동 동선에 따라 배정 시간이 달라질 수 있음"],
  "팔달구": ["수원역과 인계동 중심 상권 접근성이 좋은 편", "숙소와 업무지구 문의가 섞여 시간대별 안내가 다름"],
  "영통구": ["영통, 망포, 광교 생활권 문의가 많은 편", "아파트 단지와 업무지구가 섞여 출입 동선 확인이 필요"],
  "처인구": ["용인 안에서도 이동 거리가 넓어 시간 조율이 중요", "읍면 지역은 외곽 이동 조건을 먼저 확인해야 함"],
  "기흥구": ["신갈, 구갈, 동백, 보정 생활권이 나뉘는 지역", "도로 흐름과 퇴근 시간대 영향을 많이 받음"],
  "수지구": ["죽전, 풍덕천, 상현, 성복 문의가 꾸준한 주거 생활권", "분당·광교 인접 이동 여부를 상담 때 확인하는 편"],
  "수정구": ["위례와 태평, 신흥 생활권이 함께 있는 지역", "성남 구도심과 신도시 권역의 방문 조건이 다름"],
  "중원구": ["모란과 상대원, 은행동 생활권 문의가 나뉘는 편", "상권과 주거지 동선이 섞여 시간 확인이 필요"],
  "분당구": ["분당, 판교, 정자, 서현 생활권 수요가 뚜렷한 지역", "업무지구와 주거지가 혼재해 예약 시간 조율이 중요"],
};

const dongProfiles = [
  ["숙소 이용자와 주거지 문의가 함께 들어오는 편", "정확한 건물명과 출입 가능 시간을 미리 알려주는 것이 좋습니다"],
  ["퇴근 이후 피로 관리 문의가 많은 생활권", "야간 상담은 가능 시간과 이동 조건을 먼저 맞춰야 합니다"],
  ["상권 접근성이 있어 빠른 상담을 원하는 이용자가 많은 편", "희망 코스와 도착 가능 시간을 같이 확인하면 좋습니다"],
  ["아파트 단지와 주거지가 중심인 조용한 생활권", "주소 전달 방식과 주차 가능 여부를 미리 확인하는 편이 안전합니다"],
  ["인근 업무지구와 이동 수요가 섞이는 지역", "코스 시간보다 실제 도착 가능 시간을 먼저 확인해야 합니다"],
  ["외곽 이동 조건이 발생할 수 있는 구간", "추가 이동비 여부와 가능 업체 범위를 상담 단계에서 확인합니다"],
];

const noticeVariants = [
  ["예약 시간은 고정값이 아니라 상담 시점의 배정 상황에 따라 달라집니다", ["도착 예상 시간 확인", "총 금액과 코스 시간 재확인", "주소와 연락 가능 시간 전달"]],
  ["심야 시간대는 이동 동선이 줄어들 수 있어 빠른 확인이 필요합니다", ["심야 가능 업체 여부 확인", "후불 안내와 추가 조건 확인", "변경 가능 시간대 사전 조율"]],
  ["숙소나 오피스텔 이용 시 출입 방식에 따라 안내가 달라질 수 있습니다", ["건물명과 입실 가능 시간 확인", "주차 또는 정차 가능 여부 확인", "관리 범위와 코스명 확인"]],
  ["주말과 공휴일에는 상담량이 늘어 배정 시간이 길어질 수 있습니다", ["희망 시간보다 여유 있게 문의", "가능 코스 우선순위 전달", "취소·변경 기준 확인"]],
];

const companyVariants = [
  "지역별 방문 가능 흐름을 정리해 이용자가 예약 전 비교할 수 있도록 만든 안내 플랫폼입니다.",
  "특정 업체를 과장하기보다 상담 전에 확인해야 할 시간, 요금, 코스 범위를 먼저 보여주는 방식으로 구성합니다.",
  "도시와 구, 동 단위로 페이지를 나눠 생활권별 예약 흐름을 쉽게 살펴볼 수 있도록 정리합니다.",
  "전화 상담 전 필요한 기본 정보를 줄여 이용자가 더 빠르게 가능 여부를 확인하도록 돕습니다.",
];

const extraVariants = [
  ["방문 장소의 출입 조건에 따라 실제 도착 안내가 달라질 수 있습니다", ["엘리베이터 이용 가능 여부", "건물 입구 안내 방식", "예약자 연락 가능 시간"]],
  ["도로 상황과 주차 조건은 지역마다 달라 상담 때 함께 확인하는 것이 좋습니다", ["정차 가능 지점", "근처 큰 길 기준 위치", "도착 전 연락 방식"]],
  ["희망 코스가 길수록 가능 업체가 제한될 수 있으므로 사전 확인이 필요합니다", ["장시간 코스 가능 여부", "관리 범위 확인", "추가 요금 조건"]],
  ["처음 이용하는 경우에는 코스명보다 실제 제공 범위를 먼저 비교하는 것이 좋습니다", ["코스 설명 확인", "후불 조건 확인", "상담 내용 기록"]],
];

const managerVariants = [
  ["관리사 배정은 지역과 시간대, 코스에 따라 달라집니다", ["가능 코스 우선 확인", "희망 스타일 전달", "배정 가능 시간 확인"]],
  ["경력이나 스타일 안내는 업체별로 제공 범위가 다를 수 있습니다", ["초보 이용자 기본 안내", "강도나 관리 방향 전달", "장시간 코스 상담 권장"]],
  ["원하는 관리 방향이 있다면 예약 확정 전 상담원에게 먼저 전달하는 것이 좋습니다", ["오일/건식 선호도", "집중 관리 부위", "불편한 요청 제외"]],
  ["배정 가능한 관리사는 실시간 상황에 따라 바뀔 수 있습니다", ["현재 가능 인원 확인", "도착 예상 시간 확인", "코스 변경 가능 여부"]],
];

const cautionVariants = [
  ["부적절하거나 위법한 요청은 상담 및 안내 대상에서 제외됩니다", ["위법 요청 안내 불가", "코스 범위 사전 확인", "상담 내용과 다른 요청 제한"]],
  ["이용 전 총 금액과 코스 범위를 확인해야 오해를 줄일 수 있습니다", ["추가비 여부 확인", "결제 방식 확인", "예약 확정 조건 확인"]],
  ["과도한 음주 상태이거나 현장 상황이 맞지 않으면 이용이 제한될 수 있습니다", ["안전한 이용 환경 확인", "연락 가능 상태 유지", "무리한 요청 금지"]],
  ["상담 중 안내된 조건과 현장 요청이 다르면 진행이 중단될 수 있습니다", ["사전 안내 내용 확인", "주소 정확히 전달", "변경 요청은 미리 상담"]],
];

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
  const start = normalized.split("out/area/")[1] || "";
  const parts = start.split("/");
  if (parts.length < 4 || parts.at(-1) !== "index.html") return null;
  return parts.slice(0, -1).map(decode);
}

function hashText(text) {
  return [...text].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
}

function pick(list, seed, offset = 0) {
  return list[(seed + offset) % list.length];
}

function localIntro(city, district, dong, seed) {
  const [dongTone, dongTip] = pick(dongProfiles, seed);
  const [districtTone, districtTip] = districtTraits[district] || ["생활권별 이동 흐름이 나뉘는 지역", "상담 단계에서 위치 확인이 중요"];
  const opening = [
    `${city} ${district} ${dong} 출장마사지는 현재 위치와 상담 시간에 따라 가능 업체가 달라질 수 있습니다.`,
    `${dong}에서 홈타이나 출장마사지를 알아본다면 먼저 생활권과 이동 가능 범위를 확인하는 것이 좋습니다.`,
    `${city} ${district} ${dong} 지역은 예약 전 코스와 이동 조건을 함께 확인해야 안내가 정확해집니다.`,
    `${dong} 주변 출장마사지 문의는 시간대와 장소 조건에 따라 상담 흐름이 달라질 수 있습니다.`,
  ];
  const middle = [
    `${district}는 ${districtTone}이라는 특징이 있고, ${dong}은 ${dongTone}입니다.`,
    `${district} 권역은 ${districtTip}는 점을 고려해야 하며, ${dong}에서는 ${dongTip}.`,
    `${dong} 이용자는 ${dongTone}이라 상담 전 위치와 희망 시간을 함께 알려주는 편이 좋습니다.`,
    `${district} 안에서도 ${dong}은 주변 동선에 따라 도착 시간이 달라질 수 있어 ${dongTip}.`,
  ];
  const eeat = [
    `${brand}는 지역명만 나열하지 않고 도시, 구, 동 단위로 예약 전에 확인할 정보를 나눠 정리합니다.`,
    `${brand} 운영 기준은 요금표, 코스 범위, 이동 조건, 주의사항을 먼저 확인하도록 돕는 것입니다.`,
    `${brand}는 과장된 업체 소개보다 이용자가 상담 전에 알아야 할 조건을 중심으로 안내합니다.`,
    `${brand}는 ${city} 지역의 생활권 차이를 반영해 동별 안내 문구와 확인 항목을 구성합니다.`,
  ];
  const closing = [
    "표기 요금은 참고 기준이며 실제 가능 여부는 상담 시점의 배정 상황과 이동 조건에 따라 달라질 수 있습니다.",
    "예약 전에는 총 금액, 방문 가능 시간, 코스 범위, 후불 조건을 전화로 확인하는 것을 권장합니다.",
    "부적절하거나 위법한 요청은 안내 대상에서 제외되며, 건전한 방문 케어 기준 안에서만 정보를 제공합니다.",
    "처음 이용하는 경우에는 코스명보다 실제 관리 범위와 결제 기준을 먼저 확인하는 것이 안전합니다.",
  ];
  return `${pick(opening, seed)} ${pick(middle, seed, 1)} ${pick(eeat, seed, 2)} ${pick(closing, seed, 3)} ${pick(middle, seed, 4)} ${pick(closing, seed, 5)}`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function card(title, text, items) {
  return `<article class="detail-card"><h2>${title}</h2><p>${text}</p>${list(items)}</article>`;
}

function faq(city, district, dong, seed) {
  const arrivalWord = pick(["도착 예상 시간", "배정 가능 시간", "상담 가능한 시간대", "방문 가능 흐름"], seed);
  const costWord = pick(["총 금액", "코스별 기준 금액", "후불 조건", "추가 이동비 여부"], seed, 1);
  const locationWord = pick(["건물명", "정확한 주소", "근처 큰 길 기준 위치", "출입 가능 시간"], seed, 2);
  return `<section class="section" data-third-faq="true"><h2>${dong} 자주 묻는 질문</h2><div class="faq-list"><article class="faq-item"><h3>1. ${dong}에서 당일 상담이 가능한가요?</h3><p>${arrivalWord}은 실시간 배정 상황에 따라 달라집니다. ${locationWord}와 희망 코스를 알려주면 상담원이 가능 범위를 확인합니다.</p></article><article class="faq-item"><h3>2. ${district} 안에서도 동마다 요금이 달라지나요?</h3><p>기본 요금표는 참고 기준이지만 ${costWord}는 이동 거리와 시간대에 따라 달라질 수 있습니다. 예약 전 최종 안내를 확인하세요.</p></article><article class="faq-item"><h3>3. ${dong} 홈타이 상담 전에 무엇을 준비해야 하나요?</h3><p>희망 시간, 코스 종류, 현재 위치, 연락 가능한 번호를 정리해두면 안내가 빨라집니다. 처음 이용한다면 코스 범위를 함께 물어보는 것이 좋습니다.</p></article><article class="faq-item"><h3>4. 관리사 배정은 선택할 수 있나요?</h3><p>업체 상황에 따라 가능한 안내 범위가 다릅니다. 원하는 관리 방향이 있다면 예약 전에 전달하고 가능 여부를 확인하는 방식으로 진행합니다.</p></article><article class="faq-item"><h3>5. ${city} ${dong} 이용 시 주의할 점은?</h3><p>부적절하거나 위법한 요청은 안내되지 않습니다. 총 금액, 방문 가능 시간, 코스 범위, 결제 방식을 먼저 확인한 뒤 예약하는 것이 안전합니다.</p></article></div></section>`;
}

function makeContent(city, district, dong) {
  const seed = hashText(`${city}${district}${dong}`);
  const place = `${city} ${district} ${dong}`;
  const [noticeText, noticeItems] = pick(noticeVariants, seed);
  const [extraText, extraItems] = pick(extraVariants, seed, 1);
  const [managerText, managerItems] = pick(managerVariants, seed, 2);
  const [cautionText, cautionItems] = pick(cautionVariants, seed, 3);
  const companyText = pick(companyVariants, seed, 4);
  const districtNote = districtTraits[district]?.[0] || "생활권별 이동 흐름이 다른 지역";

  return `<section class="section local-intro" data-third-rich="true"><p class="eyebrow">${place} 지역 안내</p><h2>${dong} 출장마사지 소개</h2><div class="local-intro-box"><p>${localIntro(city, district, dong, seed)}</p></div></section><section class="section" data-third-details="true"><div class="detail-grid">${card("공지사항", `${dong} ${noticeText}. ${district}는 ${districtNote}이라 상담 전 위치 확인이 중요합니다.`, noticeItems)}${card("업체소개", `${brand}는 ${place} 기준으로 ${companyText} ${dong} 주변 이용자는 상담 전 요금과 가능 시간을 먼저 비교할 수 있습니다.`, ["동 단위 지역 안내", "상담 전 확인 항목 정리", "건전한 방문 케어 기준"])}${card("기타사항", `${extraText}. ${dong}은 주변 여건에 따라 도착 안내가 달라질 수 있으므로 예약 확정 전에 세부 조건을 확인하세요.`, extraItems)}${card("관리사정보", `${managerText}. ${place} 예약에서는 코스 종류와 희망 시간을 먼저 전달하면 배정 가능 여부를 더 명확히 확인할 수 있습니다.`, managerItems)}${card("주의사항", `${cautionText}. ${brand}는 건전한 이용 기준을 벗어나는 상담을 안내하지 않습니다.`, cautionItems)}<article class="detail-card"><h2>전화예약</h2><p>${place} 상담은 전화로 가장 빠르게 확인할 수 있습니다. 현재 가능 지역, ${pick(["도착 예상 시간", "이동 조건", "코스별 요금", "후불 안내"], seed, 5)}를 상담 시점 기준으로 확인하세요.</p><p><a class="primary-btn" href="${tel}">${phone}</a></p></article></div></section>${faq(city, district, dong, seed)}`;
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
  html = html.replace(/<section class="section local-intro" data-third-rich="true">[\s\S]*?<\/section><section class="section" data-third-details="true">[\s\S]*?<\/section><section class="section" data-third-faq="true">[\s\S]*?<\/section>/, "");
  html = html.replace("</main>", `${makeContent(city, district, dong)}</main>`);
  writeFileSync(file, html, "utf8");
}
