# Delivery checkpoints and verification

Date: 2026-10-19. The prepared workflow is an interactive local CHARETT demo. Production integrations and publication are separate operations.

## Completed checkpoints

1. Read the complete brief before implementation and preserved it byte-for-byte in BUILD_BRIEF.md. Inspected the previously empty repository, available Node/Chromium tools, and the 15 actually attached PDFs. Source text stayed outside the checkout; no owner facts or medical protocols were inferred.
2. Built the responsive editorial shell, clean eight-topic home, two-step skippable intake and shared private profile. No new worktree was created. All interface and seeded content is English.
3. Implemented owned-product/wardrobe CRUD and ordering, AM/PM routines and weekly schedules, editable routine library across all topics, training schedules/history/volume, food estimates/targets, hair comparisons, fragrance shortlist and topic notes.
4. Implemented three remembered clothing themes across every clothing view, outfit building/editing/duplication, item metadata/links/dates and explicit handling of unknown or mixed-currency prices. Added separately labelled private real worn-outfit photos and simulated diagram previews.
5. Implemented one fictional community with audience previews, structured posts, filtering/search/sort, creator profiles, follows, likes, private saves, comments, editable copies, reports, blocks and coherent removed/restricted content. Local rich-card conversations enforce access again after deletion/audience changes.
6. Implemented deterministic contextual coach responses and reviewed plan proposals. Photos are not analyzed. Personal uploads stay in tab memory; edited/generated inspiration is excluded from real comparisons. Reset and private-information removal are available.
7. Inspected actual mobile and desktop screenshots of Home, Skincare, dark Clothing wardrobe, Explore, Coach and Messages. Corrected the mobile hero overflow, secondary-text contrast, topic/profile tab resets, form labels and dialog focus/background behavior. The app has no horizontal page overflow on the tested routes, and no browser page errors were recorded.
8. Reinstalled from the frozen lockfile with `bash scripts/setup.sh`; its dependency installation and production build passed. Saved that complete `install_script` and service/readiness `start_skill` in the cloud configuration draft. Removed temporary unused custom network additions while retaining the package-manager preset. Saving did not execute, publish or validate a new task restoration.

## Verified checks

| Check                                 | Observed result                                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Fresh `npm ci` through setup script   | Passed; lockfile used, integrity/TLS verification retained                                                                         |
| TypeScript and production build       | Passed; compiled Vite bundle generated                                                                                             |
| ESLint                                | Passed                                                                                                                             |
| Prettier source/test/config check     | Passed                                                                                                                             |
| Vitest domain suite                   | 11 tests passed; no skipped tests                                                                                                  |
| Chromium main journeys                | 30 cases passed across 1440×1000 and 390×844 before the final expanded regression run                                              |
| Additional privacy/access/theme suite | 10 cases passed across both sizes after the dialog accessibility correction                                                        |
| Full final regression                 | 40 passed in the final combined run; no failed or skipped cases                                                                    |
| Automated accessibility sweep         | 28 route/viewport scans (14 routes × 2 widths), no WCAG A/AA/2.1 AA axe violations in the sampled states                           |
| Dark clothing tabs + edit modal       | Axe scans passed in the additional privacy suite                                                                                   |
| Production preview browser smoke      | Home, Clothing, Gym, Explore, Coach and Messages returned HTTP 200, rendered expected headings and produced no browser page errors |
| Brief preservation                    | `cmp` passed against the uploaded original                                                                                         |
| Repository hygiene                    | Only intended app/docs/assets/config/tests; no uploaded PDFs, owner photos, raw chat exports or secret files included              |

Tests exercise actual browser behavior, not just open ports: create/edit/delete flows, known/unknown price handling, theme persistence/scope, social state, copy/edit, audience preview, linked-card navigation and access changes, local photos, nutrition/workout logging and reviewed plan changes. Corrupt images are rejected; edited/generated inspiration cannot enter real-photo comparisons; a private worn-outfit upload is absent from public previews and localStorage. Test photo fixtures are bundled stock references, never owner photos or fabricated achieved transformations.

Public screenshot artifacts: [desktop Home](screenshots/home-desktop.png) and [mobile Home](screenshots/home-mobile.png). Other inspected captures and detailed diagnostic reports remain outside the committed app or in ignored test-output folders. Screenshots contain only fictional starter content and licensed editorial assets.

## Limits and next steps

Chromium is the tested engine. Safari/Firefox, screen-reader usability, actual multi-user authorization, real AI quality, real shopping availability, account security and real message delivery were not tested or claimed. Automated axe scans are not a complete accessibility audit. There are no live APIs or real notifications.

Current OpenAI/Supabase commercial pricing was still blocked by the proxy on the final check. COST_ESTIMATE.md includes dated official Cloudflare source rates, infrastructure-only subtotals and explicit unknown-rate formulas for 10/100/1,000 users. It does not present a guessed all-in budget.

The implementation is available in the current checkout and the development server runs on port 5173. Nothing has been pushed to GitHub or deployed to an external host. Review/save the reusable environment draft in settings and publish the environment to retain its prepared snapshot; that user action and fresh-task restoration remain unverified. A real private beta starts with the authentication/storage/authorization gates in PRODUCTION_ROADMAP.md.

## 2026-10-20 — Web preview repair

The user reported the outer ChatGPT visualization displaying a generic visualization error. Investigation confirmed that the app itself rendered at port 5173 without JavaScript or failed-request errors, while Vite returned HTTP 403 for non-local Host headers and no service listened on port 3000. These are concrete preview-serving problems; they do not establish the exact cause of the platform's generic UI message.

Changes are limited to serving configuration, startup documentation and regression tests. `npm run web-preview` now builds the existing app and serves it on `0.0.0.0:3000`. Development remains on `0.0.0.0:5173`. Both ports are strict. The exact `chatgpt.com` gateway and the known cloud-environment subdomains are explicitly allowed; an unrelated test hostname still receives HTTP 403. Application components, styles, assets, private storage rules and features were not changed. The rebuilt application JavaScript/CSS content hashes match the previous build.

Verification completed:

- Production build and TypeScript compilation passed.
- ESLint, formatting and all 11 domain tests passed.
- All **44 browser tests passed** at desktop 1440px and mobile 390px, including four new preview regression cases.
- The compiled app was opened in Chromium through a real local forwarding server carrying the ChatGPT Host header. Tests clicked every topic card and each primary navigation destination, reloaded topic deep links, and exercised browser back/forward navigation. No JavaScript errors, failed requests or missing assets were observed in those preview tests.
- New compiled-preview screenshots were inspected at both viewport sizes. Existing layout and content were retained. Diagnostic screenshots remain outside the checkout in `/tmp/charett-preview-repair/`; no owner content was used.
- The compiled preview is running on port 3000 and the development server on port 5173. Reusable `start_skill` instructions were saved successfully in the environment draft; the install script and unrelated configuration were preserved. Saving does not publish the draft or restart future tasks.

The supplied `https://chatgpt.com/local/...` URL was also attempted in Chromium, but the execution environment's network proxy rejected the connection with `ERR_TUNNEL_CONNECTION_FAILED`. This is separate from the application's inbound Host validation. The authenticated outer visualization UI could not be inspected or reset from this environment. The verified result is the running compiled app and its gateway-forwarded browser journeys, not proof that the platform's generic visualization error has cleared. Refresh the existing visualization to retry it against the running preview; no external deployment or publication was performed.

## Second version — local validation 2026-10-20

Implemented the accepted iteration in `ITERATION_2.md`: Home For You/Following photo/video feed, explicit Categories/AI Coach navigation, eight permanent beginner guides, About us, optional post topics, on-demand filters/details, natural-question sample coaching, portrait processing, account/follower/journal privacy demonstrations, recipient rechecks and stronger green/cream/rose editorial surfaces. Existing topic tools and My Plan remain.

Checkpoints found and fixed: vague photo questions losing conversation context, unnecessary default style tags on untagged posts, low-contrast metadata, access checks in both share entry points, mobile About us navigation and the avatar menu staying open on query-only navigation.

Validation: 15 domain tests passed; the full 58-test Chromium regression run passed at 1440×1000 and 390×844. After the last menu fix, its two targeted desktop/mobile journeys passed again. Typecheck, lint, formatting and the normal production build passed. The final standalone export is separately tested under `/Looksmaxx-coach/`, with its own evidence distinguishing local fixtures from public tests. Desktop/mobile screenshots of Home, Categories, guides, About us, coach and profile were inspected; no horizontal overflow was found on the inspected routes.

Source notes and limitations: reference-based guides are original educational summaries; unvalidated medical protocols and discriminatory claims were not adopted. Current AAD/FDA/NHS and Victoria’s Secret pages were blocked by the workspace proxy; no current clinical validation or live visual-site inspection is claimed. Stock image sources are 400×400 and browser enlargement does not add detail. The 5-second video is a silent licensed-still motion study. Real AI, secure authentication and real social delivery remain future work.

Public deployment verification is recorded separately in WEB_PUBLICATION.md after its own run completes.


## 22 October 2026 — editorial design and post sounds

Preserved the approved navigation, all eight tools/guides, privacy and social journeys. Added original labelled AI campaign/still-life imagery, coherent forest/ivory/rose/amber styling across ten pages, and three original sound loops for photo/video posts. Working previews, mixing, post playback, edit/removal, one player at a time and viewport/navigation cleanup. No third-party commercial tracks, new medical claims or private owner content were added.

Validation: 15 domain tests; typecheck, lint, formatting and build passed. Final broad browser run: 63/64 passed; the remaining animated-navigation contrast failure was fixed and both affected desktop/mobile accessibility cases passed on rerun. All 64 selected cases have passing evidence across the runs. Six sound cases passed, including the private-session boundary. Ten routes at both viewport sizes were inspected, without overflow or exceptions. Final standalone local fixture passed both viewports including sounds, all topics/guides, reloads, wardrobe, comments, linked cards and coach/plan; it correctly records publicBrowserVerified=false.

The ready standalone HTML is 3,451,984 bytes, SHA-256 5fde55df6c5f4979b7e779764bba8e094710e541ca71498c31fc2677075deb25. Its size includes all images/audio/video/fonts and does not require external media requests. The expected standalone chunk-size warning does not indicate build failure.

The temporary native-Git authentication rejection resolved on a later check. Both source and Pages pushes succeeded without an owner token/settings change. Public Actions run 39843465689 passed for source 351b11755f6601fb6a96ab3c230c22898a8f9917; evidence 3231dbc36d265934ae9715bb5301242b452cf2ec. The real HTTPS export matched the final SHA-256, and fresh Chrome desktop/mobile journeys passed for sounds, all topics/guides, route reloads, wardrobe, comments, linked cards, coach/plan and profile/About navigation with no errors. Actual public screenshots were inspected and retained. A restarted compiled-preview mobile sound/navigation/guide check and focused My Plan accessibility scans also passed. Publication is complete; WEB_PUBLICATION.md records the current verified version.

## Fourth iteration — complete

Collected the owner's consecutive visual/feed messages as one change set. ITERATION_4.md records the bounded canvas and side gutters, richer forest-green surfaces, uniform category cards and top image row, image-overlaid captions, separate Photos/Reels with independent For You/Following, and accessible photo slideshows in Reels. The existing wordmark, typefaces, sounds, all eight tools, guides and privacy/social journeys remain selected. The referenced example image was unavailable; no inspection of it or of the current Victoria's Secret site is claimed.

On 24 October 2026, the final full regression passed all 72 browser cases; 15 domain tests, type checking, lint, formatting and build passed. The separate standalone export passed both viewport journeys with no browser/request errors. Fifteen routes fit at 320/390/768/1440 px, and the principal desktop/mobile screens were visually inspected. The initial ambiguous composer-test locator was fixed without removing assertions. Public run 40119164432 passed for source 6171e93068b854f0df449770c864033abb779d0b. The actual HTTPS export matched its expected checksum; both viewport journeys passed with no browser/request errors. Actual public screenshots were inspected. Pages commit 61b34ce89eafd57a243e225200587a5c8396fe09 and evidence commit d092187adeed4bba9236e24603f763a63561950e are recorded in WEB_PUBLICATION.md.


## Premium edit — 24 October 2026

The owner asked for a more premium look with the same structure. Implemented: central design tokens (`src/tokens.css`) with forest, ivory, champagne and ink, plus removal of all light green and pink; centred Instagram/TikTok feed tabs with chip filters; captions below photo posts with like/comment/save actions; product tags and a "Shop the look" row in place of the old price block; reels unchanged with overlay captions; a floating rounded mobile bottom bar with safe-area insets; Instagram-DM-style Messages and AI Coach; less filler text. Vector illustrations in the feed now render instead of appearing as empty blocks. Details are in DESIGN_SYSTEM.md.

Validation: typecheck, ESLint, Prettier, 15 domain tests and the production build passed. The full Chromium run passed 79 cases at 1440×1000 and 390×844. That covers the 72 existing cases, with four assertions updated where the UI changed on purpose (photo caption below the image, no topic line on untagged posts, the composer's "Message"/"Send message" labels), plus a new `premium.spec.ts` for centred tabs, chip filtering, product tags, the mobile bar and chat composers. Axe scans of 21 routes at both widths and all clothing themes found no violations. The standalone HashRouter export was built and opened locally without errors; `demo/CHARETT-demo.html` and `gh-pages` were not updated in this change. Before and after screenshots are in `docs/screenshots/premium/`.


## Second premium round — 24 October 2026

The owner's feedback on the first preview was agreed point by point before any building started, and was then delivered in four phases. Each phase was published to the private preview.

1. **Home and layout**
   - Masthead tagline spacing is fixed and the Explore row is removed.
   - Stories sit at the top of Home.
   - Home order is For You/Following, then Photos/Reels, then filters.
   - Captions expand in place.
   - Categories is an icon list with a closing quote.
   - My Plan shows one day with Routines/Tasks filters, and the check-in is removed.
   - Topic banners and cards are aligned.
2. **Profiles, chats, coach and clothing**
   - Instagram-style profiles: stats, drafts, private posts, reposts, likes, the ⋯ menu and settings.
   - Chat photos, stickers and voice messages.
   - Coach file attachments.
   - Brand and price in the outfit builder.
   - Old money and Minimalist page moods.
3. **Gym planner**
   - Named days with per-set reps and kg, repeated weekly or applied once.
   - Today tick-off, then automatic logging after midnight (untouched sessions are recorded as skipped).
   - PR detection that can be shared as a story.
   - Training data persists in `localStorage` (`charett-training-v1`), as the owner approved; reset clears it.
4. **Beginner guides**
   - The skincare, grooming and hair guides now contain practical tips from the five supplied Looksmax PDFs.
   - Medication doses, injections, self-sourcing of prescription products and DMSO use are deliberately left out.
   - The creator name is removed everywhere.

**Validation**
- Typecheck, ESLint and Prettier pass.
- 19 unit tests pass, including the new training tests.
- 93 Chromium cases pass, with 1 mobile-only case skipped on desktop.
- Axe finds no violations on 21 routes at both widths or in the three clothing themes.

Updated screenshots are `docs/screenshots/premium/v2-*.jpg`.

## Third premium round — 25 October 2026

1. **Home, reels and scrolling**
   - Stories run continuously for every creator and scroll with touch, wheel, drag or arrows.
   - All chip rows scroll the same way.
   - On a phone a reel fills the screen, with likes, caption and "more" inside the reel. Tapping it opens an Instagram-style sheet with Shop the look.
   - Photo sound is a small icon on the image.
   - Captions no longer repeat the handle.
2. **Chats, settings and dark mode**
   - The microphone sits only at the bottom right; camera and stickers are in the + menu.
   - Custom stickers can be made from text or a photo.
   - Streaks for chats, routines and the gym unlock rewards at 3, 7, 30 and 100 days.
   - A full Settings page (account, notifications, appearance with light/dark/device, privacy, units, subscription, data). The app is English only for now.
3. **Plan, gym and nutrition**
   - Tasks have an optional date and repeat, grouped Overdue / Today / This week / Later.
   - Routines link owned products, per routine and per step.
   - The separate exercise log is gone; history stays editable and weights follow the kg/lb setting.
   - Nutrition targets are set by the person: kcal, carbs, protein and fat are required; fibre, sugars, salt, potassium, minerals and vitamins are optional.
   - Food is entered by hand or scanned (BarcodeDetector, or ZXing on Safari and Firefox, plus typing the number). Values come from Open Food Facts and scale to the grams eaten.
   - A weight log shows a chart and the 7-day average.
   - A calorie calculator (Mifflin-St Jeor) gives maintenance only under 18 and never suggests less than 1200/1500 kcal.
   - Food, weights and targets persist in `charett-training-v1`.
4. **Guides and membership**
   - Every guide now explains what each product does, how to put it together, and what works and what doesn't.
   - The guides list no sources, and the extreme drug content is removed.
   - Wherever hormones or medication come up, the guides say "Hormones or medication only through a doctor."
   - A new weight guide (lose, maintain, gain) is linked from Gym and the calculator.
   - Each guide ends with a coach call to action.
   - `/plans` offers Free, Plus (€9.99 a month or €99.99 a year) and Signature (€19.99 a month or €199.99 a year), with a simulated checkout that asks for no payment details.
   - Free includes 10 coach messages and 1 file a day, 3 training days and food logging by hand. It shows sponsored posts every sixth post and between stories; the sponsors are fictional.
   - Plus lifts the limits, adds the barcode scan and custom stickers, and removes ads.
   - Signature adds all chat themes and sticker packs, streak protection and a profile badge.

**Validation**
- Typecheck, ESLint and Prettier (source) pass.
- 27 unit tests pass.
- All Chromium e2e cases pass at desktop and mobile width; the mobile-only and pointer-only cases are skipped where they don't apply.
- Axe finds no violations in light and dark mode on the new routes.

Screenshots are `docs/screenshots/premium/v3-*.jpg`.
