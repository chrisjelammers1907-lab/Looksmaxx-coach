import { describe, expect, it } from "vitest";
import { extraGuides, guides } from "../src/lib/guides";

const all = { ...guides, ...extraGuides };

describe("guides tell the truth about shortcuts", () => {
  it("covers what people use, with what it does and what it costs", () => {
    const covered = Object.fromEntries(
      Object.entries(all)
        .filter(([, g]) => g.shortcuts?.length)
        .map(([key, g]) => [key, g.shortcuts!.map((s) => s.name)]),
    );
    expect(covered).toMatchObject({
      skincare: expect.arrayContaining([expect.stringMatching(/Isotretinoin/)]),
      colouring: expect.arrayContaining([expect.stringMatching(/Melanotan/)]),
      gym: expect.arrayContaining([
        expect.stringMatching(/Testosterone/),
        expect.stringMatching(/MK-677/),
      ]),
      weight: expect.arrayContaining([
        expect.stringMatching(/GLP-1/),
        expect.stringMatching(/DNP/),
      ]),
      presence: expect.arrayContaining([expect.stringMatching(/anxiety/i)]),
      brows: expect.arrayContaining([expect.stringMatching(/Bimatoprost/)]),
      hair: expect.arrayContaining([expect.stringMatching(/Finasteride/)]),
    });
    for (const g of Object.values(all))
      for (const s of g.shortcuts ?? []) {
        expect(s.does.length).toBeGreaterThan(30);
        expect(s.cost.length).toBeGreaterThan(30);
      }
  });

  it("never gives doses, schedules or where to buy", () => {
    const text = Object.values(all)
      .flatMap((g) => g.shortcuts ?? [])
      .map((s) => `${s.name} ${s.does} ${s.cost}`)
      .join(" ");
    expect(text).not.toMatch(
      /\d\s?(mg|mcg|µg|iu|ml|units?)\b|per (day|week)|cycle of|inject(ion)? into|buy|source|vendor|india/i,
    );
  });

  it("only lists real failures under 'doesn't work'", () => {
    const skip = Object.values(all)
      .flatMap((g) => g.skip)
      .join(" | ");
    // These work, at a cost; they belong with the shortcuts instead.
    expect(skip).not.toMatch(/tanning injections|tanning pills|miracle/i);
  });
});
