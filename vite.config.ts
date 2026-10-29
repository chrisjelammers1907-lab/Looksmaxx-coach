import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Static hosts serve 404.html for a path they don't know, such as a shared
// /topics/skincare link; it is the app itself, so the router takes over.
function spaFallback(): Plugin {
  let outDir = "dist";
  return {
    name: "spa-fallback",
    apply: "build",
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(resolve(outDir, "index.html"), resolve(outDir, "404.html"));
    },
  };
}

// The preview gateway forwards its public Host header to Vite.
// Keep host checks enabled and allow only the known ChatGPT gateways.
const previewHosts = ["chatgpt.com", ".codex-cloud-environments.chatgpt.com"];

export default defineConfig({
  plugins: [react(), spaFallback()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    allowedHosts: previewHosts,
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    allowedHosts: previewHosts,
  },
});
