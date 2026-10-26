import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { clothingStyles, seedPosts, topics } from "../src/lib/data";
import { topicPhoto } from "../src/lib/editorial";

const photos: { slug: string }[] = JSON.parse(
  fs.readFileSync("scripts/photos.json", "utf8"),
);

describe("editorial photography", () => {
  it.each(photos.map((p) => p.slug))(
    "photo-%s is bundled and light",
    (slug) => {
      const file = `public/assets/photo-${slug}.jpg`;
      expect(fs.existsSync(file)).toBe(true);
      expect(fs.statSync(file).size).toBeLessThanOrEqual(92160);
    },
  );
  it("credits every photo", () => {
    const credits = fs.readFileSync("docs/ASSET_CREDITS.md", "utf8");
    for (const p of photos) expect(credits).toContain(`photo-${p.slug}.jpg`);
  });
});

describe("photos the app builds at runtime", () => {
  const keys = [
    ...topics.map((t) => topicPhoto(t.id)),
    ...clothingStyles.map((s) => `photo-style-${s.id}`),
    ...seedPosts.map((p) => p.image).filter((k) => k.startsWith("photo-")),
  ];
  it.each([...new Set(keys)])("%s exists", (key) =>
    expect(fs.existsSync(`public/assets/${key}.jpg`)).toBe(true),
  );
});
