import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { build } from "vite";
import { fileURLToPath } from "node:url";
import console from "node:console";
import react from "@vitejs/plugin-react";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "charett-offline-build-"));
const assetDir = path.join(root, "public/assets");
const assets = {};
for (const name of fs.readdirSync(assetDir)) {
  const ext = path.extname(name);
  const type = {
    ".svg": "image/svg+xml",
    ".jpg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".mp3": "audio/mpeg",
  }[ext];
  if (!type) continue;
  assets[path.basename(name, ext)] =
    `data:${type};base64,${fs.readFileSync(path.join(assetDir, name)).toString("base64")}`;
}
await build({
  root,
  configFile: false,
  base: "./",
  plugins: [
    {
      name: "charett-offline-export",
      enforce: "pre",
      transform(code, id) {
        if (id === path.join(root, "src/main.tsx"))
          return code.replaceAll("BrowserRouter", "HashRouter");
        if (id === path.join(root, "src/lib/domain.ts")) {
          const start = code.indexOf("export const asset =");
          const end = code.indexOf("export const topicName");
          if (start < 0 || end < start)
            throw new Error("Cannot locate the asset helper safely.");
          return (
            code.slice(0, start) +
            `const offlineAssets: Record<string,string> = ${JSON.stringify(assets)};\nexport const asset = (key:string) => offlineAssets[key] ?? offlineAssets.skin;\n` +
            code.slice(end)
          );
        }
        // The About turn frames live in a subfolder; inline the phone set.
        if (id === path.join(root, "src/components/TurnSequence.tsx")) {
          const start = code.indexOf("const framePath =");
          const end = code.indexOf("/**", start);
          if (start < 0 || end < start)
            throw new Error("Cannot locate the frame helper safely.");
          const dir = path.join(assetDir, "about-turn/s");
          const frames = fs
            .readdirSync(dir)
            .sort()
            .map(
              (name) =>
                `data:image/webp;base64,${fs.readFileSync(path.join(dir, name)).toString("base64")}`,
            );
          return (
            code.slice(0, start) +
            `const offlineFrames: string[] = ${JSON.stringify(frames)};\nconst framePath = (_size: "s" | "l", index: number) => offlineFrames[index];\n\n` +
            code.slice(end)
          );
        }
      },
    },
    react(),
  ],
  build: {
    outDir,
    emptyOutDir: false,
    assetsInlineLimit: Number.MAX_SAFE_INTEGER,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});
let html = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
let scripts = 0,
  styles = 0;
html = html.replace(
  /<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g,
  (_match, src) => {
    scripts++;
    const js = fs
      .readFileSync(path.join(outDir, src), "utf8")
      .replaceAll("</script", "<\\/script");
    return `<script type="module">${js}</script>`;
  },
);
html = html.replace(
  /<link\b(?=[^>]*rel="stylesheet")[^>]*\bhref="([^"]+)"[^>]*>/g,
  (_match, href) => {
    styles++;
    return `<style>${fs.readFileSync(path.join(outDir, href), "utf8").replaceAll("</style", "<\\/style")}</style>`;
  },
);
html = html.replace(
  'href="./favicon.svg"',
  `href="data:image/svg+xml;base64,${fs.readFileSync(path.join(root, "public/favicon.svg")).toString("base64")}"`,
);
if (scripts !== 1 || styles !== 1)
  throw new Error(
    `Unexpected build shape: ${scripts} scripts, ${styles} styles`,
  );
const notices = fs
  .readdirSync(path.join(root, "public/licenses"))
  .map(
    (name) =>
      `${name}\n${fs.readFileSync(path.join(root, "public/licenses", name), "utf8")}`,
  )
  .join("\n\n");
html = html.replace(
  "</html>",
  `<!--\nCHARETT standalone local demo. Fictional data only. AI coach, shopping and social features are simulated.\nStock portraits: Creative Tim Paper Kit 2 (MIT), source photographer filenames documented in the project.\nOriginal AI editorial assets: campaign, ritual, tailoring; fictional inspiration, never customers or results.\nOriginal synthesized demo instrumentals: Golden hour, After hours, Soft focus; no third-party songs.\n${notices.replaceAll("--", "—")}\n-->\n</html>`,
);
const output = path.join(root, "demo/CHARETT-demo.html");
fs.writeFileSync(output, html);
console.log(
  JSON.stringify({
    output,
    bytes: fs.statSync(output).size,
    embeddedMediaAssets: Object.keys(assets).length,
    router: "HashRouter (standalone export only)",
  }),
);
