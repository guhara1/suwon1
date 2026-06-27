import { writeFileSync } from "node:fs";

// 네이버 서치어드바이저 HTML 파일 방식 소유확인.
// 발행 도메인 루트에 그대로 노출되어야 합니다.
const fileName = "naver0ad59aeb6d9e87bfc8de63f66ae13e67.html";
const content = "naver-site-verification: naver0ad59aeb6d9e87bfc8de63f66ae13e67.html";

writeFileSync(`out/${fileName}`, content, "utf8");
