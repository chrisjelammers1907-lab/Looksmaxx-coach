# CHARETT public website — editorial design and post sounds

**https://chrisjelammers1907-lab.github.io/Looksmaxx-coach/**

The third iteration is live. Refresh an existing tab to load the new design. No installation or GitHub login is needed. Choose **Skip for now** or complete the optional introduction.

## Public verification

GitHub Actions run `39843465689` completed successfully on **22 October 2026 at 21:50 CEST** (19:50 UTC).

- Verified source commit: `351b11755f6601fb6a96ab3c230c22898a8f9917`.
- Pages content commit: `02f599b9f7b8084b98127879027ce51aaa62e8d0`, branch `gh-pages`, root `/`.
- Evidence commit: `3231dbc36d265934ae9715bb5301242b452cf2ec`, branch `charett-publication-status`.
- The actual unauthenticated HTTPS HTML matched the intended standalone file byte for byte: SHA-256 `5fde55df6c5f4979b7e779764bba8e094710e541ca71498c31fc2677075deb25`.
- Fresh Chrome contexts without a login passed at 1440 × 1000 and 390 × 844, including mobile touch emulation.
- Both exercised For You, video playback with an attached sound, photo-sound playback, choosing/previewing/attaching a sound to a new private post and setting its volume, all eight category routes/guides, route reloads, wardrobe editing, comments, linked-card sharing and round trips, reviewed coach changes, plan updates, profile navigation and About us.
- No browser, HTTP or failed-request errors occurred. The actual public screenshots were retrieved and visually inspected.

The initial configuration snapshot reported Pages as `building`. The verifier waited until the public HTML matched the intended export before exercising it. The browser report records `localFixture: false` and `publicBrowserVerified: true`.

[Public verification record](verification/iteration-3-public.json), [desktop screenshot](screenshots/home-desktop.png), [mobile screenshot](screenshots/home-mobile.png). The second-version evidence remains in verification/iteration-2-public.json.

## Local verification

The 64-case browser regression run passed 63 cases and found an animated-sidebar contrast failure. Removing the colour/background transition resolved it; both affected desktop/mobile accessibility journeys passed on rerun. Every selected case has passed across these runs; a single all-green 64-case rerun is not claimed. The six new sound cases cover previews, selection, photo/video playback, volume mixing, removal, single-player coordination and viewport/navigation cleanup.

Fifteen domain tests, type checking, lint, formatting and the normal production build passed. Ten important pages were inspected at both viewport sizes with no overflow or exceptions. My Plan also passed a focused accessibility scan at both sizes after the colour corrections. The final standalone export passed both viewport journeys under `/Looksmaxx-coach/` before publication, correctly marking the local fixture as not public verification. The compiled preview was restarted and its mobile sound/navigation/guide journey passed.

These are Chrome checks at two viewport sizes. Physical phones, Safari, Firefox, real accounts, live AI replies and real message delivery are not claimed as tested. The optional standalone file was tested over HTTP; managed-browser policy prevented direct `file://` checks.

## Content and privacy

The three-file website branch contains only `.nojekyll`, `README.md` and `index.html`. It embeds fictional demo content, licensed stock, original labelled AI editorial inspiration and three original instrumental sounds. Owner photos, routines, PDFs, health profiles, credentials and the original build brief are excluded from that branch. Media are bundled; no third-party music-streaming catalogue is connected.

Personal uploads and edits stay in the browser tab; uploaded originals cannot enter public demo posts. Account privacy, follower approvals and independent journal audience choices remain local simulations. AI coach replies, ranking, shopping, in-app generation and social activity stay clearly labelled demos. The static editorial assets were generated for this iteration and are not customers, exact product depictions, achieved progress or real try-on results. The five-second motion study animates a fictional AI still, with optional separately controlled instrumental audio.

Beginner guides retain the attachment-to-guide mapping and distinguish cautious basics and preferences from unverified source claims. No clinical review, treatment protocol, live official-page verification or guaranteed result is claimed. Direct AAD, FDA, NHS and Victoria’s Secret access was blocked by the cloud proxy. Upscaled licensed portraits do not gain source detail; the new editorial still lifes have higher-resolution source assets. See ASSET_CREDITS.md and SOURCE_INVENTORY.md.

## Maintenance

Run `node scripts/build-standalone.mjs` after source changes, refresh the ZIP, publish the exact fictional-only export to `gh-pages`, then trigger the Verify CHARETT publication workflow. It runs on matching source pushes, tags matching `charett-verify-*`, or manual dispatch. Check the intended source commit, exact HTML checksum, public browser results and screenshots before handing over a link.

This cloud machine still blocks direct access to the Pages host (CONNECT 403); real public verification runs on the GitHub-hosted runner. A temporary Git authentication rejection during this iteration resolved on a later native-Git check. Both pushes then succeeded without the owner needing to change a token or setting. No credential was exposed, stored in source or replaced. Publication is no longer blocked.
