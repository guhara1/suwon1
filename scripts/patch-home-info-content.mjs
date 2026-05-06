import { readFileSync, writeFileSync, existsSync } from "node:fs";

const file = "out/index.html";
if (!existsSync(file)) process.exit(0);

let html = readFileSync(file, "utf8");

if (html.includes('id="what-is-mobile-massage"')) {
  process.exit(0);
}

const css = `.info-section{border-top:1px solid #1f1f1f}.info-body{border:1px solid #2b2b2b;border-radius:14px;background:#101010;padding:26px}.info-body p{color:#d4d4d4;line-height:1.85;font-size:17px;margin:0 0 16px}.info-body p:last-child{margin-bottom:0}.info-checks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.info-check{border:1px solid #342819;border-radius:12px;background:#0c0c0c;padding:16px}.info-check strong{display:block;color:#ff7a1a;margin-bottom:8px}.info-check span{color:#cfcfcf;line-height:1.6;font-size:15px}@media(max-width:900px){.info-checks{grid-template-columns:1fr}.info-body{padding:20px}.info-body p{font-size:16px}}`;

const section = `<section class="section info-section" id="what-is-mobile-massage"><p class="eyebrow">홈타이허브 운영팀 안내</p><h2>출장마사지란?</h2><div class="info-body"><p>출장마사지는 이용자가 매장으로 이동하지 않고, 상담을 통해 정한 장소와 시간에 맞춰 관리사가 방문하는 형태의 마사지 안내 서비스입니다. 홈타이허브에서는 수원, 용인, 성남처럼 생활권이 넓고 이동 시간이 지역마다 다른 곳에서 이용자가 먼저 확인해야 할 정보를 정리하는 데 초점을 둡니다. 같은 수원이라도 인계동, 영통동, 광교동의 이동 흐름이 다르고, 용인은 처인구와 수지구의 거리가 크며, 성남은 분당·판교·위례·모란 생활권이 나뉘기 때문에 예약 가능 시간과 배정 조건이 달라질 수 있습니다.</p><p>출장마사지를 알아볼 때는 단순히 가격만 비교하기보다 코스 시간, 이동 가능 범위, 추가 비용 여부, 결제 방식, 관리 범위, 상담 가능 시간, 주의사항을 함께 확인하는 것이 중요합니다. 특히 늦은 시간이나 외곽 지역은 이동 조건에 따라 안내가 달라질 수 있으므로, 상담 전 현재 위치와 희망 시간, 원하는 코스를 분명히 전달하면 불필요한 오해를 줄일 수 있습니다. 홈타이허브는 지역명만 반복하는 페이지가 아니라 도시, 구, 동 기준으로 실제 이용자가 확인해야 할 흐름을 나눠 보여주려는 목적의 지역 전문 안내 페이지입니다.</p><p>또한 출장마사지와 홈타이는 건전한 방문 케어 안내 기준 안에서 이용되어야 합니다. 부적절하거나 위법한 요청은 안내 대상에서 제외되며, 이용 전 코스 범위와 결제 기준을 확인하는 것이 좋습니다. 홈타이허브 운영팀은 수원·용인·성남 지역의 생활권, 이동 거리, 상담 전 확인사항을 기준으로 정보를 정리하며, 최종 가능 여부는 상담 시점의 배정 상황에 따라 달라질 수 있음을 명확히 안내합니다.</p><div class="info-checks"><div class="info-check"><strong>지역 기준</strong><span>도시, 구, 동 단위로 이동 가능 범위와 상담 흐름을 구분합니다.</span></div><div class="info-check"><strong>요금 기준</strong><span>표기 금액은 참고용이며 시간대, 거리, 코스에 따라 상담 중 확인합니다.</span></div><div class="info-check"><strong>안전 기준</strong><span>부적절한 요청은 제외하고 예약 전 이용 조건을 먼저 확인하도록 안내합니다.</span></div></div></div></section>`;

html = html.replace("</style>", `${css}</style>`);
html = html.replace(/<\/section><\/main>/, `</section>${section}</main>`);

writeFileSync(file, html, "utf8");
