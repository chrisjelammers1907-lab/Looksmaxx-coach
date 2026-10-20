# CHARETT web publication

The public website is live at **https://chrisjelammers1907-lab.github.io/Looksmaxx-coach/**. Choose **Skip for now** or complete intake. No download, installation or GitHub login is needed.

## Verified public-browser result

GitHub Actions run `39485299213` completed successfully on **20 October 2026 at 21:40 CEST** (19:40 UTC), for source commit `de2d8aa89aaf644cdd4fcc6dfb134ad647aafc73`.

- GitHub reported Pages `built`, `public: true`, source `gh-pages` at `/`.
- An unauthenticated HTTPS fetch returned HTTP 200. The published HTML matched the intended standalone demo byte for byte: SHA-256 `04c4a0db63b109beefe6247313911d0fc2edcb2c2071b03c7ef8caef1521b4c6`.
- Fresh Chrome contexts without a login passed at 1440×1000 and 390×844, including mobile touch emulation.
- Both exercised all eight topics, topic reloads, horizontal-overflow checks, wardrobe editing, community comments, simulated rich-card messaging and round trips, reviewed coach changes, plan updates and profile navigation.
- Both completed without browser, HTTP or failed-request errors. The actual public-page desktop and mobile screenshots were retrieved and visually inspected.

The `charett-publication-status` branch holds `configuration.json`, `outcome.json`, `browser-verification.json`, `desktop.png` and `mobile.png`. Evidence commit: `77c817c215935849483ba58b5877da09b8349efe`. The browser report explicitly records `localFixture: false` and `publicBrowserVerified: true`. Its source commit, URL and HTML checksum were checked against the intended publication before the link was supplied.

This is browser verification in Chrome at two viewport sizes. Physical mobile devices, Safari and Firefox are not claimed as tested.

## Published content and privacy

The `gh-pages` branch contains exactly `.nojekyll`, `README.md` and `index.html`. The index embeds the app and licensed editorial images, fonts and notices. Hash routes preserve navigation and reloads under `/Looksmaxx-coach/` without server rewrites. The existing application design and features are unchanged.

Only fictional demo content is embedded. Owner photos, personal routines, reference PDFs, credentials and the original build brief are not in the website branch. Personal profile edits, photos, routines and logs remain in the current browser tab; the main README documents the limited allowlisted fictional preferences kept in localStorage. AI, shopping, visualizations and social activity remain labelled simulations.

GitHub reported the repository itself as public during this check. Its visibility was changed outside the agent's actions; the agent did not change repository visibility.

## Verification and maintenance

The `Verify CHARETT publication` workflow reads the real Pages configuration with read-only Pages permission, tests the reported URL without a login and records the result on the separate evidence branch. It runs on matching demo-source pushes, verification tags matching `charett-verify-*`, or manual dispatch. Local fixture tests deliberately leave `publicBrowserVerified` false.

After app changes, regenerate the standalone export, update the fictional-only `gh-pages` index, let Pages finish building and rerun the public-browser check. Do not present source edits as deployed until the published HTML matches and the external browser checks pass.

## Resolved delivery failures

Earlier raw GitHub download checks used the cloud proxy's repository authentication, while the repository was private. They did not prove anonymous availability. GitHub subsequently confirmed `has_pages: false`; an automated attempt to activate Pages returned HTTP 403, `Resource not accessible by integration`. The owner enabled branch-based Pages, after which the public checks above succeeded.

This cloud machine still receives egress-proxy CONNECT 403 for the external site. The successful public checks ran in the GitHub-hosted runner, outside that restricted network. A saved environment draft, a localhost test and the ChatGPT chat URL are not evidence of a working public website.
