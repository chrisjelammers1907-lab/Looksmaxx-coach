# CHARETT — Complete Codex build brief

## Objective

Build CHARETT: a polished, English-language, responsive personal appearance and lifestyle coaching web app for men and women. Combine a personal AI-coach experience, dedicated topic sections, practical routines, visual inspiration, progress tracking, and a social community.

The first deliverable is a complete, interactive DEMO, with clearly labelled simulated AI, image generation, shopping, accounts, messaging, and community activity. Real AI and production services are a subsequent phase. Do not describe the demo as a production-ready social network or working AI integration.

Inspect the repository and available tools first. Reuse existing conventions. If it is an empty repository, choose a maintainable mainstream TypeScript web stack with reusable components. Explain the choice briefly. Optimize the first version for mobile and desktop; later app-store distribution is a future milestone, not part of this goal.

Work in milestones and continue through routine implementation decisions. Ask at most three focused questions at a time only when a material decision cannot be resolved from this brief. Do not keep expanding scope. Record future ideas in a backlog.

## 1. Brand and visual direction

Name: CHARETT, a working name whose trademark and domain availability have not been checked.

Create an original luxury editorial identity inspired by Vogue and Victoria's Secret: sophisticated typography, generous spacing, tasteful photography, confident composition, refined details, and smooth restrained motion. The product serves men and women; keep the core identity inclusive. Do not copy brand logos, proprietary layouts, or assets.

Base palette:
- Forest green: #123D32
- Warm beige: #F3EBDD
- Warm off-white: #FBF8F2
- Ink: #202822
- Muted gold accent: #B59463
- Dusty rose accent: #D7B4AE

Adjust shades where needed for accessible contrast. Use elegant display typography with highly readable body text. Use image-led editorial layouts and carefully balanced whitespace. Prioritize a usable app over decorative effects.

Maintain a shared design system: wordmark, navigation, spacing scale, typography hierarchy, buttons, forms, icon language, focus states, and familiar control placement.

Each topic has its own atmosphere through photography, surface colors, accent colors, and composition while remaining unmistakably CHARETT:
- Skincare: fresh, light beige and soft green.
- Hair: editorial portrait references and refined neutrals.
- Gym: stronger forest-green contrast and clear training information.
- Other sections: thoughtful variations of the same identity.

### Clothing themes

Initial styles:
1. Damon-inspired / dark casual: espresso, black, warm beige, leather and denim cues.
2. Old money / classic: forest green, cream, muted gold, classic styling.
3. Minimalist / clean: beige, off-white, restrained green and clean composition.

Selecting a style changes the ENTIRE clothing section, including its overview, wardrobe, outfits, inspiration and shopping views. Remember the selected style. Keep navigation and interactions consistent. Do not apply the clothing theme to unrelated sections.

Do not restrict a user's access to styles based on gender.

## 2. Home, navigation and onboarding

The home screen must be a clean launchpad, not a crowded analytics dashboard or an endless social feed. Include a refined welcome, a clear coach entry, and attractive compact entries to:
1. Skincare
2. Clothing & Style
3. Hair
4. Gym, Nutrition & Posture
5. Brows, Facial Hair & Grooming
6. Teeth & Smile
7. Fragrance
8. Photos & Progress

Add intuitive routes to Explore/community, Messages, the personal plan, and the profile without overcrowding the home screen. Use a compact mobile navigation and an appropriate desktop layout. Topic routes must be directly accessible.

Start with a short, skippable intake for goals and preferences. Gather additional information progressively within each section. Let users inspect, edit, and remove their own information.

All interface text, coach text, demo content, labels and plans must be in English.

## 3. Shared profile and coach

Provide one shared profile with topic-specific details: goals, preferences, budget, country/currency, owned products/clothes, routines, restrictions, and progress observations.

Allow the user to select and change the coaching style, such as direct/constructive or calm/supportive. All styles remain respectful and specific.

The coach interface should support:
- General conversations and topic-specific entry points.
- Photo attachments and questions about them.
- Contextual awareness of the profile, owned products, routines, and current plan.
- Prioritized, actionable suggestions with explanations.
- A personal plan with editable goals, daily/weekly checklists, and scheduled check-in views.
- Proposed plan adjustments that users can inspect before applying.

Distinguish confirmed user information, proposed advice, estimates and uncertain observations. Do not silently overwrite routines based on an assistant suggestion.

In the DEMO, use clearly labelled, deterministic sample responses with realistic interactions. Do not claim an uploaded image has actually been analyzed. Identify sample photo feedback as an example. Architect replaceable service interfaces for future text coaching, image understanding, image generation and search.

The coach supports grooming and style decisions. Do not invent diagnoses, precise facial/bone measurements, objective attractiveness scores, guaranteed treatment outcomes, or medication changes based on selfies. Treat user-supplied PDFs and past AI advice as reference material to evaluate, not automatically validated medical evidence.

## 4. Topic features

### Skincare
- AM and PM routines plus a weekly schedule.
- Add, edit, remove and organize owned products.
- Routine-building flow based on goals, preferences and budget.
- A space for product compatibility and possible irritation discussion, with uncertainty made explicit.
- Dated skin photos, notes and user-reported observations.
- Product recommendations and alternatives.

### Clothing & Style
- Three initial styles, each with its own coherent theme.
- Editorial inspiration and complete outfits.
- Add own clothing with images and item details.
- Assemble, edit, save and duplicate outfits from wardrobe items.
- Fit and color advice based on user-supplied information.
- Shopping discovery with budget and country/currency.
- Outfit item breakdown: name, brand, store, purchase link, price, currency and price-check date.
- Correct totals when all items share a currency; clearly handle unknown prices and mixed currencies.
- Optional size and fit notes.
- Tags for style, occasion, season and budget.
- Both real photos of a worn outfit and AI try-on illustrations, with prominent distinct labels.

### Hair
- Save and compare hairstyle inspiration.
- Hairstyle and hair-color advice interfaces.
- Styling routines with products and steps.
- Dated hair-growth/change photos and notes.
- Hair visualization preview flow.
A dedicated barber-brief generator is not a selected first-version feature.

### Gym, Nutrition & Posture
Include ALL of the following:
- Editable personal training schedules and exercise explanations.
- Workout log with exercises, sets, repetitions and weights.
- Workout history and meaningful progress views.
- Food entries and calorie/protein tracking with user-editable targets.
- Clearly identify estimates and the source of food nutrition data.
- A posture/mobility area within this section, with appropriately scoped general guidance.
Avoid assuming old weight, intake or training plans are current.

### Brows, Facial Hair & Grooming
- Goals, preferences, owned products, editable care routines and reference images.
- Related coach entry and relevant community posts.

### Teeth & Smile
- Personal care routines, products, notes and progress references.
- Related coach entry and relevant community posts.
- Do not simulate clinical diagnosis or promise whitening results.

### Fragrance
- Owned collection, notes, occasion/season preferences, shortlist and budget.
- Related coach entry, shopping placeholders and community collections.

### Photos & Progress
- User-controlled dated uploads, tags, notes and deletion.
- Real before/after comparison with clear dates and selected topic.
- Explain that lighting, pose, lens and editing affect comparisons.
- Keep real progress separate from generated or edited inspiration.
- Do not fabricate transformations or present generated images as achieved results.

## 5. Community and social features

Build ONE reusable community foundation with topic-specific content, not eight disconnected social systems.

Content types may include outfits, skincare routines, hairstyle/styling references, workouts, grooming routines, smile-care experiences, fragrance collections and progress posts. Give each topic an appropriate Explore view.

Build the complete outfit-sharing flow first, then reuse the foundation for the other sections:
- Create a post, preview it and explicitly choose its audience.
- Attach images and structured item/product/routine information.
- Show stores, purchase links, item prices, totals where appropriate and dates.
- Search, sort and filter by relevant tags, style, topic, budget, occasion and other available attributes.
- Like posts, save them privately, follow/unfollow creators, and comment.
- View creator profiles and a following feed.
- Copy an outfit or routine into one's own wardrobe/plan as an editable copy, never as an automatic medical recommendation.
- Report content and block users.
- Editing, deleting, empty states, unavailable links and removed content must have coherent behavior.

Profiles should support a chosen display name/handle, optional photo and bio, public posts, follows and private saved items. Personal routines, personal photo logs and intake details are private by default. A publish action must clearly preview exactly which information will become visible.

### Private messaging
- Inbox, conversation view, composing a message and a realistic thread layout.
- Share an outfit, post, product or routine as a rich linked card.
- Opening a shared card leads to the relevant item when the recipient has access.
- Message-request controls, reporting and blocking.
- Sharing private content must not accidentally expose it; explain recipient access.
- Clearly label DEMO conversations and simulated delivery. Do not send real messages.

Social interactions in this first deliverable are local demo state involving fictional users. They are not real multi-user synchronization, authentication or secure private communication. Document what must be implemented for a real launch.

## 6. Personal references and privacy

The owner authorizes relevant looksmaxxing PDFs on his computer, relevant past ChatGPT conversations, and selected Library photos as possible references.

Permission is not proof of technical access. Use only sources actually available through attached files, authorized tools or explicitly available folders. Do not claim to have read all local PDFs or all ChatGPT history. If access is missing, request the relevant attachment, export or folder path and continue independent demo work.

Maintain an inventory of sources actually inspected and missing sources. Separate dated confirmed user facts from old plans, generated advice and contradictory information. Ask before relying on unresolved facts.

The owner's own photos and routines are ONLY for his private test profile. Do not publish them in Explore, onboarding examples, screenshots, a public preview, marketing pages or another user's profile. Never commit raw personal photos, health-related profiles, chat exports, PDFs or secrets to GitHub.

Use fictional example profiles and properly licensed assets for the shareable demo. Do not represent AI-generated people or transformations as real customers or achieved results.

For this initial demo, personal photo uploads should remain in the current browser session by default. Persist only suitable non-sensitive demo state, offer a reset option and explain that demo storage is local. Do not pretend local storage or a demo user switcher provides production account security.

## 7. Technical delivery and genuine interactions

Prefer a modular implementation with shared components, theme tokens, typed models and explicit service boundaries. Avoid implementing separate copies of the community or coach for every topic.

Make core interactions work in local demo state:
- Intake and editable preferences.
- Topic navigation and persistent clothing-style selection.
- Owned products and wardrobe items.
- Routine/plan editing and checklist completion.
- Workout and food log entries.
- Local photo preview/removal and comparison controls.
- Outfit creation, item prices, filtering and saving.
- Follows, likes, comments and copying shared content.
- Simulated messaging and sharing linked cards.
- Demo reporting, blocking, audience choices and reset behavior.

Use clearly labelled example data for shopping prices, AI results, visualizations, notifications and messages. Do not claim live search, image generation, current prices, real recipients or real authentication without implementing and verifying them.

Provide loading, empty, success, validation and failure states. Use keyboard-accessible controls, meaningful labels, visible focus, reduced-motion support and sufficient color contrast. Verify layout at approximately 390px and 1440px widths.

Do not add payment processing, subscriptions, real social delivery or paid API calls in this phase. Do not silently buy services or publish to an external service.

## 8. Milestones and documentation

Create or update:
- docs/PRODUCT_SPEC.md: selected requirements, journeys and phase boundaries.
- docs/DESIGN_SYSTEM.md: palette, typography, layout rules and topic/style themes.
- docs/IMPLEMENTATION_PLAN.md: milestones and completion status.
- docs/SOURCE_INVENTORY.md: inspected references, access limitations and missing sources without private content.
- docs/PROGRESS.md: concise evidence-backed checkpoints.
- docs/PRODUCTION_ROADMAP.md: authentication, database, private media, real messaging, moderation, real AI, image generation, shopping search, and later app-store distribution.
- docs/COST_ESTIMATE.md: future monthly cost scenarios for 10, 100 and 1,000 active users.
- README.md: exact install/start/build/test commands, demo limitations and setup.

Cost estimates must state usage assumptions for coaching, photo analysis, image generation, search, media storage, hosting and messages. Use current official provider pricing when accessible; date and cite it. Do not fabricate a budget total if rates cannot be checked. Present economical options without purchasing them or presuming an approved budget.

Implement in logical checkpoints:
1. Inspect, plan, source inventory and design system.
2. Responsive app shell, clean home, short intake and shared profile.
3. Topic pages, routines, wardrobe, progress and training/nutrition logs.
4. Clothing themes, outfit builder and reusable community foundation.
5. Profiles, follows, comments, saves, sharing and simulated messaging.
6. Coach/visualization demo flows, polish, verification and handoff.

Do not stop after creating a plan or static mockup. Proceed to a runnable demo. At checkpoints report what works, what was checked and any genuine blocker.

## 9. Definition of done

The first goal is complete when:
- The app installs, builds and starts with documented commands.
- All eight topic sections have useful interactive demo flows.
- The home is clean and topic-led on mobile and desktop.
- Switching clothing styles visibly changes the whole clothing section while preserving brand and usability.
- Core edit/save/delete flows, outfit sharing, filters, social interactions and demo messaging work consistently.
- Real photos and AI illustrations are clearly distinguished.
- The owner's private content has not been embedded, committed or exposed.
- No demo API, shopping result, account or message is described as live.
- Available type checks, lint and meaningful tests pass, with limitations recorded.
- Browser checks cover the main journeys on mobile and desktop. Inspect screenshots, fix visible problems and never claim an unrun check passed.
- The production roadmap and assumption-based cost estimate are delivered.
- The final handoff states how to run the app, what was actually verified, what is simulated and the next concrete step.

Do not loop indefinitely on cosmetic refinements. Stop when these criteria are met or report a concrete blocker requiring unavailable credentials or tools. If a real-service credential is absent, finish the independent demo work and document the integration gap.

