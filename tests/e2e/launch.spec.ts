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
