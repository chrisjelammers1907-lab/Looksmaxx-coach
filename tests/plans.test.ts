import { describe, expect, it } from "vitest";
import { plans } from "../src/lib/plans";

describe("membership copy", () => {
  it("compares what you get, not stickers, themes or badges", () => {
    for (const plan of plans)
      for (const feature of plan.features)
        expect(feature).not.toMatch(/sticker|theme|badge/i);
  });
  it("still names the extras honestly, in one quiet line", () => {
    const signature = plans.find((p) => p.id === "signature")!;
    expect(signature.extras).toMatch(/chat theme/);
    expect(signature.extras).toMatch(/badge/);
  });
});
