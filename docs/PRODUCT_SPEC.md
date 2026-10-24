# Selected product specification

CHARETT is an English-language, responsive local demonstration for all genders. React + TypeScript + Vite provide a mainstream component stack; React Router supports direct routes; one typed store supports coach, plan, all eight topics, community and messages.

## Journeys and acceptance boundaries

- Skippable intake → shared editable preferences → Home feed and eight-topic Categories overview → contextual coach → review a proposed plan change → apply intentionally → editable daily/weekly plan and check-in.
- Skincare: owned product CRUD/reorder, AM/PM routine editing, weekly schedule, routine builder, uncertain compatibility discussion, alternatives and private dated observations.
- Clothing: dark casual, old money and minimalist themes across overview, wardrobe, outfits, inspiration and shopping only. Item CRUD with optional image/details; build/edit/duplicate/save outfits; structured prices/store/link/check date; unknown and mixed-currency totals; fit/color preferences and tags.
- Hair: save/compare inspiration, editable product/step routine, hair/color coach, private progress, labelled visualization flow. No barber-brief generator.
- Gym: editable weekly training, exercise guidance, set/rep/weight logs and history/progress; food entries and editable calorie/protein targets with user-reported estimates/source; general mobility/posture guidance.
- Grooming, Smile and Fragrance: editable preferences, owned products/collection, routines/notes, private references and topic community; fragrance shortlist and budget/shopping placeholders. No diagnosis or treatment claims.
- Photos: dated/tagged private session uploads, notes, deletion and genuine two-upload comparison. No fabricated progress; generated illustrations kept separately.
- One community: fictional topic posts, structured cards, create→audience→preview→publish, edit/delete, search/sort/tag/style/occasion/budget/topic filters; likes, private saves, follows, comments, editable copies, reporting and blocking; following feed and profiles.
- Messages: local inbox/conversations, compose, requests/report/block, shared post/outfit/product/routine cards with access checks. Removed/blocked/restricted content has explicit unavailable behavior. No real delivery.
- Reset clears local fictional state, private memory and preferences. Public seeded content is fictional; stock photographs depict references, never those fictional people or achieved transformations.

## Privacy and scope

Only clothing theme, onboarding completion and fictional social interactions may persist in localStorage. Personal profile edits, routines, uploads, wardrobe edits, logs, coach and messages stay in memory until reload. All newly created posts remain memory-only; personal media can be attached only to private session posts and cannot enter public demo posts. This is a conservative demo boundary, not account security. No paid APIs, real auth, payments, live shopping, image analysis/generation, or network messaging.

Production integrations are recorded in PRODUCTION_ROADMAP.md. The attached brief preserves the original complete requirements; the accepted later iterations record the owner’s subsequent changes.

## Second-version update — 2026-10-20

The accepted changes are recorded in [ITERATION_2.md](ITERATION_2.md). Home is now the For You/Following media feed; the eight-topic launchpad lives at Categories. Navigation explicitly includes AI Coach. Every category has a permanent beginner-guide entry and the public About us page explains the product and demo. Topic selection and extra post fields are optional; the coach follows the message without a topic selector. Forest green, warm cream and dusty rose provide stronger section contrast while retaining typography and clothing themes. Account/journal audiences and recipient checks remain local demonstrations; original uploaded photos/videos remain private. All prior wardrobe, routine, training, nutrition, comparison, messaging and social journeys remain selected.

## Accepted third-iteration requirements

Carry the owner's preceding navigation, feed, privacy and beginner-guide decisions forward. The visual identity should feel considered throughout the product, with stronger original editorial photography and forest/ivory/rose/amber contrast. Retain the approved wordmark/typefaces and all existing tools. Photo/video posts can optionally attach a sound from a clearly scoped demo library, preview it, set added-sound/original-video levels and remove it. Viewing a post never starts audible playback automatically. Existing social/private-save/linked-card flows use the same post and sound metadata.

## Accepted fourth-iteration requirements

Apply all consecutive feedback together. Use a bounded 1280 px canvas with visible desktop/mobile gutters, richer forest-green sections and uniform category cards with a category image row above the feed/overview. Retain the approved typography and existing functions. Home exposes For You/Following independently from Photos/Reels: Photos excludes reels; Reels includes video and explicitly chosen photo stories. Captions appear within images over a readable gradient. Photo stories support buttons, keyboard and swiping. Preserve optional topics, on-demand filters, sound choices, social actions, private saves and rich-card access checks. See ITERATION_4.md for milestones and the verification status.
