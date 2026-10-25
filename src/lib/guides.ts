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
        title: "Timing",
        text: "Acne improves in 4–8 weeks, oil and texture in 8–12, fine lines in 3–6 months. Change one product at a time.",
      },
    ],
    works: [
      "Daily sunscreen, even on cloudy days",
      "One active at a time, introduced slowly",
      "Cleansing after the gym and after showering",
      "A richer moisturiser on nights your skin feels tight",
    ],
    skip: [
      "Harsh scrubs and alcohol-heavy toners",
      "Five new products in the same week",
      "Picking at spots — it leaves longer-lasting marks",
      "Toothpaste, lemon or baking soda on skin",
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
      "Box dye on lashes or brows",
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
      "Fat burners and pre-workout with mega doses",
    ],
    remember: `Get advice first if an injury or condition affects training. ${doctorNote}`,
  },
  grooming: {
    title: "Brows, lashes and the finer details",
    intro:
      "Small details frame the face: tidy brows, a clean shave or beard line, and skin that isn’t irritated.",
    productsTitle: "What each tool does",
    products: [
      {
        name: "Spoolie brush",
        does: "Brushes brows into shape so you can see what to trim.",
      },
      {
        name: "Small scissors",
        does: "Trims long brow hairs without changing the shape.",
      },
      {
        name: "Tweezers",
        does: "Removes stray hairs between and under the brows. One hair at a time.",
      },
      {
        name: "Brow gel",
        does: "Holds brows in place; tinted gel fills light gaps.",
      },
      {
        name: "Safety razor",
        does: "A single blade causes fewer ingrown hairs than multi-blade razors.",
      },
      {
        name: "Electric trimmer",
        does: "Beard lines and the neck, where razor bumps start most.",
      },
      {
        name: "Shaving cream and aftershave balm",
        does: "Cream lets the blade glide; the balm calms skin after.",
      },
      {
        name: "Gradual self-tan",
        does: "A light, even glow built up over a few days.",
      },
    ],
    routine: [
      {
        title: "Brows",
        text: "Brush up → trim what sticks out above the line → tweeze strays below and between. Stop and look in the mirror often.",
      },
      {
        title: "Shave",
        text: "Shower first or exfoliate gently → cream → shave with the grain → rinse with cool water → balm → SPF.",
      },
      {
        title: "Beard",
        text: "Trim to one length → set a neckline one finger above the Adam’s apple → clean up the cheek line.",
      },
      {
        title: "Self-tan",
        text: "On moisturised, dry skin, a small amount, every two or three days. Keep it off brows and hairline; wash your hands.",
      },
    ],
    works: [
      "Doing less to brows than you planned",
      "A sharp neckline",
      "Clean tools and a fresh blade",
      "Balm instead of alcohol aftershave",
    ],
    skip: [
      "Thin, over-plucked brows",
      "Shaving against the grain on sensitive skin",
      "Hair dye on lashes or brows",
      "Heat tools near the eyes",
    ],
    remember: `Lash or hair growth serums with active drugs need a doctor. ${doctorNote}`,
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
    topic: "gym",
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
      "Detox teas, fat burners and ‘miracle’ pills",
      "Judging progress on one weigh-in",
      "Cutting out a whole food group without reason",
    ],
    remember: `Under 18, pregnant, or living with a medical condition or an eating disorder? Talk to a doctor before changing your weight. ${doctorNote}`,
  },
};
