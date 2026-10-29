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

test("about tells the CHARETT story while he walks in and turns to face you", async ({
  page,
}) => {
  await open(page, "/about");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "I always wanted to build something of my own.",
    }),
  ).toBeVisible();
  // Every chapter is real text, readable without scrolling through it.
  for (const line of [
    "It started on TikTok, at the end of 2023.",
    "Chico. Barrett. CHARETT.",
    "Too many promises. Too little proof.",
    "For anyone who looks in the mirror and wants more.",
    "Honest about what works. Clear about what doesn’t.",
  ])
    await expect(page.getByRole("heading", { name: line })).toBeAttached();
  const canvas = page.locator(".about-turn canvas");
  await expect(canvas).toHaveAttribute("data-frame", "0");
  // The film starts right under the masthead, with no strip of page between.
  const seam = await page.evaluate(
    () =>
      document.querySelector(".about-story")!.getBoundingClientRect().top -
      document.querySelector(".site-header")!.getBoundingClientRect().bottom,
  );
  expect(Math.round(seam)).toBe(0);
  const scrollStory = (share: number) =>
    page.evaluate((share) => {
      const story = document.querySelector(".about-story")!;
      const box = story.getBoundingClientRect();
      const top = scrollY + box.top;
      window.scrollTo(0, top + (box.height - innerHeight) * share);
    }, share);
  await scrollStory(0.5);
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-frame")))
    .toBeGreaterThan(20);
  // He fills the app frame edge to edge and the full height, really drawn.
  const fill = await canvas.evaluate((c: HTMLCanvasElement) => {
    const box = c.getBoundingClientRect();
    const shell = document
      .querySelector(".site-shell")!
      .getBoundingClientRect();
    const px = c
      .getContext("2d")!
      .getImageData(c.width >> 1, c.height >> 1, 1, 1).data;
    return {
      left: Math.round(box.left - shell.left),
      width: Math.round(box.width - shell.width),
      top: Math.round(box.top),
      height: Math.round(box.height) - innerHeight,
      drawn: px[3] > 0,
    };
  });
  expect(fill).toEqual({ left: 0, width: 0, top: 0, height: 0, drawn: true });
  // The text scrolls with the page instead of swapping in place.
  const heading = page.getByRole("heading", {
    name: "Too many promises. Too little proof.",
  });
  const before = (await heading.boundingBox())!.y;
  await page.evaluate(() => window.scrollBy(0, 200));
  await expect
    .poll(async () => Math.round(before - (await heading.boundingBox())!.y))
    .toBe(200);
  await scrollStory(1);
  await expect(canvas).toHaveAttribute("data-frame", "119");
  await expect(
    page.getByRole("link", { name: /Find your starting point/ }).first(),
  ).toBeInViewport();
  // Once the story ends, the film stops with it: the next section is not
  // covered.
  const next = page.getByRole("heading", { name: "A conversation" });
  await next.scrollIntoViewIfNeeded();
  const onTop = await next.evaluate((h) => {
    const r = h.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + 4, r.top + r.height / 2);
    return !!hit && h.contains(hit);
  });
  expect(onTop).toBe(true);
  await noAxeViolations(page);
});

test("about is one still portrait and the full story with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/about");
  await expect(page.locator(".about-turn canvas")).toHaveCount(0);
  await expect(page.locator(".about-turn img")).toBeVisible();
  const hidden = await page
    .locator(".story-chapter")
    .evaluateAll(
      (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length,
    );
  expect(hidden).toBe(0);
  await noAxeViolations(page);
});

test("Photos and Reels stay in reach while you scroll the feed", async ({
  page,
}) => {
  await open(page, "/");
  await page.getByRole("tab", { name: "Photos" }).click();
  await page.mouse.wheel(0, 2500);
  const reels = page.getByRole("tab", { name: "Reels" });
  await expect(reels).toBeInViewport();
  await reels.click();
  await expect(reels).toHaveAttribute("aria-selected", "true");
});

test("reels play by themselves, muted, with one sound switch", async ({
  page,
}) => {
  await open(page, "/");
  await page.getByRole("tab", { name: "Reels" }).click();
  const reel = page.locator(".post-card").filter({
    has: page.getByRole("heading", { name: "A moment in motion", exact: true }),
  });
  await reel.locator(".post-media").scrollIntoViewIfNeeded();
  const video = reel.locator("video");
  // No tap needed: it plays, muted, and the big play button stays away.
  await expect
    .poll(() =>
      video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0.1),
    )
    .toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  await expect(
    reel.getByRole("button", { name: "Pause video A moment in motion" }),
  ).toHaveCSS("opacity", "0");
  const audio = reel.locator("audio");
  await reel.getByRole("button", { name: "Turn sound on for reels" }).click();
  await expect
    .poll(() =>
      audio.evaluate((a: HTMLAudioElement) => !a.paused && a.currentTime > 0.1),
    )
    .toBe(true);
  await reel.getByRole("button", { name: "Turn sound off for reels" }).click();
  await expect
    .poll(() => audio.evaluate((a: HTMLAudioElement) => a.paused))
    .toBe(true);
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
});

test("every tab has a real name", async ({ page }) => {
  for (const [path, title] of [
    ["/", "CHARETT"],
    ["/coach", "AI Coach · CHARETT"],
    ["/plans", "Membership · CHARETT"],
    ["/topics/skincare", "Skincare · CHARETT"],
    ["/profile/mira", "Mira Laurent · CHARETT"],
    ["/no-such-page", "Page not found · CHARETT"],
  ]) {
    await open(page, path);
    await expect(page).toHaveTitle(title);
  }
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
});

test("the About frames never load on other pages", async ({ page }) => {
  const frames: string[] = [];
  page.on("request", (r) => {
    if (r.url().includes("about-turn")) frames.push(r.url());
  });
  await open(page, "/");
  await go(page, "/categories");
  expect(frames).toEqual([]);
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
  await expect(progress.locator("strong")).toHaveText(
    /^\d+ of \d+ done today$/,
  );
  await expect(progress).toContainText(/\d+ routines? · \d+ tasks?/);
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

test("the plans page sells outcomes without a SaaS badge", async ({ page }) => {
  await open(page, "/plans");
  await expect(page.getByText("Most popular")).toHaveCount(0);
  await expect(page.locator(".plan-card h2 svg")).toHaveCount(0);
  await expect(
    page.getByRole("radio", { name: /2 months free/ }),
  ).toBeVisible();
  await expect(page.locator(".plan-extras").first()).toBeVisible();
});

test("my plan is one day: routines and tasks in one list", async ({ page }) => {
  await open(page, "/plan");
  await expect(page.locator(".plan-page .routine-card")).toHaveCount(0);
  const today = page.locator(".task-group-today");
  const routine = today.locator(".routine-line").first();
  await expect(routine).toBeVisible();
  await expect(
    today.locator(".goal-row:not(.routine-line)").first(),
  ).toBeVisible();
  const count = page.locator(".plan-progress strong");
  const before = Number((await count.textContent())!.split(" ")[0]);
  // The steps are one tap away, and the routine is done in one tap.
  await routine.locator("summary").click();
  await expect(routine.locator("ol li").first()).toBeVisible();
  await expect(routine.getByRole("link", { name: /Edit in/ })).toBeVisible();
  await routine.getByRole("button", { name: /^Mark .* done$/ }).click();
  await expect(count).toHaveText(new RegExp(`^${before + 1} of`));
  await noAxeViolations(page);
});
