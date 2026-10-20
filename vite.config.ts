import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The preview gateway forwards its public Host header to Vite.
// Keep host checks enabled and allow only the known ChatGPT gateways.
const previewHosts = ["chatgpt.com", ".codex-cloud-environments.chatgpt.com"];

export default defineConfig({
  plugins: [react()],
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
