# Monthly production cost model

Prepared **2026-10-19**, in USD before tax. The demo runs without paid APIs or purchased services. These are future deployment scenarios, not an approved budget or an invoice quote.

## Verified infrastructure rates

Official Cloudflare documentation was fetched successfully from the provider's own GitHub source on the date above. The public commercial pricing websites for OpenAI and Supabase were blocked by this environment's egress proxy (HTTP 403); current AI/auth prices could not be verified. Historical cookbook model descriptions were not used as current pricing evidence.

| Component     | Verified rate / included allowance                                                                                                   | Official source                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Workers Paid  | $5/account/month minimum; 10M requests and 30M CPU-ms/month included; extra $0.30/M requests and $0.02/M CPU-ms                      | [Pricing](https://developers.cloudflare.com/workers/platform/pricing/) · [source retrieved](https://raw.githubusercontent.com/cloudflare/cloudflare-docs/production/src/content/docs/workers/platform/pricing.mdx) |
| Static assets | Static asset requests free/unlimited under the documented conditions                                                                 | Same Workers source; avoid adding billable cache interception unnecessarily                                                                                                                                        |
| D1 Paid       | 25B rows read, 50M rows written/month and 5GB storage included; overage $0.001/M reads, $1/M writes, $0.75/GB-month                  | [Pricing](https://developers.cloudflare.com/d1/platform/pricing/) · [source retrieved](https://raw.githubusercontent.com/cloudflare/cloudflare-docs/production/src/content/partials/workers/d1-pricing.mdx)        |
| R2 Standard   | 10GB-month, 1M Class A and 10M Class B requests/month free; then $0.015/GB-month, $4.50/M Class A, $0.36/M Class B; no egress charge | [Pricing](https://developers.cloudflare.com/r2/pricing/) · [source retrieved](https://raw.githubusercontent.com/cloudflare/cloudflare-docs/production/src/content/docs/r2/pricing.mdx)                             |

Pricing is account-wide and can change. R2 usage rounds upward to billing units. Recheck provider terms before selecting this architecture. Managed authentication, email, moderation, support, monitoring, tax, domain registration and engineering time are not included in the infrastructure subtotal.

## Usage assumptions per monthly active user

- Text coaching: 30 turns/month, **2,000 input + 500 output tokens/turn** including capped context → 60,000 input and 15,000 output tokens/user. No uncapped conversation-history replay.
- Photo understanding: 4 analyses/month, estimated **5,000 image/context input tokens + 800 output tokens each** → 20,000 input and 3,200 output tokens/user. Actual image tokenization is model/resolution dependent; this is a planning assumption, not measured usage.
- Image generation: 2 standard-resolution images/user/month, paid only if explicitly enabled later. Do not assume a current per-image rate.
- Shopping search: 4 requests/user/month, cached where licensing allows. Rate depends on provider/plan.
- Media: 20 uploads/user/month × 2MB, retained for six months at steady state → **0.24GB/user**. Assume 20 writes/user/month and 300 reads/user/month, below R2 request allowances in all scenarios. No video. Real image processing/thumbnail compute may add costs.
- App/API activity: 3,000 dynamic requests/user/month at 5 CPU-ms/request including active-session polling, structured logs and social interactions. 100 sent messages/user/month; storage is included in 5MB of non-media data/user. This is a limited polling design, not a priced realtime/WebSocket service.
- Database: indexed queries, fewer than 20 rows read/request and 500 row writes/user/month including index amplification. 5MB/user total text/log data at the modeled retention. These assumptions require measurement before launch.

## Scenarios

| Monthly active users | Dynamic requests / CPU-ms | Media retained | Messages/month | Verified infra subtotal/month |
| -------------------: | ------------------------: | -------------: | -------------: | ----------------------------: |
|                   10 |          30,000 / 150,000 |          2.4GB |          1,000 |                     **$5.00** |
|                  100 |       300,000 / 1,500,000 |           24GB |         10,000 |                     **$5.21** |
|                1,000 |    3,000,000 / 15,000,000 |          240GB |        100,000 |                     **$8.45** |

Workers/D1 stay within the included Paid allowances at these assumptions. R2 contributes $0, $0.21 and $3.45 respectively after the 10GB free allowance. These are **infrastructure-only subtotals**, not all-in production budgets. Shared account usage, row sizes, CPU, retention and request distributions can change them.

### AI-enabled total: explicit formula until live rates are checked

Let `Ti`/`To` be text input/output USD per million tokens, `Vi`/`Vo` vision input/output USD per million tokens, `G` USD per generated image, `S` USD per search request, and `A(N)` the monthly quote for managed auth/email/monitoring/moderation and any non-included services at N users.

Per-user monthly AI/search cost:

`U = 0.060×Ti + 0.015×To + 0.020×Vi + 0.0032×Vo + 2×G + 4×S`

| Active users | Future monthly total expression |
| -----------: | ------------------------------- |
|           10 | `$5.00 + 10×U + A(10)`          |
|          100 | `$5.21 + 100×U + A(100)`        |
|        1,000 | `$8.45 + 1,000×U + A(1000)`     |

An all-in numeric total is intentionally **unconfirmed** because current model, image, search and authentication rates were not accessible. Check [OpenAI official API pricing](https://openai.com/api/pricing/), the selected search provider and [Supabase pricing](https://supabase.com/pricing) or another managed auth quote before filling the variables. Do not substitute guessed or outdated rates. No provider account or subscription was created.

Economical starting choices: keep AI disabled for a small private beta; bundle a shared database/storage plan; cap context; resize images with consent; make image generation opt-in; cache permitted shopping results; enforce per-user quotas and hard spend alerts. Decide the exact provider and budget only after rate verification and a measured beta.

## Video scope added in the second version

The subtotals above model the original image-based assumptions and are not a priced production video service. For an illustrative beta, 5 uploads/user/month × 20 seconds × 2 Mbps is approximately 25 MB/user/month; 12 months of retention adds 0.3 GB/user (3 / 30 / 300 GB at 10 / 100 / 1,000 users). At 200 complete 5 MB clip plays/user/month, delivery adds roughly 1 GB/user/month before caching or adaptive bitrate savings. These are usage assumptions, not observed production usage.

Apply the verified storage rate to total retained image-plus-video bytes, sharing the same free allowance once. Add separately quoted transcoding, moderation, authenticated delivery/CDN and any streaming-service fees; do not present the old infrastructure subtotal as an all-in video budget. No service, paid plan or account was purchased for this demo.

## Post-sound scope added 22 October 2026

The demo's three original bundled loops use no paid music API or commercial catalogue. This does not estimate the cost of commercial music licensing. Rights-holder rates, territory coverage and any audio identification/transcoding service were not available and must be quoted before adding a production catalogue. Include preview audio requests/bytes and mixed video renditions in the media-storage and delivery assumptions above; avoid counting a separately delivered audio track again when it is already mixed into a rendition.
