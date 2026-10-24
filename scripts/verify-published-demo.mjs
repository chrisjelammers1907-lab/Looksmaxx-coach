import { chromium, expect } from "@playwright/test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import process from "node:process";
import { Buffer } from "node:buffer";
import { URL } from "node:url";
import console from "node:console";

const url = process.env.CHARETT_PUBLIC_URL;
const fixture = process.env.CHARETT_VERIFY_LOCAL_FIXTURE === "1";
if (
  !url ||
  (!/^https:\/\//.test(url) &&
    !(fixture && /^http:\/\/127\.0\.0\.1:\d+\//.test(url)))
)
  throw new Error("The deployment must supply its actual HTTPS URL.");
const base = url.replace(/\/$/, "");
const output = "/tmp/charett-publication";
fs.mkdirSync(output, { recursive: true });
const evidence = {
  url,
  authentication: "none; fresh browser contexts",
  localFixture: fixture,
  publicBrowserVerified: false,
  results: [],
};
const chrome = ["/usr/bin/google-chrome", "/usr/bin/chromium"].find(
  fs.existsSync,
);
const browser = await chromium.launch({
  ...(chrome ? { executablePath: chrome } : { channel: "chrome" }),
  args: ["--no-sandbox"],
});
try {
  const expected = fs.readFileSync("demo/CHARETT-demo.html");
  const digest = (data) => createHash("sha256").update(data).digest("hex");
  let received, status;
  for (let attempt = 0; attempt < 24; attempt++) {
    const response = await globalThis.fetch(`${base}/`, {
      signal: globalThis.AbortSignal.timeout(15000),
    });
    status = response.status;
    received = Buffer.from(await response.arrayBuffer());
    if (status === 200 && digest(received) === digest(expected)) break;
    if (fixture || ![200, 404, 502, 503].includes(status)) break;
    await new Promise((resolve) => globalThis.setTimeout(resolve, 5000));
  }
  expect(status).toBe(200);
  expect(digest(received)).toBe(digest(expected));
  evidence.htmlSha256 = digest(received);
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: name === "mobile",
      hasTouch: name === "mobile",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (res) => {
      if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`);
    });
    page.on("requestfailed", (request) =>
      errors.push(`${request.failure()?.errorText} ${request.url()}`),
    );
    expect(
      (await page.goto(`${base}/`, { waitUntil: "networkidle" })).status(),
    ).toBe(200);
    await page.getByRole("button", { name: "Skip for now" }).click();
    await expect(page.locator("h1")).toHaveText("Your daily edit.");
    await page.evaluate(() => globalThis.document.fonts.ready);
    await expect(
      page.getByRole("tab", { name: "For You", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      page.locator(".feed-grid .post-media img").first(),
    ).toBeVisible();
    await expect(
      page.getByRole("tab", { name: "Photos", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".feed-grid video")).toHaveCount(0);
    await page.getByRole("tab", { name: "Following", exact: true }).click();
    await expect(page.locator(".feed-grid .post-card")).toHaveCount(0);
    await page.getByRole("tab", { name: "Reels", exact: true }).click();
    await expect(
      page.getByRole("tab", { name: "Following", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(".feed-grid .post-card")).toHaveCount(0);
    await page.getByRole("tab", { name: "For You", exact: true }).click();
    await expect(page.locator(".feed-grid video")).toHaveCount(1);
    const clipCard = page
      .locator(".post-card")
      .filter({
        has: page.getByRole("heading", {
          name: "A moment in motion",
          exact: true,
        }),
      });
    const clip = clipCard.locator("video");
    await clipCard
      .getByRole("button", { name: "Play sound Golden hour", exact: true })
      .click();
    await expect
      .poll(() => clip.evaluate((node) => node.currentTime))
      .toBeGreaterThan(0.15);
    const videoSound = clipCard.locator("audio");
    await expect
      .poll(() => videoSound.evaluate((node) => node.currentTime))
      .toBeGreaterThan(0.15);
    await clipCard
      .getByRole("button", { name: "Pause sound Golden hour", exact: true })
      .click();
    await expect
      .poll(() => videoSound.evaluate((node) => node.paused))
      .toBe(true);
    const slides = page
      .locator(".post-card")
      .filter({
        has: page.getByRole("heading", {
          name: "Three details, one mood",
          exact: true,
        }),
      });
    await slides
      .getByRole("button", {
        name: "Next photo in Three details, one mood",
        exact: true,
      })
      .click();
    await expect(
      slides.locator(".slide-controls").getByRole("status"),
    ).toHaveText("2 / 3");
    await slides.locator(".slideshow-media").focus();
    await page.keyboard.press("ArrowRight");
    await expect(
      slides.locator(".slide-controls").getByRole("status"),
    ).toHaveText("3 / 3");
    await page.getByRole("tab", { name: "Photos", exact: true }).click();
    await expect(page.locator(".feed-grid video")).toHaveCount(0);
    await page
      .getByRole("button", { name: "Play sound Soft focus", exact: true })
      .click();
    const photoSound = page.locator(".post-sound audio").first();
    await expect
      .poll(() => photoSound.evaluate((node) => node.currentTime))
      .toBeGreaterThan(0.15);
    await page
      .getByRole("button", { name: "Pause sound Soft focus", exact: true })
      .click();
    const shell = await page.locator(".site-shell").boundingBox();
    expect(shell.x).toBeGreaterThanOrEqual(10);
    expect(shell.x + shell.width).toBeLessThanOrEqual(width - 10);
    expect(shell.width).toBeLessThanOrEqual(1280);
    expect(
      await page.evaluate(
        () =>
          globalThis.document.documentElement.scrollWidth >
          globalThis.innerWidth,
      ),
    ).toBe(false);
    await page.evaluate(() => globalThis.scrollTo(0, 0));
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: false });
    const nav = page.getByRole("navigation", {
      name: name === "mobile" ? "Mobile navigation" : "Main navigation",
      exact: true,
    });
    for (const topic of [
      "skincare",
      "clothing",
      "hair",
      "gym",
      "grooming",
      "smile",
      "fragrance",
      "photos",
    ]) {
      await nav.getByRole("link", { name: "Categories", exact: true }).click();
      await page.locator(`main a[href="#/topics/${topic}"]`).first().click();
      expect(new URL(page.url()).hash).toBe(`#/topics/${topic}`);
      await expect(page.locator("h1")).toBeVisible();
      expect((await page.reload()).status()).toBe(200);
      await expect(page.locator("h1")).toBeVisible();
      expect(
        await page.evaluate(
          () =>
            globalThis.document.documentElement.scrollWidth >
            globalThis.innerWidth,
        ),
      ).toBe(false);
      await page
        .locator(".topic-links")
        .getByRole("link", { name: /Beginner’s guide/ })
        .click();
      await expect(
        page.getByRole("heading", { name: "Where this guide comes from" }),
      ).toBeVisible();
      expect((await page.reload()).status()).toBe(200);
      await nav.getByRole("link", { name: "Home", exact: true }).click();
    }
    await nav.getByRole("link", { name: "Categories", exact: true }).click();
    await page.locator('main a[href="#/topics/clothing"]').first().click();
    await page.getByRole("button", { name: /Dark casual/ }).click();
    await page.getByRole("tab", { name: "My wardrobe", exact: true }).click();
    await page.getByRole("button", { name: "Add item" }).click();
    await page
      .getByLabel("Item name", { exact: true })
      .fill("Fictional publication test item");
    await page.getByRole("button", { name: "Save item" }).click();
    await expect(
      page.getByRole("heading", { name: "Fictional publication test item" }),
    ).toBeVisible();
    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await page
      .getByRole("button", { name: "Create a post", exact: true })
      .click();
    await page
      .getByLabel("Caption", { exact: true })
      .fill("A fictional publication sound test");
    await page.getByRole("button", { name: "Add sound", exact: true }).click();
    await page
      .getByRole("button", { name: "Preview After hours", exact: true })
      .click();
    const soundPreview = page.locator(".sound-picker audio");
    await expect
      .poll(() => soundPreview.evaluate((node) => node.currentTime))
      .toBeGreaterThan(0.15);
    await page
      .getByRole("button", { name: "Use After hours", exact: true })
      .click();
    await page.getByLabel("Added sound volume", { exact: true }).fill("0.35");
    await page
      .getByRole("button", { name: "Preview audience & content" })
      .click();
    await page
      .getByRole("button", { name: "Save private post", exact: true })
      .click();
    await expect(
      page.getByRole("heading", {
        name: "A fictional publication sound test",
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Play sound After hours", exact: true })
      .click();
    const attachedSound = page.locator(".post-sound audio");
    await expect
      .poll(() => attachedSound.evaluate((node) => node.currentTime))
      .toBeGreaterThan(0.15);
    expect(await attachedSound.evaluate((node) => node.volume)).toBeCloseTo(
      0.35,
    );
    await page
      .getByRole("button", { name: "Pause sound After hours", exact: true })
      .click();
    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await page
      .getByRole("link", { name: "The art of a simple Sunday", exact: true })
      .click();
    await page
      .getByLabel("Your comment")
      .fill("Fictional publication test comment");
    await page.getByRole("button", { name: "Post demo comment" }).click();
    await expect(
      page.getByText("Fictional publication test comment", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Share The art of a simple Sunday" })
      .click();
    await page.getByRole("button", { name: "Simulate sharing" }).click();
    await expect(page.locator(".outgoing .linked-card")).toBeVisible();
    await page.locator(".outgoing .linked-card").click();
    await expect(
      page.getByRole("heading", {
        name: "The art of a simple Sunday",
        exact: true,
      }),
    ).toBeVisible();
    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await nav.getByRole("link", { name: "AI Coach", exact: true }).click();
    await expect(page.getByRole("combobox")).toHaveCount(0);
    await page
      .getByLabel("Ask your demo coach")
      .fill("Help me simplify my routine");
    await page.getByRole("button", { name: "Send", exact: true }).click();
    await page.getByRole("button", { name: "Inspect proposed change" }).click();
    await page.getByRole("button", { name: "Apply to my plan" }).click();
    await nav.getByRole("link", { name: /plan/i }).click();
    await expect(
      page.getByText("Spend five minutes reviewing my personal routine", {
        exact: true,
      }),
    ).toBeVisible();
    await page.getByLabel("Open profile and menu").click();
    await page
      .getByRole("navigation", { name: "Profile menu" })
      .getByRole("link", { name: "My profile", exact: true })
      .click();
    await expect(page.getByLabel("Account visibility")).toHaveValue("private");
    await page.getByLabel("Open profile and menu").click();
    await page
      .getByRole("navigation", { name: "Profile menu" })
      .getByRole("link", { name: "About us", exact: true })
      .click();
    await expect(page.locator("h1")).toContainText("A little intention.");
    await expect(page.locator("h1")).toBeVisible();
    expect(errors).toEqual([]);
    evidence.results.push({
      viewport: name,
      eightTopics: true,
      eightGuides: true,
      feedVideo: true,
      separatePhotoAndReelFeeds: true,
      independentFollowingAndFormat: true,
      photoReelSlideshow: true,
      boundedLayout: true,
      photoSound: true,
      videoSound: true,
      soundPreviewAndAttachment: true,
      aboutPage: true,
      optionalCoachTopic: true,
      routeReloads: true,
      wardrobeEdit: true,
      comments: true,
      linkedCardMessaging: true,
      coachPlan: true,
      profileNavigation: true,
      errors,
    });
    await context.close();
  }
  evidence.publicBrowserVerified = !fixture;
} catch (error) {
  evidence.failure = error.message;
  process.exitCode = 1;
} finally {
  await browser.close();
  fs.writeFileSync(
    `${output}/browser-verification.json`,
    JSON.stringify(evidence, null, 2),
  );
  console.log(JSON.stringify(evidence, null, 2));
}
