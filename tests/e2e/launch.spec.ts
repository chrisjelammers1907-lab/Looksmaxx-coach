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

const allTopics: [string, string][] = [
  ["skincare", "Skincare"],
  ["makeup", "Makeup"],
  ["face", "Face structure"],
  ["colouring", "Colouring"],
  ["brows", "Brows & lashes"],
  ["smile", "Teeth & smile"],
  ["hair", "Hair"],
  ["grooming", "Beard & shaving"],
  ["gym", "Gym & physique"],
  ["nutrition", "Nutrition"],
  ["body", "Body care & nails"],
  ["sleep", "Sleep & recovery"],
  ["presence", "Posture & presence"],
  ["clothing", "Clothing & style"],
  ["fragrance", "Fragrance"],
  ["photos", "Photos & progress"],
];

test("every category page and guide renders", async ({ page }) => {
  test.setTimeout(90000);
  await open(page, "/categories");
  for (const [id, title] of allTopics) {
    await go(page, `/topics/${id}`);
    await expect(page.locator("h1").first()).toHaveText(title);
    await go(page, `/topics/${id}/guide`);
    await expect(
      page.getByRole("heading", { name: "Put it together" }),
    ).toBeVisible();
  }
});

test("face structure covers the four areas honestly", async ({ page }) => {
  await open(page, "/topics/face/guide");
  for (const area of [
    "Eye area",
    "Maxilla & midface",
    "Cheekbones (zygos)",
    "Jaw (mandible) & chin",
  ])
    await expect(page.getByText(area, { exact: true }).first()).toBeVisible();
  await expect(page.locator("main")).not.toContainText(
    /testosterone|steroid|peptide|\bdose|\bmg\b/i,
  );
  await expect(page.locator("main")).toContainText(
    "only via a qualified specialist",
  );
});

test("nutrition has its own category", async ({ page }) => {
  await open(page, "/topics/nutrition");
  await expect(
    page.getByRole("button", { name: "Calorie calculator" }),
  ).toBeVisible();
});

test("topic banners and category rows use real photos", async ({ page }) => {
  await open(page, "/categories");
  await expect(page.locator(".category-row img")).toHaveCount(16);
  for (const id of ["makeup", "face", "sleep", "presence", "body"]) {
    await go(page, `/topics/${id}`);
    await expect(page.locator(".topic-banner img")).toHaveAttribute(
      "src",
      new RegExp(`photo-${id}`),
    );
  }
  await go(page, "/");
  const chips = page.getByLabel("Filter by style or topic");
  await expect(
    chips.getByRole("button", { name: "Makeup", exact: true }),
  ).toBeAttached();
  await expect(
    chips.getByRole("button", { name: "Sleep", exact: true }),
  ).toBeAttached();
});

test("all eight styles switch the page mood", async ({ page }) => {
  test.setTimeout(120000);
  const styles = [
    ["old-money", "Old money"],
    ["dark-casual", "Dark casual"],
    ["minimalist", "Minimalist"],
    ["streetwear", "Streetwear"],
    ["smart-casual", "Smart casual"],
    ["athleisure", "Athleisure"],
    ["preppy", "Preppy"],
    ["bohemian", "Bohemian"],
  ];
  // The page mood fades in; read contrast on the settled colours.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/settings");
  for (const theme of ["Light", "Dark"]) {
    await go(page, "/settings");
    await page.getByRole("radio", { name: theme, exact: true }).check();
    await go(page, "/topics/clothing");
    const switcher = page.getByRole("group", { name: "Clothing style" });
    for (const [id, label] of styles) {
      await switcher.getByRole("button", { name: label }).click();
      await expect(page.locator(".clothing-page")).toHaveClass(
        new RegExp(`clothing-${id}`),
      );
      await expect(page.locator(".clothing-hero img")).toHaveAttribute(
        "src",
        new RegExp(`photo-style-${id}`),
      );
      await noAxeViolations(page);
    }
  }
  await expect
    .poll(() =>
      page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
  await go(page, "/");
  await expect(
    page.getByLabel("Filter by style or topic").getByText("Streetwear"),
  ).toBeVisible();
});

test("intake asks for 18+", async ({ page }) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  const next = dialog.getByRole("button", { name: "Continue" });
  await dialog.getByLabel("What should we call you?").fill("Sam");
  await expect(next).toBeDisabled();
  await dialog.getByRole("checkbox", { name: "I’m 18 or older" }).check();
  await expect(next).toBeEnabled();
  await next.click();
  await dialog.getByRole("button", { name: "Find my starting point" }).click();
  await expect(dialog).toHaveCount(0);
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("charett-demo-v1")!).adult,
    ),
  ).toBe(true);
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  // Skipping stays possible and still lets a visitor browse.
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: "Skip for now" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("h1").first()).toBeAttached();
});

test("a post becomes a share card for Instagram and TikTok", async ({
  page,
}) => {
  await open(page, "/");
  await page
    .getByRole("button", { name: "Share The art of a simple Sunday" })
    .first()
    .click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Share to Instagram / TikTok" })
    .click();
  expect((await download).suggestedFilename()).toMatch(/\.png$/);
});

test("portrait photos never stretch banners on desktop", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "desktop layout");
  await open(page, "/topics/face");
  const banner = await page.locator(".topic-banner").boundingBox();
  expect(banner!.height).toBeLessThanOrEqual(460);
  await go(page, "/topics/face/guide");
  const hero = await page.locator(".guide-hero").boundingBox();
  expect(hero!.height).toBeLessThanOrEqual(560);
});
