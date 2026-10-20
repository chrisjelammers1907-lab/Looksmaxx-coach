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
  const response = await globalThis.fetch(`${base}/`);
  expect(response.status).toBe(200);
  const received = Buffer.from(await response.arrayBuffer());
  const expected = fs.readFileSync("demo/CHARETT-demo.html");
  const digest = (data) => createHash("sha256").update(data).digest("hex");
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
    await expect(page.locator("h1")).toHaveText("Your everyday, elevated.");
    await page.evaluate(() => globalThis.document.fonts.ready);
    await page.screenshot({ path: `${output}/${name}.png`, fullPage: true });
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
      await page.locator(`main a[href="#/topics/${topic}"]`).click();
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
      await nav.getByRole("link", { name: "Home", exact: true }).click();
    }
    await page.locator('main a[href="#/topics/clothing"]').click();
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
    await nav.getByRole("link", { name: "Explore", exact: true }).click();
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
    await page
      .getByRole("link", { name: "Meet your personal coach", exact: true })
      .click();
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
    await nav.getByRole("link", { name: /profile/i }).click();
    await expect(page.locator("h1")).toBeVisible();
    expect(errors).toEqual([]);
    evidence.results.push({
      viewport: name,
      eightTopics: true,
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
