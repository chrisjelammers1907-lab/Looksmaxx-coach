// Downloads the editorial photo set listed in scripts/photos.json from
// Pexels (free licence), grades it warm and muted, and keeps each JPG
// under 90 KB at 1080 px wide. Re-run after editing photos.json.
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import console from "node:console";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const photos = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/photos.json"), "utf8"),
);
const tmp = fs.mkdtempSync(
  path.join(fs.realpathSync("/tmp"), "charett-photos-"),
);
const grade = path.join(root, "scripts/grade-photo.py");

for (const p of photos) {
  const out = path.join(root, `public/assets/photo-${p.slug}.jpg`);
  if (fs.existsSync(out)) continue;
  const raw = path.join(tmp, `${p.slug}.jpg`);
  execFileSync("curl", [
    "-sSL",
    "--max-time",
    "60",
    "-o",
    raw,
    `${p.url}?auto=compress&cs=tinysrgb&w=1400`,
  ]);
  execFileSync("python3", [grade, raw, out]);
  console.log(`photo-${p.slug}.jpg`, fs.statSync(out).size);
}

const rows = photos
  .map((p) => `| \`photo-${p.slug}.jpg\` | ${p.alt} | [Pexels](${p.page}) |`)
  .join("\n");
const credits = path.join(root, "docs/ASSET_CREDITS.md");
const marker = "## Editorial photography (round 5)";
let text = fs.readFileSync(credits, "utf8");
if (text.includes(marker))
  text = text.slice(0, text.indexOf(marker)).trimEnd() + "\n";
text += `\n${marker}\n\nReal photographs from Pexels, free to use commercially under the [Pexels licence](https://www.pexels.com/license/). No AI images. Each is resized to 1080 px, given a light warm grade and compressed by \`scripts/fetch-photos.mjs\`.\n\n| File | Subject | Source |\n| --- | --- | --- |\n${rows}\n`;
fs.writeFileSync(credits, text);
