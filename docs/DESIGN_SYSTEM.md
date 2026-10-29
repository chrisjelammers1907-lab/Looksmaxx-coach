# Design system

Current palette (premium edit, see the section at the end): forest #123D32, deep forest #0B2A22, ivory #F8F4EC, cream #F1EBE0, linen #E7DFD0, champagne #C5A46D, ink #15201B. All tokens live in `src/tokens.css`. Earlier iterations below describe historical rose and sage surfaces that are no longer used. Cormorant Garamond display serif pairs with DM Sans. Editorial italic headings, thin rules, large photographic crops, generous whitespace and restrained motion create an original inclusive identity.

Spacing: 4/8/12/16/24/32/48/64px. Controls: 44px comfortable targets, visible forest focus rings, labelled forms, semantic buttons, accessible dialogs, responsive grids and reduced-motion support. A centered canvas, horizontal desktop navigation and inset mobile bottom navigation frame the content. Home is the For You/Following feed; Categories contains the eight-topic overview.

Topic surfaces: skincare pale sage/beige; hair warm stone portraits; training forest with high-contrast data; grooming warm neutral; smile cool cream; fragrance rose/espresso; photos gallery cream.

Clothing scope only: dark casual espresso/cream, old money forest/cream/gold, minimalist off-white/charcoal. All clothing tabs inherit variables. Theme is remembered locally, never tied to gender.

Photography combines licensed stock references and visibly labelled original AI editorial inspiration. In-app AI visualization is an explicitly labelled simulation, never achieved progress. Shared focus, buttons, tabs, cards, fields, notices, empty states and modal components unify the app.

## Second-version update — 2026-10-20

The accepted changes are recorded in [ITERATION_2.md](ITERATION_2.md). Home is now the For You/Following media feed; the eight-topic launchpad lives at Categories. Navigation explicitly includes AI Coach. Every category has a permanent beginner-guide entry and the public About us page explains the product and demo. Topic selection and extra post fields are optional; the coach follows the message without a topic selector. Forest green, warm cream and dusty rose provide stronger section contrast while retaining typography and clothing themes. Account/journal audiences and recipient checks remain local demonstrations; original uploaded photos/videos remain private. All prior wardrobe, routine, training, nutrition, comparison, messaging and social journeys remain selected.

## Editorial refinement and sounds

Iteration 3 retains the wordmark and Cormorant Garamond / DM Sans pairing. Original high-resolution editorial assets bring a consistent travertine, olive, ivory and amber palette to the forest/rose interface. Image credits stay legible; generated images are inspiration rather than testimonials. Compact mobile heroes keep Home's For You feed reachable. Rose ribbons, gold rules, restrained rectangular controls and forest/cream/sage surfaces carry through categories, guides, clothing, coach, plan and profile. Clothing themes remain scoped to that section. Sound selections use the same palette, with 44 px picker controls, explicit accessible play/pause labels and reduced-motion waveforms. Audio never starts on page arrival.

## Fourth iteration — bounded canvas and consistent categories

The shell has a 1280 px maximum width, 32 px desktop outer gutters and 12 px mobile outer gutters. Content padding contracts for small screens; images, long titles and controls must remain inside the shell. Category thumbnails scroll only within their own strip when needed. The primary navigation uses a deep-forest masthead, restrained gold active rules and the existing five destinations.

Use consistent forest-green category cards and the same rectangular image/label treatment throughout the top category row. Remove alternating category-card colors. Keep topic tool atmospheres and section-scoped clothing themes. Home uses a compact purpose heading, independent For You/Following and Photos/Reels controls, and captions inside images over a dark gradient. Reels are a centered portrait column; photo posts use two columns on desktop and one on mobile. Photo-story controls stay visible and support keyboard/touch.

See ITERATION_4.md for the accepted feedback and verification gates. The unavailable reference image was not inspected; this direction follows the owner's description and uses CHARETT assets.

## Premium edit — 24 October 2026

All colour, radius, shadow and motion values are defined once in `src/tokens.css`; every other stylesheet refers to those variables. The roughly 440 hard-coded legacy colours in `styles.css`, `v2.css`, `editorial.css`, `refinement.css` and `theme.css` were mapped onto the tokens, and light sage and rose were removed (vector illustrations included). `src/premium.css` is the last layer and holds the redesigned components.

| Token | Value | Use |
| --- | --- | --- |
| `--forest` | #123D32 | Primary actions, outgoing bubbles, brand |
| `--forest-deep` | #0B2A22 | Masthead, footer, mobile bottom bar |
| `--ivory` / `--porcelain` | #F8F4EC / #FDFBF7 | Page and card surfaces |
| `--cream` / `--linen` | #F1EBE0 / #E7DFD0 | Secondary surfaces, incoming bubbles |
| `--line` / `--line-strong` | #E0D7C7 / #CFC3AE | Hairlines, outlined chips |
| `--champagne` | #C5A46D | Metallic accent on dark surfaces, avatar rings (decorative on light) |
| `--gold-deep` | #684B1E | Accent text on light surfaces (eyebrows, topic lines) |
| `--ink` / `--muted` | #15201B / #524E46 | Body and secondary text |
| `--on-dark` / `--on-dark-muted` | #F6F0E4 / #CDC3AE | Text on forest surfaces |

Checked text contrast (WCAG AA ≥ 4.5:1): ink on ivory 15.3, muted on ivory 7.5, muted on line-strong 4.8, gold-deep on ivory 7.3, gold-deep on line-strong 4.6, on-dark on forest 10.6, on-dark-muted on forest 6.9, champagne on forest 5.1. Axe scans of all routes at 1440 px and 390 px, plus all three clothing themes, report no contrast violations. The scoped espresso clothing theme keeps its own warm values.

Type stays Cormorant Garamond (display) with DM Sans (UI). The minimum UI text size is now 10.5–11 px for labels and 13–15 px for reading text. Buttons and chips are pills. Cards use 14–24 px radii and soft shadows instead of borders.

Feed: a sticky header with a centred For You / Following tab switch (2 px underline), search and new-post actions on the right, and a horizontally scrolling chip row (Photos/Reels segment, then style and topic chips). Photo posts are Instagram-style: author handle with a champagne avatar ring, image without text overlay, a like/comment/share/save row, like count, caption (topic line, serif title, handle + text, hashtags), a compact "Shop the look" row and the date. A bag button on the photo toggles product tags (item, store, price) that open the item breakdown. Reels and videos keep the TikTok-style overlay caption.

Mobile navigation: a floating, rounded (26 px), blurred deep-forest bar inside the safe area (`viewport-fit=cover`, `env(safe-area-inset-bottom)`), five equal columns with 22 px icons and an animated champagne pill behind the active icon.

Messages and AI coach share one chat language: a conversation list with 56 px avatars, a profile intro at the top of each thread, grouped 22 px-radius bubbles (cream incoming, forest outgoing), and a pill composer with an attachment icon and a round send button (Enter sends, Shift+Enter starts a new line). Decorative filler (brand note, rail captions, feed hero and disclosures, page headers on Messages/Coach/post detail) was removed; the required demo disclosures remain as short single lines.

## Second premium round — 24 October 2026

- **Masthead:** the tagline "The art of becoming" sits directly under the wordmark in italic serif (16 px desktop, 13.5 px mobile), so it reads as part of the logo.
- **Home:** there is no category row. From the top, Home shows:
  - stories: champagne and forest ring when unseen, a stone ring once seen, and a 9:16 viewer with progress bars
  - For You / Following
  - Photos / Reels
  - filter chips
- **Captions:** photo captions show about two lines and expand in place with "… more".
- **Categories:** an icon list (forest circles, serif titles, guide links), closed by the line "Become someone your future self thanks."
- **Topic banners:**
  - desktop: two halves, with the image filling its half
  - phones: the photo sits above the copy, with 20 px padding
  - cards, tabs, notes and buttons share the 16/24 px radii and 13–15 px text
- **Profile:**
  - stats for posts, followers, following and likes
  - name and bio shown once
  - icon tabs: posts, reels, drafts, private, reposts, likes, saved
  - a 3-column 4:5 grid
  - a ⋯ sheet (share, notifications, mute, report, block) and a Settings & privacy sheet
- **Chats:**
  - a + menu for photo, sticker, voice message and post
  - the original CHARETT sticker set uses palette tokens and the italic serif
  - voice notes play as waveform bubbles
- **Clothing moods:**
  - Old money: parchment pinstripe, double champagne rules and italic serif
  - Minimalist: gallery white, hairlines, square edges and light sans
  - Dark casual: espresso
- **Gym:** day tiles (forest for training days, champagne ring for today) and a Today card with set rows, check buttons, a champagne "New PR" badge and a forest PR banner.

## Third premium round — 25 October 2026

- **Dark mode.** `:root[data-theme="dark"]` in `tokens.css` redefines the surfaces.
  - Text uses its own tokens (`--forest-text`, `--on-dark`, `--on-dark-muted`), so legacy layers stay readable in both themes.
  - Settings choose Light, Dark or Match my device.
- **Scroll rows.** `HScroll` wraps every horizontal row (stories, chips, tabs, week strip) with edge fades and arrow buttons.
- **Guides.** Every guide uses the same layout:
  - a glossary (`dl.guide-products`);
  - numbered steps (`ol.guide-steps`);
  - a two-column Works / Doesn't verdict;
  - an optional reminder;
  - a forest-green coach call to action.
- **Nutrition.** One calorie ring plus four macro bars: forest for calories, champagne for macros, danger when a target is passed. The weight chart draws the raw line in `--line-strong`, the 7-day average in `--forest`, and champagne dots.
- **Membership.**
  - Plan cards: Free on porcelain; Plus outlined in forest with a "Most popular" flag; Signature on `--forest-deep` with champagne accents.
  - Upgrade prompts (`.upgrade-card`) and the `Plus` tag use cream and champagne, never red.
  - Sponsored posts reuse the photo card with a forest CTA bar and the word "Sponsored" under the brand.

## Fifth round — launch edit — 25 October 2026

- **Photography.** Real photos with models only. Banners and heroes use `height: 0; min-height: 100%` on the image, so the copy, not the photo, sets the height.
- **Monogram.** `Monogram.tsx` (a serif C in a hairline circle) replaces decorative sparkles and the coach orb.
- **Radii and shadows.** `--radius-sm` 8, `--radius` 10, `--radius-lg` 14; cards carry no drop shadow.
- **Streaks.** `StreakFlame` is a green flame (`--forest-text`) with the count, next to the name; champagne on the dark plan card.
- **Categories.** `.category-group` sections with a small gold uppercase heading and 56 px round photo thumbs.
- **Clothing moods.** The five newer styles set a full palette (`--style-bg`, `--style-soft`, `--style-card`, `--style-ink`, `--style-muted`, `--style-accent`, `--style-border`, `--style-button`, `--style-on-button`) and map the global tokens onto it, so they look the same in light and dark mode:
  - streetwear: black #111, off-white, orange #e8743d, square corners, heavy condensed caps;
  - smart casual: #f7f8fa, navy #14213d, semibold sans, 6 px radius;
  - athleisure: graphite #2b2d2f, fog #ecebe7, light sans, 20 px radius;
  - preppy: cream #f6f1e6, navy #1d2b4f, burgundy #7a2433, a regimental stripe on the hero;
  - bohemian: warm paper #f3e7d6, terracotta #96482a, italic serif, 18–24 px radius.
- **Share card.** 1080×1920: photo on top, forest band, gold kind label, Cormorant title, CHARETT wordmark; text stays above the bottom 150 px for the Stories controls.
