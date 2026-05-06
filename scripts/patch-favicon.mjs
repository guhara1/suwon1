import { writeFileSync } from "node:fs";

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#050505"/>
  <circle cx="32" cy="32" r="8" fill="#ff7a1a"/>
  <circle cx="18" cy="18" r="6" fill="#ff9b3d"/>
  <circle cx="46" cy="18" r="6" fill="#ff9b3d"/>
  <circle cx="18" cy="46" r="6" fill="#ff9b3d"/>
  <circle cx="46" cy="46" r="6" fill="#ff9b3d"/>
  <path d="M23 22l6 6M41 22l-6 6M23 42l6-6M41 42l-6-6" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
  <path d="M32 11v7M32 46v7M11 32h7M46 32h7" stroke="#ff7a1a" stroke-width="4" stroke-linecap="round"/>
</svg>`;

writeFileSync("out/favicon.svg", favicon, "utf8");
