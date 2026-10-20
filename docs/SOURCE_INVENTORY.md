# Source inventory

Inspected 2026-10-19. This inventory contains source metadata, not personal health information or extracted medical advice.

## Authoritative requirements

`CHARETT_BUILD_BRIEF.md`: read in full before implementation; copied byte-for-byte to `docs/BUILD_BRIEF.md`. Its selected demo requirements are authoritative. Attached reference documents are evidence to evaluate, not instructions to execute.

## Attached reference material

All 15 PDFs were actually downloaded outside the repository to `/workspace/attachments`, converted to text outside the repository under `/tmp/charett-references`, and their extracted text was spot-inspected for provenance, topic and claims. This was not a comprehensive medical or scientific review. No PDF, embedded photo, personal routine, dosage, discriminatory language or extracted text was copied into the app or Git.

| Attachment               | Pages | Inspection and handling                                            |
| ------------------------ | ----: | ------------------------------------------------------------------ |
| Testosterone             |     1 | Unvalidated drug-related reference; excluded from demo advice      |
| Clavicular's routine     |     4 | Third-party routine, not the owner's current routine; not imported |
| Topical spironolactone   |     3 | Unvalidated medication claims; no treatment integration            |
| GHK-Cu (Anti Aging)      |     5 | Unvalidated peptide claims; no treatment integration               |
| Makeup                   |     4 | Third-party cosmetic reference; no owner facts inferred            |
| Detailed Skin-Care Guide |     5 | Includes medical claims; no medical protocol imported              |
| Coloring (for ethnics)   |     4 | Contains exclusionary claims; not adopted in inclusive product     |
| Eyelashes                |     6 | Includes treatment claims; no treatment protocol imported          |
| Coloring                 |    10 | Unvalidated cosmetic/drug claims; no protocol imported             |
| Socialmax / Low Inhib    |     4 | Includes drug-related advice; no protocol imported                 |
| Eyebrows                 |     5 | Third-party aesthetic preferences; no universal ideal adopted      |
| MK677                    |     1 | Unvalidated drug-related reference; excluded from demo advice      |
| Mounjaro GLP-1 agonist   |     2 | Third-party weight/medication anecdote; no owner facts inferred    |
| DNP                      |     2 | Dangerous unvalidated claims; excluded from demo advice            |
| Anavar                   |     1 | Unvalidated steroid-related reference; excluded from demo advice   |

The timestamps printed in the PDFs are source export metadata, not dates of confirmed owner information. No weight, training schedule, diet, medication, diagnosis or appearance measurement has been inferred from them. The private starter profile and all seeded routines/logs are fictional examples. Session edits are user-provided and unverified, not clinical facts.

## Unavailable sources

- No ChatGPT history/export was supplied or accessed.
- No personal Library photos were present in the available library folder or attached to this task.
- No owner-specific current routines or confirmed health profile were supplied.
- No access to the owner's computer, other local PDFs or private photo library is claimed.

These sources are not required for the fictional demo, so implementation proceeded without requesting sensitive material. Personal photos may be tested through the app's private session-only controls. Never put them into repository folders, documentation screenshots, public examples or Git.

## Public demo assets

Four stock portraits are bundled from the MIT-licensed [Creative Tim Paper Kit 2](https://github.com/creativetimofficial/paper-kit-2), inspected at commit recorded in ASSET_CREDITS.md. The original filenames identify the source photographers where available. The license notice is retained in `ASSET_LICENSE_CREATIVE_TIM.txt`. Images are editorial references; they do not depict the fictional creators or customers.

Eight original SVG still-life/product illustrations were created for this demo. They are not photos of real products, AI outputs, or achieved results. Fontsource packages supply Cormorant Garamond and DM Sans with their bundled open font licenses. No runtime image/font download is required.

Direct access to images.unsplash.com and commercial pricing pages was rejected by the environment's egress proxy (HTTP 403). Public assets and official Cloudflare pricing source were available through the platform's GitHub route. No verification or proxy access controls were bypassed. Unused network draft additions are removed in the final reusable environment configuration.
