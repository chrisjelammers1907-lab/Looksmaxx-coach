# CHARETT launch design — round 5

Date: 2026-10-25 · Branch: `claude/relaxed-mayer-u369kh` · Status: awaiting owner review

## 1. Intent

The owner wants to launch CHARETT commercially as a premium self-improvement app. They asked for four things:

- Make it as beautiful as possible.
- Make it feel human-designed and high-end, not AI-made.
- Cover every relevant looksmaxxing category.
- Keep the current layout largely intact.

The Decision Council advised a narrower v1 positioning, and the owner agreed to it:

- **18+** product.
- **No face ratings** or attractiveness scores, anywhere.
- **Coach and plan first.** The social feed stays as inspiration and sharing, not a full social network.
- **Nothing extreme.** No testosterone, steroids, peptides, DNP or other drugs, and no doses. Where hormones or medication come up, the copy says "Hormones or medication only through a doctor." Procedures are named only as "via a qualified specialist".

**Owner said:**

- Add all relevant categories, including makeup.
- Face areas: maxilla, zygos, mandible, chin, eye area, colouring.
- Use real photos with models.
- Add more clothing styles, each with its own page style and filter.
- A green streak flame next to the name, also for routine and gym streaks.
- Remove the frame around the profile stats.

**Assumed** (the owner can correct these):

- English UI.
- Prices and tiers unchanged (Free / Plus €9.99 / Signature €19.99).
- Still a front-end demo: no backend, accounts or payments in this round.
- Only the five skincare PDFs are available in this session. The face-structure content is written from general softmaxxing knowledge, and the owner may supply more PDFs later.

**Success criteria:**

- Every screen reads as designed by a studio:
  - real photography;
  - no AI tells;
  - consistent spacing.
- 16 categories in 5 logical groups, each with a routine, guide, chips, products and photos.
- 8 clothing styles, each with a distinct page mood.
- Green streak flames everywhere a streak shows.
- All tests pass, axe finds no violations in light and dark mode, and there is no horizontal overflow at 390 px.

## 2. Visual direction — "editorial, not generated"

Remove the AI tells:

1. **Photography**
   - Real Unsplash/Pexels photos with models, women and men, licensed for free commercial use. Unsplash+ is never used.
   - Images are colour-graded consistently (warm, slightly muted) and stored as optimised JPGs (≤ ~90 KB at 1080 w).
   - Credits go in `docs/ASSET_CREDITS.md`.
   - The "AI editorial inspiration" labels and AI image files are removed.
2. **Fewer cards, more editorial structure**
   - Hairline rules, generous whitespace and smaller radii: cards 10 px, buttons 999 px kept for pills only, inputs 8 px.
   - Almost no shadows.
   - The cream-card-with-italic-headline pattern is no longer repeated on every page.
3. **Typography**
   - Cormorant Garamond only for page titles and big numbers, and italics used sparingly.
   - DM Sans for everything else, on a tighter type scale.
   - Fewer uppercase eyebrows: at most one per section.
4. **Iconography**
   - Remove the Sparkles icon as decoration, the "C" empty-state mark, the glowing coach orb and emoji.
   - Use an own monogram mark (a CHARETT "C" in a thin circle, SVG) and line icons only.
5. **Copy**
   - Short and human. Demo disclaimers live on About only.

Layout, navigation, the palette (forest #123D32 with ivory, cream, champagne and ink) and the dark mode stay.

## 3. Information architecture — 16 categories in 5 groups

| Group    | Category id | Title              | Notes                                                                                                            |
| -------- | ----------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Face     | `skincare`  | Skincare           | existing                                                                                                         |
| Face     | `makeup`    | Makeup             | **new** — base, concealer, brows, eyes, lips, contour; day and evening looks; for women and men                  |
| Face     | `face`      | Face structure     | **new** — sections: Eye area · Maxilla & midface · Cheekbones (zygos) · Jaw (mandible) & chin                    |
| Face     | `colouring` | Colouring          | **new** — skin undertone, contrast, hair and brow colour, colours that suit you, safe tanning (no tanning drugs) |
| Face     | `brows`     | Brows & lashes     | split from grooming                                                                                              |
| Face     | `smile`     | Teeth & smile      | existing                                                                                                         |
| Hair     | `hair`      | Hair               | existing                                                                                                         |
| Hair     | `grooming`  | Beard & shaving    | grooming is renamed; keeps its id for stored data                                                                |
| Body     | `gym`       | Gym & physique     | existing; nutrition and posture move out                                                                         |
| Body     | `nutrition` | Nutrition          | **new** route using the existing `Nutrition` component                                                           |
| Body     | `body`      | Body care & nails  | **new**                                                                                                          |
| Body     | `sleep`     | Sleep & recovery   | **new**                                                                                                          |
| Body     | `presence`  | Posture & presence | **new** — posture (moved from gym), eye contact, voice, photos of yourself                                       |
| Style    | `clothing`  | Clothing & style   | existing, 8 styles                                                                                               |
| Style    | `fragrance` | Fragrance          | existing                                                                                                         |
| Progress | `photos`    | Photos & progress  | existing                                                                                                         |

**Face structure honesty rule.** Each area has the same three parts:

- **What you can do yourself:** body fat, posture and head position, sleep, beard shaping, haircut framing, brow shape, makeup contour, under-eye care.
- **What doesn't work:** jaw exercisers, gua sha "reshaping bone", mewing promises for adults, face-yoga claims.
- **Specialist options:** orthodontics, fillers and surgery, as "only via a qualified specialist". No prices, doses or promotion.

**Where categories show:**

- The Categories page shows grouped sections with a group heading.
- The Home chips follow the same order.
- Every category has a guide (same how-to template), at least one seed routine, 2–4 seed products, a banner (own eyebrow and headline), a practical tip and a real photo.
- `TopicId` grows. Stored data stays compatible because existing ids are kept.

## 4. Clothing — 8 styles

Existing: Old money · Dark casual · Minimalist. New:

| Style        | Page mood (no light green, no pink)                                                 |
| ------------ | ----------------------------------------------------------------------------------- |
| Streetwear   | near-black and white, safety-orange accent, square corners, bold condensed headings |
| Smart casual | navy and white, crisp grid, thin rules                                              |
| Athleisure   | charcoal and stone, sporty sans, rounded pills                                      |
| Preppy       | navy, cream and burgundy, subtle stripe band                                        |
| Bohemian     | terracotta, sand and ochre, soft serif, warm paper                                  |

- Each style has its own hero copy, photo, `--style-*` tokens and feed chip.
- The switcher becomes a horizontal scroll row of 8 pills.
- Each mood passes axe contrast checks.

## 5. Streaks

- An own `StreakFlame` SVG component in forest green; in dark mode it uses `--forest-text`.
- It replaces the 🔥 emoji everywhere:
  - in chat, next to the conversation name, in the list and the header;
  - in the plan's routine streak;
  - in the gym training streak;
  - in unlock toasts.
- The count sits beside the flame.

## 6. Profile

- Remove the borders and dividers around the stats row.
- Keep the centred numbers over labels.

## 7. Feed scope (v1)

- Keep: the feed (photos and reels), stories, comments, shop the look and messages.
- Add: a "Share to Instagram/TikTok" card export.
  - It is a share sheet with an image card of a post, outfit or progress milestone, using the Web Share API with a fallback to download.
  - It is the distribution hook from the council advice.
- Add an **18+ confirmation** in the intake.

## 8. Testing

- Existing e2e and unit suites keep passing. Tests are updated only where copy or structure intentionally changes.
- New tests:
  - grouped categories page and new topic routes;
  - every guide renders;
  - the 8 clothing styles switch and pass axe;
  - the streak flame shows in chat, plan and gym;
  - profile stats have no border;
  - the share card;
  - the 18+ gate.
- Axe in light and dark mode on the new routes. Overflow check at 390 px.

## 9. Phases (with a preview after each)

- **A.** Visual system: photography pipeline and images, typography and radius pass, AI tells removed, streak flame, profile stats.
- **B.** Categories: IA, the eight new categories, guides, routines, products, and the gym, nutrition and presence split.
- **C.** Clothing: 8 styles with moods and feed chips.
- **D.** Share card, 18+ gate, full audit, docs, screenshots and PR update.

## 10. Out of scope

- A real backend, accounts, payments or a live AI coach.
- Store submission.
- Trademark or legal checks; the owner does these.
