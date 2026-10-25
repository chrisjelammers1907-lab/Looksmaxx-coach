import { afterEach, describe, expect, it, vi } from "vitest";
import { shareFileName, shareOrDownload } from "../src/lib/shareCard";

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
