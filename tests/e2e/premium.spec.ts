import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const open = async (page: Page, path = "/") => {
  await page.goto(path);
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
};

const noAxeViolations = async (page: Page) => {
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

test("feed tabs are centred and style/topic chips filter posts", async ({
  page,
}) => {
  await open(page);
  const header = (await page.locator(".feed-header").boundingBox())!;
  const tabs = (await page.locator(".feed-tabs [role=tablist]").boundingBox())!;
  expect(
    Math.abs(tabs.x + tabs.width / 2 - (header.x + header.width / 2)),
  ).toBeLessThan(6);

  const chips = page.locator(".chip-scroller");
  const all = chips.getByRole("button", { name: "All", exact: true });
  await expect(all).toHaveAttribute("aria-pressed", "true");
  await chips.getByRole("button", { name: "Old money", exact: true }).click();
  await expect(all).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator(".feed-grid .post-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", {
      name: "The art of a simple Sunday",
      exact: true,
    }),
  ).toBeVisible();
  await chips.getByRole("button", { name: "Skincare", exact: true }).click();
  await expect(page.locator(".feed-grid .post-card")).toHaveCount(0);
  await all.click();
  await expect(page.locator(".feed-grid .post-card").first()).toBeVisible();
  expect(await page.locator(".feed-grid .post-card").count()).toBeGreaterThan(
    5,
  );
  await noAxeViolations(page);
});

test("photo posts show a caption below and tappable shop-the-look tags", async ({
  page,
}) => {
  await open(page);
  const post = page.locator(".post-card").filter({
    has: page.getByRole("heading", {
      name: "The art of a simple Sunday",
      exact: true,
    }),
  });
  const caption = post.locator(".post-body .post-caption");
  await expect(caption).toContainText("mira.edits");
  await expect(caption).toContainText("#linen");
  await expect(post.locator(".shop-row")).toContainText("3 items · €177.00");

  await post
    .getByRole("button", {
      name: "Show products in The art of a simple Sunday",
      exact: true,
    })
    .click();
  const tags = post.locator(".product-tag");
  await expect(tags).toHaveCount(3);
  const media = (await post.locator(".post-media").boundingBox())!;
  for (const box of await tags.evaluateAll((nodes) =>
    nodes.map((n) => n.getBoundingClientRect().toJSON()),
  )) {
    expect(box.x).toBeGreaterThanOrEqual(media.x);
    expect(box.y).toBeGreaterThanOrEqual(media.y);
    expect(box.x + box.width).toBeLessThanOrEqual(media.x + media.width + 1);
    expect(box.y + box.height).toBeLessThanOrEqual(media.y + media.height + 1);
  }
  await tags.first().click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("heading", { name: "Shop the look", exact: true }),
  ).toBeVisible();
  await expect(dialog.locator(".breakdown-row")).toHaveCount(3);
  await page.keyboard.press("Escape");

  // Reels keep their TikTok-style caption over the video.
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  const reel = page.locator(".post-card").filter({
    has: page.getByRole("heading", { name: "A moment in motion", exact: true }),
  });
  await expect(reel.locator(".post-media .post-caption")).toHaveCount(1);
});

test("mobile bottom bar floats inside the safe area with consistent icons", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile", "Mobile navigation only");
  await open(page);
  const nav = page.getByRole("navigation", { name: "Mobile navigation" });
  const box = (await nav.boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.x).toBeGreaterThanOrEqual(10);
  expect(viewport.width - (box.x + box.width)).toBeGreaterThanOrEqual(10);
  expect(viewport.height - (box.y + box.height)).toBeGreaterThanOrEqual(8);
  expect(
    await nav.evaluate((n) => parseFloat(getComputedStyle(n).borderRadius)),
  ).toBeGreaterThanOrEqual(20);
  const icons = await nav
    .locator("svg")
    .evaluateAll((nodes) =>
      nodes.map((n) => [
        Math.round(n.getBoundingClientRect().width),
        Math.round(n.getBoundingClientRect().height),
      ]),
    );
  expect(icons).toHaveLength(5);
  expect(new Set(icons.map((i) => i.join("x"))).size).toBe(1);
  const links = nav.getByRole("link");
  const tops = await links.evaluateAll((nodes) =>
    nodes.map((n) => Math.round(n.getBoundingClientRect().top)),
  );
  expect(new Set(tops).size).toBe(1);
  await expect(links.first()).toHaveClass(/active/);
  await links.nth(4).click();
  await expect(page).toHaveURL(/\/messages$/);
  await expect(links.nth(4)).toHaveClass(/active/);
});

test("direct messages and coach use a pill composer and chat bubbles", async ({
  page,
}) => {
  await open(page, "/messages?to=noor");
  const message = page.getByLabel("Message", { exact: true });
  await message.fill("Enter sends this note.");
  await message.press("Enter");
  const outgoing = page.locator(".message-bubble.outgoing").last();
  await expect(outgoing).toContainText("Enter sends this note.");
  await expect(message).toHaveValue("");
  const thread = (await page.locator(".thread").boundingBox())!;
  const bubble = (await outgoing.boundingBox())!;
  // Outgoing bubbles align to the right edge of the thread.
  expect(thread.x + thread.width - (bubble.x + bubble.width)).toBeLessThan(40);
  await noAxeViolations(page);

  await page.goto("/coach");
  await page
    .locator(".prompt-chips")
    .getByRole("button", { name: "Review my weekly plan" })
    .click();
  await expect(page.locator(".chat-message.you .chat-bubble")).toContainText(
    "Review my weekly plan",
  );
  await expect(page.locator(".chat-message.coach .chat-bubble")).toHaveCount(1);
  await noAxeViolations(page);
});

test("stories open in a viewer and your own story can be added", async ({
  page,
}) => {
  await open(page);
  const row = page.getByRole("region", { name: "Stories" });
  await row.getByRole("button", { name: "View story from mira.edits" }).click();
  const viewer = page.getByRole("dialog", { name: "Story" });
  await expect(viewer.getByRole("status")).toContainText("Story 1 of 2");
  await viewer.getByRole("button", { name: "Next story" }).click();
  await expect(viewer.getByRole("status")).toContainText("Story 2 of 2");
  await viewer.getByRole("button", { name: "Close story" }).click();
  await expect(viewer).toHaveCount(0);
  await expect(
    row.getByRole("button", { name: "View story from mira.edits" }),
  ).toHaveClass(/seen/);

  await row.getByRole("button", { name: "Add to your story" }).click();
  const composer = page.getByRole("dialog", { name: "Add to your story" });
  await composer.getByLabel("Text").fill("Leg day, done.");
  await composer.getByRole("button", { name: "Share to story" }).click();
  await row.getByRole("button", { name: "View your story" }).click();
  await expect(
    page.getByRole("dialog", { name: "Story" }).getByRole("status"),
  ).toContainText("Leg day, done.");
});

test("long captions expand in place and push Shop the look down", async ({
  page,
}, info) => {
  await open(page);
  const post = page.locator(".post-card").filter({
    has: page.getByRole("heading", {
      name: "My slower morning ritual",
      exact: true,
    }),
  });
  const shop = post.locator(".shop-row");
  // Measure inside the card: clicking may scroll the page.
  const offset = async () =>
    (await shop.boundingBox())!.y - (await post.boundingBox())!.y;
  const before = await offset();
  await post
    .getByRole("button", {
      name: "Read more of My slower morning ritual",
    })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(post.locator(".post-body .post-caption")).toContainText(
    "not treatment advice",
  );
  // On wide columns the full text can still fit in two lines.
  if (info.project.name === "mobile")
    expect(await offset()).toBeGreaterThan(before);
  else expect(await offset()).toBeGreaterThanOrEqual(before);
});

test("plan shows one day with routine and task filters", async ({ page }) => {
  await open(page, "/plan");
  await expect(page.getByText("Your next check-in")).toHaveCount(0);
  await expect(page.getByText(/tasks done/)).toBeVisible();
  const filters = page.getByLabel("Show in plan");
  await filters.getByRole("button", { name: "Tasks", exact: true }).click();
  await expect(page.locator(".routine-card")).toHaveCount(0);
  await expect(page.locator(".goal-row").first()).toBeVisible();
  await filters.getByRole("button", { name: "Routines", exact: true }).click();
  await expect(page.locator(".goal-row")).toHaveCount(0);
  await expect(page.locator(".routine-card").first()).toBeVisible();
  await noAxeViolations(page);
});
