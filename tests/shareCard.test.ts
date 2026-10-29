import { afterEach, describe, expect, it, vi } from "vitest";
import {
  prShareCard,
  wrapLines,
  shareFileName,
  shareOrDownload,
} from "../src/lib/shareCard";

const fakeDocument = (clicked: string[]) => ({
  createElement: () => ({
    href: "",
    download: "",
    click() {
      clicked.push(this.download);
    },
    remove() {},
  }),
  body: { append() {} },
});

afterEach(() => vi.unstubAllGlobals());

describe("share cards", () => {
  it("shareOrDownload falls back to download", async () => {
    const clicked: string[] = [];
    vi.stubGlobal("navigator", {});
    vi.stubGlobal("document", fakeDocument(clicked));
    const blob = new Blob(["png"], { type: "image/png" });
    await expect(shareOrDownload(blob, "charett-sunday.png")).resolves.toBe(
      "downloaded",
    );
    expect(clicked).toEqual(["charett-sunday.png"]);
  });

  it("uses the share sheet when files can be shared", async () => {
    const shared: unknown[] = [];
    vi.stubGlobal("navigator", {
      canShare: () => true,
      share: async (data: unknown) => void shared.push(data),
    });
    const blob = new Blob(["png"], { type: "image/png" });
    await expect(shareOrDownload(blob, "card.png")).resolves.toBe("shared");
    expect(shared).toHaveLength(1);
  });

  it("downloads when the share sheet fails for another reason", async () => {
    const clicked: string[] = [];
    vi.stubGlobal("navigator", {
      canShare: () => true,
      share: async () => {
        throw new Error("NotAllowedError");
      },
    });
    vi.stubGlobal("document", fakeDocument(clicked));
    const blob = new Blob(["png"], { type: "image/png" });
    await expect(shareOrDownload(blob, "card.png")).resolves.toBe("downloaded");
  });

  it("names files safely", () => {
    expect(shareFileName("The art of a simple Sunday")).toBe(
      "charett-the-art-of-a-simple-sunday.png",
    );
    expect(shareFileName("  ")).toBe("charett.png");
  });
});

describe("PR share card", () => {
  it("states both weights with their unit", () => {
    expect(prShareCard("Bench press", 100, 105, "kg")).toEqual({
      title: "Bench press: 105 kg",
      subtitle: "Up from 100 kg. Logged with CHARETT.",
      kind: "pr",
    });
    expect(prShareCard("Squat", 100, 105, "lb").subtitle).toMatch(/ lb\./);
  });
});

describe("share card text", () => {
  const ctx = { measureText: (t: string) => ({ width: t.length * 10 }) };
  it("breaks a word wider than the card", () => {
    const lines = wrapLines(ctx, "Supercalifragilistic", 80, 5);
    expect(lines.every((l) => l.length <= 8)).toBe(true);
    expect(lines.join("")).toBe("Supercalifragilistic");
  });
  it("ends a cut-off text with an ellipsis", () => {
    const lines = wrapLines(ctx, "one two three four five six", 80, 2);
    expect(lines).toHaveLength(2);
    expect(lines[1].endsWith("…")).toBe(true);
  });
});
