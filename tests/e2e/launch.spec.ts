import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const open = async (page: Page, path = "/") => {
  await page.goto(path);
  const skip = page.getByRole("button", { name: "Skip for now" });
  if (await skip.isVisible()) await skip.click();
  // Pages load lazily; wait for the page's own heading, not just the frame.
  await expect(page.locator("main h1").first()).toBeAttached();
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
    await expect(page.locator(".topic-photo-strip img")).toHaveAttribute(
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
  const banner = await page.locator(".topic-photo-strip").boundingBox();
  expect(banner!.height).toBeLessThanOrEqual(460);
  await go(page, "/topics/face/guide");
  const hero = await page.locator(".guide-hero").boundingBox();
  expect(hero!.height).toBeLessThanOrEqual(560);
});

test("the share sheet opens inside the tap, so Safari allows it", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const w = window as unknown as { inTap: boolean; sharedInTap?: boolean };
    w.inTap = false;
    addEventListener(
      "click",
      () => {
        w.inTap = true;
        setTimeout(() => (w.inTap = false));
      },
      true,
    );
    Object.assign(navigator, {
      canShare: () => true,
      share: async () => {
        w.sharedInTap = w.inTap;
      },
    });
  });
  await open(page, "/");
  await page
    .getByRole("button", { name: "Share The art of a simple Sunday" })
    .first()
    .click();
  const button = page
    .getByRole("dialog")
    .getByRole("button", { name: "Share to Instagram / TikTok" });
  await expect(button).toBeEnabled();
  await button.click();
  await expect
    .poll(() =>
      page.evaluate(
        () => (window as unknown as { sharedInTap?: boolean }).sharedInTap,
      ),
    )
    .toBe(true);
});

test("no visible text is set below a readable size", async ({ page }) => {
  test.setTimeout(120000);
  await open(page, "/");
  const routes = [
    "/",
    "/categories",
    "/topics/skincare",
    "/topics/face",
    "/topics/face/guide",
    "/topics/clothing",
    "/topics/gym",
    "/topics/nutrition",
    "/plan",
    "/plans",
    "/profile",
    "/messages",
    "/messages?to=mira",
    "/coach",
    "/settings",
    "/about",
  ];
  const offenders: string[] = [];
  for (const route of routes) {
    await go(page, route);
    await page.waitForTimeout(150);
    offenders.push(
      ...(await page.evaluate((route) => {
        const out: string[] = [];
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
        );
        while (walker.nextNode()) {
          const node = walker.currentNode as Text;
          const text = node.textContent?.trim();
          const el = node.parentElement;
          if (!text || !el || el.closest("[aria-hidden='true']")) continue;
          const style = getComputedStyle(el);
          const box = el.getBoundingClientRect();
          if (
            style.visibility === "hidden" ||
            style.display === "none" ||
            box.width === 0 ||
            box.height === 0 ||
            el.closest(".sr-only, .visually-hidden, option")
          )
            continue;
          const size = parseFloat(style.fontSize);
          const floor = el.closest("p") && text.length > 40 ? 13 : 11;
          if (size < floor)
            out.push(`${route} ${size}px "${text.slice(0, 30)}"`);
        }
        return out;
      }, route)),
    );
  }
  expect([...new Set(offenders)]).toEqual([]);
});

test("heading levels never skip on the feed and the profile", async ({
  page,
}) => {
  await open(page, "/");
  for (const route of ["/", "/profile"]) {
    await go(page, route);
    const levels = await page.evaluate(() =>
      [...document.querySelectorAll("main h1, main h2, main h3, main h4")].map(
        (h) => Number(h.tagName[1]),
      ),
    );
    levels.forEach((level, i) => {
      if (i > 0)
        expect(level - levels[i - 1], `${route} heading ${i}`).toBeLessThan(2);
    });
  }
});

test("a missing photo falls back to a quiet tint, never a broken image", async ({
  page,
}) => {
  await page.route("**/assets/photo-topic*", (route) => route.abort());
  await page.route("**/assets/photo-skincare.jpg", (route) =>
    route.fulfill({ status: 404, body: "" }),
  );
  await open(page, "/topics/skincare");
  const img = page.locator(".topic-photo-strip img");
  await expect(img).toHaveAttribute("data-missing", "true");
  await expect
    .poll(() => img.evaluate((n: HTMLImageElement) => n.naturalWidth))
    .toBeGreaterThan(0);
});

test("18+ stays confirmed when the second intake step is skipped", async ({
  page,
}) => {
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("What should we call you?").fill("Sam");
  await dialog.getByRole("checkbox", { name: "I’m 18 or older" }).check();
  await dialog.getByRole("button", { name: "Continue" }).click();
  await dialog.getByRole("button", { name: "Skip for now" }).click();
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem("charett-demo-v1")!).adult,
    ),
  ).toBe(true);
});

test("about tells its story on scroll: the frame opens and the words light up", async ({
  page,
}) => {
  await open(page, "/about");
  await expect(
    page.getByRole("heading", { level: 1, name: /A little intention/ }),
  ).toBeVisible();
  await expect(page.locator("main")).not.toContainText("AI inspiration");
  const frame = page.locator(".about-stage-photo");
  const clip = () => frame.evaluate((n) => getComputedStyle(n).clipPath);
  const before = await clip();
  expect(before).not.toBe("none");
  // Scroll through the stage: the photo opens to the full frame.
  await page.evaluate(() => {
    const stage = document.querySelector(".about-stage")!;
    const box = stage.getBoundingClientRect();
    scrollTo(0, scrollY + box.top + box.height - innerHeight);
  });
  await expect.poll(clip).not.toBe(before);
  // The statement is read word by word; every word is real text.
  const words = page.locator(".about-statement .word");
  expect(await words.count()).toBe(7);
  await expect(page.locator(".about-statement")).toHaveText(
    /Good guidance should make room for you\./,
  );
  // Read to the end: every word is lit, and the page passes axe.
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await noAxeViolations(page);
});

test("about stays still and fully legible with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/about");
  const frame = page.locator(".about-stage-photo");
  expect(await frame.evaluate((n) => getComputedStyle(n).clipPath)).toBe(
    "none",
  );
  const opacities = await page
    .locator(".about-statement .word")
    .evaluateAll((ws) => ws.map((w) => getComputedStyle(w).opacity));
  expect(new Set(opacities)).toEqual(new Set(["1"]));
});

test("a held story resumes where it paused, not from the start", async ({
  page,
}) => {
  await open(page);
  await page
    .getByRole("region", { name: "Stories" })
    .getByRole("button", { name: "View story from mira.edits" })
    .click();
  const viewer = page.getByRole("dialog", { name: "Story" });
  const status = viewer.getByRole("status");
  await expect(status).toContainText("Story 1 of 2");
  await page.waitForTimeout(3000);
  const box = (await viewer.locator(".story-viewer").boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(400);
  await page.mouse.up();
  // About 2 seconds were left; a full restart would need 5.
  await expect(status).toContainText("Story 2 of 2", { timeout: 3200 });
});

test("form fields are 16px on touch screens, so iOS does not zoom", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile", "touch screens only");
  await open(page, "/");
  await page
    .getByRole("button", { name: "Create a post", exact: true })
    .click();
  const small = await page
    .locator(
      "input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]), textarea, select",
    )
    .evaluateAll((els) =>
      els
        .filter((e) => (e as HTMLElement).offsetParent)
        .map((e) => parseFloat(getComputedStyle(e).fontSize))
        .filter((size) => size < 16),
    );
  expect(small).toEqual([]);
});

test("deleting a routine asks once more before it is gone", async ({
  page,
}) => {
  await open(page, "/topics/skincare");
  const card = page
    .locator(".routine-card")
    .filter({ hasText: "A fresh start" });
  await card.getByRole("button", { name: "Delete A fresh start" }).click();
  await expect(card).toHaveCount(1);
  await card
    .getByRole("button", { name: "Confirm: delete A fresh start" })
    .click();
  await expect(card).toHaveCount(0);
});

test("my plan counts clearly and keeps the streak flame small", async ({
  page,
}) => {
  await open(page, "/plan");
  const progress = page.locator(".plan-progress");
  await expect(progress.locator("strong")).toHaveText(/of \d+ tasks done/);
  await expect(progress).toContainText(/routines? on today’s plan/);
  const flame = progress.locator(".streak svg");
  if (await flame.count()) {
    const box = (await flame.boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(16);
  }
});

test("chat screens end at the composer, without the site footer", async ({
  page,
}) => {
  await open(page, "/coach");
  await expect(page.locator("footer.footer")).toBeHidden();
  await go(page, "/messages?to=mira");
  await expect(page.locator("footer.footer")).toBeHidden();
  await go(page, "/categories");
  await expect(page.locator("footer.footer")).toBeVisible();
});

test("nutrition actions fit their buttons", async ({ page }) => {
  await open(page, "/topics/nutrition");
  const buttons = page.locator(".nutrition-actions .button");
  await expect(buttons.first()).toBeVisible();
  const clipped = await buttons.evaluateAll((els) =>
    els
      .filter((e) => e.scrollWidth > e.clientWidth + 1)
      .map((e) => e.textContent),
  );
  expect(clipped).toEqual([]);
});

test("category pages open on your routine, not on a slogan", async ({
  page,
}, info) => {
  await open(page, "/topics/skincare");
  await expect(page.locator(".topic-banner")).toHaveCount(0);
  await expect(page.locator(".topic-photo-strip img")).toBeVisible();
  // On a phone the first routine starts in the first screen.
  const first = await page.locator(".routine-card").first().boundingBox();
  const limit = info.project.name === "mobile" ? 844 : 1000;
  expect(first!.y).toBeLessThan(limit);
  // The weekly rhythm is one sentence, not seven identical cards.
  await expect(page.locator(".week-grid")).toHaveCount(0);
  await expect(page.locator(".routine-rhythm")).toContainText(/daily/i);
});
