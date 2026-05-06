import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const google = '<meta name="google-site-verification" content="MU_vE-O28ixg9Dcxc3NG_yDEMbtaCnBohs289fRl8P8">';
const naver = '<meta name="naver-site-verification" content="537a1fa066ed34eec29ee5b969e97f4f8bc67874">';

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

for (const file of walk(outDir)) {
  if (!file.endsWith(".html")) continue;
  let html = readFileSync(file, "utf8");

  html = html.replace(/<meta name="google-site-verification" content="[^"]*"\s*\/?>(\s*)/g, "");
  html = html.replace(/<meta name="naver-site-verification" content="[^"]*"\s*\/?>(\s*)/g, "");
  html = html.replace("</head>", `${google}${naver}</head>`);

  writeFileSync(file, html, "utf8");
}
