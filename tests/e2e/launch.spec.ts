import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const open = async (page: Page, path = "/") => {
  await page.goto(path);
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
};

const go = async (page: Page, path: string) => {
  await page.evaluate((next) => {
    history.pushState(null, "", next);
    dispatchEvent(new PopStateEvent("popstate"));
  }, path);
  await expect(page.locator("h1").first()).toBeAttached();
};

export const noAxeViolations = async (page: Page) => {
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
};

test("no AI tells on key routes", async ({ page }) => {
  await open(page, "/");
  for (const route of [
    "/",
    "/categories",
    "/topics/skincare",
    "/coach",
    "/about",
  ]) {
    await go(page, route);
    await expect(
      page.getByText(/AI editorial|AI fictional|AI fashion/),
    ).toHaveCount(0);
    await expect(page.locator(".empty-mark")).toHaveCount(0);
    await expect(page.locator(".coach-orb")).toHaveCount(0);
    await expect(page.locator("main svg.lucide-sparkles")).toHaveCount(0);
  }
});

test("streaks show a green flame, never an emoji", async ({ page }) => {
  await open(page, "/messages");
  const row = page
    .locator(".conversation-preview", { hasText: "Mira" })
    .first();
  await expect(row.locator(".streak svg")).toBeVisible();
  await expect(page.getByText("🔥")).toHaveCount(0);
  const [fill, token] = await row
    .locator(".streak svg path")
    .first()
    .evaluate((el) => [
      getComputedStyle(el).fill,
      getComputedStyle(document.documentElement)
        .getPropertyValue("--forest-text")
        .trim(),
    ]);
  const toRgb = await page.evaluate((c) => {
    const el = document.createElement("i");
    el.style.color = c;
    document.body.append(el);
    const v = getComputedStyle(el).color;
    el.remove();
    return v;
  }, token);
  expect(fill).toBe(toRgb);
  await go(page, "/plan");
  await expect(page.locator(".plan-progress .streak svg")).toBeVisible();
  await expect(page.getByText("🔥")).toHaveCount(0);
});

test("profile stats have no frame on phones", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await open(page, "/profile/mira");
  const stats = page.getByRole("list", { name: "Profile stats" });
  await expect(stats).toBeVisible();
  expect(
    await stats.evaluate((el) => getComputedStyle(el).borderTopWidth),
  ).toBe("0px");
  expect(
    await stats
      .locator("li")
      .nth(1)
      .evaluate((el) => getComputedStyle(el).borderLeftWidth),
  ).toBe("0px");
});
