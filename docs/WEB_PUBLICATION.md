# CHARETT public website — publication status

**22 October 2026:** the third-iteration editorial design and post sounds are complete and locally checked. Publishing the update is temporarily blocked by rejected GitHub authentication. The public evidence below verifies the **second version**, not the new local export. See ITERATION_3.md and verification/iteration-3-local.json. Do not tell visitors the new design/sounds are live until public verification succeeds.

**https://chrisjelammers1907-lab.github.io/Looksmaxx-coach/**

The second version is live. Existing open tabs should be refreshed to load it. Choose **Skip for now** or complete the optional introduction. No installation or GitHub login is needed.

## Public verification

GitHub Actions run `39496395487` completed successfully on **20 October 2026 at 22:58 CEST** (20:58 UTC).

- Verified source commit: `d34a1c7c84f9249797616fa6ae1d775022a03922`.
- Pages content commit: `fdab8857b858288997b3837a5c87f0370d0c9ffd`, branch `gh-pages`, root `/`.
- Evidence commit: `33ca97ab9837314b1d8ab5e2fd42649a536ce261`, branch `charett-publication-status`.
- The actual unauthenticated HTTPS HTML matched the intended standalone file byte for byte: SHA-256 `29d80ee85a5e99d0c29e0c8f943c0f336ebc5359f48f03da84165518d22aee81`.
- Fresh Chrome contexts without a login passed at 1440×1000 and 390×844, including mobile touch emulation.
- Both exercised For You, video playback, all eight category routes and their beginner guides, route reloads, wardrobe editing, comments, simulated linked-card sharing and round trips, reviewed coach changes, plan updates, account/profile navigation and About us.
- No browser, HTTP or failed-request errors occurred. Actual public-page desktop and mobile screenshots were retrieved and visually inspected.

The initial configuration snapshot reported Pages as `building`. The verifier waited until the public HTML matched the new export before exercising it; the actual served bytes and successful browser journeys establish which version was checked. The separate browser report records `localFixture: false` and `publicBrowserVerified: true`.

[Public verification record](verification/iteration-2-public.json), [desktop screenshot](screenshots/home-desktop.png), [mobile screenshot](screenshots/home-mobile.png).

## Local verification

The full 58-test browser regression run passed, along with 15 domain tests, type checking, lint, formatting and the normal production build. After the last menu fix, the two affected desktop/mobile navigation journeys passed again. The final standalone export was also tested on both viewport sizes under `/Looksmaxx-coach/` before publication, with `publicBrowserVerified: false` for the local fixture. See [PROGRESS.md](PROGRESS.md).

These are Chrome checks at two viewport sizes. Physical mobile devices, Safari, Firefox, real accounts, live model responses and real message delivery are not claimed as tested.

## Content and privacy

Only fictional demo content and licensed editorial assets are embedded in the three-file website branch: `.nojekyll`, `README.md`, `index.html`. Owner photos, personal routines, PDFs, health profiles, credentials and the original build brief are excluded from that branch.

Personal uploads and edits stay in the browser tab; original photos/videos cannot enter public demo posts. Public/private account settings, follower approval and independent journal audience preferences are local simulations, not production authentication. AI responses, feed ordering, shopping, visualizations and social activity remain clearly labelled demos.

Beginner guides map the supplied reference files to useful educational material and explain which claims were not adopted. No clinical review, treatment protocol, live official-page verification or guaranteed result is claimed. Direct AAD, FDA, NHS and Victoria’s Secret access was blocked by the cloud egress proxy; see SOURCE_INVENTORY.md. Enlarged feed images have the requested pixel dimensions but do not gain source detail. The video is a labelled silent motion study made from licensed stock photography.

## Maintenance

Run `node scripts/build-standalone.mjs` after source changes, update the fictional-only `gh-pages` index, then trigger the `Verify CHARETT publication` workflow. It can run on matching demo-source pushes, tags matching `charett-verify-*`, or manual dispatch. It waits for the intended HTML checksum before testing the actual Pages URL and records results on the separate evidence branch. Inspect that evidence and its source commit before supplying a visitor link.

This cloud machine still blocks direct access to the external Pages host. Successful public checks run in the GitHub-hosted runner. A cloud-local test, authenticated raw download, saved environment draft or ChatGPT chat URL does not prove a public website works. Earlier 404 delivery failures are resolved by the verified Pages publication above.
