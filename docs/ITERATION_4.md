# CHARETT — a bounded layout and a clearer feed

The owner's consecutive messages form one set of feedback. Accidental Enter presses do not replace earlier requirements. This iteration carries forward the existing style, functions, privacy boundaries and source-based beginner guides while addressing the remaining visual and feed issues.

## Selected changes

- Use a centered canvas capped at 1280 px, with visible outer gutters: 32 px per side on wider screens and 12 px on mobile. Content, menus and controls must fit smaller viewports without horizontal page overflow. A category strip may scroll within its own bounds.
- Retain the CHARETT wordmark and Cormorant Garamond / DM Sans typefaces. Use more confident forest-green sections, warm ivory and restrained gold accents, with consistent spacing and image crops.
- Carry the category-image treatment into a top row on Home, Categories and the community route. Use the same green treatment for every category card, replacing alternating category-card colors. Keep all eight category tools and their permanent beginner guides.
- Keep Home as the feed and the five destinations Home, Categories, AI Coach, My Plan and Messages. Keep profile/private saves/About us accessible from the profile menu.
- Keep For You and Following as the audience/source choice. Add an independent Photos/Reels choice. Photos shows still posts; Reels shows video and explicitly selected photo stories, with no mixed default feed.
- Put each feed title and caption inside its image, over a dark readable gradient. Preserve likes, comments, private saves, sharing, post details, copying and creator navigation.
- Support a photo slideshow in Reels with visible previous/next controls, position feedback, keyboard controls and touch swiping. The interrupted sentence was interpreted as a request for a slideshow. The composer can choose a photo story and an optional second editorial image; private test uploads remain private.
- Keep optional sounds for photo/video posts, opt-in playback, preview/removal, volume mixing, one player at a time and pause on scrolling away or navigation. Format switching must also stop abandoned playback.

The reference image mentioned by the owner was not available in this turn. No inspection of that image or of the current Victoria's Secret website is claimed. The design uses the owner's description and CHARETT's existing original or licensed assets, without copying another brand's identity.

## Milestones

1. Implement the bounded shell, horizontal desktop navigation, inset mobile navigation, category image row and consistent green category cards.
2. Implement the separate feed formats, caption overlays and accessible photo stories while retaining existing social and sound behavior.
3. Validate the current app: type checking, lint, formatting, domain tests, browser regressions, 320/390/768/1440 px layout checks, accessibility scans and visual inspection on desktop/mobile. Check the standalone export separately.
4. Publish the exact verified export to the existing Pages site; verify its checksum, public browser journeys and screenshots before identifying it as the new live version.

## Preservation and scope

BUILD_BRIEF.md remains unchanged. Later accepted requirements in ITERATION_2.md and ITERATION_3.md continue to apply: English UI; all eight topic sections; three clothing themes; wardrobe/outfit/routine/training/nutrition/hair/photo tools; shared profile and coach; optional post topics; minimal on-demand filters; About us; source-based beginner guides; accounts and journal audiences; fictional community activity; linked-card messaging and private saves. My Plan retains its existing behavior.

Public examples are fictional. Owner photos, routines, source PDFs and secrets stay out of Git and public content. Personal media remain in the private browser session and cannot be published as public demo posts. AI coaching, in-app image generation, shopping, feed ordering and social activity remain explicitly simulated. Actual playback of bundled media is functional; it is not a connected commercial music library.

## Verification status

Milestones 1 and 2 are implemented. The standalone export passed its full local desktop/mobile browser journeys with no browser/request errors, including format separation, sounds, slideshows, all eight categories/guides, wardrobe edits, comments, linked cards, coach-to-plan changes and profile navigation. Its report explicitly records localFixture: true and publicBrowserVerified: false; it is not evidence of public deployment.

An initial 72-case regression run passed 70 cases and found an ambiguous locator in the new composer test: both the background format tablist and the dialog select had the accessible name Post format. Scoping the test to the dialog combobox resolved both failures on focused rerun. This correction preserves the actual composer, public/private audience and format assertions. The final full regression passed all 72 browser cases in 2.5 minutes on 24 October 2026. Fifteen domain tests, type checking, ESLint, formatting and the production build also passed.

Visual inspection found inherited alternating post-author colors, excessive letterboxing on the fictional video poster, and an oversized clothing heading on small screens. These were corrected. Private uploaded media retain their framing. The shell and 15 routes passed overflow/gutter checks at 320, 390, 768 and 1440 px.

Desktop/mobile Home, feed, Reels, Categories, Clothing, Coach and Plan screenshots were visually inspected. Milestone 4 is complete. GitHub Actions run 40119164432 verified the actual public HTTPS site for source 6171e93068b854f0df449770c864033abb779d0b on 24 October 2026. Its HTML matched SHA-256 3e66f6ba79ff553e5e3d0e34e0d26b6542e19dd4ae999e40c2b3a80bc2238917. Desktop/mobile journeys passed with no browser or request errors, and the real public screenshots were inspected. See WEB_PUBLICATION.md and verification/iteration-4-public.json.
