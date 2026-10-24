import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const go = async (page: Page, path: string) => {
  if (page.url().startsWith("http://127.0.0.1:5173"))
    await page.evaluate((p) => {
      history.pushState(null, "", p);
      dispatchEvent(new PopStateEvent("popstate"));
    }, path);
  else await page.goto(path);
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
};
test("Home is For You, navigation is explicit, every category has a usable guide", async ({
  page,
}) => {
  await go(page, "/");
  await expect(
    page.getByRole("tab", { name: "For You", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Topic", { exact: true })).toHaveCount(0);
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
    await go(page, "/categories");
    await page.locator(`main a[href="/topics/${topic}"]`).first().click();
    await page
      .locator(".topic-links")
      .getByRole("link", { name: /^Beginner’s guide/ })
      .click();
    await expect(page).toHaveURL(new RegExp(`/topics/${topic}/guide$`));
    await expect(
      page.getByRole("heading", { name: "Where this guide comes from" }),
    ).toBeVisible();
    await page
      .getByRole("navigation", { name: "Guide chapters" })
      .getByRole("button", { name: "References & further reading" })
      .click();
    await expect(page).toHaveURL(new RegExp(`/topics/${topic}/guide$`));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  }
  await go(page, "/post/p1");
  await page
    .getByRole("button", { name: "Save The art of a simple Sunday privately" })
    .click();
  await go(page, "/profile");
  await page.getByLabel("Open profile and menu").click();
  await page
    .getByRole("navigation", { name: "Profile menu" })
    .getByRole("link", { name: "Private saves", exact: true })
    .click();
  await expect(
    page.getByRole("tab", { name: "Private saves", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".post-card")).toHaveCount(1);
  await page.getByLabel("Open profile and menu").click();
  await page
    .getByRole("navigation", { name: "Profile menu" })
    .getByRole("link", { name: "About us" })
    .click();
  await expect(page.locator("h1")).toContainText("A little intention.");
  await expect(
    page.getByText(/This version is an interactive demonstration/),
  ).toBeVisible();
});
test("feed video plays, photo frames have real supported pixel dimensions, topic is optional", async ({
  page,
}) => {
  await go(page, "/");
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  const video = page.locator(".feed-grid video").first();
  await video.scrollIntoViewIfNeeded();
  await video.evaluate((n: HTMLVideoElement) => n.play());
  await expect
    .poll(() => video.evaluate((n: HTMLVideoElement) => n.currentTime))
    .toBeGreaterThan(0.15);
  await video.evaluate((n: HTMLVideoElement) => n.pause());
  await page.getByRole("tab", { name: "Photos", exact: true }).click();
  const picture = page.locator(".feed-grid .post-media img").first();
  await expect(picture).toBeVisible();
  expect(
    await picture.evaluate((n: HTMLImageElement) => [
      n.naturalWidth,
      n.naturalHeight,
    ]),
  ).toEqual([1080, 1350]);
  await go(page, "/explore?compose=new");
  await page.getByLabel("Caption").fill("A fictional caption without a topic");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Save private post" }).click();
  await expect(
    page.getByRole("heading", { name: "A fictional caption without a topic" }),
  ).toBeVisible();
  await expect(page.locator(".post-caption > .eyebrow")).toHaveText(
    "Community",
  );
});
test("private upload is cropped proportionally and cannot be published as public demo media", async ({
  page,
}) => {
  await go(page, "/explore?compose=new");
  await page.getByLabel("Caption").fill("A private image framing test");
  await page
    .getByLabel("Add a private test photo or video")
    .setInputFiles("public/assets/hair.jpg");
  const img = page.getByAltText("Private feed photo preview");
  await expect(img).toBeVisible();
  await expect
    .poll(() =>
      img.evaluate((n: HTMLImageElement) => [n.naturalWidth, n.naturalHeight]),
    )
    .toEqual([1080, 1350]);
  await page.getByLabel("Photo frame").selectOption("1920");
  await page.getByLabel("Horizontal framing").fill("25");
  await page.getByRole("button", { name: "Apply photo framing" }).click();
  await expect
    .poll(() =>
      img.evaluate((n: HTMLImageElement) => [n.naturalWidth, n.naturalHeight]),
    )
    .toEqual([1080, 1920]);
  await page.getByLabel("Audience", { exact: true }).selectOption("public");
  await expect(
    page.getByRole("button", { name: "Preview audience & content" }),
  ).toBeDisabled();
  await expect(page.getByRole("alert")).toContainText(
    "Personal test uploads stay private",
  );
  await page.getByLabel("Audience", { exact: true }).selectOption("private");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Save private post" }).click();
  await expect(
    page.locator('[data-media-origin="private-upload"] img'),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("charett-demo-v1")),
  ).not.toContain("data:image");
});
test("private video upload decodes and remains session only", async ({
  page,
}) => {
  await go(page, "/explore?compose=new");
  await page.getByLabel("Caption").fill("A private video test");
  await page
    .getByLabel("Add a private test photo or video")
    .setInputFiles("public/assets/motion.mp4");
  const video = page.getByLabel("Private video preview");
  await expect(video).toBeVisible();
  await expect
    .poll(() => video.evaluate((n: HTMLVideoElement) => n.videoWidth))
    .toBe(1080);
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Save private post" }).click();
  await expect(
    page.locator('[data-media-origin="private-upload"] video'),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("charett-demo-v1")),
  ).not.toContain("blob:");
});
test("account privacy restricts rich cards and approved followers unlock only their own access", async ({
  page,
}) => {
  await go(page, "/explore?compose=new");
  await page
    .getByLabel("Post title (optional)")
    .fill("An account privacy example");
  await page
    .getByLabel("Caption")
    .fill("Fictional editorial content, private account.");
  await page.getByLabel("Audience", { exact: true }).selectOption("public");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Publish demo post" }).click();
  const postPath = new URL(page.url()).pathname;
  await page
    .getByRole("button", { name: "Share An account privacy example" })
    .click();
  await expect(
    page.getByRole("button", { name: "Simulate sharing" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await go(page, "/profile");
  await expect(page.getByLabel("Account visibility")).toHaveValue("private");
  await page.getByRole("button", { name: "Accept request" }).click();
  await go(page, postPath);
  await page
    .getByRole("button", { name: "Share An account privacy example" })
    .click();
  await expect(
    page.getByRole("button", { name: "Simulate sharing" }),
  ).toBeVisible();
  await page.getByLabel("Share with").selectOption("noor");
  await expect(
    page.getByRole("button", { name: "Simulate sharing" }),
  ).toHaveCount(0);
  await page.getByLabel("Check recipient access").selectOption("mira");
  await page.getByRole("button", { name: "Simulate sharing" }).click();
  await expect(page.locator(".outgoing .linked-card")).toContainText(
    "An account privacy example",
  );
  await go(page, "/profile");
  await page.getByLabel("Account visibility").selectOption("public");
  await go(page, "/topics/photos");
  await page
    .getByLabel("Add a private progress photo")
    .setInputFiles("public/assets/hair.jpg");
  await expect(page.getByLabel("Journal audience")).toHaveValue("private");
  await page.getByLabel("Journal audience").selectOption("followers");
  await page.getByRole("button", { name: "Save private photo" }).click();
  await expect(
    page.getByText("Sharing preference: followers · Original stays private"),
  ).toBeVisible();
});
test("coach follows natural questions across topics without category or style filters", async ({
  page,
}) => {
  await go(page, "/coach");
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await page
    .getByLabel("Ask your demo coach")
    .fill("What should I wear this weekend?");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.locator(".chat-message.coach").last()).toContainText(
    "ABOUT CLOTHING & STYLE",
  );
  await expect(page.locator(".chat-message.coach").last()).toContainText(
    "The linen shirt",
  );
  await page
    .getByLabel("Ask your demo coach")
    .fill("My skin feels dry, what should I start with?");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.locator(".chat-message.coach").last()).toContainText(
    "ABOUT SKINCARE",
  );
  await page
    .locator(".chat-message.coach")
    .last()
    .getByRole("link", { name: /Read the beginner’s guide/ })
    .click();
  await expect(page.locator("h1")).toHaveText("Your first skincare routine");
});
test("new editorial routes meet accessibility and overflow checks", async ({
  page,
}) => {
  test.setTimeout(60000);
  for (const route of [
    "/",
    "/categories",
    "/topics/skincare/guide",
    "/about",
    "/profile",
  ]) {
    await go(page, route);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      scan.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
  }
});
