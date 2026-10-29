import { describe, expect, it } from "vitest";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { build } from "vite";

// The launch build (VITE_DEMO=false) must carry no demo-only copy at all.
describe("launch build", () => {
  it("drops every demo, fictional and simulated line", async () => {
    const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "charett-launch-"));
    process.env.VITE_DEMO = "false";
    try {
      await build({ logLevel: "silent", build: { outDir, emptyOutDir: true } });
    } finally {
      delete process.env.VITE_DEMO;
    }
    const js = fs
      .readdirSync(path.join(outDir, "assets"))
      .filter((f) => f.endsWith(".js"))
      .map((f) => fs.readFileSync(path.join(outDir, "assets", f), "utf8"))
      .join("\n")
      // Internal identifiers, not copy: the storage key and service status.
      .replaceAll("charett-demo-v1", "")
      .replaceAll(/status:"simulated"/g, "")
      // React's own dev-tools hook, not app copy.
      .replaceAll("Simulated error coming from DevTools", "");
    const found = [
      ...js.matchAll(/[^"`]{0,40}\b(fictional|demo|simulat\w*)\b[^"`]{0,40}/gi),
    ].map((m) => m[0]);
    expect(found).toEqual([]);
  }, 120000);
});
