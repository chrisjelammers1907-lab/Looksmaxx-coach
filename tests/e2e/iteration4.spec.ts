import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const open = async (page: Page) => {
  await page.goto("/");
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
};

const go = async (page: Page, path: string) => {
  await page.evaluate((next) => {
    history.pushState(null, "", next);
    dispatchEvent(new PopStateEvent("popstate"));
  }, path);
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await expect(page.locator("h1")).toBeVisible();
};

test("the framed site fits small phones, tablets and desktop with visible side gutters", async ({
  page,
}, info) => {
  test.setTimeout(90000);
  await open(page);
  const widths = info.project.name === "mobile" ? [320, 390] : [768, 1440];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/categories",
      "/coach",
      "/plan",
      "/messages",
      "/profile",
      "/about",
      ...[
        "skincare",
        "clothing",
        "hair",
        "gym",
        "grooming",
        "smile",
        "fragrance",
        "photos",
      ].map((id) => `/topics/${id}`),
    ]) {
      await go(page, route);
      await expect
        .poll(
          () =>
            page.evaluate(
              () => document.documentElement.scrollWidth <= innerWidth,
            ),
          `${route} at ${width}px`,
        )
        .toBe(true);
      const shell = await page.locator(".site-shell").boundingBox();
      expect(shell, `${route} frame`).not.toBeNull();
      expect(shell!.x).toBeGreaterThanOrEqual(10);
      expect(shell!.x + shell!.width).toBeLessThanOrEqual(width - 10);
      expect(shell!.width).toBeLessThanOrEqual(1280);
    }
  }
});

test("category images navigate and Photos/Reels keep Following independent", async ({
  page,
}) => {
  await open(page);
  const rail = page.getByRole("navigation", {
    name: "Browse categories",
    exact: true,
  });
  await expect(rail.getByRole("link")).toHaveCount(8);
  await rail.locator('a[href="/topics/hair"]').click();
  await expect(page).toHaveURL(/\/topics\/hair$/);
  await go(page, "/");
  await expect(
    page.getByRole("tab", { name: "Photos", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".feed-grid video")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "A moment in motion", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Three details, one mood", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "Following", exact: true }).click();
  await expect(page.locator(".feed-grid .post-card")).toHaveCount(0);
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  await expect(
    page.getByRole("tab", { name: "Following", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".feed-grid .post-card")).toHaveCount(0);
  await page.getByRole("tab", { name: "For You", exact: true }).click();
  await expect(page.locator(".feed-grid .post-card")).toHaveCount(2);
  await expect(page.locator(".feed-grid video")).toHaveCount(1);
  const reel = page.locator(".post-card").filter({
    has: page.getByRole("heading", {
      name: "A moment in motion",
      exact: true,
    }),
  });
  await reel.getByRole("button", { name: "Follow", exact: true }).click();
  await page.getByRole("tab", { name: "Following", exact: true }).click();
  await expect(page.locator(".feed-grid .post-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "A moment in motion", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Photos", exact: true }).click();
  await expect(
    page.getByRole("tab", { name: "Following", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".feed-grid .post-card")).toHaveCount(2);
  await expect(page.locator(".feed-grid video")).toHaveCount(0);
  const photo = page.locator(".post-card").filter({
    has: page.getByRole("heading", {
      name: "The art of a simple Sunday",
      exact: true,
    }),
  });
  const picture = await photo.locator(".post-media").boundingBox();
  const caption = await photo.locator(".post-caption").boundingBox();
  expect(picture).not.toBeNull();
  expect(caption).not.toBeNull();
  // Photo captions sit below the image, Instagram-style; reels keep overlays.
  expect(caption!.y).toBeGreaterThanOrEqual(picture!.y + picture!.height);
  await expect(photo.locator(".post-media .post-caption")).toHaveCount(0);
  await expect(photo.locator(".post-likes")).toHaveText("24 likes");
  const like = photo.getByRole("button", {
    name: "Like The art of a simple Sunday",
    exact: true,
  });
  await like.click();
  await expect(like).toHaveAttribute("aria-pressed", "true");
  const save = photo.getByRole("button", {
    name: "Save The art of a simple Sunday privately",
    exact: true,
  });
  await save.click();
  await expect(save).toHaveAttribute("aria-pressed", "true");
});

test("photo reels have accessible slideshow controls and keep their chosen sound", async ({
  page,
}, info) => {
  await open(page);
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  const card = page.locator(".post-card").filter({
    has: page.getByRole("heading", {
      name: "Three details, one mood",
      exact: true,
    }),
  });
  const slideshow = card.locator(".slideshow-media");
  const counter = card.locator(".slide-controls").getByRole("status");
  await expect(counter).toHaveText("1 / 3");
  await card
    .getByRole("button", { name: "Play sound After hours", exact: true })
    .click();
  const audio = card.locator("audio");
  await expect
    .poll(() => audio.evaluate((node: HTMLAudioElement) => node.currentTime))
    .toBeGreaterThan(0.1);
  await card
    .getByRole("button", {
      name: "Next photo in Three details, one mood",
      exact: true,
    })
    .click();
  await expect(counter).toHaveText("2 / 3");
  await expect
    .poll(() => audio.evaluate((node: HTMLAudioElement) => node.paused))
    .toBe(false);
  await slideshow.focus();
  await page.keyboard.press("ArrowRight");
  await expect(counter).toHaveText("3 / 3");
  await page.keyboard.press("ArrowLeft");
  await expect(counter).toHaveText("2 / 3");
  if (info.project.name === "mobile") {
    await slideshow.scrollIntoViewIfNeeded();
    const box = (await slideshow.boundingBox())!;
    const x = box.x + box.width * 0.7;
    const y = Math.max(100, box.y + box.height * 0.35);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - 90, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(counter).toHaveText("3 / 3");
    await cdp.detach();
  }
  await card
    .getByRole("button", { name: "Pause sound After hours", exact: true })
    .click();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((violation) => ({
      id: violation.id,
      targets: violation.nodes.map((node) => node.target),
    })),
  ).toEqual([]);
});

test("a new photo reel can be previewed, shared locally, changed to Photos, and kept private after upload", async ({
  page,
}) => {
  await open(page);
  await go(page, "/profile");
  await page.getByLabel("Account visibility").selectOption("public");
  await go(page, "/");
  await page
    .getByRole("button", { name: "Create a post", exact: true })
    .click();
  await page
    .getByLabel("Post title (optional)")
    .fill("A fictional photo story");
  await page
    .getByLabel("Caption", { exact: true })
    .fill("Two editorial examples for my fictional demo reel.");
  await page
    .getByRole("dialog")
    .getByRole("combobox", { name: "Post format", exact: true })
    .selectOption("reel");
  await page.getByLabel("Second slideshow photo").selectOption("tailoring");
  await page.getByLabel("Audience", { exact: true }).selectOption("public");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await expect(
    page.getByRole("dialog").locator(".slide-controls").getByRole("status"),
  ).toHaveText("1 / 2");
  await page
    .getByRole("button", { name: "Publish demo post", exact: true })
    .click();
  const path = new URL(page.url()).pathname;
  await expect(
    page.getByRole("heading", { name: "A fictional photo story", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .locator(".post-media img")
        .evaluate((node: HTMLImageElement) => [
          node.naturalWidth,
          node.naturalHeight,
        ]),
    )
    .toEqual([1080, 1920]);
  await go(page, "/");
  await expect(
    page.getByRole("heading", { name: "A fictional photo story", exact: true }),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A fictional photo story", exact: true }),
  ).toBeVisible();
  await go(page, path);
  await page.getByRole("button", { name: "Edit post", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("combobox", { name: "Post format", exact: true })
    .selectOption("photo");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page
    .getByRole("button", { name: "Publish demo post", exact: true })
    .click();
  await go(page, "/");
  await expect(
    page.getByRole("heading", { name: "A fictional photo story", exact: true }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A fictional photo story", exact: true }),
  ).toHaveCount(0);
  await go(page, path);
  await page.getByRole("button", { name: "Edit post", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("combobox", { name: "Post format", exact: true })
    .selectOption("reel");
  await page
    .getByLabel("Add a private test photo or video")
    .setInputFiles("public/assets/hair.jpg");
  await expect(page.getByAltText("Private feed photo preview")).toBeVisible();
  await expect(page.getByLabel("Second slideshow photo")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Preview audience & content" }),
  ).toBeDisabled();
  await page.getByLabel("Audience", { exact: true }).selectOption("private");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page
    .getByRole("button", { name: "Save private post", exact: true })
    .click();
  await expect(page.locator(".slide-controls")).toHaveCount(0);
  await expect(
    page.locator('[data-media-origin="private-upload"] img'),
  ).toBeVisible();
  await go(page, "/");
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "A fictional photo story", exact: true }),
  ).toHaveCount(0);
});
