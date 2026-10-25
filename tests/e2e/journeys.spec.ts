import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const go = async (page: Page, path: string) => {
  if (page.url().startsWith("http://127.0.0.1:5173"))
    await page.evaluate((p) => {
      history.pushState(null, "", p);
      window.dispatchEvent(new PopStateEvent("popstate"));
    }, path);
  else await page.goto(path);
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
};
const open = async (page: Page, path = "/") => {
  await go(page, path);
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
};
const dialog = (page: Page) => page.getByRole("dialog");
test("skippable intake and editable shared profile", async ({ page }) => {
  await go(page, "/");
  await expect(dialog(page)).toBeVisible();
  await page.getByLabel("What should we call you?").fill("Taylor Demo");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Find my starting point" }).click();
  await go(page, "/profile");
  await expect(
    page.getByRole("heading", { name: "Taylor Demo" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Edit profile" }).click();
  await page
    .getByLabel("Goals", { exact: true })
    .fill("Build a capsule wardrobe");
  await page.getByLabel("Shopping budget").fill("95");
  await page.getByRole("button", { name: "Save profile" }).click();
  await page.getByRole("link", { name: "Settings", exact: true }).click();
  await expect(
    page.getByText("Build a capsule wardrobe", { exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => localStorage.getItem("charett-demo-v1")),
  ).not.toContain("Taylor Demo");
});
test("all eight sections load without overflow or missing assets", async ({
  page,
}) => {
  await open(page);
  for (const id of [
    "skincare",
    "clothing",
    "hair",
    "gym",
    "grooming",
    "smile",
    "fragrance",
    "photos",
  ]) {
    await go(page, `/topics/${id}`);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const broken = await page
      .locator("img")
      .evaluateAll(
        (imgs) =>
          imgs.filter(
            (i) =>
              !(i as HTMLImageElement).complete ||
              (i as HTMLImageElement).naturalWidth === 0,
          ).length,
      );
    expect(broken).toBe(0);
  }
});
test("clothing theme covers tabs, persists and stays section-scoped", async ({
  page,
}) => {
  await open(page, "/topics/clothing");
  await page.getByRole("button", { name: /Dark casual/ }).click();
  await expect(page.getByTestId("clothing-section")).toHaveClass(
    /clothing-dark-casual/,
  );
  for (const name of [
    "My wardrobe",
    "My outfits",
    "Inspiration",
    "Shopping demo",
  ]) {
    await page.getByRole("tab", { name, exact: true }).click();
    await expect(page.getByTestId("clothing-section")).toHaveClass(
      /clothing-dark-casual/,
    );
  }
  await page.reload();
  await expect(page.getByTestId("clothing-section")).toHaveClass(
    /clothing-dark-casual/,
  );
  await go(page, "/topics/skincare");
  await expect(page.locator(".clothing-dark-casual")).toHaveCount(0);
  await go(page, "/topics/clothing");
  await page.getByRole("button", { name: /Minimalist/ }).click();
  await expect(page.getByTestId("clothing-section")).toHaveClass(
    /clothing-minimalist/,
  );
});
test("owned product CRUD, ordering and routine builder", async ({ page }) => {
  await open(page, "/topics/skincare");
  await page.getByRole("tab", { name: "Owned products" }).click();
  await page.getByRole("button", { name: "Add product" }).click();
  await page
    .getByLabel("Item name", { exact: true })
    .fill("My example cleanser");
  await page.getByLabel("Price (leave blank if unknown)").fill("12");
  await page.getByRole("button", { name: "Save item" }).click();
  await expect(
    page.getByRole("heading", { name: "My example cleanser" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Move My example cleanser up" })
    .click();
  const product = page.locator(".product-card").filter({
    has: page.getByRole("heading", { name: "My example cleanser" }),
  });
  await product.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("Item name", { exact: true }).fill("Edited cleanser");
  await page.getByRole("button", { name: "Save item" }).click();
  await page.getByRole("button", { name: "Delete Edited cleanser" }).click();
  await expect(
    page.getByRole("heading", { name: "Edited cleanser" }),
  ).toHaveCount(0);
  await page.getByRole("tab", { name: "My routines" }).click();
  await page.getByRole("button", { name: "Build a routine" }).click();
  await page.getByRole("button", { name: "Review editable copy" }).click();
  await page.getByLabel("Routine name").fill("My reviewed morning");
  await page.getByRole("button", { name: "Save routine" }).click();
  await expect(
    page.getByRole("heading", { name: "My reviewed morning" }),
  ).toBeVisible();
  const r = page.locator(".routine-card").filter({
    has: page.getByRole("heading", { name: "My reviewed morning" }),
  });
  await r
    .getByRole("button", { name: "Complete Gentle cleanse if needed" })
    .click();
  await expect(
    r.getByRole("button", { name: "Complete Gentle cleanse if needed" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Delete My reviewed morning" })
    .click();
});
test("outfit builder saves, edits, duplicates and deletes", async ({
  page,
}) => {
  await open(page, "/topics/clothing?tab=outfits");
  await page
    .getByRole("button", { name: "Build an outfit", exact: true })
    .click();
  await page.getByLabel("Outfit name").fill("Sunday test edit");
  await page.getByLabel(/^The linen shirt/).check();
  await page.getByLabel(/^Straight-leg denim/).check();
  await expect(
    dialog(page).getByText("€148.00", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save outfit" }).click();
  const outfit = page
    .locator(".outfit-card")
    .filter({ has: page.getByRole("heading", { name: "Sunday test edit" }) });
  await outfit.getByRole("button", { name: "Edit", exact: true }).click();
  await page.getByLabel("Fit, color & styling notes").fill("Relaxed fit");
  await page.getByRole("button", { name: "Save outfit" }).click();
  await outfit.getByRole("button", { name: "Duplicate" }).click();
  await expect(
    page.getByRole("heading", { name: "Sunday test edit — copy" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Delete Sunday test edit — copy" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Sunday test edit — copy" }),
  ).toHaveCount(0);
});
test("public outfit journey: preview, social actions, copy, share, edit and removed card", async ({
  page,
}) => {
  await open(page, "/profile?settings=privacy");
  await page.getByLabel("Account visibility").selectOption("public");
  await go(page, "/topics/clothing?tab=outfits");
  await page.getByRole("link", { name: "Preview & share outfit" }).click();
  await page
    .getByLabel("Caption")
    .fill("A fictional weekend outfit for this demo.");
  await page.getByLabel("Audience", { exact: true }).selectOption("public");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await expect(dialog(page).getByText(/Public: title/)).toBeVisible();
  await expect(
    dialog(page).getByText("€148.00", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Publish demo post" }).click();
  await page
    .getByRole("button", { name: "Like The considered weekend" })
    .click();
  await page
    .getByRole("button", { name: "Save The considered weekend privately" })
    .click();
  await page.getByLabel("Your comment").fill("A useful fictional reference.");
  await page.getByRole("button", { name: "Post demo comment" }).click();
  await expect(
    page.getByText("A useful fictional reference.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Copy outfit to my wardrobe" })
    .click();
  await page
    .getByRole("button", { name: "Share The considered weekend" })
    .click();
  await page.getByRole("button", { name: "Simulate sharing" }).click();
  await expect(page.locator(".outgoing .linked-card")).toBeVisible();
  await page.locator(".outgoing .linked-card").click();
  await page.getByRole("button", { name: "Edit post", exact: true }).click();
  await page.getByLabel("Post title (optional)").fill("A revised weekend");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Publish demo post" }).click();
  await expect(
    page.getByRole("heading", { name: "A revised weekend" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete post", exact: true }).click();
  await dialog(page)
    .getByRole("button", { name: "Delete post", exact: true })
    .click();
  await go(page, "/messages?to=mira");
  await expect(
    page.getByText("Content unavailable", { exact: true }),
  ).toBeVisible();
  await go(page, "/topics/clothing?tab=outfits");
  await expect(
    page.getByRole("heading", { name: "The considered weekend — my copy" }),
  ).toBeVisible();
});
test("following, saved feed, comments and local moderation", async ({
  page,
}) => {
  await open(page, "/post/p1");
  await page.getByRole("button", { name: "Follow", exact: true }).click();
  await page
    .getByRole("button", { name: "Save The art of a simple Sunday privately" })
    .click();
  await page.getByLabel("Your comment").fill("A thoughtful demo note.");
  await page.getByRole("button", { name: "Post demo comment" }).click();
  await expect(
    page.getByText("A thoughtful demo note.", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Delete comment" }).click();
  await page.getByRole("button", { name: "Report", exact: true }).click();
  await page.getByRole("button", { name: "Submit demo report" }).click();
  await go(page, "/explore");
  await page.getByRole("tab", { name: "Following", exact: true }).click();
  await expect(page.locator(".post-card")).toHaveCount(2);
  await page.getByRole("tab", { name: "Reels", exact: true }).click();
  await expect(page.locator(".post-card")).toHaveCount(1);
  await go(page, "/profile?saved=true");
  await expect(page.locator(".profile-tile")).toHaveCount(1);
  await go(page, "/post/p1");
  await page.getByRole("button", { name: "Block creator" }).click();
  await expect(
    page.getByRole("heading", { name: "This content is unavailable." }),
  ).toBeVisible();
  await go(page, "/profile/mira");
  await page.getByRole("button", { name: "Unblock Mira Laurent" }).click();
  await expect(
    page.getByRole("heading", { name: "Mira Laurent", exact: true }).first(),
  ).toBeVisible();
});
test("community filters and routine copying", async ({ page }) => {
  await open(page, "/explore");
  await page.getByRole("button", { name: "Search and filter posts" }).click();
  await page.getByLabel("Topic", { exact: true }).selectOption("skincare");
  await expect(page.locator(".post-card")).toHaveCount(1);
  await page.getByLabel("Search posts").fill("nothing matches");
  await expect(page.locator(".post-card")).toHaveCount(0);
  await page.getByRole("button", { name: "Reset filters & discover" }).click();
  await page.locator(".filter-details summary").click();
  await page.getByLabel("Style", { exact: true }).selectOption("old-money");
  await expect(page.locator(".post-card")).toHaveCount(1);
  await page.getByLabel("Max total (EUR)").fill("100");
  await expect(page.locator(".post-card")).toHaveCount(0);
  await go(page, "/post/p2");
  await page.getByRole("button", { name: "Copy routine / collection" }).click();
  await go(page, "/topics/skincare");
  await expect(
    page.getByRole("heading", { name: "My slower morning ritual — my copy" }),
  ).toBeVisible();
});
test("messages compose, rich routine card, request controls and blocking", async ({
  page,
}) => {
  await open(page, "/messages");
  await page.getByRole("button", { name: "Accept", exact: true }).click();
  await expect(
    page
      .locator(".thread")
      .getByText(/Thanks for accepting this simulated request/),
  ).toBeVisible();
  await page.getByLabel("Message", { exact: true }).fill("A fictional hello.");
  await page.getByRole("button", { name: "Add attachment" }).click();
  await page.getByRole("menuitem", { name: "Share a post" }).click();
  await dialog(page)
    .getByRole("button", { name: /My slower morning ritual/ })
    .click();
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".outgoing")).toContainText("A fictional hello.");
  await page.locator(".outgoing .linked-card").click();
  await expect(
    page.getByRole("heading", {
      name: "My slower morning ritual",
      exact: true,
    }),
  ).toBeVisible();
  await go(page, "/messages?to=james");
  await page.getByRole("button", { name: "Report conversation" }).click();
  await page.getByRole("button", { name: "Submit demo report" }).click();
  await page.getByRole("button", { name: "Block recipient" }).click();
  await expect(
    page.getByRole("heading", { name: "This recipient is blocked." }),
  ).toBeVisible();
});
test("training schedule, nutrition targets and food log", async ({ page }) => {
  await open(page, "/topics/gym");
  await page.getByRole("button", { name: /^Monday:/ }).click();
  await page.getByLabel("Session name").fill("Comfortable strength");
  await page.getByRole("button", { name: "Save day" }).click();
  await expect(
    page.getByRole("button", { name: /^Monday: Comfortable strength/ }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Nutrition", exact: true }).click();
  await page.getByRole("button", { name: "Set targets" }).click();
  await page.getByLabel("Daily calories (kcal)").fill("2400");
  await page.getByLabel("Daily carbohydrates (g)").fill("280");
  await page.getByLabel("Daily protein (g)").fill("140");
  await page.getByLabel("Daily fat (g)").fill("70");
  await page.getByRole("button", { name: "Save targets" }).click();
  await page.getByRole("button", { name: "Add food" }).click();
  await page.getByLabel("Food or meal").fill("Example lunch");
  await page.getByLabel("Calories (kcal)").fill("600");
  await page.getByLabel("Carbohydrates (g)").fill("70");
  await page.getByLabel("Protein (g)", { exact: true }).fill("30");
  await page.getByLabel("Fat (g)", { exact: true }).fill("18");
  await page.getByRole("button", { name: "Save food" }).click();
  await expect(page.getByText("1800", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete Example lunch" }).click();
  await expect(
    page.getByRole("heading", { name: "Nothing logged yet." }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Posture & mobility" }).click();
  await page
    .getByRole("button", { name: "Add a movement break to my plan" })
    .click();
  await go(page, "/plan");
  await expect(
    page.getByText("Take a comfortable movement break", { exact: true }),
  ).toBeVisible();
});
test("private real photo comparison, edit, removal and no persistence", async ({
  page,
}) => {
  await open(page, "/topics/photos");
  for (const [date, tag] of [
    ["2026-10-01", "Before demo fixture"],
    ["2026-10-18", "After demo fixture"],
  ]) {
    await page
      .getByLabel("Add a private progress photo")
      .setInputFiles("public/assets/hair.jpg");
    await page.getByLabel("Photo date").fill(date);
    await page.getByLabel("Tag", { exact: true }).fill(tag);
    await page.getByRole("button", { name: "Save private photo" }).click();
  }
  await page.getByRole("button", { name: "Compare photos" }).click();
  await expect(page.getByAltText("Before: 2026-10-01")).toBeVisible();
  await expect(page.getByAltText("After: 2026-10-18")).toBeVisible();
  await page.getByLabel("Comparison slider").fill("75");
  expect(
    await page.evaluate(() => localStorage.getItem("charett-demo-v1")),
  ).not.toContain("data:image");
  await page
    .getByRole("button", { name: "Delete photo from 2026-10-01" })
    .click();
  await expect(
    page.getByRole("button", { name: "Compare photos" }),
  ).toBeDisabled();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Every story starts somewhere." }),
  ).toBeVisible();
});
test("coach photo example and inspected plan proposal", async ({ page }) => {
  await open(page, "/coach?topic=clothing");
  await page
    .getByLabel("Ask your demo coach")
    .fill("Help me with fit and color");
  await page
    .getByLabel("Attach a private photo")
    .setInputFiles("public/assets/hair.jpg");
  await page.getByRole("button", { name: "Send", exact: true }).click();
  await expect(
    page.getByText(/Your attached photo has not been analyzed/),
  ).toBeVisible();
  await page.getByRole("button", { name: "Inspect proposed change" }).click();
  await expect(
    dialog(page).getByText(
      /Your existing routines, products and goals are preserved/,
    ),
  ).toBeVisible();
  await page.getByRole("button", { name: "Apply to my plan" }).click();
  await go(page, "/plan");
  await expect(
    page.getByText("Plan one outfit using my owned pieces", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Complete Plan one outfit using my owned pieces",
    })
    .click();
  await expect(
    page.getByRole("button", {
      name: "Complete Plan one outfit using my owned pieces",
    }),
  ).toHaveAttribute("aria-pressed", "true");
});
test("hair inspiration, comparison, simulated visualization, fragrance shortlist", async ({
  page,
}) => {
  await open(page, "/topics/hair");
  await page.getByRole("tab", { name: "Inspiration & preview" }).click();
  await page.getByRole("button", { name: "Save inspiration" }).first().click();
  await expect(
    page.getByRole("button", { name: "Saved inspiration" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Compare styles" }).click();
  await expect(
    dialog(page).getByAltText("Soft texture stock inspiration"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Try the preview" }).click();
  await page.getByLabel("Hair color direction").selectOption("Copper");
  await page.getByRole("button", { name: "Show example preview" }).click();
  await expect(
    dialog(page).getByText("Simulated illustration · Not your result"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await go(page, "/topics/fragrance");
  await page.getByRole("button", { name: "Add to shortlist" }).click();
  await expect(
    page.getByRole("button", { name: "✓ Shortlisted" }),
  ).toBeVisible();
});
test("private audience cannot be shared, reset removes session content", async ({
  page,
}) => {
  await open(page, "/explore?compose=new");
  await page.getByLabel("Post title (optional)").fill("A private demo thought");
  await page.getByLabel("Caption").fill("Only for my test session.");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Save private post" }).click();
  await page
    .getByRole("button", { name: "Share A private demo thought" })
    .click();
  await expect(
    dialog(page).getByText(/A linked card would not give the recipient access/),
  ).toBeVisible();
  await expect(
    dialog(page).getByRole("button", { name: "Simulate sharing" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Close dialog" }).click();
  await go(page, "/profile?settings=privacy");
  await page.getByRole("button", { name: "Reset demo", exact: true }).click();
  await page.getByRole("button", { name: "Confirm reset" }).click();
  await go(page, "/explore");
  await expect(
    page.getByRole("heading", { name: "A private demo thought" }),
  ).toHaveCount(0);
});
test("keyboard dialogs and accessible key routes", async ({ page }) => {
  await open(page);
  for (const route of [
    "/",
    "/explore",
    "/coach",
    "/messages?to=mira",
    "/topics/clothing",
    "/topics/skincare",
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
  }
  await go(page, "/profile");
  await page.getByRole("button", { name: "Edit profile" }).click();
  await page.getByLabel("Display name").click();
  await page.getByLabel("Display name").press("End");
  await page.getByLabel("Display name").pressSequentially(" Test");
  await expect(page.getByLabel("Display name")).toHaveValue("Alex Morgan Test");
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toHaveCount(0);
});
