import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const start = async (page: Page, path: string) => {
  await page.goto(path);
};
const go = async (page: Page, path: string) => {
  await page.evaluate((p) => {
    history.pushState(null, "", p);
    dispatchEvent(new PopStateEvent("popstate"));
  }, path);
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
};
test("copied workout routines remain editable in the personal plan", async ({
  page,
}) => {
  await start(page, "/post/p3");
  await page.getByRole("button", { name: "Copy routine / collection" }).click();
  await go(page, "/plan?routine=gym");
  await page.getByRole("button", { name: "Edit routine" }).click();
  await page.getByLabel("Routine name").fill("My reviewed strength routine");
  await page.getByRole("button", { name: "Save routine" }).click();
  await expect(
    page.getByRole("heading", { name: "My reviewed strength routine" }),
  ).toBeVisible();
  await go(page, "/profile");
  await page.getByRole("tab", { name: "Following & controls" }).click();
  await page.getByRole("link", { name: /Mira Laurent/ }).click();
  await expect(
    page.getByRole("tab", { name: "Public demo posts" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".post-card")).toHaveCount(3);
});
test("corrupt images are rejected and generated inspiration is excluded from progress", async ({
  page,
}) => {
  await start(page, "/topics/photos");
  await page.getByLabel("Add a private progress photo").setInputFiles({
    name: "invalid.jpg",
    mimeType: "image/jpeg",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.getByRole("alert")).toContainText("could not be decoded");
  await page
    .getByLabel("Add a private progress photo")
    .setInputFiles("public/assets/hair.jpg");
  await page.getByLabel("Image category").selectOption("inspiration");
  await page.getByRole("button", { name: "Save private photo" }).click();
  await expect(
    page.getByText("Edited/generated inspiration · Private"),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Compare photos" }),
  ).toBeDisabled();
  expect(
    await page.evaluate(() => localStorage.getItem("charett-demo-v1")),
  ).not.toContain("data:image");
});
test("a private worn-outfit photo never enters a public post preview", async ({
  page,
}) => {
  await start(page, "/topics/clothing?tab=outfits");
  await page.getByRole("button", { name: "Edit", exact: true }).click();
  await page
    .getByLabel("Add a private real worn-outfit photo")
    .setInputFiles("public/assets/hair.jpg");
  await expect(
    page.getByAltText("Real worn-outfit private preview"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Save outfit" }).click();
  await expect(page.getByText("Real worn photo · Private")).toBeVisible();
  await page.getByRole("link", { name: "Preview & share outfit" }).click();
  await page
    .getByLabel("Caption")
    .fill("An explicitly fictional outfit reference.");
  await page.getByLabel("Audience", { exact: true }).selectOption("public");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await expect(
    page.getByRole("dialog").locator('[data-media-origin="editorial"]'),
  ).toBeVisible();
  await expect(
    page.getByRole("dialog").locator('[data-media-origin="private-upload"]'),
  ).toHaveCount(0);
  await expect(
    page.getByRole("dialog").getByAltText("Real worn-outfit private preview"),
  ).toHaveCount(0);
});
test("recipient access is rechecked after a public post becomes private", async ({
  page,
}) => {
  await start(page, "/profile");
  await page.getByLabel("Account visibility").selectOption("public");
  await go(page, "/explore?compose=new");
  await page
    .getByLabel("Post title (optional)")
    .fill("A temporary public example");
  await page
    .getByLabel("Caption")
    .fill("This fictional example will become private.");
  await page.getByLabel("Audience", { exact: true }).selectOption("public");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Publish demo post" }).click();
  await page
    .getByRole("button", { name: "Share A temporary public example" })
    .click();
  await page.getByRole("button", { name: "Simulate sharing" }).click();
  await page.locator(".outgoing .linked-card").click();
  await page.getByRole("button", { name: "Edit post", exact: true }).click();
  await page.getByLabel("Audience", { exact: true }).selectOption("private");
  await page
    .getByRole("button", { name: "Preview audience & content" })
    .click();
  await page.getByRole("button", { name: "Save private post" }).click();
  await go(page, "/messages?to=mira");
  await expect(page.locator(".outgoing .linked-card")).toContainText(
    "Content unavailable",
  );
});
test("clothing themes and edit dialogs maintain accessible contrast", async ({
  page,
}) => {
  test.setTimeout(60000);
  await start(page, "/topics/clothing");
  await page.getByRole("button", { name: /Dark casual/ }).click();
  for (const tab of [
    "The edit",
    "My wardrobe",
    "My outfits",
    "Inspiration",
    "Shopping demo",
  ]) {
    await page.getByRole("tab", { name: tab, exact: true }).click();
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
  await page.getByRole("button", { name: /Minimalist/ }).click();
  await page.getByRole("tab", { name: "My wardrobe", exact: true }).click();
  await page.getByRole("button", { name: "Add item" }).click();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});
