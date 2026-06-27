import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const google = '<meta name="google-site-verification" content="MU_vE-O28ixg9Dcxc3NG_yDEMbtaCnBohs289fRl8P8">';
const naver = '<meta name="naver-site-verification" content="4a7f241ca2c4a3756fa788f8683ce25bdf353084">';

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
