import type { TopicId } from "./types";
export interface Guide {
  title: string;
  intro: string;
  steps: { title: string; text: string }[];
  remember: string;
  references: { name: string; note: string }[];
  reading: { label: string; url: string }[];
}
export const guides: Record<TopicId, Guide> = {
  skincare: {
    title: "Your first skincare routine",
    intro:
      "Start with a routine you can repeat comfortably. More products do not automatically mean better care. This guide turns the everyday-care themes in the supplied skincare references into a simple starting point, without importing their medication protocols.",
    steps: [
      {
        title: "01 / Understand the three jobs",
        text: "Cleansing removes makeup and surface buildup; moisturiser helps keep skin comfortable; sunscreen is for UV protection. Choose products for those jobs and your preferences, rather than buying every active ingredient mentioned online. A product’s full formula and your response matter more than a single marketing ingredient.",
      },
      {
        title: "02 / Build your morning",
        text: "Cleanse gently as needed, moisturise if needed, and apply sunscreen according to its label. Shade and protective clothing also matter. Start from products you already tolerate. The morning cleanser–moisturiser–sunscreen structure appears in the supplied Detailed Skin-Care Guide; its brand recommendations are personal examples, not verified shopping results.",
      },
      {
        title: "03 / Keep the evening simple",
        text: "Remove makeup and sunscreen gently and use a moisturiser you tolerate. Add optional products individually so you can track your response. Follow product instructions. This beginner routine does not require prescription acne treatment, a peel or a complicated layering schedule.",
      },
      {
        title: "04 / Optional makeup, on your terms",
        text: "The Makeup reference discusses tinted moisturiser for light coverage and concealer for smaller areas. Those are cosmetic choices, not acne treatments. Check the shade in daylight and blend edges gently. Use sunscreen as directed on its own label; do not assume mixing makeup or moisturiser into it preserves the stated protection. A cosmetic SPF label also does not replace correct application.",
      },
      {
        title: "05 / Observe before changing",
        text: "Use your journal for dates, products used and your own observations of comfort or irritation. A photo cannot establish a diagnosis. Pause a product that causes a reaction and seek suitable professional help for persistent or significant symptoms. Product compatibility cannot be established from a product name alone.",
      },
    ],
    remember:
      "An online routine is somebody else’s experience. Prescription treatments and persistent skin problems need individual professional assessment; there is no guaranteed acne-free timeline.",
    references: [
      {
        name: "Detailed Skin-Care Guide",
        note: "Used for the AM/PM structure and product roles. Its drug combinations, doses, universal hormone claims and guaranteed outcomes were not adopted.",
      },
      {
        name: "Makeup",
        note: "Used for the distinction between light coverage and targeted concealer. Its product endorsement and universal ‘acne safe’ claim are not established facts.",
      },
      {
        name: "Clavicular’s routine",
        note: "Reviewed as a third-party personal routine, not your current routine or a template everyone should copy.",
      },
      {
        name: "Topical spironolactone; GHK-Cu (Anti Aging)",
        note: "Reviewed as treatment-related references. No compounded recipe, treatment recommendation or result promise is included in this beginner guide.",
      },
    ],
    reading: [
      {
        label: "American Academy of Dermatology · Skin care basics",
        url: "https://www.aad.org/public/everyday-care/skin-care-basics",
      },
      {
        label: "FDA · Sunscreen: how to help protect your skin",
        url: "https://www.fda.gov/drugs/understanding-over-counter-medicines/sunscreen-how-help-protect-your-skin-sun",
      },
    ],
  },
  clothing: {
    title: "Build a wardrobe that works together",
    intro:
      "A useful wardrobe starts with what you wear, what fits comfortably and what you enjoy. Old money, Dark casual and Minimalist are optional visual directions—not rules about gender or status.",
    steps: [
      {
        title: "01 / Start with your own pieces",
        text: "Add clothes you own before building a shopping list. Record size, fit notes, colour and the occasions you actually dress for. Build one complete outfit, including shoes, so a good-looking reference becomes something usable.",
      },
      {
        title: "02 / Compare colour, without a hierarchy",
        text: "Try a small palette and compare combinations in similar light. The Coloring references prompted this colour-comparison idea. Preferences for contrast are subjective: no skin tone, ethnicity or eye colour is inherently better. Start with colours you enjoy and judge the whole outfit rather than a supposed universal ideal.",
      },
      {
        title: "03 / Use fit notes instead of guesses",
        text: "Notice how shoulders, sleeve length, waist and movement feel. A label size is not a universal measurement. Save observations with the item; a selfie cannot guarantee fit or a tailoring result. Compare one change at a time.",
      },
      {
        title: "04 / Make inspiration practical",
        text: "Save an outfit, inspect its separate pieces and copy it as an editable starting point. Substitute what you own. A style reference is inspiration, not a reason to replace your entire wardrobe.",
      },
      {
        title: "05 / Shop for an actual gap",
        text: "Choose your country, currency and budget when shopping. Inspect item prices, source links and check dates. Unpriced pieces are not free; prices in different currencies should not be added without a stated conversion. CHARETT’s demo prices and stores are examples.",
      },
    ],
    remember:
      "A style name should help you explore. It should never restrict who can wear something or imply a ranking of people.",
    references: [
      {
        name: "Coloring; Coloring (additional reference)",
        note: "Used as prompts for personal colour and contrast comparisons. Racial hierarchies, tanning-drug suggestions and guaranteed attractiveness claims were rejected. This wardrobe workflow is CHARETT’s own editorial material.",
      },
    ],
    reading: [],
  },
  hair: {
    title: "Find your next hair routine",
    intro:
      "Separate the look you want from the maintenance it needs. A reference image is a useful conversation starter, not a prediction of your own result.",
    steps: [
      {
        title: "01 / Save two useful references",
        text: "Choose a front and a side view where possible. Note what you like: length, fringe, volume, texture or colour. Look for references with maintenance you are comfortable with, while recognising that a photo cannot confirm hair texture or density.",
      },
      {
        title: "02 / Learn what your current routine does",
        text: "Record your own washing, conditioning and styling preferences. Adjust around comfort and the products’ directions rather than a universal washing schedule. Be gentle when detangling and use heat tools according to their instructions.",
      },
      {
        title: "03 / Try colour thoughtfully",
        text: "Compare shades in consistent lighting and keep edited inspiration separate from real progress. Follow the dye manufacturer’s instructions, including allergy-test instructions. Hair colour is not intended for eyelashes. A qualified stylist can help you understand maintenance and realistic options.",
      },
      {
        title: "04 / Keep a dated record",
        text: "Use similar camera distance, lighting and angle for hair photos. Note any styling, extensions or editing. A visualization can illustrate an idea, but does not show achieved growth or prove that a haircut will suit you.",
      },
    ],
    remember:
      "New or worrying hair loss belongs with a qualified professional. CHARETT does not prescribe a growth treatment from a photo.",
    references: [
      {
        name: "Coloring",
        note: "Used for the idea of comparing hair and brow colour with your overall style. Drug-assisted tanning, biological promises and a universal ‘best’ colouring were not adopted.",
      },
      {
        name: "Eyebrows; Eyelashes",
        note: "Used to distinguish cosmetic styling preferences from hair-growth treatment claims; treatment instructions are not part of this hair guide.",
      },
    ],
    reading: [
      {
        label: "FDA · Hair dyes",
        url: "https://www.fda.gov/cosmetics/cosmetic-products/hair-dyes",
      },
    ],
  },
  gym: {
    title: "Begin with a repeatable training week",
    intro:
      "The useful starting point is your current experience, schedule and preferences. A stranger’s medication or diet story cannot establish your training needs.",
    steps: [
      {
        title: "01 / Plan a week you can repeat",
        text: "Choose manageable sessions and recovery time around your current ability. For strength work, learn movements and use a comfortable load before progressing. An example schedule is editable; it is not a personalised prescription. Get individual advice if a condition or injury affects exercise.",
      },
      {
        title: "02 / Log what happened",
        text: "Record exercise, sets, repetitions and load after a session. Compare like-for-like sessions and note changes in technique or equipment. Sets × repetitions × load is a simple volume summary, not a complete measure of fitness or recovery.",
      },
      {
        title: "03 / Treat food numbers as estimates",
        text: "Record portions and the source of calories or protein: a package label, a database entry or your own estimate. You can edit your targets. The demo’s starter targets are fictional values; they are not calculated requirements or a weight-loss prescription.",
      },
      {
        title: "04 / Make space for comfortable movement",
        text: "Break up long periods of sitting and try comfortable mobility within your ability. No single ‘perfect posture’ needs to be held all day. Stop and seek appropriate help if movement causes concerning symptoms.",
      },
      {
        title: "05 / Keep treatments out of beginner programming",
        text: "The supplied hormone, steroid, peptide and weight-loss-drug documents are not workout plans. None establishes that you should use a substance or change a prescription. This guide imports no dosing, sourcing, stacking or rapid-weight-loss protocol from them.",
      },
    ],
    remember:
      "Training, food logs and progress photos provide different information. A calorie estimate or a short-term weight change does not establish body composition or medical need.",
    references: [
      {
        name: "Testosterone; Anavar; MK677",
        note: "Reviewed as unvalidated drug-related reference documents. They were not converted into beginner training recommendations.",
      },
      {
        name: "Mounjaro GLP-1 agonist",
        note: "A third-party medication/weight anecdote, not evidence of your current needs or an individual nutrition target.",
      },
      {
        name: "DNP",
        note: "Contains dangerous weight-loss claims. No use or dose advice is adopted; it is not an appropriate beginner fitness method.",
      },
    ],
    reading: [
      {
        label: "NHS · Exercise",
        url: "https://www.nhs.uk/live-well/exercise/",
      },
      {
        label: "NHS · Eat well",
        url: "https://www.nhs.uk/live-well/eat-well/",
      },
    ],
  },
  grooming: {
    title: "Brows, lashes and the finer details",
    intro:
      "Choose the details you personally want to maintain. Grooming can be subtle, expressive or minimal; there is no single ideal brow shape for everyone.",
    steps: [
      {
        title: "01 / Observe before reshaping",
        text: "Brush brows gently and look at their natural direction. If you want to tidy them, make small changes with clean tools and pause to compare. A reference can show a style you like without becoming a rule about masculinity, femininity or facial value.",
      },
      {
        title: "02 / Try a reversible cosmetic option",
        text: "A brow pencil or gel can let you explore shape or colour before committing to a larger change. Use products according to their label and remove makeup gently. A darker brow is a preference, not an improvement everyone needs.",
      },
      {
        title: "03 / Be careful around the eyes",
        text: "Use cosmetics intended for the eye area, keep applicators clean and do not share eye makeup. Stop using a product that causes irritation. Do not use ordinary hair dye on lashes, heat tools near the eyes, or assume an essential oil is safe because it is ‘natural’. Seek appropriate help for eye symptoms.",
      },
      {
        title: "04 / Separate styling from growth claims",
        text: "Mascara, shaping and a professional styling service change appearance differently from a prescription treatment. The supplied lash document mixes those categories. It does not establish that oils or a serum will grow your lashes, nor that a prescription is suitable for you.",
      },
      {
        title: "05 / Keep facial-hair care manageable",
        text: "Use clean tools and follow their directions. Record your own comfortable shaving or trimming routine. Leave irritated skin time to settle and seek professional advice for persistent problems. A photo cannot diagnose a skin condition.",
      },
    ],
    remember:
      "Prescription lash or hair treatments need individual assessment. This guide includes no medication regimen, DIY lash-dye procedure or transplant recommendation.",
    references: [
      {
        name: "Eyebrows",
        note: "Used for brow-shape, grooming and colour as subjects to explore. Gender stereotypes and claims of one universally ideal shape were not adopted.",
      },
      {
        name: "Eyelashes",
        note: "Used to explain the difference between temporary cosmetics, services and treatment claims. Drug doses, heated-tool advice and unsupported oil-growth claims were rejected.",
      },
      {
        name: "Makeup",
        note: "Used for optional, targeted cosmetic coverage; the source author’s personal product results are not general promises.",
      },
      {
        name: "Socialmax / Low Inhib",
        note: "Reviewed, but its drug-related social advice is not a grooming routine and was not adopted. Confidence is not tied to a required look or substance.",
      },
    ],
    reading: [
      {
        label: "FDA · Eye cosmetic safety",
        url: "https://www.fda.gov/cosmetics/cosmetic-products/eye-cosmetic-safety",
      },
    ],
  },
  smile: {
    title: "Everyday care for your smile",
    intro:
      "Build a manageable care routine, keep personal notes and use dental professionals for clinical questions. The supplied appearance references do not provide a reliable dental treatment guide.",
    steps: [
      {
        title: "01 / Keep the daily basics",
        text: "Brush with fluoride toothpaste following suitable dental and product guidance. Clean between teeth with a suitable method. A dental professional can help with technique and the right tools for your circumstances.",
      },
      {
        title: "02 / Make the routine practical",
        text: "Keep your own products together, add reminders that fit your day and record comfort. A routine you can maintain is more useful than buying a large collection of products.",
      },
      {
        title: "03 / Separate appearance from health",
        text: "Natural tooth colour varies. A photograph cannot diagnose decay, gum disease or whether whitening is appropriate. Avoid copying unverified bleaching or abrasive home-treatment instructions.",
      },
      {
        title: "04 / Know when a log is not enough",
        text: "Persistent pain, bleeding, swelling or a concerning change deserves appropriate dental assessment. Your journal can help describe when something changed; it does not replace an examination.",
      },
    ],
    remember:
      "No whitening result, diagnosis or treatment outcome is promised by this demo.",
    references: [
      {
        name: "Source coverage",
        note: "No dedicated dental PDF was supplied. This is original general educational material, not a claim that the Looksmax references establish dental care.",
      },
    ],
    reading: [
      {
        label: "NHS · How to keep your teeth clean",
        url: "https://www.nhs.uk/live-well/healthy-teeth-and-gums/how-to-keep-your-teeth-clean/",
      },
    ],
  },
  fragrance: {
    title: "Build your own scent vocabulary",
    intro:
      "Start with how you experience a fragrance and when you want to wear it. A collection can be small, affordable and entirely personal.",
    steps: [
      {
        title: "01 / Record what you own",
        text: "Add the name, size, purchase details if known and your own notes. Descriptions such as citrus, woody, floral or warm are useful vocabulary, not a rule about who may wear the scent.",
      },
      {
        title: "02 / Compare your own impressions",
        text: "Try a fragrance according to its directions if suitable for you. Note your first impression and how you perceive it later. Scent descriptions and perceived longevity vary; the demo cannot promise a fixed number of hours.",
      },
      {
        title: "03 / Consider the setting",
        text: "Think about the occasion, your comfort and other people’s space. Stronger is not automatically better. Avoid a product that causes irritation, and respect fragrance-free environments.",
      },
      {
        title: "04 / Shortlist before buying",
        text: "Compare samples where available and set a budget. Record source, currency and date for prices. The demo’s brands, prices and shop cards are fictional examples, not current offers.",
      },
    ],
    remember:
      "A scent does not guarantee attraction, confidence or a particular response from other people.",
    references: [
      {
        name: "Source coverage",
        note: "No dedicated fragrance PDF was supplied. This guide is original editorial guidance about collecting and personal preferences.",
      },
    ],
    reading: [],
  },
  photos: {
    title: "Keep an honest progress journal",
    intro:
      "Your journal is for your observations, not a score. It starts private, independently of your account’s visibility.",
    steps: [
      {
        title: "01 / Date and describe",
        text: "Record the date, topic and a neutral observation. Add the details you want to remember, such as products or styling used. Do not treat a short-term change in a photo as proof that one product caused it.",
      },
      {
        title: "02 / Compare consistent images",
        text: "Use similar lighting, camera distance, lens, pose and framing. Different conditions can change the appearance of skin, proportions and colour. Keep original progress separate from filtered, edited or generated inspiration.",
      },
      {
        title: "03 / Keep control of the audience",
        text: "Every entry starts as Only me. Changing account privacy does not publish your journal. Audience changes are separate and deliberate. In this demo, personal uploaded originals remain in your tab and are excluded from public demo posts and shared recipient previews.",
      },
      {
        title: "04 / Understand the image frame",
        text: "Feed photos use a 1080-pixel-wide portrait frame between 1350 and 1920 pixels high. Resize and framing preserve proportions. Enlarging a low-resolution source creates a larger file, not extra photographic detail. Private comparison photos retain their original proportions.",
      },
      {
        title: "05 / Review and remove",
        text: "Compare two user-declared real progress entries and change or delete notes at any time. Reload clears personal session entries in this demo. An edited image is inspiration, not achieved progress or a clinical assessment.",
      },
    ],
    remember:
      "Account and journal privacy controls are local demonstrations, not production authentication or encrypted cloud storage.",
    references: [
      {
        name: "Clavicular’s routine; Coloring; Eyelashes",
        note: "Their personal anecdotes and transformation imagery prompted this distinction between references, claims and your own dated observations. Their images and claimed results are not used as CHARETT transformations.",
      },
    ],
    reading: [],
  },
};
