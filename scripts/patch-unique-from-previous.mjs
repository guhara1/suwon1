import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";

const replacements = [
  ["지역 전문 예약 안내 플랫폼입니다", "수원권 생활권 맞춤 상담 안내 페이지입니다"],
  ["지역 전문 안내 플랫폼입니다", "수원·용인·성남 전용 지역 안내 페이지입니다"],
  ["가능 지역을 도시, 구, 동 기준으로 정리", "상담 흐름을 도시별 생활권과 세부 동선 기준으로 분류"],
  ["도시, 구, 동 기준으로 정리", "도시별 생활권과 세부 동선 기준으로 정리"],
  ["예약 전 요금, 이동 가능 범위, 코스 차이, 상담 시 확인할 내용을 한 번에 살펴볼 수 있습니다", "문의 전에 후불 안내, 예상 이동 시간, 코스별 확인 포인트를 차례대로 점검할 수 있습니다"],
  ["표기 금액은 참고 기준이며 최종 금액은 이동 조건과 코스 선택에 따라 상담 중 확인합니다", "안내된 금액은 기본 기준이고 실제 결제 조건은 거리, 시간대, 선택 코스를 확인한 뒤 상담에서 확정합니다"],
  ["부적절하거나 위법한 요청은 안내하지 않으며, 이용 전 코스 범위와 결제 방식을 확인합니다", "건전한 이용 기준을 벗어난 문의는 제외하며, 진행 전 관리 범위와 후불 조건을 먼저 확인합니다"],
  ["부적절하거나 위법한 요청은 안내 대상에서 제외합니다", "건전한 방문 케어 기준을 벗어난 문의는 상담 범위에서 제외합니다"],
  ["최종 이용 조건은 상담 시점의 지역 배정 상황을 기준으로 확인해 주세요", "최종 안내는 통화 시점의 동선, 시간대, 가능 업체 상황을 기준으로 다시 확인해 주세요"],
  ["전화 상담 기준으로 가능 시간과 코스를 안내합니다", "전화 문의 시 현재 가능한 시간대와 후불 조건을 함께 안내합니다"],
  ["건전한 방문 케어 기준", "홈타이허브의 안전 상담 기준"],
  ["특정 업체를 과장하기보다", "업체를 과도하게 포장하기보다"],
  ["상담 전 확인 항목 정리", "문의 전 점검 항목 구성"],
  ["예약 전 확인사항", "상담 전 체크포인트"],
  ["관리사정보", "관리사 안내"],
  ["업체소개", "안내 기준"],
  ["기타사항", "이용 참고사항"],
];

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(outDir)) {
  if (!file.endsWith(".html") && !file.endsWith(".xml")) continue;
  let text = readFileSync(file, "utf8");
  for (const [from, to] of replacements) {
    text = text.split(from).join(to);
  }
  writeFileSync(file, text, "utf8");
}
