import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("choose, preview, mix, publish and remove a photo sound", async ({
  page,
}) => {
  await page.goto("/explore?compose=new");
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
  await page
    .getByLabel("Caption", { exact: true })
    .fill("A fictional sound and photo example");
  await page.getByRole("button", { name: "Add sound", exact: true }).click();
  await page
    .getByRole("button", { name: "Preview Golden hour", exact: true })
    .click();
  const preview = page.locator(".sound-picker audio");
  await expect
    .poll(() => preview.evaluate((a: HTMLAudioElement) => a.currentTime))
    .toBeGreaterThan(0.15);
  await page
    .getByRole("button", { name: "Use Golden hour", exact: true })
    .click();
  await expect
    .poll(() => preview.evaluate((a: HTMLAudioElement) => a.paused))
    .toBe(true);
  await page.getByLabel("Added sound volume", { exact: true }).fill("0.35");
  const audit = await new AxeBuilder({ page })
    .include(".modal")
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(audit.violations).toEqual([]);
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page
    .getByRole("button", { name: "Save private post", exact: true })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "A fictional sound and photo example",
      exact: true,
    }),
  ).toBeVisible();
  const audio = page.locator(".post-sound audio");
  await expect
    .poll(() => audio.evaluate((a: HTMLAudioElement) => a.paused))
    .toBe(true);
  await page
    .getByRole("button", { name: "Play sound Golden hour", exact: true })
    .click();
  await expect
    .poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime))
    .toBeGreaterThan(0.15);
  expect(await audio.evaluate((a: HTMLAudioElement) => a.volume)).toBeCloseTo(
    0.35,
  );
  await page
    .getByLabel("Sound volume for A fictional sound and photo example")
    .fill("0.2");
  expect(await audio.evaluate((a: HTMLAudioElement) => a.volume)).toBeCloseTo(
    0.2,
  );
  await page
    .getByRole("button", { name: "Pause sound Golden hour", exact: true })
    .click();
  await expect
    .poll(() => audio.evaluate((a: HTMLAudioElement) => a.paused))
    .toBe(true);
  await page.getByRole("button", { name: "Edit post", exact: true }).click();
  await page.getByRole("button", { name: "Remove sound", exact: true }).click();
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page
    .getByRole("button", { name: "Save private post", exact: true })
    .click();
  await expect(page.locator(".post-sound")).toHaveCount(0);
  expect(
    await page.evaluate(() => localStorage.getItem("charett-demo-v1")),
  ).not.toContain("fictional sound and photo");
});

test("video sound follows playback and seeking, with volume mixing", async ({
  page,
}) => {
  await page.goto("/explore?compose=new");
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
  await page
    .getByLabel("Caption", { exact: true })
    .fill("A fictional video mix");
  await page
    .getByLabel("Editorial reference image", { exact: true })
    .selectOption("motion");
  await page.getByRole("button", { name: "Add sound", exact: true }).click();
  await page
    .getByRole("button", { name: "Use After hours", exact: true })
    .click();
  await page.getByLabel("Original video volume", { exact: true }).fill("0.25");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page
    .getByRole("button", { name: "Save private post", exact: true })
    .click();
  const video = page.locator(".post-media video");
  const audio = page.locator(".post-sound audio");
  await page
    .getByRole("button", { name: "Play sound After hours", exact: true })
    .click();
  await expect
    .poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime))
    .toBeGreaterThan(0.15);
  await expect
    .poll(() => video.evaluate((a: HTMLVideoElement) => a.currentTime))
    .toBeGreaterThan(0.15);
  expect(
    await video.evaluate((a: HTMLVideoElement) => [a.muted, a.volume]),
  ).toEqual([false, 0.25]);
  await video.evaluate((a: HTMLVideoElement) => {
    a.currentTime = 2;
  });
  await expect
    .poll(() =>
      page.evaluate(() =>
        Math.abs(
          document.querySelector<HTMLAudioElement>(".post-sound audio")!
            .currentTime -
            document.querySelector<HTMLVideoElement>(".post-media video")!
              .currentTime,
        ),
      ),
    )
    .toBeLessThan(0.5);
  await video.evaluate((a: HTMLVideoElement) => a.pause());
  await expect
    .poll(() => audio.evaluate((a: HTMLAudioElement) => a.paused))
    .toBe(true);
});

test("only one feed sound plays, scrolling and navigation stop it", async ({
  page,
}) => {
  await page.goto("/");
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
  const first = page.locator(".post-sound audio").first();
  const second = page.locator(".post-sound audio").nth(1);
  await page
    .getByRole("button", { name: "Play sound Golden hour", exact: true })
    .click();
  await expect
    .poll(() => first.evaluate((a: HTMLAudioElement) => a.currentTime))
    .toBeGreaterThan(0.1);
  await page
    .getByRole("button", { name: "Play sound Soft focus", exact: true })
    .click();
  await expect
    .poll(() => first.evaluate((a: HTMLAudioElement) => a.paused))
    .toBe(true);
  await expect
    .poll(() => second.evaluate((a: HTMLAudioElement) => a.currentTime))
    .toBeGreaterThan(0.1);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect
    .poll(() => second.evaluate((a: HTMLAudioElement) => a.paused))
    .toBe(true);
  await page
    .getByRole("button", { name: "Play sound Soft focus", exact: true })
    .click();
  await page.evaluate(() => {
    (window as unknown as { soundTestAudio: HTMLAudioElement }).soundTestAudio =
      document.querySelectorAll<HTMLAudioElement>(".post-sound audio")[1];
  });
  const nav = page.getByRole("navigation", {
    name:
      test.info().project.name === "mobile"
        ? "Mobile navigation"
        : "Main navigation",
  });
  await nav.getByRole("link", { name: "Categories", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { soundTestAudio: HTMLAudioElement })
            .soundTestAudio.paused,
      ),
    )
    .toBe(true);
});
