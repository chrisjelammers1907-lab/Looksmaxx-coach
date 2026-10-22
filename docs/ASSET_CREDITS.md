# Asset credits

The app bundles its assets; there are no runtime image or font requests to external hosts.

## Stock portraits

Source: [Creative Tim Paper Kit 2](https://github.com/creativetimofficial/paper-kit-2), commit `96ad4f474dc9c1a9aadc80d65cc2274451d3bbd6`. Its MIT license is retained in ASSET_LICENSE_CREATIVE_TIM.txt. The original source paths are preserved here. No identity, endorsement, customer relationship or achieved result is implied. These portraits are not the fictional community creators or the owner.

| Bundled file | Source file under assets/img | Source filename credit                       |
| ------------ | ---------------------------- | -------------------------------------------- |
| hero.jpg     | faces/clem-onojeghuo-2.jpg   | Clem Onojeghuo                               |
| hair.jpg     | faces/joe-gardner-2.jpg      | Joe Gardner                                  |
| grooming.jpg | faces/erik-lucatero-2.jpg    | Erik Lucatero                                |
| style.jpg    | avatar.jpg                   | Photographer not specified by source package |

## Original illustrations

`skin.svg`, `gym.svg`, `smile.svg`, `fragrance.svg`, `shirt.svg`, `tee.svg`, `denim.svg`, `food.svg` are original vector demo assets. They are editorial illustrations, not real product photography, AI-generated try-ons or achieved results. The CHARETT product labels and brands are fictional examples.

## Fonts and icons

Cormorant Garamond and DM Sans are bundled using Fontsource packages with their included SIL Open Font License notices. Lucide icons use the ISC license included in lucide-react. Notices are also bundled under `public/licenses/` and copied into `dist/licenses/` for redistribution.

Direct Unsplash downloads were blocked by egress policy. None of the attempted downloads were used. Public-assets samples investigated during sourcing were not copied into the app.

## Editorial demo video

`public/assets/motion.mp4` is a five-second, silent camera-motion study produced from the same MIT-licensed `grooming.jpg` / Erik Lucatero stock still above. It is labelled **Editorial motion study**, not recorded footage of a fictional creator, an AI-generated transformation or a customer result. H.264, 1080 × 1920; no speech or music is included. The original Creative Tim license is retained and embedded in the standalone export.

Feed images are resized/cropped in the browser to the requested 1080-pixel width and supported portrait heights. The source portraits are 400 × 400; upscaling changes dimensions and does not restore photographic detail. No claim of native 1080-resolution source photography is made.

## Third-iteration original editorial assets — 22 October 2026

`campaign.jpg`, `ritual.jpg` and `tailoring.jpg` were generated specifically for CHARETT using the image-generation tool, then transcoded to JPEG. The generated originals remain outside the repository. They depict fictional adults, imaginary unbranded cosmetics and an outfit still life. Visible **AI editorial inspiration** labels distinguish them from real community photos, shopping products, uploaded originals, try-on output and achieved results. No Victoria’s Secret photography or branding was copied. These are static generated assets; the in-app image-generation/try-on feature remains a labelled simulation.

`motion.mp4` now uses `campaign.jpg` instead of the former licensed portrait. It is a five-second H.264 camera-motion study at 1080 × 1350, not recorded footage or an achieved transformation. Its visual track is silent; an optional separately controlled original instrumental is attached as post metadata. It is labelled **AI editorial motion study**. Earlier video details above describe the previous exported version.

`sound-golden.mp3` (Golden hour, 80 BPM / 12 s), `sound-after.mp3` (After hours, 100 BPM / 9.6 s) and `sound-soft.mp3` (Soft focus, 64 BPM / 15 s) are original synthesized instrumental loops composed for this demo. They contain no vocals, sampled recordings or third-party songs. The reproducible generator is `scripts/create-demo-sounds.py` (Python standard library and FFmpeg/libmp3lame); this is not a commercial music catalogue or a real music-generation service. Playback is real and opt-in. All assets are bundled in the normal build and standalone export; no external streaming host is required.
