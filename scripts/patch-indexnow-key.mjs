import { writeFileSync } from "node:fs";

// IndexNow 인증 키. 발행 도메인 루트에 {key}.txt 파일로 노출되어야
// Bing / Naver / Yandex 등 IndexNow 참여 검색엔진이 통보를 신뢰합니다.
// tools/indexnow.py 의 KEY 값과 반드시 동일해야 합니다.
export const INDEXNOW_KEY = "81e1629645e4ec6815d888e8983046fb";

writeFileSync(`out/${INDEXNOW_KEY}.txt`, INDEXNOW_KEY, "utf8");
