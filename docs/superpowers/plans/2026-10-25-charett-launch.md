# CHARETT launch (round 5) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make CHARETT launch-ready in look and scope: real photography, no AI tells, 16 categories in 5 groups, 8 clothing styles, green streak flames, a borderless profile stats row, a share card and an 18+ gate.

**Architecture:** This stays a front-end React/Vite demo.

- **Category metadata:** one `topics` table in `src/lib/data.ts` gains a `group` field. Per-topic copy and icons stay in `Record<TopicId, …>` maps, so TypeScript forces every new id to be filled in.
- **Photos:** optimised JPGs in `public/assets/photo-*.jpg`, inlined by the standalone build.
- **Styles:** each clothing style is a `.clothing-<id>` class that sets `--style-*` tokens in `src/premium.css`.

**Tech Stack:** React 19, TypeScript, Vite 7, React Router 7, lucide-react, Vitest, Playwright and axe-core, curl and ImageMagick/PIL for images.

**Spec:** `docs/superpowers/specs/2026-10-25-charett-launch-design.md`

## Global Constraints

- English UI.
- Palette:
  - forest `#123D32`, ivory, cream, champagne and ink;
  - **no light green, no pink**;
  - WCAG AA contrast in light and dark mode.
- No face ratings or attractiveness scores anywhere.
- No drugs, hormones, peptides or doses:
  - wherever they come up, show "Hormones or medication only through a doctor.";
  - procedures appear only as "only via a qualified specialist".
- Photos come only from Unsplash (free licence, never `plus.unsplash.com`) or Pexels, are credited in `docs/ASSET_CREDITS.md`, and are ≤ 90 KB each at 1080 px wide.
- Keep the existing TopicIds. `grooming` stays as the id, retitled "Beard & shaving".
- Copy is short and human. The only demo disclaimers are on About and in the checkout.
- At 390 px there is no horizontal overflow and the gutter is 18 px.
- Commits end with the session attribution lines. Push to `claude/relaxed-mayer-u369kh`.

## Review Focus

1. **Stored state from before this round** (old `charett-demo-v1` with `style: "old-money"` and routines on `grooming`). It must still load, with no crash and no lost data. Test: Task 5 unit test `loads legacy state`.
2. **A clothing style id no longer in the list** (for example a stored `style: "y2k"`). It must fall back to `old-money`. Test: Task 8.
3. **A missing photo file in the standalone build.** `asset()` must fall back without a broken image. Test: Task 1 checks every referenced photo key exists in `public/assets`.
4. **Dark mode on the new style moods and the new categories.** Axe must stay clean. Test: Task 8 and Task 11 axe loops in both themes.
5. **The share card on browsers without the Web Share API** (desktop Chrome or Firefox). It must fall back to a download. Test: Task 10 e2e checks that the download fires.

---

### Task 1: Photography pipeline and photo set

**Files:**

- Create: `scripts/fetch-photos.mjs`, `scripts/photos.json`, `public/assets/photo-*.jpg`, `docs/ASSET_CREDITS.md` (append a section)
- Modify: `src/lib/domain.ts` (`asset()` extension map), `scripts/build-standalone.mjs` (keep inlining `.jpg`, already supported)
- Test: `tests/assets.test.ts`

**Interfaces:**

- Produces:
  - image keys used through `asset(key)`: `photo-<slug>`;
  - slugs: `home-hero, skincare, makeup, face, colouring, brows, smile, hair, grooming, gym, nutrition, body, sleep, presence, clothing, fragrance, photos`, plus one per style `style-old-money, style-dark-casual, style-minimalist, style-streetwear, style-smart-casual, style-athleisure, style-preppy, style-bohemian`, plus feed and story images `feed-1 … feed-10`, `ad-1 … ad-3`.

- [ ] **Step 1: Find candidates.** Use `firecrawl_search` with `sources: ["images"]` and queries such as `site:unsplash.com model skincare editorial`. Keep only photos that:
  - are from `images.unsplash.com/photo-…` or `images.pexels.com/photos/…`;
  - show real models;
  - share a warm, muted look;
  - contain no logos or text.

  Record `{slug, source, url, photographer, page}` in `scripts/photos.json`.

- [ ] **Step 2: Write the failing test** `tests/assets.test.ts`. For every `slug` in `scripts/photos.json`, `fs.existsSync("public/assets/photo-<slug>.jpg")` is true and its size is `<= 92160` bytes.
- [ ] **Step 3: Run** `npm test -- assets`. Expected: FAIL (files missing).
- [ ] **Step 4: Implement `scripts/fetch-photos.mjs`.** For each entry, curl the URL with `w=1080&q=80&fm=jpg` (Unsplash) or `?auto=compress&w=1080` (Pexels). Then re-encode with PIL: a gentle warm grade (+4 % red, −3 % saturation), progressive JPEG, quality stepped down until ≤ 90 KB. Save to `public/assets/photo-<slug>.jpg`. Append the credits table to `docs/ASSET_CREDITS.md`.
- [ ] **Step 5: Run the script, then** `npm test -- assets`. Expected: PASS.
- [ ] **Step 6: Commit** `feat: real editorial photography set`.

### Task 2: Remove AI tells and apply the editorial visual pass

**Files:**

- Modify: `src/lib/editorial.ts`, `src/components/ui.tsx` (Empty), `src/pages/Coach.tsx` (orb), `src/pages/Topic.tsx` and `src/pages/Guide.tsx` (`isAIEditorial` credit), `src/lib/data.ts` (post images go to `photo-feed-*`), `src/premium.css` (new "Round 5" section at the end)
- Create: `src/components/Monogram.tsx`
- Test: `tests/e2e/launch.spec.ts`

**Interfaces:**

- Produces: `Monogram({ size?: number })`, a thin-circle "C" SVG with `aria-hidden`. `topicPhoto(id: TopicId): string` in `src/lib/editorial.ts` returns `photo-<id>`.
- Consumes: the photo keys from Task 1.

- [ ] **Step 1: Write the failing test** `no AI tells on key routes`. For `/`, `/categories`, `/topics/skincare`, `/coach` and `/about`:
  - `page.getByText(/AI editorial|AI fictional|AI fashion/)` has count 0;
  - `.empty-mark` has count 0;
  - `.coach-orb` has count 0;
  - `main svg.lucide-sparkles` has count 0.
- [ ] **Step 2: Run** `CHARETT_CHROMIUM=/opt/pw-browsers/chromium npx playwright test launch -g "no AI tells"`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - `topicPhoto` replaces `topicEditorial`. Delete `isAIEditorial` and its credit spans.
  - The Empty state uses `<Monogram />`. The coach header and welcome use `Monogram`.
  - Sparkles is removed where it is decoration: the editorial notes, upgrade cards and guide CTA.
  - Seed posts and stories use the `photo-feed-*` images.
  - CSS pass:
    - `--radius: 10px`, `--radius-lg: 14px`;
    - shadows reduced to `0 1px 2px rgb(0 0 0 / 4%)`;
    - section titles in sans 600 with Cormorant only on `h1`, `.page-header h1` and big numbers;
    - eyebrows used at most once per section (drop them from the topic banners).
- [ ] **Step 4: Run** the test, then the full `npx playwright test`. Expected: PASS. Fix only tests whose copy or structure changed on purpose.
- [ ] **Step 5: Commit** `feat: editorial visual pass without AI tells`.

### Task 3: Green streak flame

**Files:**

- Create: `src/components/StreakFlame.tsx`
- Modify: `src/pages/Messages.tsx:239,278,111`, `src/pages/Plan.tsx:93`, `src/components/Routines.tsx:43-44`, `src/components/Training.tsx:465`, `src/premium.css`
- Test: `tests/e2e/launch.spec.ts`

**Interfaces:**

- Produces: `StreakFlame({ count: number; label?: string })`. It renders `<span class="streak" aria-label={label ?? \`${count}-day streak\`}><svg …/> {count}</span>`. The flame is filled with `var(--forest-text)`. Toasts use the text "`n`-day streak" (no emoji).

- [ ] **Step 1: Write the failing test** `streaks show a green flame, never an emoji`. On `/messages`:
  - the Mira row contains `.streak svg`;
  - `page.getByText("🔥")` has count 0;
  - the computed `fill` of `.streak svg path` equals the computed `--forest-text`.

  Repeat the `.streak` visible check on `/plan`.

- [ ] **Step 2: Run it.** Expected: FAIL.
- [ ] **Step 3: Implement** the component, replace every `🔥` usage, and place the flame right after the name in the conversation list and header.
- [ ] **Step 4: Run** it. Expected: PASS.
- [ ] **Step 5: Commit** `feat: green streak flame`.

### Task 4: Profile stats without frame

**Files:**

- Modify: `src/premium.css` (mobile `.profile-stats` block)
- Test: `tests/e2e/premium.spec.ts` (extend `profiles show stats once…`)

- [ ] **Step 1: Add the assertion.** At 390 px, the computed `.profile-stats` `border-top-width` is `0px` and the second `li` has `border-left-width` `0px`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Remove the borders and dividers.** Keep the 4-column grid and centring, with `margin: 18px 0`.
- [ ] **Step 4: Run.** Expected: PASS. **Commit** `fix: profile stats without frame`.

### Task 5: Category model — 16 topics in 5 groups

**Files:**

- Modify: `src/lib/types.ts` (TopicId), `src/lib/data.ts` (`topics` gains `group`, plus new entries, items, routines and brands), `src/pages/Categories.tsx` (grouped list and icons), `src/pages/Community.tsx` (chip order by group)
- Test: `tests/topics.test.ts`

**Interfaces:**

- Produces:
  - `type TopicGroup = "face" | "hair" | "body" | "style" | "progress"`;
  - `topics[i].group: TopicGroup`;
  - `export const topicGroups: { id: TopicGroup; title: string }[]` with titles `Face, Hair, Body, Style, Progress`;
  - new TopicIds `makeup, face, colouring, brows, nutrition, body, sleep, presence`.
- New titles:
  - `face` "Face structure", `colouring` "Colouring", `brows` "Brows & lashes", `body` "Body care & nails", `sleep` "Sleep & recovery", `presence` "Posture & presence";
  - `grooming` is retitled "Beard & shaving";
  - `gym` is retitled "Gym & physique".

- [ ] **Step 1: Write failing unit tests.**
  - `every topic has a group and a unique number`: there are 16 topics and the numbers run 01–16.
  - `groups are in order`: the order is face, hair, body, style, progress.
  - `loads legacy state`: `makeInitialState()` merged with `{style: "old-money", routines on grooming}` keeps those routines.
- [ ] **Step 2: Run** `npm test -- topics`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Data: each new topic gets 2–4 seed items under a house brand, one seed routine, and a subtitle.
  - Categories page: render a section per group with an `h2` holding the group title, and the existing row markup.
  - TypeScript then flags each `Record<TopicId,…>` map (icons, guides, banner and note). Fill all of them in Task 6.
- [ ] **Step 4: Run** unit tests and `npx tsc -b`. tsc failures are expected only in the maps that Task 6 fills, so do Task 6 before committing.

### Task 6: Content for the new categories (guides, banners, tips, routes)

**Files:**

- Modify: `src/lib/guides.ts` (8 new guides; brows split from grooming), `src/pages/Topic.tsx` (banner and note maps; tabs per new topic), `src/main.tsx` (no new routes needed — `/topics/:topic` already covers them), `src/pages/Gym.tsx` (remove the Nutrition and Posture tabs), `src/lib/services.ts` (coach `specific` and `nextQuestion` for the new ids)
- Test: `tests/e2e/launch.spec.ts`

**Interfaces:**

- Consumes: Task 5 topics.
- The `nutrition` topic page renders `<Nutrition />` as its first tab. The `presence` page renders the existing posture content plus routines.
- The `face` guide's routine section has four chapters titled exactly `Eye area`, `Maxilla & midface`, `Cheekbones (zygos)`, `Jaw (mandible) & chin`. Each has three parts in its text:
  - **Do yourself:** …
  - **Doesn't work:** …
  - **Specialist:** only via a qualified specialist …

- [ ] **Step 1: Write failing tests.**
  - `every category page and guide renders`: for all 16 ids, `/topics/<id>` has an `h1` equal to the title, and `/topics/<id>/guide` shows the "Put it together" heading.
  - `face structure covers the four areas honestly`: the four chapter titles are visible, and `main` does not match `/testosterone|steroid|peptide|dose|mg\b/i`.
  - `nutrition has its own category`: `/topics/nutrition` shows "Calorie calculator".
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Write the guides in the existing `Guide` shape** (products, routine, works, skip, remember).
  - **Makeup** covers both women and men (tinted moisturiser, concealer, brow gel, mascara, lip, contour; a day look and an evening look).
  - **Colouring** covers undertone, contrast, the colours that suit you, and safe tanning (self-tan only; no tanning drugs).
  - **Body care, Sleep, Presence** each get their own concrete guide.
  - Add banner and note entries for every new id.
  - Gym keeps "Training & history" only and links to Nutrition and Presence.
- [ ] **Step 4: Run** the tests and the full suites. Update tests that used Gym's Nutrition and Posture tabs to the new routes.
- [ ] **Step 5: Commit** (with Task 5) `feat: 16 categories in 5 groups with guides`.

### Task 7: Category photos and feed chips

**Files:**

- Modify: `src/pages/Topic.tsx` (banner image uses `topicPhoto(id)`), `src/pages/Categories.tsx` (optional 56 px photo thumb instead of the icon circle), `src/pages/Community.tsx` (chips grouped: styles first, then topics in group order)
- Test: `tests/e2e/launch.spec.ts`

- [ ] **Step 1: Write the failing test** `topic banners use real photos`. For 5 sample ids, `.topic-banner img` has a `src` containing `photo-<id>`.
- [ ] **Step 2: Run.** Expected: FAIL. **Step 3:** Implement. **Step 4:** Run. Expected: PASS. **Step 5: Commit** `feat: category photography`.

### Task 8: Eight clothing styles with moods

**Files:**

- Modify: `src/lib/types.ts` (ClothingStyle), `src/pages/Clothing.tsx` (`themes` array and the switcher as a scrolling pill row), `src/lib/store.tsx` (validate stored style), `src/pages/Community.tsx` (style chips), `src/lib/data.ts` (one seed post per new style using `photo-style-*`), `src/premium.css` (`.clothing-<id>` tokens and mood rules)
- Test: `tests/e2e/launch.spec.ts`, `tests/topics.test.ts`

**Interfaces:**

- `ClothingStyle = "old-money" | "dark-casual" | "minimalist" | "streetwear" | "smart-casual" | "athleisure" | "preppy" | "bohemian"`.
- `export const clothingStyles: { id: ClothingStyle; label: string; desc: string; hero: string; sub: string }[]` moves to `src/lib/data.ts`.
- Mood tokens:
  - streetwear `--style-bg #111111, --style-ink #f5f5f2, --style-accent #e0642b`;
  - smart casual `#f7f8fa / #14213d / #14213d`;
  - athleisure `#2b2d2f / #ecebe7 / #b9b4aa`;
  - preppy `#f6f1e6 / #1d2b4f / #7a2433`;
  - bohemian `#f3e7d6 / #3d2a1e / #a8552f`.

  Adjust shades only to reach AA.

- [ ] **Step 1: Write failing tests.**
  - `all eight styles switch the page mood`: for each style, click its pill, then `.clothing-page` has class `clothing-<id>`, and axe is clean in light and dark mode.
  - Unit test `unknown stored style falls back`: stored `"y2k"` becomes `old-money`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** Streetwear uses square corners and bold condensed uppercase headings. Preppy gets a thin stripe band on the hero. Bohemian uses a soft serif and warm paper.
- [ ] **Step 4: Run.** Expected: PASS. **Commit** `feat: eight clothing styles with their own moods`.

### Task 9: 18+ gate in the intake

**Files:**

- Modify: `src/components/Intake.tsx`, `src/lib/types.ts` (`adult?: boolean` on DemoState), `src/lib/store.tsx` (persist `adult`)
- Test: `tests/e2e/launch.spec.ts`

- [ ] **Step 1: Write the failing test** `intake asks for 18+`. On the fresh intake, "Continue" is disabled until the checkbox "I'm 18 or older" is checked. "Skip for now" stays available and still lets the person browse.
- [ ] **Step 2:** Run. FAIL. **Step 3:** Implement. **Step 4:** Run. PASS. **Commit** `feat: 18+ confirmation`.

### Task 10: Share card (distribution hook)

**Files:**

- Create: `src/lib/shareCard.ts`, `src/components/ShareCard.tsx`
- Modify: `src/components/Social.tsx` (ShareDialog adds "Share to Instagram / TikTok"), `src/components/Training.tsx` (PR banner "Share card")
- Test: `tests/shareCard.test.ts`, `tests/e2e/launch.spec.ts`

**Interfaces:**

- `renderShareCard(opts: { title: string; subtitle: string; image?: string; kind: "post" | "outfit" | "pr" }): Promise<Blob>` draws a 1080×1920 canvas: the photo, a forest band, the title in Cormorant, and the CHARETT wordmark.
- `shareOrDownload(blob: Blob, name: string): Promise<"shared" | "downloaded">` uses `navigator.share({ files })` when `navigator.canShare?.({ files })`, otherwise triggers an `<a download>`.

- [ ] **Step 1: Write the failing tests.**
  - Unit: `shareOrDownload falls back to download` (no `navigator.share`) returns `"downloaded"`.
  - e2e: from a post's share dialog, clicking "Share to Instagram / TikTok" fires a `download` event whose file name ends in `.png`.
- [ ] **Step 2:** Run. FAIL. **Step 3:** Implement. **Step 4:** Run. PASS. **Commit** `feat: share cards for Instagram and TikTok`.

### Task 11: Full audit, docs, screenshots, preview, PR

**Files:**

- Modify: `docs/PROGRESS.md`, `docs/DESIGN_SYSTEM.md`, `docs/screenshots/premium/v5-*.jpg`, `scripts/verify-published-demo.mjs` (if headings changed)
- Test: all suites

- [ ] **Step 1: Run the axe and overflow audit** over all 16 topic routes, `/`, `/plans`, `/settings`, `/profile`, `/messages` and `/coach`, at 390 px and 1440 px, in light and dark mode. Expected: 0 violations and no overflow. Fix what fails.
- [ ] **Step 2: Do a visual pass** from screenshots of every route at both widths. Fix misalignments.
- [ ] **Step 3: Run** `npx tsc -b && npx eslint . && npx prettier --check src tests && npm test && CHARETT_CHROMIUM=/opt/pw-browsers/chromium npx playwright test`. Expected: all green.
- [ ] **Step 4:** Update the docs (round 5 section, credits) and screenshots. Run make-preview, republish the artifact, and update the PR #1 body.
- [ ] **Step 5: Commit and push** `docs: round 5`.

## Phase mapping (preview after each)

| Phase | Tasks      |
| ----- | ---------- |
| A     | Tasks 1–4  |
| B     | Tasks 5–7  |
| C     | Task 8     |
| D     | Tasks 9–11 |
