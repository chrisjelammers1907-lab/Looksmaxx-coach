# CHARETT

A polished English-language personal appearance and lifestyle **interactive demo** for mobile and desktop. React 19, TypeScript, Vite, React Router and a shared typed local store. Original editorial identity, eight directly routable topics, three clothing themes, private routines/progress, outfit building, a fictional community and clearly simulated coach/messages/shopping/visualizations.

## Open the demo

**[Open CHARETT](https://chrisjelammers1907-lab.github.io/Looksmaxx-coach/)** and choose **Skip for now** or complete the intake. No download or installation is needed.

The published website was verified without a login in Chrome at desktop and mobile sizes. All eight topics, route reloads, wardrobe editing, comments, simulated linked-card messaging, coach changes and profile navigation passed without browser errors. See [publication evidence](docs/WEB_PUBLICATION.md). Only fictional demo content is included; personal edits and uploads remain local to the current tab as described below.

## Second-version experience

Home is the **For You / Following** photo-and-video feed. **Categories** explains all eight topic tools and gives permanent access to a beginner guide in each. **AI Coach**, **My Plan** and **Messages** are main navigation items. Profile/private saves and **About us** are accessible from the avatar menu.

The coach has no topic filter; clearly labelled sample replies use the question and session context. Post topics and extra metadata are optional. Search and refinement are hidden until requested. Feed photos are proportionally framed to 1080 × 1350–1920, and private test videos support MP4/WebM within the displayed limits. Personal uploads remain private; only fictional editorial examples can be shared in public demo posts. Account visibility and each journal audience preference are separate local simulations.

Read [the accepted feedback and review gates](docs/ITERATION_2.md). The guides visibly explain how the supplied reference files were used, distinguish unsupported claims, and provide official further-reading links. They are general education, not treatment protocols or validated personal medical advice.

## Run

Use Node **24.19.0** (`.nvmrc`) and npm. No API keys, backend, database, payment account or secrets are needed.

```bash
cd /workspace/Looksmaxx-coach
npm ci --cache /tmp/charett-npm-cache --no-audit --no-fund
npm run web-preview
```

`bash scripts/setup.sh` is the tested reusable installation/build script.

The web preview builds the app and serves it on **port 3000**, host `0.0.0.0`. Keep this process running while using the workspace visualization. The compiled preview does not depend on development hot-reload connections. From another terminal, `curl -fsS -H 'Host: chatgpt.com' http://127.0.0.1:3000/` should return the CHARETT HTML document. The ChatGPT gateway host and its cloud-environment subdomains are explicitly allowed; unrelated hostnames remain blocked. Both servers use strict ports so a busy port produces an actionable error instead of silently moving the app.

For development with hot reload, run `npm run dev` in a second terminal; it listens on **port 5173** and host `0.0.0.0`. Use the workspace's supported browser/port access to open the app. Do not create a new Git worktree: use the existing isolated checkout.

```bash
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npm run test:e2e
```

`npm test` runs domain tests with Vitest. Browser tests use Playwright and the environment's `/usr/bin/chromium`, at 1440×1000 and 390×844. They start the development server (5173) and compiled preview (3000) automatically when needed. Preview regression tests exercise real browser navigation through a local forwarding server with the ChatGPT Host header; they also verify unrelated hosts are rejected. This is not a claim to control or authenticate to the outer `chatgpt.com/local/...` interface. Set `CHARETT_CHROMIUM=/absolute/path/to/chromium` if the binary is elsewhere. On a machine without Chromium, install a trusted Chromium build or use `npx playwright install chromium` and set `CHARETT_CHROMIUM` to its installed executable. No browser-install download was required in this cloud environment. Reports/traces/screenshots under `playwright-report/` and `test-results/` are ignored by Git.

To serve the compiled demo:

```bash
npm run build
npm run preview -- --port 4173
```

For the standalone Pages export, run `node scripts/build-standalone.mjs`; it regenerates `demo/CHARETT-demo.html` with embedded assets and hash routes.

For future static hosting, serve `dist/` and rewrite unknown app routes to `index.html`. No deployment or publication is performed by these commands.

## Try the selected journeys

1. Complete or skip the two-step intake. Edit shared preferences in **My profile**. The starter profile is fictional; it does not contain the owner's facts.
2. Explore all eight topics from Categories. Add/edit/reorder/delete owned products; create AM/PM routines and weekly schedules. Hair offers saved comparisons and a labelled visualization placeholder. Grooming, smile care and fragrance have editable personal collections and notes.
3. Open **Clothing & Style**. Switch Old money / Dark casual / Minimalist; each theme stays within that entire section and persists locally. Add wardrobe items with optional private photos, build/edit/save/duplicate outfits, inspect known/unknown/mixed-currency prices, and optionally attach a private real worn-outfit photo.
4. For public sharing, make the demo account public in **My profile → Account privacy**, or approve the fictional recipient as a follower of the private account. **Preview & share outfit** creates a separate fictional post draft with an explicit audience. The preview shows the author identity, public text, tags, editorial reference and structured item details. Private uploaded images are excluded. Do not enter real personal routines into public demo posts.
5. Explore posts, filter by topic/style/occasion/season/tags/budget, follow fictional creators, like, privately save, comment, and copy outfits or routines. Copies are independent editable private content, never an automatic medical recommendation. All copied topic routines are accessible in **My plan → private ritual library**.
6. Share an accessible editorial post/outfit/product/routine reference as a rich card in **Messages**. Simulated requests can be accepted/declined; conversations can be reported or blocked. Deleted or newly private content becomes unavailable to recipients. No message leaves the browser.
7. Log a workout, edit its sets/reps/load, review history/volume, edit the training week, log food estimates and change nutrition targets. Food sources are manually entered; no food database or individualized target calculation is claimed.
8. Add two private real progress photos of the same topic, date/tag them and use the comparison slider. Edited/generated inspiration is a separate category excluded from progress comparisons. Delete either photo or reload to remove session content.
9. Ask the **simulated coach**, optionally attach a private photo, inspect a proposed goal and apply it intentionally. Sample feedback never claims to analyze the photo. Existing routines never change silently.
10. Reset the demo in **My profile**, or remove private details separately.

## Privacy and simulation boundaries

| Data                                                                                                                                                  | Lifetime / behavior                                     |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Profile edits, own products/wardrobe/outfits/routines, food/workout logs, goals, notes, uploaded photos, coach turns, messages and new posts/comments | Memory in the current tab; reload or reset clears them  |
| Clothing theme, intake completion and likes/saves/follows/blocks/reports involving seeded fictional content                                           | Small allowlisted localStorage record; reset removes it |
| Owner PDFs, health-related profile, ChatGPT exports, personal Library photos and secrets                                                              | Not embedded in the app or committed to Git             |

The app has **no real authentication or secure private account isolation**. Browser memory and localStorage are not production security controls. “Private” describes local demo behavior and access-aware card logic. AI coaching, image understanding/generation, prices, shopping, social activity, delivery and notifications are labelled examples; no paid APIs or live integrations are called. Fictional creators are not the people in stock photographs. Generated/edited inspiration never counts as achieved progress.

Reference PDFs were extracted and spot-inspected outside the checkout, not validated as medical evidence or imported as personal plans. No owner's photos or routines were supplied or used as public content.

## Structure and delivery documents

- `src/components/`: shared accessible controls, collections, routines and social cards.
- `src/lib/`: typed models, seeded fictional data, guarded local persistence, pricing/access rules and replaceable service contracts.
- `src/pages/`: topic workflows, clothing, community, plan, profiles, coach and messaging.
- `tests/`: domain invariants and real Chromium journeys at both viewport sizes.
- [Original brief](docs/BUILD_BRIEF.md), [product spec](docs/PRODUCT_SPEC.md), [design system](docs/DESIGN_SYSTEM.md), [milestones](docs/IMPLEMENTATION_PLAN.md).
- [Source inventory](docs/SOURCE_INVENTORY.md), [asset credits](docs/ASSET_CREDITS.md), [validation evidence](docs/PROGRESS.md).
- [Production roadmap](docs/PRODUCTION_ROADMAP.md) and [10/100/1,000-user cost model](docs/COST_ESTIMATE.md).

Current official AI/auth pricing could not be verified through the network policy, so the cost model gives verified infrastructure subtotals and explicit AI/search/auth formulas rather than a fabricated all-in total. Safari, Firefox, real accounts, real message delivery and model outputs are not claimed as verified. CHARETT trademark/domain availability is unverified.

### Editorial design and post sounds

The third iteration adds original, labelled AI editorial imagery and a consistent forest/ivory/rose/amber visual direction. Home remains For You and all eight category tools/guides remain available. To try sounds: **Create a post → Add sound → preview an instrumental → Use sound → adjust volume → Preview audience & content → Save private post**. Sounds work with photos and videos; video posts also expose original-video volume. Use the sound play button below a post's image. Playback pauses when leaving the viewport, hiding the tab or navigating away; starting another media item pauses the previous one. Posts, chosen sounds and uploads stay in session. The library contains three original demo instrumentals, not commercial songs. See `docs/ITERATION_3.md` and `docs/ASSET_CREDITS.md`.
