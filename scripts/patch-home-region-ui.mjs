import { readFileSync, writeFileSync, existsSync } from "node:fs";

const file = "out/index.html";
if (!existsSync(file)) process.exit(0);

let html = readFileSync(file, "utf8");

const extraCss = `.quick-panel{padding:24px}.quick-panel h2{margin-bottom:16px}.quick-region-grid{display:grid;grid-template-columns:1fr;gap:10px}.quick-region-card{display:grid;grid-template-columns:86px minmax(0,1fr) auto;gap:14px;align-items:center;border:1px solid #2f2f2f;border-radius:12px;background:linear-gradient(180deg,#161616,#101010);padding:16px}.quick-region-badge{width:64px;height:64px;border-radius:14px;background:linear-gradient(135deg,#ff7a1a,#ff4f1f);display:grid;place-items:center;color:#fff;font-size:24px;font-weight:900}.quick-region-card h3{margin:0 0 6px;color:#ff7a1a;font-size:24px}.quick-region-card p{margin:0;color:#d6d6d6;font-size:15px;line-height:1.55}.quick-region-card span{display:block;margin-top:6px;color:#aaa;font-size:13px}.quick-region-action{border:1px solid #3a2a1d;border-radius:999px;padding:9px 12px;color:#fff;background:#0b0b0b;font-size:13px;font-weight:900;white-space:nowrap}@media(max-width:760px){.quick-region-card{grid-template-columns:54px minmax(0,1fr);padding:14px}.quick-region-badge{width:46px;height:46px;border-radius:10px;font-size:18px}.quick-region-action{grid-column:1/-1;text-align:center}.quick-region-card h3{font-size:21px}.quick-region-card p{font-size:14px}}`;

const quickHtml = `<div class="panel quick-panel"><h2>빠른 지역 선택</h2><div class="quick-region-grid"><a class="quick-region-card" href="/area/%EC%88%98%EC%9B%90/"><div class="quick-region-badge">수</div><div><h3>수원 홈타이</h3><p>수원역, 광교, 영통, 인계동 중심으로 가능 시간과 이동 조건을 확인하세요.<span>장안구 · 권선구 · 팔달구 · 영통구</span></p></div><strong class="quick-region-action">지역 보기</strong></a><a class="quick-region-card" href="/area/%EC%9A%A9%EC%9D%B8/"><div class="quick-region-badge">용</div><div><h3>용인 홈타이</h3><p>처인, 기흥, 수지 권역별 이동 거리와 코스 상담 기준을 나눠 안내합니다.<span>처인구 · 기흥구 · 수지구</span></p></div><strong class="quick-region-action">지역 보기</strong></a><a class="quick-region-card" href="/area/%EC%84%B1%EB%82%A8/"><div class="quick-region-badge">성</div><div><h3>성남 홈타이</h3><p>분당, 판교, 위례, 모란 생활권 기준으로 방문 가능 범위를 확인하세요.<span>수정구 · 중원구 · 분당구</span></p></div><strong class="quick-region-action">지역 보기</strong></a></div></div>`;

html = html.replace(/<div class="panel"><h2>빠른 지역 선택<\/h2><div class="grid-3">[\s\S]*?<\/div><\/div><\/section>/, `${quickHtml}</section>`);

if (!html.includes(".quick-panel")) {
  html = html.replace("</style>", `${extraCss}</style>`);
}

writeFileSync(file, html, "utf8");
