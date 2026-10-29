import type { TopicId } from "./types";
export interface Guide {
  title: string;
  intro: string;
  /** Heading for the glossary, e.g. "What each product does". */
  productsTitle: string;
  products: { name: string; does: string }[];
  /** How to put it together, in order. */
  routine: { title: string; text: string }[];
  works: string[];
  skip: string[];
  /**
   * What people use for faster results, told straight: what it really does
   * (including when it works) and what it costs. Never doses or sources.
   */
  shortcuts?: { name: string; does: string; cost: string }[];
  remember?: string;
}

/** Shown wherever a guide touches hormones, medication or prescriptions. */
export const doctorNote = "Hormones or medication only through a doctor.";

export const guides: Record<TopicId, Guide> = {
  skincare: {
    title: "Your first skincare routine",
    intro:
      "Three products in the morning, two or three at night. Learn what each one does, then add one treatment at a time.",
    productsTitle: "What each product does",
    products: [
      {
        name: "Cleanser",
        does: "Removes oil, sweat, sunscreen and dirt. A gentle, non-foaming one keeps your skin barrier intact.",
      },
      {
        name: "Moisturiser",
        does: "Holds water in your skin and repairs the barrier. Gel for oily skin, cream for dry skin.",
      },
      {
        name: "Sunscreen (SPF 30+)",
        does: "Blocks UV, the main cause of dark marks, redness and early ageing. Mineral (zinc oxide) suits sensitive skin.",
      },
      {
        name: "Retinoid (adapalene, retinol)",
        does: "Speeds up cell turnover so pores clog less; also smooths texture over months. Use at night.",
      },
      {
        name: "Prescription retinoid (tretinoin, tazarotene)",
        does: "Stronger than retinol or adapalene and the best-studied for acne, marks and fine lines. Through a doctor; start slowly, it irritates at first.",
      },
      {
        name: "Benzoyl peroxide",
        does: "Kills acne bacteria. Good as a spot treatment or as a 5–10% wash for chest and back. Can bleach towels.",
      },
      {
        name: "Salicylic acid (BHA)",
        does: "Dissolves oil inside pores. Helps blackheads and oily skin.",
      },
      {
        name: "Niacinamide",
        does: "Calms redness, evens tone and fades marks left by spots.",
      },
      {
        name: "Azelaic acid",
        does: "Fades red and dark marks and calms breakouts; gentle enough for sensitive skin.",
      },
      {
        name: "Vitamin C serum",
        does: "Brightens and protects against daily damage. Morning, under sunscreen.",
      },
      {
        name: "Glycolic or lactic acid (AHA)",
        does: "Exfoliates the surface for smoother texture. Once a week to start.",
      },
      {
        name: "Hyaluronic acid",
        does: "Draws water into the skin for a plumper feel. Apply on damp skin, under moisturiser.",
      },
      {
        name: "Copper peptides (GHK-Cu serum)",
        does: "A cosmetic serum that may support repair and firmness. Small studies and a modest effect: a nice extra, not a fix.",
      },
    ],
    routine: [
      {
        title: "Morning",
        text: "Cleanser (or just water) → vitamin C if you use it → moisturiser → sunscreen. Sunscreen always goes last.",
      },
      {
        title: "Evening",
        text: "Cleanse after your shower → one treatment (retinoid, or an acid on a different night) → moisturiser. Retinoid and acids don’t go on the same night at first.",
      },
      {
        title: "Starting a retinoid",
        text: "A pea-sized amount, two or three nights a week, on dry skin. Build up over a month. A short purge in the first weeks is normal.",
      },
      {
        title: "Combining treatments",
        text: "Retinoid + niacinamide: fine. Benzoyl peroxide in the morning, retinoid at night: fine. Retinoid + strong acid on the same night: too much for most skin.",
      },
      {
        title: "Marks and scars",
        text: "Red or dark marks fade with azelaic acid, niacinamide and daily SPF. Pitted scars don’t fade with creams: chemical peels, microneedling or laser by a professional do.",
      },
      {
        title: "Timing",
        text: "Acne improves in 4–8 weeks, oil and texture in 8–12, fine lines in 3–6 months. Change one product at a time.",
      },
    ],
    works: [
      "Daily sunscreen, even on cloudy days",
      "One active at a time, introduced slowly",
      "Cleansing after the gym and after showering",
      "A richer moisturiser on nights your skin feels tight",
      "A dermatologist when acne leaves marks or keeps coming back",
    ],
    skip: [
      "Harsh scrubs and alcohol-heavy toners",
      "Five new products in the same week",
      "Picking at spots — it leaves longer-lasting marks",
      "Toothpaste, lemon or baking soda on skin",
    ],
    shortcuts: [
      {
        name: "Isotretinoin (Accutane)",
        does: "The most effective treatment for severe or stubborn acne. It shrinks the oil glands, and for many people the acne stays away after the course.",
        cost: "Dry lips, eyes and skin for months, higher liver values and cholesterol (so you get blood tests), rare mood changes, and it causes birth defects, so no pregnancy during or soon after. Only through a dermatologist.",
      },
      {
        name: "Topical spironolactone",
        does: "Blocks the hormone signal that drives oil in the skin, so there is less oil and fewer spots. Small studies look promising.",
        cost: "Little long-term research, only made by compounding pharmacies, and the strength of unofficial creams is unknown. Ask a dermatologist.",
      },
      {
        name: "Finasteride or dutasteride for oily skin",
        does: "They lower DHT, the hormone behind oily skin and male hair loss, so skin can get less oily.",
        cost: "Not an approved acne treatment. A minority of men get sexual side effects or low mood, and anyone who could be pregnant must not touch the tablets. Prescription only.",
      },
    ],
    remember: `Persistent or painful acne belongs with a dermatologist. ${doctorNote}`,
  },
  clothing: {
    title: "Build a wardrobe that works together",
    intro:
      "A good wardrobe is a small set of pieces that combine with each other. Start from what fits, then fill the gaps.",
    productsTitle: "What each piece does",
    products: [
      {
        name: "Plain tee or knit",
        does: "The base layer of most outfits. Neutral colours make everything else easier.",
      },
      {
        name: "Overshirt or shirt",
        does: "Adds structure to a tee and jeans; open as a layer or closed on its own.",
      },
      {
        name: "Straight or tapered trousers",
        does: "Balance the upper body. Straight is relaxed, tapered is sharper.",
      },
      {
        name: "Dark denim",
        does: "Dresses up or down. Dark washes look cleaner than faded ones.",
      },
      {
        name: "Outer layer (coat, jacket)",
        does: "Sets the tone of the whole look. The piece people notice first.",
      },
      {
        name: "Clean shoes",
        does: "Finish the outfit. White or black leather sneakers go with almost everything.",
      },
      {
        name: "Belt, watch, bag",
        does: "Small details that make a simple outfit look considered.",
      },
    ],
    routine: [
      {
        title: "Fit first",
        text: "Shoulder seams sit on your shoulder, sleeves end at the wrist, trousers break once or not at all. A cheap piece that fits beats an expensive one that doesn’t.",
      },
      {
        title: "Three colours per outfit",
        text: "Pick one main neutral (navy, black, grey, camel, white), one supporting neutral, and at most one accent.",
      },
      {
        title: "Balance the shape",
        text: "Loose top with slim bottoms, or fitted top with wider trousers. Loose on loose looks sloppy unless it’s deliberate.",
      },
      {
        title: "Build outfits, not items",
        text: "Before you buy, name three things you own that it goes with. If you can’t, skip it.",
      },
      {
        title: "Pick a direction",
        text: "Old money, dark casual and minimalist each have a colour set and a few key pieces. Choose one to start so your pieces combine.",
      },
    ],
    works: [
      "A tailor for trouser length and sleeve length",
      "Neutral basics in a better fabric",
      "Repeating outfits that work",
      "Steaming or ironing before you go out",
    ],
    skip: [
      "Big logos and loud graphics on everything",
      "Buying a trend you’d only wear once",
      "Sizes that are ‘almost right’",
      "Worn-out shoes with a sharp outfit",
    ],
  },
  hair: {
    title: "Find your next hair routine",
    intro:
      "Pick the cut first, then the products that hold it. Most hair needs only two or three products.",
    productsTitle: "What each product does",
    products: [
      {
        name: "Shampoo",
        does: "Cleans oil and product from the scalp. Focus on the roots, not the lengths.",
      },
      {
        name: "Conditioner",
        does: "Smooths the lengths and makes them easier to detangle. Mid-lengths to ends.",
      },
      {
        name: "Ketoconazole shampoo",
        does: "Calms dandruff and an itchy scalp. Twice a week, leave on for a few minutes.",
      },
      {
        name: "Minoxidil 5% (foam or solution)",
        does: "Over the counter and proven to slow thinning and regrow some hair, mostly at the crown. It takes 4–6 months and only works while you keep using it.",
      },
      {
        name: "Sea-salt spray",
        does: "Adds texture and volume before blow-drying. Light hold, matte look.",
      },
      {
        name: "Clay or paste",
        does: "Matte, flexible hold for short to medium styles.",
      },
      {
        name: "Pomade",
        does: "Shine and a sleek finish; good for slick-backs and side parts.",
      },
      {
        name: "Curl cream or leave-in",
        does: "Defines curls and stops frizz. On wet hair, scrunch, don’t rub.",
      },
      {
        name: "Heat protectant",
        does: "Shields hair from blow-dryer and straightener damage.",
      },
    ],
    routine: [
      {
        title: "Choose the cut",
        text: "Bring a front and a side photo to your barber or stylist and ask how much daily styling it needs.",
      },
      {
        title: "Wash",
        text: "Shampoo two to four times a week, conditioner every time. Oily scalp: more often. Curly or dry hair: less.",
      },
      {
        title: "Style",
        text: "Towel-dry → sea-salt spray or heat protectant → blow-dry in the direction you want → a fingertip of clay or pomade, warmed in your hands.",
      },
      {
        title: "Keep the shape",
        text: "Short cuts need a trim every 3–5 weeks, longer styles every 6–10.",
      },
    ],
    works: [
      "Blow-drying for volume instead of more product",
      "Using less product than you think",
      "A cut that suits your hair type",
      "Seeing a doctor early about thinning",
    ],
    skip: [
      "Washing with hot water every day",
      "High heat without protectant",
      "Heavy gel on fine hair",
      "Hair dye on brows or lashes",
    ],
    shortcuts: [
      {
        name: "Finasteride or dutasteride",
        does: "They stop or slow male-pattern hair loss in most men by lowering DHT. Together with minoxidil they work better still.",
        cost: "Prescription only. A minority get sexual side effects or low mood, anyone who could be pregnant must not handle the tablets, and the loss comes back when you stop.",
      },
    ],
    remember: `Thinning or a receding hairline is best seen early by a doctor. ${doctorNote}`,
  },
  gym: {
    title: "Begin with a repeatable training week",
    intro:
      "Three sessions a week, a handful of exercises, a little heavier over time. That covers most of the progress a beginner can make.",
    productsTitle: "What each part does",
    products: [
      {
        name: "Compound lifts",
        does: "Squat, deadlift, bench, rows, overhead press: many muscles at once. The core of every session.",
      },
      {
        name: "Accessory exercises",
        does: "Curls, raises, lunges: fill in smaller muscles and weak points.",
      },
      {
        name: "Progressive overload",
        does: "A bit more weight or one more rep over time. This is what makes muscles grow.",
      },
      {
        name: "Rest days",
        does: "Muscles grow while you recover, not while you train.",
      },
      {
        name: "Protein",
        does: "Builds and repairs muscle. Spread it over your meals.",
      },
      {
        name: "Creatine monohydrate",
        does: "One of the best-studied supplements: a little more strength and reps over time. Optional.",
      },
      {
        name: "Sleep",
        does: "Seven to nine hours makes recovery, appetite and strength easier.",
      },
    ],
    routine: [
      {
        title: "Pick a split",
        text: "Three days: full body each time. Four days: upper / lower / upper / lower. Plan it in the day planner and the sessions log themselves.",
      },
      {
        title: "Build a session",
        text: "Two or three compound lifts, then two accessories. 3 sets of 6–12 reps. Rest 1–3 minutes between sets.",
      },
      {
        title: "Progress",
        text: "When you hit the top of the rep range on all sets, add 2.5 kg (or 5 lb) next time.",
      },
      {
        title: "Warm up",
        text: "Five minutes of light movement, then one or two lighter sets of the first lift.",
      },
    ],
    works: [
      "The same plan for 8–12 weeks before switching",
      "Logging every set so you know what to beat",
      "Good form before heavy weight",
      "Walking on rest days",
    ],
    skip: [
      "Changing your program every week",
      "Training to failure on every set",
      "Skipping legs",
      "Fat-burner pills: mostly caffeine, a small and short effect",
    ],
    shortcuts: [
      {
        name: "Testosterone and anabolic steroids (such as Anavar)",
        does: "They work: more muscle and strength, faster, and less fat than training alone can give.",
        cost: "They shut down your own testosterone, which can leave you infertile and low after you stop. Acne, hair loss, worse cholesterol and a strained heart are common, and tablets like Anavar strain the liver. Illegal without a prescription in many countries; testosterone only through a doctor for proven low levels.",
      },
      {
        name: "MK-677 (ibutamoren)",
        does: "It raises growth hormone and IGF-1: more appetite, deeper sleep and some size and weight gain.",
        cost: "Not approved for use and sold as a research chemical. Water retention, tingling hands and higher blood sugar are common, and its long-term safety is unknown.",
      },
    ],
    remember: `Get advice first if an injury or condition affects training. ${doctorNote}`,
  },
  grooming: {
    title: "Shave and beard, without the irritation",
    intro:
      "A clean shave or a sharp beard line changes your face more than most products. The trick is preparation and a good neckline.",
    productsTitle: "What each tool does",
    products: [
      {
        name: "Safety razor",
        does: "One sharp blade: fewer ingrown hairs than multi-blade razors.",
      },
      {
        name: "Electric trimmer",
        does: "Beard length, stubble and the neck, where razor bumps start most.",
      },
      {
        name: "Shaving cream",
        does: "Lets the blade glide and protects the skin.",
      },
      {
        name: "Aftershave balm",
        does: "Calms the skin after shaving. Skip alcohol-heavy splashes.",
      },
      {
        name: "Beard oil",
        does: "Softens the hair and stops itch under a longer beard.",
      },
    ],
    routine: [
      {
        title: "Prepare",
        text: "Shave after a warm shower, or exfoliate gently first so the hairs stand up.",
      },
      {
        title: "Shave",
        text: "Cream → shave with the grain → rinse cool → balm → sunscreen in the morning.",
      },
      {
        title: "Shape a beard",
        text: "Trim to one length. Neckline one finger above the Adam’s apple, curving up behind the ears. Clean up the cheek line.",
      },
      {
        title: "Keep it",
        text: "Re-trim the lines every 3–4 days. Wash the beard with face wash, then a drop of oil.",
      },
    ],
    works: [
      "A fresh blade every 5–7 shaves",
      "A sharp neckline",
      "Balm instead of alcohol aftershave",
      "Letting irritated skin rest a few days",
    ],
    skip: [
      "Shaving against the grain on sensitive skin",
      "Pressing hard with a dull blade",
      "A neckline on the jawbone",
      "Dry shaving without cream",
    ],
  },
  makeup: {
    title: "Makeup that looks like good skin",
    intro:
      "Good makeup doesn’t look like makeup. Even out redness, define brows and lashes, add a touch of colour — for women and men alike.",
    productsTitle: "What each product does",
    products: [
      {
        name: "Tinted moisturiser or skin tint",
        does: "Evens out redness and tone with a sheer finish. The base for everything.",
      },
      {
        name: "Foundation",
        does: "More coverage than a tint. Choose by undertone, test on the jaw in daylight.",
      },
      {
        name: "Concealer",
        does: "Covers spots and under-eye shadow. Tap on only where needed.",
      },
      {
        name: "Setting powder",
        does: "Takes away shine on the T-zone. A light press, not a layer.",
      },
      {
        name: "Brow gel or pencil",
        does: "Holds brows in place and fills gaps with fine strokes.",
      },
      {
        name: "Mascara",
        does: "Lengthens and darkens lashes; opens up the eyes.",
      },
      {
        name: "Bronzer and contour",
        does: "Bronzer warms where the sun hits; contour adds shadow under cheekbones and along the jaw.",
      },
      {
        name: "Lip and cheek tint",
        does: "A natural flush of colour; one shade for both.",
      },
    ],
    routine: [
      {
        title: "Prep",
        text: "Moisturiser → sunscreen → wait a minute so the base doesn’t slide.",
      },
      {
        title: "Base",
        text: "Mix a little tinted moisturiser with moisturiser on your fingertips. Blend from the centre outwards, into the jaw and neck.",
      },
      {
        title: "Correct",
        text: "Concealer only on spots and the inner under-eye. Tap, don’t rub.",
      },
      {
        title: "Define",
        text: "Brush brows up and set them. Mascara on the top lashes, wiggling at the roots.",
      },
      { title: "Day look", text: "Stop here, or add tint on lips and cheeks." },
      {
        title: "Evening look",
        text: "Add bronzer to cheekbones and temples, contour under the cheekbones, a darker lip or a soft smoky liner.",
      },
    ],
    works: [
      "Less product, blended well",
      "Matching base to your neck, not your hand",
      "Applying in daylight",
      "Non-comedogenic products if you get spots",
    ],
    skip: [
      "A base line at the jaw",
      "Heavy powder on dry skin",
      "Sleeping in makeup",
      "Sharing mascara or eye products",
    ],
  },
  face: {
    title: "Face structure: what really changes it",
    intro:
      "Bone structure is mostly set as an adult. What you can change is everything around it: fat, posture, sleep, hair and how you frame your features.",
    productsTitle: "What each lever does",
    products: [
      {
        name: "Body fat",
        does: "The biggest lever for a defined jaw and cheekbones. A few kilos less often shows first in the face.",
      },
      {
        name: "Posture and head position",
        does: "A forward head softens the jawline. Neck long and chin level shows it.",
      },
      {
        name: "Sleep and salt",
        does: "Short sleep and salty evenings cause puffiness around the eyes and cheeks.",
      },
      {
        name: "Haircut and beard",
        does: "Volume on top lengthens the face; a beard can square a soft jaw or balance a long chin.",
      },
      {
        name: "Brows",
        does: "Well-groomed brows frame the eye area and lift the face.",
      },
      {
        name: "Makeup contour",
        does: "Shadow under cheekbones and along the jaw creates definition for photos and evenings.",
      },
    ],
    routine: [
      {
        title: "Eye area",
        text: "Do yourself: 7–9 hours of sleep, less salt in the evening, a cold compress and caffeine eye cream for puffiness, SPF and sunglasses against fine lines, groomed brows. Doesn’t work: creams that promise to remove hollows or change eye shape. Specialist: under-eye hollows, droopy lids or dark circles from volume loss — only via a qualified specialist.",
      },
      {
        title: "Maxilla & midface",
        text: "Do yourself: a good posture with the tongue resting on the roof of the mouth and nasal breathing, a healthy weight, and hair or makeup that adds focus to the cheek area. Doesn’t work: promises that mewing reshapes an adult’s upper jaw, or face yoga for bone changes. Specialist: a recessed midface or breathing problems — orthodontics and jaw treatments are only via a qualified specialist.",
      },
      {
        title: "Cheekbones (zygos)",
        text: "Do yourself: lower body fat, contour or bronzer high on the cheekbone, and a haircut that doesn’t hide the sides of your face. Doesn’t work: gua sha or massage tools that claim to lift bone. Specialist: fillers or implants for cheek volume — only via a qualified specialist.",
      },
      {
        title: "Jaw (mandible) & chin",
        text: "Do yourself: lose fat around the neck, keep the head up, shape the beard with a clean neckline, and contour along the jaw for photos. Doesn’t work as promised: jaw exercisers and hard gum add a little chewing muscle at best and strain the jaw joint. Specialist: a weak chin or bite problems — orthodontics, fillers or surgery only via a qualified specialist.",
      },
    ],
    works: [
      "A healthy, lower body-fat percentage",
      "Good posture and nasal breathing",
      "A haircut and beard that frame your face",
      "Good sleep and less salt at night",
    ],
    skip: [
      "Jaw exercisers and chewing for hours",
      "Gua sha or tools that promise to reshape bone",
      "Rating your face with apps",
      "Anything sold as a shortcut to a new face",
    ],
    remember: `Bone changes are never a home project. ${doctorNote}`,
  },
  colouring: {
    title: "Find the colours that suit you",
    intro:
      "Your colouring is the mix of skin undertone, hair and eye colour, and the contrast between them. Work with it and you look healthier without changing anything.",
    productsTitle: "What each part does",
    products: [
      {
        name: "Undertone",
        does: "Warm (golden), cool (pink) or neutral. Shows in which metals and whites flatter you.",
      },
      {
        name: "Contrast",
        does: "The difference between your hair, skin and eyes. High contrast suits bold combinations; low contrast suits tone-on-tone.",
      },
      {
        name: "Tinted SPF",
        does: "Protects from sun and evens tone. Tanning damage ages skin faster than anything.",
      },
      {
        name: "Gradual self-tan",
        does: "A light, believable glow without sun damage.",
      },
      {
        name: "Hair and brow colour",
        does: "Brows a shade close to your hair keep your face in balance.",
      },
    ],
    routine: [
      {
        title: "Find your undertone",
        text: "In daylight, hold a pure white and a cream top near your face, then gold and silver. Whatever makes your skin look even and your eyes brighter shows it: white and silver lean cool, cream and gold lean warm, both is neutral.",
      },
      {
        title: "Find your contrast",
        text: "Take a black-and-white photo. Big difference between hair and skin: high contrast. Similar greys: low.",
      },
      {
        title: "Choose colours",
        text: "Warm: cream, camel, olive, rust. Cool: pure white, navy, grey, burgundy. Neutral: most colours. Wear your best ones near your face.",
      },
      {
        title: "A glow, safely",
        text: "Self-tan two to three times a week on moisturised skin; keep it off brows and hairline. Daily SPF stays.",
      },
      {
        title: "Colour from food",
        text: "More fruit and vegetables, especially orange and red ones, adds a warm, healthy tint to the skin within weeks; in studies people rate it as healthier and more attractive. Food works better than high-dose pills.",
      },
      {
        title: "Even out dark spots",
        text: "On every skin tone, azelaic acid, niacinamide and daily SPF fade dark spots and marks. You even out your skin; you don’t change its tone.",
      },
      {
        title: "Lips, teeth and eyes",
        text: "A tinted lip balm and gentle exfoliation for lips, whitening through a dentist, and coloured contacts only when fitted by an optician — never from a costume shop.",
      },
    ],
    works: [
      "Testing colours under your chin in daylight",
      "Self-tan instead of sunbeds",
      "Brows close to your hair colour",
      "Neutrals in your undertone as a base",
    ],
    skip: [
      "Sunbeds and tanning without SPF",
      "A “base tan” before a holiday: it protects about as much as SPF 3",
      "Judging colour under shop lights",
      "Rules that say one skin tone is better",
    ],
    shortcuts: [
      {
        name: "Melanotan II (MT2)",
        does: "A tanning peptide: it does tan you with little sun, and it also lowers appetite.",
        cost: "Not approved anywhere and sold unregulated, so what is in the vial is uncertain. Nausea and flushing are common; it darkens moles and freckles and can create new ones, which makes skin cancer harder to spot. Have your moles checked by a dermatologist.",
      },
      {
        name: "Skin lighteners (hydroquinone, steroid creams, glutathione)",
        does: "Hydroquinone does fade dark spots and melasma. Glutathione pills have weak evidence.",
        cost: "Hydroquinone belongs in short, supervised courses: long use can cause a lasting blue-black darkening. Creams mixed with steroids thin the skin, and glutathione injections carry infection and allergy risks. For spots, not your skin tone, and through a dermatologist.",
      },
    ],
    remember:
      "Every skin tone is good; colouring is about harmony, not a ranking.",
  },
  brows: {
    title: "Brows and lashes",
    intro:
      "Brows frame the face and lashes open up the eyes. Shape a little, fill where needed, and set them so they stay.",
    productsTitle: "What each tool does",
    products: [
      {
        name: "Spoolie brush",
        does: "Brushes brows into shape so you can see what to trim.",
      },
      {
        name: "Small scissors",
        does: "Trims long hairs without changing the shape.",
      },
      {
        name: "Tweezers",
        does: "Removes strays between and under the brows, one hair at a time.",
      },
      {
        name: "Brow gel",
        does: "Holds brows in place; tinted gel fills light gaps.",
      },
      {
        name: "Brow pencil",
        does: "Fine, hair-like strokes where brows are sparse.",
      },
      {
        name: "Mascara and lash curler",
        does: "Curl first, then mascara at the roots for lift.",
      },
      {
        name: "Brow tint kit",
        does: "Darkens light brows for about four weeks. Made for brows, unlike hair dye.",
      },
      {
        name: "Lash serum (peptides)",
        does: "Cosmetic serums can make lashes look a little fuller over a few months; the drug serum below works far better.",
      },
      {
        name: "Castor oil",
        does: "Conditions lashes and brows. Any growth effect is small and unproven, but it does no harm.",
      },
    ],
    routine: [
      {
        title: "Map",
        text: "Start in line with the edge of your nostril and end just past the outer corner of the eye. For a masculine look keep the brow fairly straight and low, with a neutral or slightly rising tilt; for a softer look, a gentle arch above the outer edge of the iris.",
      },
      {
        title: "Trim",
        text: "Brush up and trim what sticks out above the line.",
      },
      {
        title: "Tweeze",
        text: "Strays below and between only. Stop often and step back.",
      },
      {
        title: "Set",
        text: "Fill sparse spots with short strokes, then brush through with gel.",
      },
      {
        title: "Tint",
        text: "Light brows: a brow tint kit, a shade darker than your hair. Petroleum jelly around the brow, follow the timing on the kit and patch-test first. Lash tints at a salon: they sit right at the eye.",
      },
      {
        title: "Lift",
        text: "A lash lift curls lashes for six to eight weeks; with a tint they look longer and darker. Extensions add length and need refills every three to four weeks.",
      },
    ],
    works: [
      "Doing less than you planned",
      "Strokes, not a solid block",
      "A brow tint for light brows, at home or in a salon",
      "Removing mascara every night",
    ],
    skip: [
      "Thin, over-plucked brows",
      "Hair dye on brows — use a brow tint",
      "Heat tools near the eyes",
      "Tinting your own lashes",
    ],
    shortcuts: [
      {
        name: "Bimatoprost (Latisse)",
        does: "An approved lash-growth drug: lashes get longer, fuller and darker in two to four months.",
        cost: "Prescription only. It can redden or itch the eyes, darken the eyelid skin and, in light eyes, rarely darken the iris for good. Lashes go back to normal when you stop.",
      },
      {
        name: "Oral minoxidil",
        does: "Low-dose tablets grow hair all over, including brows, beard and scalp.",
        cost: "Prescription only and off-label. Unwanted body hair, fluid retention and a faster heartbeat are possible; not for anyone with a heart or blood-pressure condition.",
      },
      {
        name: "Lash or brow transplant",
        does: "Hairs from the scalp are moved to the lash line or brows and keep growing there.",
        cost: "Expensive, months of healing, and the hairs grow like scalp hair, so they need trimming. Only with an experienced surgeon.",
      },
    ],
    remember: `Drug serums and tablets for lash and brow growth go through a doctor. ${doctorNote}`,
  },
  nutrition: {
    title: "Eat for how you want to look and feel",
    intro:
      "Your weight follows energy in versus energy out; your skin, energy and training follow what that food is made of.",
    productsTitle: "What each part does",
    products: [
      { name: "Calories", does: "Set your direction: lose, maintain or gain." },
      {
        name: "Protein",
        does: "Builds muscle and keeps you full. Some at every meal.",
      },
      { name: "Carbohydrates", does: "Fuel for training and your brain." },
      { name: "Fat", does: "Needed for hormones and vitamins A, D, E and K." },
      {
        name: "Fibre and vegetables",
        does: "Fullness and digestion for few calories.",
      },
      { name: "Water", does: "Thirst and hunger feel alike; drink first." },
    ],
    routine: [
      {
        title: "Set targets",
        text: "Use the calorie calculator, then choose your carbs, protein and fat in your targets.",
      },
      {
        title: "Build a plate",
        text: "Half vegetables, a quarter protein, a quarter carbs, a thumb of fat.",
      },
      {
        title: "Log",
        text: "Scan or add what you eat for two weeks to learn your patterns.",
      },
      {
        title: "Watch the trend",
        text: "Weigh in a few mornings a week and look at the 7-day average, not one day.",
      },
    ],
    works: [
      "Protein at every meal",
      "Planning the busy days",
      "Scanning packaged food",
      "Adjusting by 100–200 kcal at a time",
    ],
    skip: [
      "Crash diets",
      "Detox teas and cleanses: laxatives, so only water goes",
      "Cutting out whole food groups",
      "Judging on one weigh-in",
    ],
    remember:
      "Under 18, pregnant, or with a medical condition or an eating disorder? Talk to a doctor first.",
  },
  body: {
    title: "Body care, hands and nails",
    intro:
      "Smooth skin, clean nails and fresh hands are details people notice up close. Ten minutes a day covers it.",
    productsTitle: "What each product does",
    products: [
      {
        name: "Gentle body wash",
        does: "Cleans without stripping. Exfoliating versions twice a week for rough patches.",
      },
      {
        name: "Body lotion",
        does: "Keeps skin soft; richest after the shower on damp skin.",
      },
      {
        name: "Deodorant or antiperspirant",
        does: "Deodorant masks odour; antiperspirant reduces sweat. Apply to clean, dry skin.",
      },
      {
        name: "Nail file and clipper",
        does: "Short, even nails; file in one direction.",
      },
      {
        name: "Cuticle oil and hand cream",
        does: "Soft cuticles and hands that don’t crack.",
      },
      { name: "Body SPF", does: "Arms, neck and hands age from the sun too." },
    ],
    routine: [
      {
        title: "Shower",
        text: "Lukewarm water, gentle wash, exfoliate twice a week.",
      },
      {
        title: "After",
        text: "Pat dry, lotion within a few minutes, deodorant on dry skin.",
      },
      {
        title: "Hands and nails",
        text: "Weekly: clip, file and push back cuticles after a shower. Nightly: cuticle oil and hand cream.",
      },
      {
        title: "Hair removal",
        text: "Shave with the grain after exfoliating, or trim. Moisturise after; give irritated skin a break.",
      },
    ],
    works: [
      "Lotion on damp skin",
      "Short, clean nails",
      "SPF on hands and neck",
      "Clean towels and sheets weekly",
    ],
    skip: [
      "Very hot showers",
      "Cutting cuticles",
      "Scrubbing irritated skin",
      "Antiperspirant on freshly shaved skin",
    ],
  },
  sleep: {
    title: "Sleep and recovery",
    intro:
      "Sleep is when skin repairs, muscles grow and appetite resets. Better sleep is the cheapest glow-up there is.",
    productsTitle: "What each lever does",
    products: [
      {
        name: "Wake-up time",
        does: "A steady time, also at weekends, sets your body clock.",
      },
      {
        name: "Daylight",
        does: "Ten minutes outside in the morning helps you sleep at night.",
      },
      {
        name: "Caffeine cut-off",
        does: "Caffeine lasts hours; stop around eight hours before bed.",
      },
      {
        name: "A dark, cool room",
        does: "Around 18 °C, dark curtains or a mask.",
      },
      {
        name: "Wind-down",
        does: "Screens away and a calm routine tell your body it’s time.",
      },
      {
        name: "Silk pillowcase",
        does: "Less friction on hair and skin. Nice to have, not essential.",
      },
    ],
    routine: [
      {
        title: "Morning",
        text: "Same wake-up time, daylight within an hour, coffee after you’re up.",
      },
      {
        title: "Afternoon",
        text: "No caffeine after about 2 pm; a short walk beats a long nap.",
      },
      {
        title: "Evening",
        text: "Dim lights, screens away 30 minutes before bed, the same simple routine.",
      },
      {
        title: "Recovery days",
        text: "Light movement, enough protein and water, and an extra half hour of sleep after hard training.",
      },
    ],
    works: [
      "Seven to nine hours",
      "Morning daylight",
      "A cool, dark bedroom",
      "Training earlier in the day",
    ],
    skip: [
      "Catching up only at the weekend",
      "Alcohol to fall asleep",
      "Scrolling in bed",
      "Sleeping pills as a habit: they stop helping and are hard to quit",
    ],
    remember:
      "Snoring loudly, waking up tired every day or long-term insomnia is worth a visit to a doctor.",
  },
  presence: {
    title: "Posture and presence",
    intro:
      "How you stand, look and speak is read before your face is. These habits are free and work from day one.",
    productsTitle: "What each habit does",
    products: [
      {
        name: "Posture",
        does: "Shoulders back and down, chin level: taller, calmer and a clearer jawline.",
      },
      {
        name: "Mobility",
        does: "Five minutes for the upper back undoes hours at a desk.",
      },
      {
        name: "Eye contact",
        does: "Holding it a beat longer reads as confident and interested.",
      },
      {
        name: "Voice",
        does: "Slower and a little lower than feels natural sounds calm.",
      },
      {
        name: "Photos of yourself",
        does: "Light from the side, camera at eye level, chin slightly forward and down.",
      },
    ],
    routine: [
      {
        title: "At the desk",
        text: "Screen at eye level, feet flat, stand up every hour.",
      },
      {
        title: "Move",
        text: "Foam roller for the upper back, doorway chest stretch and shoulder rolls — five minutes.",
      },
      {
        title: "In conversations",
        text: "Face the person, keep eye contact while they talk, pause before you answer.",
      },
      {
        title: "In photos",
        text: "Turn slightly to the side, chin out and down, relax the shoulders.",
      },
      {
        title: "Practise the fear",
        text: "Make a ladder from easy to hard — asking a stranger the time, joining a conversation, speaking up in a group — and climb one step a few times a week until it feels dull. This is how social anxiety shrinks.",
      },
      {
        title: "Steady your body",
        text: "Before you walk in, breathe out longer than in: four counts in, six out, for a minute. It slows a racing heart and steadies your voice.",
      },
    ],
    works: [
      "Small breaks every hour",
      "Strength training for the back",
      "Slowing down when nervous",
      "Small, repeated steps outside your comfort zone",
      "Natural light for photos",
    ],
    skip: [
      "Holding a stiff posture all day",
      "Staring instead of looking",
      "Filters on progress photos",
      "Comparing yourself to edited images",
    ],
    shortcuts: [
      {
        name: "Anxiety medication (pregabalin, benzodiazepines, propranolol)",
        does: "They work: pregabalin and benzodiazepines calm the mind within an hour, and propranolol stops shaking hands and a racing heart.",
        cost: "Pregabalin and benzodiazepines are addictive, need more over time and are dangerous with alcohol, which can stop your breathing. Propranolol only treats the body, not the worry. Only through a doctor; therapy such as CBT gives lasting results.",
      },
    ],
    remember:
      "Persistent pain, numbness or an injury needs a physiotherapist or doctor.",
  },
  smile: {
    title: "Everyday care for your smile",
    intro:
      "Two minutes, twice a day, plus cleaning between your teeth. That routine does most of the work.",
    productsTitle: "What each product does",
    products: [
      {
        name: "Fluoride toothpaste",
        does: "Strengthens enamel and prevents cavities. Spit, don’t rinse, after brushing.",
      },
      {
        name: "Soft or electric toothbrush",
        does: "Removes plaque without hurting gums. Electric makes good technique easier.",
      },
      {
        name: "Floss or interdental brushes",
        does: "Cleans between teeth, where a brush can’t reach.",
      },
      {
        name: "Tongue scraper",
        does: "Removes the coating behind most bad breath.",
      },
      {
        name: "Whitening toothpaste",
        does: "Polishes surface stains. It doesn’t change your natural tooth colour.",
      },
      {
        name: "Mouthwash",
        does: "Optional extra; doesn’t replace brushing or flossing.",
      },
    ],
    routine: [
      {
        title: "Morning",
        text: "Brush two minutes → tongue scraper. After breakfast is fine, but wait 30 minutes after acidic food.",
      },
      {
        title: "Evening",
        text: "Floss or interdental brush → brush two minutes → spit, don’t rinse.",
      },
      {
        title: "Every few months",
        text: "A new brush head every three months, and a check-up and cleaning at the dentist.",
      },
    ],
    works: [
      "Cleaning between teeth daily",
      "Water instead of soda between meals",
      "A straw for coffee or tea if stains bother you",
      "Professional whitening via a dentist",
    ],
    skip: [
      "Brushing hard with a hard brush",
      "Charcoal powders and DIY bleaching",
      "Lemon or baking soda on teeth",
      "Waiting until something hurts",
    ],
  },
  fragrance: {
    title: "Build your own scent vocabulary",
    intro:
      "A few scents for different moments are better than a shelf full of the same thing.",
    productsTitle: "What each type does",
    products: [
      {
        name: "Eau de toilette (EDT)",
        does: "Lighter and fresher; good for daytime and warm weather.",
      },
      {
        name: "Eau de parfum (EDP)",
        does: "Stronger and longer-lasting; evenings and colder days.",
      },
      {
        name: "Fresh / citrus",
        does: "Clean, energetic. Office, gym bag, summer.",
      },
      {
        name: "Woody / aromatic",
        does: "Calm and grown-up. An easy all-rounder.",
      },
      {
        name: "Warm / amber / vanilla",
        does: "Rich and close to the skin. Evenings and winter.",
      },
      {
        name: "Samples and decants",
        does: "Let you wear a scent for a few days before committing to a full bottle.",
      },
    ],
    routine: [
      {
        title: "Build a small set",
        text: "One fresh scent for daytime, one warm scent for evenings. Add a third only when you miss something.",
      },
      {
        title: "Apply",
        text: "On clean skin after a shower: neck and chest, two to four sprays. Don’t rub your wrists.",
      },
      {
        title: "Test before buying",
        text: "Spray on skin, not paper, and wait a few hours. The first minutes smell different from the rest of the day.",
      },
    ],
    works: [
      "Moisturised skin — scent lasts longer",
      "Fewer sprays in small rooms",
      "Matching the scent to the setting",
      "Storing bottles away from sun and heat",
    ],
    skip: [
      "Blind buying from hype alone",
      "Six sprays before the office",
      "Keeping bottles in the bathroom",
      "Layering two strong scents",
    ],
  },
  photos: {
    title: "Keep an honest progress journal",
    intro:
      "Progress shows best in photos taken the same way every time. Keep them private unless you choose otherwise.",
    productsTitle: "What each setting does",
    products: [
      {
        name: "Same light",
        does: "Daylight from a window, at the same time of day. Light changes skin and shape more than anything.",
      },
      {
        name: "Same distance and angle",
        does: "Phone at chest height, same spot on the floor. Close lenses distort faces.",
      },
      {
        name: "Front, side, back",
        does: "Three angles show changes one photo misses.",
      },
      {
        name: "Notes with the photo",
        does: "Date, products, training and sleep — so you can link changes to what you did.",
      },
      {
        name: "Only me",
        does: "Every entry starts private and stays private until you change it.",
      },
    ],
    routine: [
      {
        title: "Set up once",
        text: "Pick a spot, mark where you stand, and use a timer or a mirror at the same height.",
      },
      {
        title: "Take them regularly",
        text: "Every two to four weeks, in the morning, with the same clothes or none.",
      },
      {
        title: "Compare",
        text: "Put two photos side by side in the comparison tool, months apart rather than days.",
      },
    ],
    works: [
      "Monthly comparisons",
      "Writing what changed in your routine",
      "No filters on progress photos",
      "Deleting what you don’t want to keep",
    ],
    skip: [
      "Daily photos — changes are too small to see",
      "Comparing different lighting",
      "Edited images as ‘progress’",
      "Posting before you’re ready",
    ],
  },
};

/** Extra guides that sit next to a topic’s beginner guide. */
export const extraGuides: Record<
  string,
  Guide & { topic: TopicId; label: string }
> = {
  weight: {
    topic: "nutrition",
    label: "Weight guide",
    title: "Lose, maintain or gain weight",
    intro:
      "Your weight follows the energy you eat versus the energy you use. Small, steady changes work better than big ones.",
    productsTitle: "What each lever does",
    products: [
      {
        name: "Calories",
        does: "Eat less than you use to lose, the same to maintain, a little more to gain. Use the calorie calculator for a starting point.",
      },
      {
        name: "Protein",
        does: "Keeps you full and protects muscle while you lose. Some at every meal.",
      },
      {
        name: "Carbohydrates",
        does: "Fuel for training. Whole grains, fruit, potatoes and rice keep energy steady.",
      },
      {
        name: "Fat",
        does: "Needed for hormones and vitamin absorption. Olive oil, nuts, eggs, fish.",
      },
      {
        name: "Fibre and vegetables",
        does: "Volume for few calories: you feel full sooner.",
      },
      {
        name: "Strength training",
        does: "Tells your body to keep muscle, so the weight you lose is mostly fat.",
      },
      {
        name: "Daily steps",
        does: "Walking burns more over a week than most people expect.",
      },
      {
        name: "Sleep",
        does: "Short sleep raises hunger and cravings the next day.",
      },
    ],
    routine: [
      {
        title: "Set your target",
        text: "Use the calorie calculator, then set carbs, protein and fat yourself in your targets.",
      },
      {
        title: "Losing",
        text: "A deficit of about 300–500 kcal a day. Aim for roughly 0.5–1% of your body weight per week.",
      },
      {
        title: "Maintaining",
        text: "Eat at maintenance and watch your 7-day average. If it moves more than about 1 kg (2 lb) in a month, adjust by 100–200 kcal.",
      },
      {
        title: "Gaining",
        text: "A small surplus of about 200–300 kcal with strength training. Faster mostly adds fat.",
      },
      {
        title: "Track the trend",
        text: "Weigh in the morning, after the bathroom, a few times a week. Daily weight jumps with water and salt; the 7-day average is what counts.",
      },
      {
        title: "Adjust",
        text: "No change in the average after two to three weeks? Change calories by 100–200 kcal. Never below 1200 (women) or 1500 (men) without a doctor.",
      },
    ],
    works: [
      "Scanning or logging most of what you eat",
      "Protein and vegetables at every meal",
      "Planning meals for busy days",
      "Patience: weeks, not days",
    ],
    skip: [
      "Crash diets and skipping meals",
      "Detox teas: laxatives, so you only lose water",
      "Judging progress on one weigh-in",
      "Cutting out a whole food group without reason",
    ],
    shortcuts: [
      {
        name: "GLP-1 medicines (semaglutide, tirzepatide / Mounjaro)",
        does: "They work: much less hunger, and in studies people lost about 15–20% of their body weight.",
        cost: "Prescription only. Nausea and stomach trouble are common, muscle goes too without protein and strength training, rare risks include gallbladder and pancreas problems, and most of the weight returns when you stop.",
      },
      {
        name: "DNP (2,4-dinitrophenol)",
        does: "It does burn fat fast, by turning the energy in food into heat.",
        cost: "There is no safe amount: overheating can kill within hours, it has killed young and healthy people, and there is no antidote. Banned for human use. Never.",
      },
    ],
    remember: `Under 18, pregnant, or living with a medical condition or an eating disorder? Talk to a doctor before changing your weight. ${doctorNote}`,
  },
};
