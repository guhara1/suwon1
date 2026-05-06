import { readFileSync, writeFileSync, existsSync } from "node:fs";

const file = "out/index.html";
if (!existsSync(file)) process.exit(0);

let html = readFileSync(file, "utf8");
html = html.replace("홈타이허브 출장마사지 & 홈타이", "홈타이허브 출장마사지 & 후불요금");
writeFileSync(file, html, "utf8");
