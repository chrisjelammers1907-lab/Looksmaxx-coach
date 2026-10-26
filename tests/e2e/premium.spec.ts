import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const open = async (page: Page, path = "/") => {
  await page.goto(path);
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
};

// Starts the session on a paid plan (only when nothing is stored yet).
const asMember = async (page: Page, plan = "plus", extra = {}) =>
  page.addInitScript(
    ([plan, extra]) => {
      if (!localStorage.getItem("charett-demo-v1"))
        localStorage.setItem(
          "charett-demo-v1",
          JSON.stringify({
            subscription: { plan, billing: "monthly" },
            ...(extra as object),
          }),
        );
    },
    [plan, extra] as const,
  );

// Client-side navigation keeps session-only state such as drafts.
const go = async (page: Page, path: string) => {
  await page.evaluate((next) => {
    history.pushState(null, "", next);
    dispatchEvent(new PopStateEvent("popstate"));
  }, path);
  await expect(page.locator("h1")).toBeVisible();
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
  // The account is already named above the photo, so the caption skips it.
  await expect(caption).not.toContainText("mira.edits");
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
  await expect(dialog.locator(".shop-details summary")).toContainText(
    "Shop the look",
  );
  await expect(dialog.locator(".breakdown-row")).toHaveCount(3);
  await page.keyboard.press("Escape");

  // Reels keep their TikTok-style caption over the video.
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  const reel = page.locator(".post-card").filter({
    has: page.getByRole("heading", { name: "A moment in motion", exact: true }),
  });
  await expect(reel.locator(".post-media .reel-overlay")).toHaveCount(1);
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
    "nothing more",
  );
  // On wide columns the full text can still fit in two lines.
  if (info.project.name === "mobile")
    expect(await offset()).toBeGreaterThan(before);
  else expect(await offset()).toBeGreaterThanOrEqual(before);
});

test("plan shows one day with routine and task filters", async ({ page }) => {
  await open(page, "/plan");
  await expect(page.getByText("Your next check-in")).toHaveCount(0);
  await expect(page.getByText(/of \d+ done today/)).toBeVisible();
  const filters = page.getByLabel("Show in plan");
  await filters.getByRole("button", { name: "Tasks", exact: true }).click();
  await expect(page.locator(".routine-line")).toHaveCount(0);
  await expect(page.locator(".goal-row").first()).toBeVisible();
  await filters.getByRole("button", { name: "Routines", exact: true }).click();
  await expect(page.locator(".goal-row:not(.routine-line)")).toHaveCount(0);
  await expect(page.locator(".routine-line").first()).toBeVisible();
  await noAxeViolations(page);
});

test("profiles show stats once, drafts stay private and ⋯ holds controls", async ({
  page,
}) => {
  await open(page, "/profile");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  const stats = page.getByRole("list", { name: "Profile stats" });
  for (const label of ["posts", "followers", "following", "likes"])
    await expect(stats).toContainText(label);

  // A post saved as a draft appears only under Drafts.
  await go(page, "/explore?compose=new");
  await page.getByLabel("Caption", { exact: true }).fill("A quiet draft idea");
  await page.getByLabel("Audience", { exact: true }).selectOption("public");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Save as draft" }).click();
  await expect(page.getByText("Draft · only you")).toBeVisible();
  await go(page, "/");
  await expect(
    page.getByRole("heading", { name: "A quiet draft idea" }),
  ).toHaveCount(0);
  await go(page, "/profile");
  await page.getByRole("tab", { name: "Drafts", exact: true }).click();
  await expect(page.locator(".profile-tile")).toHaveCount(1);
  await page.getByRole("tab", { name: "Posts", exact: true }).click();
  await expect(page.locator(".profile-tile")).toHaveCount(0);

  await go(page, "/profile/noor");
  await page
    .getByRole("button", { name: "More options for @noor.notes" })
    .click();
  const sheet = page.getByRole("dialog", { name: "@noor.notes" });
  await sheet.getByRole("radio", { name: "Stories only" }).check();
  await expect(
    sheet.getByRole("radio", { name: "Stories only" }),
  ).toBeChecked();
  for (const name of ["Share profile", "Mute", "Report", "Block"])
    await expect(
      sheet.getByRole("button", { name, exact: true }),
    ).toBeVisible();
  await noAxeViolations(page);
});

test("chats send stickers and photos, the coach accepts files", async ({
  page,
}) => {
  await open(page, "/messages?to=noor");
  await page.getByRole("button", { name: "Add attachment" }).click();
  await page.getByRole("menuitem", { name: "Sticker" }).click();
  await page.getByRole("button", { name: "Send Glow up sticker" }).click();
  await expect(page.locator(".outgoing .sticker")).toHaveText("Glow up");
  await page.getByRole("button", { name: "Add attachment" }).click();
  await page
    .getByLabel("Send a photo")
    .setInputFiles("tests/fixtures/portrait.jpg");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".outgoing .message-photo")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Record voice message" }),
  ).toBeVisible();
  await noAxeViolations(page);

  await page.goto("/coach");
  await page.getByLabel("Attach a file").setInputFiles({
    name: "skin-notes.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 demo"),
  });
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(page.locator(".chat-message.you .file-chip")).toContainText(
    "skin-notes.pdf",
  );
  await expect(page.locator(".chat-message.coach").last()).toContainText(
    "does not read file contents",
  );
});

test("each clothing style gives the page its own look", async ({ page }) => {
  // The mood fades in; compare the settled colours, not a frame mid-fade.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/topics/clothing");
  const section = page.getByTestId("clothing-section");
  const backgrounds = new Set<string>();
  for (const style of [/Old money/, /Dark casual/, /Minimalist/]) {
    await page.getByRole("button", { name: style }).click();
    backgrounds.add(
      await section.evaluate(
        (n) =>
          getComputedStyle(n).backgroundImage +
          getComputedStyle(n).backgroundColor,
      ),
    );
    await noAxeViolations(page);
  }
  expect(backgrounds.size).toBe(3);
});

test("gym days are planned per set, persist, and a PR can become a story", async ({
  page,
}) => {
  await asMember(page);
  await open(page, "/topics/gym");
  const weekday = new Date().toLocaleDateString("en", { weekday: "long" });
  await page.getByRole("button", { name: new RegExp(`^${weekday}:`) }).click();
  const editor = page.getByRole("dialog", { name: `Plan ${weekday}` });
  await editor.getByLabel("Session name").fill("Upper");
  await editor.getByLabel("Exercise 1", { exact: true }).fill("Bench press");
  await editor.getByLabel("Reps, exercise 1 set 1").fill("6");
  await editor.getByLabel("Kg, exercise 1 set 1").fill("65");
  // Seeded days (Monday) already hold sets and more exercises, so the new
  // set is checked against whatever set came last, not against set 1.
  const kg = editor.getByLabel(/^Kg, exercise 1 set \d+$/);
  const sets = await kg.count();
  const last = await kg.nth(sets - 1).inputValue();
  await editor.getByRole("button", { name: "Add set" }).first().click();
  await expect(
    editor.getByLabel(`Kg, exercise 1 set ${sets + 1}`, { exact: true }),
  ).toHaveValue(last);
  await expect(editor.getByLabel(`Repeat every ${weekday}`)).toBeChecked();
  await editor.getByRole("button", { name: "Save day" }).click();

  const today = page.getByRole("region", { name: "Today: Upper" });
  await today.getByRole("button", { name: "Done: Bench press set 1" }).click();
  await expect(today.getByText("New PR")).toBeVisible();
  await today.getByRole("button", { name: "Share as story" }).click();
  await expect(
    page.getByRole("dialog", { name: "Add to your story" }).getByLabel("Text"),
  ).toHaveValue(/New PR · Bench press .* → 65 kg/);
  await page.getByRole("button", { name: "Share to story" }).click();

  // The plan and ticked sets survive a reload.
  await page.reload();
  await expect(
    page.getByRole("button", { name: new RegExp(`^${weekday}: Upper`) }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Done: Bench press set 1" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Finish and log now" }).click();
  await expect(page.getByText("Session logged")).toBeVisible();
  await expect(page.locator(".session-row").first()).toContainText("Done");
  await noAxeViolations(page);
});

test("reels fill the phone screen with in-reel actions and a details sheet", async ({
  page,
}, info) => {
  await open(page);
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  const reel = page.locator(".post-card").filter({
    has: page.getByRole("heading", { name: "A moment in motion", exact: true }),
  });
  const media = (await reel.locator(".post-media").boundingBox())!;
  const actions = (await reel.locator(".reel-actions").boundingBox())!;
  // Likes, comments and the caption sit inside the reel.
  expect(actions.x).toBeGreaterThan(media.x);
  expect(actions.x + actions.width).toBeLessThanOrEqual(media.x + media.width);
  if (info.project.name === "mobile") {
    const viewport = page.viewportSize()!;
    expect(media.height).toBeGreaterThanOrEqual(viewport.height - 2);
    expect(media.width).toBeGreaterThanOrEqual(viewport.width - 2);
  }
  await expect(reel.locator("video")).not.toHaveAttribute("controls");
  await reel
    .getByRole("button", { name: "Play video A moment in motion" })
    .click();
  await expect(
    reel.getByRole("button", { name: "Pause video A moment in motion" }),
  ).toBeVisible();
  await reel
    .getByRole("button", { name: "Read more of A moment in motion" })
    .click();
  const sheet = page.getByRole("dialog", { name: "Post by mira.edits" });
  await expect(sheet).toContainText("#editorial");
  await sheet.getByLabel("Your comment").fill("Love the light here.");
  await sheet.getByRole("button", { name: "Post demo comment" }).click();
  await expect(sheet.getByText("Love the light here.")).toBeVisible();
  await noAxeViolations(page);
});

test("story and filter rows scroll with a mouse wheel and arrows", async ({
  page,
}, info) => {
  test.skip(info.project.name === "mobile", "Pointer-specific behaviour");
  await page.setViewportSize({ width: 700, height: 900 });
  await open(page);
  const row = page.locator(".stories-row");
  await expect(row.locator(".story-bubble")).toHaveCount(14);
  await row.hover();
  await page.mouse.wheel(0, 400);
  await expect
    .poll(() => row.evaluate((n) => n.scrollLeft))
    .toBeGreaterThan(100);
  const chips = page.locator(".feed-chips .hscroll-row");
  const before = await chips.evaluate((n) => n.scrollLeft);
  await page
    .locator(".feed-chips")
    .getByRole("button", { name: "Scroll right" })
    .click();
  await expect
    .poll(() => chips.evaluate((n) => n.scrollLeft))
    .toBeGreaterThan(before);
});

test("settings switch the app to dark mode and keep the choice", async ({
  page,
}) => {
  await open(page, "/settings");
  await page.getByRole("radio", { name: "Dark" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const bg = await page
    .locator(".site-shell")
    .evaluate((n) => getComputedStyle(n).backgroundColor);
  expect(bg).toBe("rgb(14, 22, 19)");
  await noAxeViolations(page);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("radio", { name: "Light" }).check();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.getByRole("switch", { name: /Quiet hours/ }).check();
  await expect(page.getByRole("switch", { name: /Quiet hours/ })).toBeChecked();
});

test("chat streaks unlock rewards and custom stickers can be made", async ({
  page,
}) => {
  await asMember(page);
  await open(page, "/messages?to=mira");
  // Mira's seeded 6-day streak becomes 7 today and unlocks chat themes.
  await expect(page.locator(".conversation-header .streak")).toHaveText("6");
  await page.getByLabel("Message", { exact: true }).fill("Day seven!");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".conversation-header .streak")).toHaveText("7");
  await expect(page.getByRole("status").last()).toContainText("Chat themes");
  await page.getByRole("button", { name: "Chat theme" }).click();
  await page.getByRole("button", { name: "Midnight" }).click();
  await expect(page.locator(".thread")).toHaveClass(/chat-theme-midnight/);

  await page.getByRole("button", { name: "Add attachment" }).click();
  const menu = page.getByRole("menu");
  await expect(menu.getByRole("menuitem", { name: "Camera" })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: /Voice/ })).toHaveCount(0);
  await menu.getByRole("menuitem", { name: "Sticker" }).click();
  await page.getByRole("button", { name: "Create a sticker" }).click();
  await page.getByLabel("Sticker text").fill("Main event");
  await page.getByRole("button", { name: "Champagne" }).click();
  await page.getByRole("button", { name: "Save and send" }).click();
  await expect(page.locator(".outgoing .sticker").last()).toHaveText(
    "Main event",
  );
  await expect(
    page.getByRole("button", { name: "Record voice message" }),
  ).toHaveCount(1);
});

test("tasks are grouped by date and routines show the products they use", async ({
  page,
}) => {
  await open(page, "/plan");
  for (const group of ["Today", "This week", "Later"])
    await expect(
      page.locator(".task-group-title", { hasText: group }),
    ).toBeVisible();
  await page.getByRole("button", { name: "Add a task" }).click();
  await page.getByLabel("Task", { exact: true }).fill("Pick up new trainers");
  const date = new Date(Date.now() + 30 * 86_400_000);
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  await page.getByLabel("Date (optional)").fill(iso);
  await page.getByRole("button", { name: "Save task" }).click();
  await expect(
    page.locator(".task-group-later").getByText("Pick up new trainers"),
  ).toBeVisible();

  // Routines are edited in their category; My Plan lists them compactly.
  await go(page, "/topics/skincare");
  const morning = page.locator(".routine-card").first();
  await expect(morning.getByLabel("Products used")).toContainText(
    "Gentle cream cleanser",
  );
  await expect(morning.locator(".step-product").first()).toHaveText(
    "Gentle cream cleanser",
  );
  await morning.getByRole("button", { name: /^Edit/ }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Daily moisturizer").uncheck();
  await dialog.getByRole("button", { name: /^Save/ }).click();
  await expect(morning.getByLabel("Products used")).not.toContainText(
    "Daily moisturizer",
  );
  await noAxeViolations(page);
});

test("nutrition: own targets, barcode scan, extra nutrients and weight", async ({
  page,
}) => {
  await asMember(page);
  await page.route("https://world.openfoodfacts.org/**", (route) =>
    route.fulfill({
      json: {
        product: {
          product_name: "Greek yoghurt",
          brands: "Example Dairy",
          serving_quantity: 150,
          nutriments: {
            "energy-kcal_100g": 80,
            carbohydrates_100g: 4,
            proteins_100g: 10,
            fat_100g: 2,
            sugars_100g: 4,
            salt_100g: 0.1,
            potassium_100g: 0.15,
          },
        },
      },
    }),
  );
  await open(page, "/topics/gym");
  await go(page, "/topics/nutrition");
  await expect(page.getByText("Set your daily targets")).toBeVisible();

  await page.getByRole("button", { name: "Calorie calculator" }).click();
  await page.getByLabel("Age").fill("16");
  await expect(page.getByLabel("Goal")).toBeDisabled();
  await expect(page.getByText(/only shows maintenance/)).toBeVisible();
  await page.getByLabel("Age").fill("30");
  await page.getByLabel("Goal").selectOption("lose");
  await page.getByRole("button", { name: "Use as my calorie target" }).click();
  const calories = page.getByLabel("Daily calories (kcal)");
  await expect(calories).not.toHaveValue("");
  await calories.fill("2000");
  await page.getByLabel("Daily carbohydrates (g)").fill("230");
  await page.getByLabel("Daily protein (g)").fill("130");
  await page.getByLabel("Daily fat (g)").fill("65");
  await page.getByRole("button", { name: "Save targets" }).click();
  await expect(page.getByText("kcal left")).toBeVisible();

  await page.getByRole("button", { name: "Scan a barcode" }).click();
  await page.getByLabel("Barcode number").fill("5200000000001");
  await page.getByRole("button", { name: "Look up" }).click();
  const food = page.getByRole("dialog", { name: "Add food" });
  await expect(food.getByLabel("Food or meal")).toHaveValue("Greek yoghurt");
  await expect(food.getByLabel("Calories (kcal)")).toHaveValue("120");
  await food.getByLabel("Amount (g, optional)").fill("200");
  await expect(food.getByLabel("Calories (kcal)")).toHaveValue("160");
  await expect(food.getByLabel("Protein (g)", { exact: true })).toHaveValue(
    "20",
  );
  await food.getByText("More nutrients (optional)").click();
  await expect(food.getByLabel("Potassium (mg)")).toHaveValue("300");
  await food.getByRole("button", { name: "Save food" }).click();
  await expect(page.getByText("1840", { exact: true })).toBeVisible();
  await page.getByText("More nutrients", { exact: true }).click();
  await expect(page.locator(".nutrient-totals")).toContainText("300 mg");

  await page.getByLabel("Weight (kg)").fill("78.4");
  await page.getByRole("button", { name: "Log weight" }).click();
  await expect(page.locator(".weight-stats")).toContainText("78.4 kg");

  // Logs stay in this browser.
  await page.reload();
  await go(page, "/topics/nutrition");
  await expect(page.getByText("Greek yoghurt", { exact: true })).toBeVisible();
  await expect(page.locator(".weight-stats")).toContainText("78.4 kg");
  await noAxeViolations(page);
});

test("weights follow the unit chosen in settings", async ({ page }) => {
  await open(page, "/settings");
  await page.getByLabel("Weight", { exact: true }).selectOption("lb");
  await go(page, "/topics/gym");
  await go(page, "/topics/nutrition");
  await page.getByLabel("Weight (lb)").fill("176.4");
  await page.getByRole("button", { name: "Log weight" }).click();
  await expect(page.locator(".weight-stats")).toContainText("176.4 lb");
  await go(page, "/topics/gym");
  await expect(page.locator(".lift-card").first()).toContainText("lb");
});

test("free members get limits, ads and an upgrade path", async ({ page }) => {
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  await asMember(page, "free", {
    coachUsage: { date: today, messages: 9, files: 0 },
  });
  await open(page, "/");
  await expect(page.locator(".sponsored-card").first()).toContainText(
    "Sponsored",
  );

  await go(page, "/coach");
  await expect(page.getByText(/1 of 10 messages left today/)).toBeVisible();
  await page.getByLabel("Ask your demo coach").fill("Hi coach");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(
    page.getByText("You’ve used today’s 10 coach messages"),
  ).toBeVisible();
  await expect(page.getByLabel("Ask your demo coach")).toHaveCount(0);

  await go(page, "/topics/gym");
  await page.getByRole("button", { name: /^Tuesday:/ }).click();
  await expect(
    page.getByText("Free includes 3 training days a week"),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await go(page, "/topics/nutrition");
  await expect(
    page.getByRole("link", { name: /Scan a barcode/ }),
  ).toHaveAttribute("href", "/plans");

  // Upgrading removes the ads and lifts the limits.
  await go(page, "/plans");
  await page.getByRole("radio", { name: /Yearly/ }).click();
  await page.getByRole("button", { name: "Choose Plus" }).click();
  const checkout = page.getByRole("dialog", { name: "Checkout" });
  await expect(checkout).toContainText("€99.99");
  await checkout.getByRole("button", { name: "Start Plus" }).click();
  await expect(
    page.getByRole("button", { name: "Current plan" }),
  ).toBeVisible();
  await go(page, "/");
  await expect(page.locator(".sponsored-card")).toHaveCount(0);
  await go(page, "/coach");
  await expect(page.getByLabel("Ask your demo coach")).toBeVisible();
  await noAxeViolations(page);
});

test("signature shows a badge and unlocks every chat theme", async ({
  page,
}) => {
  await asMember(page, "signature");
  await open(page, "/profile");
  await expect(page.locator(".signature-badge")).toHaveText(/Signature/);
  await go(page, "/plans");
  await expect(page.locator(".plan-signature")).toContainText("Current plan");
  await noAxeViolations(page);
});

test("guides explain products, combinations and what works", async ({
  page,
}) => {
  await open(page, "/topics/nutrition");
  await page
    .locator(".topic-links")
    .getByRole("link", { name: /Weight guide/ })
    .click();
  await expect(page.locator("h1")).toHaveText("Lose, maintain or gain weight");
  await expect(
    page.getByRole("heading", { name: "What each lever does" }),
  ).toBeVisible();
  await expect(
    page.getByText("Hormones or medication only through a doctor.", {
      exact: false,
    }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: /Eat for how you want to look and feel/ })
    .click();
  await expect(page.locator(".guide-verdict")).toContainText("Doesn’t");
  await expect(page.locator("main")).not.toContainText(
    /testosterone|anavar|mk.?677|dnp/i,
  );
  await noAxeViolations(page);
});

test("plus has 50 coach messages a day; signature has no limit", async ({
  page,
}) => {
  const date = new Date();
  const today = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  await asMember(page, "plus", {
    coachUsage: { date: today, messages: 49, files: 0 },
  });
  await open(page, "/coach");
  await expect(page.getByText(/1 of 50 messages left today/)).toBeVisible();
  await go(page, "/plans");
  await expect(page.locator(".plan-plus")).toContainText(
    "50 messages and 5 photos a day",
  );
  await expect(page.locator(".plan-signature")).toContainText(
    "Unlimited coach messages and photo feedback",
  );
  await page.getByRole("button", { name: "Choose Signature" }).click();
  await page.getByRole("button", { name: "Start Signature" }).click();
  await go(page, "/coach");
  await expect(page.getByText(/messages left today/)).toHaveCount(0);
});
