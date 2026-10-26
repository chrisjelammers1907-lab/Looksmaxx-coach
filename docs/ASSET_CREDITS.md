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

## Editorial photography (round 5)

Real photographs from Pexels, free to use commercially under the [Pexels licence](https://www.pexels.com/license/). No AI images. Each is resized to 1080 px, given a light warm grade and compressed by `scripts/fetch-photos.mjs`.

| File                           | Subject                                     | Source                                           |
| ------------------------------ | ------------------------------------------- | ------------------------------------------------ |
| `photo-home-hero.jpg`          | Fashion couple in cream and white           | [Pexels](https://www.pexels.com/photo/28773331/) |
| `photo-skincare.jpg`           | Man applying face cream in a mirror         | [Pexels](https://www.pexels.com/photo/5891027/)  |
| `photo-makeup.jpg`             | Woman applying blush with a brush           | [Pexels](https://www.pexels.com/photo/16350183/) |
| `photo-face.jpg`               | Black-and-white side profile of a man       | [Pexels](https://www.pexels.com/photo/38921830/) |
| `photo-colouring.jpg`          | Portrait of a woman in golden-hour light    | [Pexels](https://www.pexels.com/photo/30313312/) |
| `photo-brows.jpg`              | Close-up of a woman's eye and brow          | [Pexels](https://www.pexels.com/photo/3724431/)  |
| `photo-smile.jpg`              | Smiling man in a white tee                  | [Pexels](https://www.pexels.com/photo/9775440/)  |
| `photo-hair.jpg`               | Barber styling a man's curly hair           | [Pexels](https://www.pexels.com/photo/35556916/) |
| `photo-grooming.jpg`           | Man shaving with a safety razor             | [Pexels](https://www.pexels.com/photo/7320169/)  |
| `photo-gym.jpg`                | Man front-squatting a barbell               | [Pexels](https://www.pexels.com/photo/116077/)   |
| `photo-nutrition.jpg`          | Woman preparing a salad                     | [Pexels](https://www.pexels.com/photo/6707691/)  |
| `photo-body.jpg`               | Hands with manicured nails on a robe        | [Pexels](https://www.pexels.com/photo/6724543/)  |
| `photo-sleep.jpg`              | Woman resting in white bedding              | [Pexels](https://www.pexels.com/photo/6660780/)  |
| `photo-presence.jpg`           | Man standing tall in a cream suit           | [Pexels](https://www.pexels.com/photo/8555392/)  |
| `photo-clothing.jpg`           | Couple in matching neutral tones            | [Pexels](https://www.pexels.com/photo/3754261/)  |
| `photo-fragrance.jpg`          | Woman holding a perfume bottle              | [Pexels](https://www.pexels.com/photo/8450539/)  |
| `photo-photos.jpg`             | Man taking a mirror selfie                  | [Pexels](https://www.pexels.com/photo/30609692/) |
| `photo-style-old-money.jpg`    | Woman in linen arranging dried flowers      | [Pexels](https://www.pexels.com/photo/5393448/)  |
| `photo-style-dark-casual.jpg`  | Man in a leather jacket at night            | [Pexels](https://www.pexels.com/photo/31896874/) |
| `photo-style-minimalist.jpg`   | Woman in black and white against stone      | [Pexels](https://www.pexels.com/photo/13966360/) |
| `photo-style-streetwear.jpg`   | Man in a black hoodie by a window           | [Pexels](https://www.pexels.com/photo/29746290/) |
| `photo-style-smart-casual.jpg` | Man in a blazer and roll-neck               | [Pexels](https://www.pexels.com/photo/5448149/)  |
| `photo-style-athleisure.jpg`   | Two friends in sportswear on a court        | [Pexels](https://www.pexels.com/photo/8693560/)  |
| `photo-style-preppy.jpg`       | Friends in a sweater vest and pleated skirt | [Pexels](https://www.pexels.com/photo/9178814/)  |
| `photo-style-bohemian.jpg`     | Woman in a straw hat and linen shirt        | [Pexels](https://www.pexels.com/photo/3021600/)  |
| `photo-feed-sunday.jpg`        | Couple in white on city stairs              | [Pexels](https://www.pexels.com/photo/33514667/) |
| `photo-feed-linen.jpg`         | Woman in a white linen set                  | [Pexels](https://www.pexels.com/photo/31444311/) |
| `photo-feed-lounge.jpg`        | Woman in linen on a sofa                    | [Pexels](https://www.pexels.com/photo/6996139/)  |
| `photo-feed-ritual.jpg`        | Woman doing her skincare                    | [Pexels](https://www.pexels.com/photo/6001217/)  |
| `photo-feed-lift.jpg`          | Man setting up a deadlift                   | [Pexels](https://www.pexels.com/photo/4720781/)  |
| `photo-feed-hair.jpg`          | Woman with soft waves at golden hour        | [Pexels](https://www.pexels.com/photo/38439020/) |
| `photo-feed-shave.jpg`         | Close-up of a man shaving                   | [Pexels](https://www.pexels.com/photo/7320120/)  |
| `photo-feed-smile.jpg`         | Black-and-white smile with stubble          | [Pexels](https://www.pexels.com/photo/6121110/)  |
| `photo-feed-autumn.jpg`        | Woman smiling in autumn light               | [Pexels](https://www.pexels.com/photo/31936486/) |
| `photo-feed-mirror.jpg`        | Man with a camera in a mirror               | [Pexels](https://www.pexels.com/photo/36557658/) |
| `photo-feed-night.jpg`         | Man in a leather jacket against brick       | [Pexels](https://www.pexels.com/photo/39083324/) |
| `photo-feed-motion.jpg`        | Couple in an urban parking deck at dusk     | [Pexels](https://www.pexels.com/photo/5905252/)  |
| `photo-feed-cuff.jpg`          | Detail of a shirt cuff and watch            | [Pexels](https://www.pexels.com/photo/37906240/) |
| `photo-ad-shirt.jpg`           | Man adjusting a watch over a shirt cuff     | [Pexels](https://www.pexels.com/photo/37906241/) |
| `photo-ad-serum.jpg`           | Hand holding unbranded serum bottles        | [Pexels](https://www.pexels.com/photo/34939729/) |
| `photo-ad-gym.jpg`             | Man doing curls in a gym                    | [Pexels](https://www.pexels.com/photo/14085138/) |

## About story frames (round 7)

`public/assets/about-turn/{s,l}/001–090.webp` are 90 stills from the video [Man Touching his Hair and Posing for the Camera](https://www.pexels.com/video/7451428/) by cottonbro studio on Pexels, free to use commercially under the [Pexels licence](https://www.pexels.com/license/). `scripts/build-about-sequence.sh` takes 3.6 seconds of the clip at 25 frames a second, crops it to 9:16, gives it a light warm grade and writes 432 × 768 (phones) and 720 × 1280 (large screens) WebP frames. He is a model, not the founder, a customer or a result.
