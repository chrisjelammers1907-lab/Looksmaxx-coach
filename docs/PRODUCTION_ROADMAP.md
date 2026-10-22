# Production roadmap

The delivered app is a local interactive demo, not a production network. No deployment, purchase or paid API request is part of this delivery. The selected first-version journeys are implemented with explicit simulations; the following work replaces those simulations with real capabilities.

## 1. A private, authenticated beta

Use a managed authentication provider with verified email/passkeys, session expiry, account recovery, rate limiting and server-side authorization. Design the database around users/profiles, topic preferences, owned items, routines/versions, plan goals/check-ins, workout sets, nutrition entries, media, outfits/items, posts/audiences, follows, likes, saves, comments, blocks/reports, conversations/membership, messages and card references.

Implement object-level access checks on every read/write. Public and private serializers must be distinct. Enforce the audience in the database/API, not by hiding a button. Private saves never appear on public profiles. Block rules apply to feed, comments, messages and card previews. A copied outfit or routine gets a new owner and independent editable version. Keep provenance and price currency/date separate; never sum mixed currencies silently.

For an economical option, evaluate Workers + D1 + R2 with a managed auth provider; alternatively use Supabase Auth/Postgres/Storage for simpler row-level authorization. Choose only after checking region, recovery and privacy requirements. No provider has been purchased or configured.

## 2. Private media and user control

Replace browser-memory photos with opt-in private object storage, signed short-lived URLs, file-type/content checks, size limits, metadata stripping, malware handling, deletion and retention rules. Separate real progress, generated/edited inspiration and public editorial content in storage and the data model. Obtain explicit consent for any model processing. Keep the owner's content exclusively in an isolated private test account. Build export, deletion, consent withdrawal, backup expiry and auditability before inviting users.

## 3. Real community and messaging

Add transactional follows/likes/comments, pagination, indexes, audience-aware search, removed-content tombstones, notification settings and abuse limits. Implement a moderation queue with content reports, appeal paths, safety policies, human review and response expectations. Add anti-spam, impersonation handling and copyright/source records.

Messages require authenticated conversation membership, request acceptance, delivery state, block enforcement, pagination and retention. Start with modest active-session polling if economical, then evaluate WebSockets/realtime at measured scale. A rich card references a resource; resolve access for the recipient every time it opens, including after audience changes or deletion. Decide whether end-to-end encryption is a requirement before claiming confidentiality; TLS alone is not E2EE.

## 4. Real coaching, photo understanding and visualization

Implement the replaceable service contracts in `src/lib/services.ts` behind a server boundary. API credentials never enter the browser bundle. Add per-user quotas, cancellation, retries, timeouts, redacted observability, cost attribution and evaluation suites. Limit stored context and distinguish confirmed facts from user reports, estimates and suggestions.

Keep plan proposals structured and require review. Provide citations/provenance for factual claims. Uploaded PDFs and old AI messages must never become trusted treatment guidance automatically. No objective attractiveness scoring, inferred bone measurements, diagnoses or medication changes from selfies. For health-related concerns, use appropriately qualified review and professional referral language. Evaluate accessibility and harmful advice failure modes with representative users.

For generated hair/outfit previews, label every output, store it separately from real progress, disclose uncertainty and obtain rights/consent for source images. No result should be framed as a predicted fit, achieved transformation or guaranteed treatment outcome.

## 5. Shopping search and production operations

Use an authorized product/search provider. Store seller, URL, price, currency, date, country availability and affiliate disclosures. Handle unavailable products, stale prices, unknown sizes and mixed currencies. Add checkout only as a separate approved scope.

Deploy with SPA fallback routing, HTTPS, a content-security policy, dependency scanning, backups and restore drills, automated CI, error monitoring, redacted logs, operational alerting and tested limits. Add cross-browser Safari/Firefox coverage and a manual assistive-technology audit. Load-test social fan-out, media delivery and coaching concurrency. Establish support/moderation ownership, data-processing agreements, retention and regional compliance before public launch.

## 6. Later mobile distribution

Validate product use on the responsive web first. Then assess a PWA and/or a native shell, camera/media permissions, push notifications, offline behavior, store privacy declarations and accessibility. App-store distribution, payments/subscriptions and a dedicated barber-brief generator are not selected demo deliverables.

## Release gates and backlog

Real accounts must pass authorization tests for every audience and rich-card transition. Media deletion, abuse/report handling, quotas, billing caps and restore tests must pass before launch. Human moderation capacity and provider rates need explicit approval. Trademark/domain availability for CHARETT is unverified. Additional styles, wear analytics, advanced training programming, live integrations and subscriptions remain backlog decisions, not automatic scope expansion.

## Second-version additions

Before real photo/video publishing: implement authenticated, server-enforced account and per-entry audiences; follower-request approval; access-checked media URLs and shared cards; private originals; consent-based publication of explicit derivatives; upload limits, virus checks, video transcoding/posters/captions, content moderation and deletion of derivatives. Replace sample feed ordering with a transparent ranking policy and user controls. The keyword-based demo coach must be replaced by a real service with consented context and a curated, reviewed knowledge source; guide provenance does not automatically validate the uploaded PDFs.

## Post sounds

The demo includes three bundled original instrumental loops, selection/previews, stored post metadata and real browser playback with sound/original-video volume controls. A production catalogue needs properly cleared master/composition rights, territory and expiry enforcement, rights-holder/takedown workflows, sound attribution and accessible captions for spoken uploads. Do not enable arbitrary commercial-song uploads without this work. Media processing must mix/transcode the chosen audio and video for consistent playback, generate accessible preview formats and enforce visibility/ownership on the server. Photo sounds need the same playback, pause and background policies as video. Current native-browser checks cover Chrome desktop/mobile emulation; verify Safari/iOS and real devices before launch.
