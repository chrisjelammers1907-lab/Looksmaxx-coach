# CHARETT public website — framed design, Photos and Reels

**https://chrisjelammers1907-lab.github.io/Looksmaxx-coach/**

The fourth iteration is live. Open the site in a new tab to load this version. No installation or GitHub login is needed. Choose **Skip for now** or complete the optional introduction.

The centered layout has visible side gutters, a richer green masthead, a consistent category image row and uniform green category cards. Home has independent **For You / Following** and **Photos / Reels** choices. Captions appear inside images over a dark gradient. Reels includes video and explicitly selected photo stories; the latter support arrows, keyboard and touch swiping. Sounds, private saves, comments, linked-card sharing and all eight topic tools remain available.

## Actual public verification

GitHub Actions run `40119164432` completed successfully on **24 October 2026 at 20:07 CEST**.

- Verified source commit: `6171e93068b854f0df449770c864033abb779d0b`.
- Pages content commit: `61b34ce89eafd57a243e225200587a5c8396fe09`, branch `gh-pages`, root `/`.
- Evidence commit: `d092187adeed4bba9236e24603f763a63561950e`, branch `charett-publication-status`.
- The unauthenticated HTTPS HTML matched the intended standalone file byte for byte: SHA-256 `3e66f6ba79ff553e5e3d0e34e0d26b6542e19dd4ae999e40c2b3a80bc2238917` (3,468,535 bytes).
- Fresh Chrome contexts without a login passed at 1440 × 1000 and 390 × 844 with mobile touch emulation.
- Both exercised separate feed formats, independent Following/format state, photo-story controls, video/photo sounds, previewing/attaching a sound and setting its volume, bounded layout, all eight categories and beginner guides, route reloads, wardrobe editing, comments, linked-card messaging, coach-to-plan changes, profile navigation and About us.
- Both reported no browser, HTTP or failed-request errors. Actual public screenshots were retrieved, visually inspected and retained.

The report records `localFixture: false` and `publicBrowserVerified: true`. This is verification of the deployed HTTPS site, separate from the earlier local export check.

[Public verification record](verification/iteration-4-public.json), [desktop screenshot](screenshots/home-desktop.png), [mobile screenshot](screenshots/home-mobile.png). Earlier iteration evidence remains in the verification directory.

## Local verification

The final complete regression passed **72 browser cases** across desktop and mobile. Fifteen domain tests, type checking, lint, formatting and the normal production build passed. Fifteen routes fit the centered frame without document overflow at 320, 390, 768 and 1440 px. Accessibility checks cover the selected routes, themes, dialogs and new slideshow controls; the new slideshow also passed actual emulated touch-swipe input.

The first regression run passed 70/72 cases and found that a composer-test locator matched both the background tablist and the dialog select. Scoping it to the dialog combobox resolved both cases; the final full run passed all 72 without removing assertions. Visual inspection corrected inherited alternating author colors, letterboxing on the fictional video poster and an oversized mobile clothing heading. Private uploads preserve their framing.

Home, feed, Reels, Categories, Clothing, Coach and Plan were visually inspected at mobile/desktop sizes. The exact final standalone export passed both full viewport journeys locally under the website path, with `publicBrowserVerified: false`, before publication. The compiled preview also passed navigation and route-reload journeys.

These are Chrome viewport/touch-emulation checks. Physical phones, Safari and Firefox are not claimed as tested. The standalone file was exercised over HTTP; managed-browser policy prevented direct `file://` testing. The export's expected large single-chunk build warning reflects bundled media/fonts and is not a failed build.

## Content and privacy

The three-file Pages branch contains only `.nojekyll`, `README.md` and `index.html`. It embeds fictional demo content, licensed stock, original illustrations, labelled AI editorial inspiration and three original instrumental sounds. Owner photos, routines, PDFs, health profiles, credentials and the original build brief are excluded from that branch. Media are bundled; no commercial music catalogue is connected.

Personal uploads and edits stay in browser-tab memory; uploaded originals cannot enter public demo posts. Account privacy, follower approvals and independent journal audiences remain local simulations. AI replies, ranking, shopping, in-app generation and social activity are labelled demos. Generated editorial images are not real creators, customers, achieved progress or try-on results. Beginner guides retain the existing attachment mapping and cautious source qualifications; this visual iteration adds no medical claims.

## Maintenance

Run `node scripts/build-standalone.mjs` after source changes, refresh the ZIP, publish the exact fictional-only export to `gh-pages`, and trigger Verify CHARETT publication. Check the intended source commit, HTML checksum, actual public browser results and screenshots before handing over the updated link. Source remains on `demo/charett-preview`; `main` is unchanged.

The cloud environment's direct Pages access was previously blocked by its proxy; actual public verification uses the GitHub-hosted runner. Native HTTPS Git publication succeeded without changing credentials or requiring owner setup.
