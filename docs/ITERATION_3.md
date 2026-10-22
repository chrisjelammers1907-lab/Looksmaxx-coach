# CHARETT visual direction and post sounds

The owner's latest feedback asks for a distinctive, beautiful visual identity throughout the existing product, using the preceding feedback as the requirements. “Sound onder” was clarified as choosing a sound for a photo or video post, as on social platforms.

## Milestones and review gates

1. Establish an original editorial direction: forest, warm ivory, dusty rose and amber; retain the wordmark and typefaces. Add high-resolution fictional editorial imagery with visible AI labels. Preserve Home as For You, the five navigation destinations, all eight categories and permanent beginner guides.
2. Implement a reusable sound library, previews, selection/removal and volume mixing for photo and video posts. Playback must require an intentional action, pause outside the viewport/on navigation, and avoid overlapping posts. Use original demo instrumentals; do not imply a licensed commercial catalogue or real social delivery.
3. Inspect the key pages at mobile and desktop sizes, run accessibility and interaction regressions, check private-upload boundaries and the standalone export.
4. Publish the completed export to the existing Pages site, verify the exact published bytes and real public browser journeys, and record the evidence before handing over the link.

## Preserved requirements

The original BUILD_BRIEF.md remains unchanged. ITERATION_2.md records the accepted navigation, optional post topics, natural-language coach, account/journal privacy, linked-card sharing, beginner guides and About us. All remain part of this iteration. The owner’s personal photos/routines and raw PDFs remain outside Git and public content.

## Status

Milestones 1–3 are complete. The 64-case browser regression run passed 63 cases and identified a transient contrast issue while the new sidebar colour transition animated. The transition was removed; both affected desktop/mobile accessibility journeys then passed. All 64 selected cases have passed across those runs. Six new sound cases cover selection, previews, photo/video playback, mixing, removal, single-player coordination, scrolling and navigation. Fifteen domain tests, type checking, lint, formatting and the production build pass.

Ten key pages were inspected at 1440 × 1000 and 390 × 844 with no overflow or browser exceptions. The final standalone export passed its desktop/mobile journeys at the real website path on a local HTTP fixture, including sound previews and attached photo/video audio. This local check explicitly records `publicBrowserVerified: false`. See verification/iteration-3-local.json and screenshots/iteration-3-local-*.png.

Milestone 4 is complete. A temporary Git authentication rejection resolved on a later native-Git check; no owner credential change was needed. The ready export was published to `gh-pages` commit `02f599b9f7b8084b98127879027ce51aaa62e8d0`. GitHub-hosted public Chrome run `39843465689` passed without login at both viewport sizes, serving the exact final export. It exercised the new photo/video sounds and composer previews in addition to all existing publication journeys. Public screenshots were inspected; evidence is saved in verification/iteration-3-public.json. See WEB_PUBLICATION.md for exact source/evidence commits and remaining browser limitations.
