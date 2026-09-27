import type { Money, Product, Reference } from "./types.ts";

/** Major units -> Money in minor units. */
const m = (gbp: number, usd: number, eur: number): Money => ({
  GBP: Math.round(gbp * 100),
  USD: Math.round(usd * 100),
  EUR: Math.round(eur * 100),
});

const ref = (authors: string, title: string, journal: string, year: number): Reference => ({
  authors,
  title,
  journal,
  year,
});

/** Mandatory food-supplement statements (UK/EU). */
const SUPPLEMENT_WARNINGS = [
  "Do not exceed the recommended daily dose.",
  "Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle.",
  "Keep out of the reach of young children.",
];

const CAFFEINE_WARNING =
  "Contains caffeine. Not recommended for children or pregnant or breast-feeding women.";

const SUPPLEMENT_COMPLIANCE = [
  "Register with local authority / FSA as food business before first sale (UK).",
  "Notify product to relevant EU member-state authority before selling into the EU.",
  "Enrol batches in Informed Sport (or equivalent) before marketing to tested athletes.",
];

/* Line palettes */
const FUEL = { color: "#FF5B24", ink: "#0E0F0F", accent: "#0E0F0F" };
const HYDRATE = { color: "#A9CBDD", ink: "#0E0F0F", accent: "#FF5B24" };
const BUILD = { color: "#EDE9E1", ink: "#0E0F0F", accent: "#FF5B24" };
const RECOVER = { color: "#7A1F2B", ink: "#F3F1EC", accent: "#FFB199" };
const SLEEP = { color: "#262A5C", ink: "#F3F1EC", accent: "#A9CBDD" };
const FOCUS = { color: "#D6F04A", ink: "#0E0F0F", accent: "#0E0F0F" };
const DAILY = { color: "#3E5641", ink: "#F3F1EC", accent: "#D6F04A" };
const CARBON = { color: "#1A1C1D", ink: "#F3F1EC", accent: "#FF5B24" };

export const products: Product[] = [
  /* ─────────────────────────── FUEL ─────────────────────────── */
  {
    id: "base",
    slug: "base-creatine-monohydrate",
    line: "FUEL",
    name: "Base",
    descriptor: "Creatine Monohydrate",
    kind: "supplement",
    category: "fuel",
    goals: ["strength", "endurance", "focus", "longevity"],
    headline: "The most researched supplement in sport. Nothing added.",
    description:
      "Five grams of micronised creatine monohydrate, the form used in the overwhelming majority of the research. It tops up phosphocreatine, the fuel your muscles burn in the first seconds of every sprint, lift and surge. Unflavoured, so it disappears into water, coffee or a shake.",
    price: m(29, 34, 32),
    subscribable: true,
    variantLabel: "Size",
    variants: [
      { id: "300g", label: "300g · 60 servings", sku: "PF-BASE-300" },
      { id: "600g", label: "600g · 120 servings", sku: "PF-BASE-600", priceDelta: m(20, 24, 22) },
    ],
    size: "60 servings",
    evidence: "A",
    benefits: [
      "More output in repeated high-intensity efforts",
      "Greater strength gains with resistance training",
      "Emerging data for cognition under sleep loss",
    ],
    ingredients: [{ name: "Creatine monohydrate", amount: "5 g", form: "Micronised, 200 mesh" }],
    howToUse:
      "Mix 5 g (one level scoop) into any drink, once a day, every day. Timing doesn't matter much; consistency does. No loading phase needed.",
    science: {
      summary:
        "Creatine is the most studied ergogenic aid available. Daily supplementation raises muscle phosphocreatine stores by roughly 20–40%, which supports repeated high-intensity work and training adaptation. Newer meta-analyses suggest benefits for memory and processing, especially under stress or sleep deprivation.",
      references: [
        ref("Kreider RB, et al.", "International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation in exercise, sport, and medicine", "J Int Soc Sports Nutr", 2017),
        ref("Avgerinos KI, et al.", "Effects of creatine supplementation on cognitive function of healthy individuals: a systematic review of randomized controlled trials", "Exp Gerontol", 2018),
        ref("Xu C, et al.", "Effects of creatine supplementation on cognitive function in adults: a systematic review and meta-analysis", "Front Nutr", 2024),
      ],
    },
    claims: [
      "Creatine increases physical performance in successive bursts of short-term, high intensity exercise.",
      "Daily creatine consumption can enhance the effect of resistance training on muscle strength in adults over the age of 55.",
    ],
    warnings: SUPPLEMENT_WARNINGS,
    badges: ["Vegan", "Unflavoured", "Single ingredient"],
    art: { format: "pouch", ...FUEL },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Micronised creatine monohydrate, ≥99.9% purity, 200 mesh. Evaluate Creapure® (AlzChem, DE) as premium option. Recyclable mono-PE stand-up pouch.",
      moq: 1000,
      unitCostGBP: 720,
      leadTimeDays: 35,
      compliance: [
        ...SUPPLEMENT_COMPLIANCE,
        "Claims require ≥3 g creatine per day; label dose is 5 g.",
        "Over-55 claim must be used alongside resistance-training context.",
      ],
    },
  },
  {
    id: "carb90",
    slug: "carb-90-endurance-fuel",
    line: "FUEL",
    name: "Carb 90",
    descriptor: "Dual-Source Endurance Fuel",
    kind: "supplement",
    category: "fuel",
    goals: ["endurance", "heat"],
    headline: "90 grams an hour. A gut that can handle it.",
    description:
      "Glucose and fructose at a 1:0.8 ratio use two separate transporters in the gut, so you can absorb more carbohydrate per hour than from glucose alone. Built for long days: marathons, sportives, ultras, Hyrox and mountain days where fuel is the limiter.",
    price: m(39, 45, 43),
    subscribable: true,
    variantLabel: "Flavour",
    variants: [
      { id: "citrus", label: "Citrus", sku: "PF-C90-CIT" },
      { id: "neutral", label: "Neutral", sku: "PF-C90-NEU" },
    ],
    size: "15 servings · 90 g carbohydrate each",
    evidence: "A",
    benefits: [
      "Higher carbohydrate absorption per hour",
      "Less gut distress at high intake rates",
      "Sodium built in for long efforts",
    ],
    ingredients: [
      { name: "Maltodextrin (glucose source)", amount: "50 g" },
      { name: "Fructose", amount: "40 g" },
      { name: "Sodium", amount: "500 mg", form: "Sodium citrate + chloride" },
      { name: "Potassium", amount: "150 mg" },
    ],
    howToUse:
      "Mix one serving into 750–1000 ml of water and drink across an hour of exercise. Start at 60 g per hour in training and build up; your gut is trainable.",
    science: {
      summary:
        "For efforts beyond 2.5 hours, guidelines support up to 90 g of carbohydrate per hour from multiple transportable carbohydrates. Glucose-fructose blends raise exogenous oxidation rates and reduce gastrointestinal complaints versus single-source glucose.",
      references: [
        ref("Jeukendrup A.", "A step towards personalized sports nutrition: carbohydrate intake during exercise", "Sports Med", 2014),
        ref("Thomas DT, Erdman KA, Burke LM.", "American College of Sports Medicine joint position statement: nutrition and athletic performance", "Med Sci Sports Exerc", 2016),
      ],
    },
    claims: [],
    warnings: SUPPLEMENT_WARNINGS.slice(0, 1),
    badges: ["Vegan", "Gluten free", "1:0.8 ratio"],
    art: { format: "pouch", ...FUEL, color: "#FF7A45" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Sports drink powder blend. Maltodextrin DE 12–19, crystalline fructose, sodium citrate. Batch-tested osmolality report requested.",
      moq: 1500,
      unitCostGBP: 900,
      leadTimeDays: 42,
      compliance: [
        ...SUPPLEMENT_COMPLIANCE,
        "Sold as a sports food, not a supplement. Carbohydrate-electrolyte claims do NOT apply (concentration > 350 kcal/L and < 75% high-GI energy). Do not add them.",
      ],
    },
  },
  {
    id: "surge",
    slug: "surge-pre-session",
    line: "FUEL",
    name: "Surge",
    descriptor: "Pre-Session Formula",
    kind: "supplement",
    category: "fuel",
    goals: ["strength", "endurance"],
    headline: "Full clinical doses. No proprietary blend. No crash.",
    description:
      "Every active at the dose used in the research, printed on the front. Citrulline and beet nitrate for blood flow, beta-alanine for buffering, and a moderate 150 mg of caffeine so you can still sleep after an evening session.",
    price: m(38, 44, 42),
    subscribable: true,
    variantLabel: "Flavour",
    variants: [
      { id: "blood-orange", label: "Blood Orange", sku: "PF-SRG-BLO" },
      { id: "sour-cherry", label: "Sour Cherry", sku: "PF-SRG-SCH" },
      { id: "stim-free", label: "Stim-Free Citrus", sku: "PF-SRG-SF" },
    ],
    size: "30 servings",
    evidence: "B",
    benefits: [
      "Supports output in efforts of 1–4 minutes",
      "Nitrate for oxygen efficiency",
      "Moderate caffeine protects sleep",
    ],
    ingredients: [
      { name: "L-Citrulline", amount: "6 g" },
      { name: "Beta-alanine", amount: "3.2 g" },
      { name: "Beetroot extract", amount: "400 mg nitrate" },
      { name: "Caffeine", amount: "150 mg", form: "Anhydrous (omitted in Stim-Free)" },
      { name: "Sodium", amount: "300 mg" },
    ],
    howToUse:
      "Mix one scoop in 300 ml of water 30–45 minutes before training. Beta-alanine works through daily loading, so take it on rest days too. A harmless tingle is normal.",
    science: {
      summary:
        "Beta-alanine raises muscle carnosine and improves performance in 1–4 minute efforts. Dietary nitrate lowers the oxygen cost of exercise, with the clearest effects in recreational athletes. Caffeine is consistently ergogenic at 3–6 mg/kg; 150 mg sits at the low end to limit sleep disruption.",
      references: [
        ref("Trexler ET, et al.", "International society of sports nutrition position stand: Beta-Alanine", "J Int Soc Sports Nutr", 2015),
        ref("Jones AM.", "Dietary nitrate supplementation and exercise performance", "Sports Med", 2014),
        ref("Guest NS, et al.", "International society of sports nutrition position stand: caffeine and exercise performance", "J Int Soc Sports Nutr", 2021),
        ref("Gonzalez AM, Trexler ET.", "Effects of citrulline supplementation on exercise performance in humans: a review of the current literature", "J Strength Cond Res", 2020),
      ],
    },
    claims: [],
    warnings: [...SUPPLEMENT_WARNINGS, CAFFEINE_WARNING],
    badges: ["Vegan", "Dose disclosed", "Stim-free option"],
    art: { format: "tub", ...FUEL, color: "#E8471A" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Powder blend, 30 × 16 g. Evaluate CarnoSyn® beta-alanine (NAI) for traceability. Standardised beetroot extract (≥2% nitrate).",
      moq: 1000,
      unitCostGBP: 950,
      leadTimeDays: 45,
      compliance: [
        ...SUPPLEMENT_COMPLIANCE,
        "Caffeine warning mandatory (EU 1169/2011 Annex III). Declare caffeine content per serving.",
      ],
    },
  },
  /* ─────────────────────────── HYDRATE ─────────────────────────── */
  {
    id: "salt",
    slug: "salt-high-sodium-electrolytes",
    line: "HYDRATE",
    name: "Salt",
    descriptor: "High-Sodium Electrolytes",
    kind: "supplement",
    category: "fuel",
    goals: ["endurance", "heat", "recovery"],
    headline: "1,000 mg sodium. Because sweat is mostly salt.",
    description:
      "Most electrolyte tabs are built for taste, not for sweat. Salt carries 1,000 mg of sodium per stick to replace what heavy and salty sweaters actually lose, with potassium and magnesium in support. Zero sugar, so you can pair it with Carb 90 or drink it on its own.",
    price: m(32, 38, 36),
    subscribable: true,
    variantLabel: "Flavour",
    variants: [
      { id: "citrus", label: "Citrus Salt", sku: "PF-SALT-CIT" },
      { id: "berry", label: "Wild Berry", sku: "PF-SALT-BER" },
      { id: "raw", label: "Unflavoured", sku: "PF-SALT-RAW" },
    ],
    size: "30 sticks",
    evidence: "A",
    benefits: [
      "Replaces sodium lost in heavy sweat",
      "Helps hold fluid rather than pass it",
      "Zero sugar; stack with fuel as needed",
    ],
    ingredients: [
      { name: "Sodium", amount: "1,000 mg", form: "Citrate + chloride" },
      { name: "Potassium", amount: "200 mg", form: "Citrate" },
      { name: "Magnesium", amount: "60 mg", form: "Citrate" },
    ],
    howToUse:
      "One stick in 500–750 ml of water before, during or after sweaty sessions. In heat or long events, one stick per hour. Adjust to your own sweat rate.",
    science: {
      summary:
        "Sweat sodium varies roughly 10-fold between athletes. For long or hot sessions, replacing sodium supports plasma volume and fluid retention. Guidance for exercise in heat recommends individualised sodium replacement for heavy and salty sweaters.",
      references: [
        ref("McCubbin AJ, et al.", "Sports Dietitians Australia position statement: nutrition for exercise in hot environments", "Int J Sport Nutr Exerc Metab", 2020),
        ref("Thomas DT, Erdman KA, Burke LM.", "American College of Sports Medicine joint position statement: nutrition and athletic performance", "Med Sci Sports Exerc", 2016),
      ],
    },
    claims: [
      "Magnesium contributes to electrolyte balance.",
      "Magnesium contributes to normal muscle function.",
    ],
    warnings: [
      ...SUPPLEMENT_WARNINGS,
      "High in sodium. Not suitable for people on sodium-restricted diets. Consult your doctor if you have high blood pressure or kidney disease.",
    ],
    badges: ["Zero sugar", "Vegan", "1,000 mg sodium"],
    art: { format: "sticks", ...HYDRATE },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "Stick-pack line, 30 × 6 g. Paper-based sticks preferred; carton outer.",
      moq: 2000,
      unitCostGBP: 650,
      leadTimeDays: 40,
      compliance: [
        ...SUPPLEMENT_COMPLIANCE,
        "Magnesium claims need ≥56.3 mg (15% NRV) per stick. 60 mg meets it; keep a tolerance margin in spec.",
      ],
    },
  },
  /* ─────────────────────────── BUILD ─────────────────────────── */
  {
    id: "isolate",
    slug: "isolate-whey-protein",
    line: "BUILD",
    name: "Isolate",
    descriptor: "Grass-Fed Whey Protein Isolate",
    kind: "supplement",
    category: "recover",
    goals: ["strength", "recovery", "longevity"],
    headline: "27 grams of protein. 2.7 grams of leucine. Mixes clean.",
    description:
      "Cold-filtered whey protein isolate from grass-fed herds. High in leucine, the amino acid that switches on muscle protein synthesis, and low enough in lactose for most sensitive stomachs. Made for the 20 minutes after training and the days you fall short on food.",
    price: m(44, 52, 49),
    subscribable: true,
    variantLabel: "Flavour",
    variants: [
      { id: "vanilla", label: "Madagascan Vanilla", sku: "PF-ISO-VAN" },
      { id: "cacao", label: "Dark Cacao", sku: "PF-ISO-CAC" },
      { id: "raw", label: "Unflavoured", sku: "PF-ISO-RAW" },
    ],
    size: "1 kg · 33 servings",
    evidence: "A",
    benefits: [
      "Supports muscle growth and maintenance",
      "Leucine-rich for protein synthesis",
      "Low lactose, low fat",
    ],
    ingredients: [
      { name: "Protein", amount: "27 g", form: "Whey isolate (milk)" },
      { name: "Leucine", amount: "2.7 g" },
      { name: "Carbohydrate", amount: "0.8 g" },
      { name: "Fat", amount: "0.3 g" },
    ],
    howToUse:
      "Blend one 30 g scoop with 250 ml of water or milk. Aim for 1.6–2.2 g of protein per kg of bodyweight a day, spread across 3–5 meals.",
    science: {
      summary:
        "Protein supplementation augments gains in muscle mass and strength with resistance training, with benefits plateauing around 1.6 g/kg/day. Whey is fast-digesting and leucine-rich, making it an efficient post-exercise protein.",
      references: [
        ref("Jäger R, et al.", "International Society of Sports Nutrition position stand: protein and exercise", "J Int Soc Sports Nutr", 2017),
        ref("Morton RW, et al.", "A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength in healthy adults", "Br J Sports Med", 2018),
      ],
    },
    claims: [
      "Protein contributes to a growth in muscle mass.",
      "Protein contributes to the maintenance of muscle mass.",
      "Protein contributes to the maintenance of normal bones.",
    ],
    warnings: [...SUPPLEMENT_WARNINGS, "Allergens: contains milk."],
    badges: ["Grass-fed", "Low lactose", "27 g protein"],
    art: { format: "tub", ...BUILD },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "WPI ≥90% protein (dry basis), cross-flow micro-filtered, grass-fed origin (IE/NZ). Request amino acid profile and heavy-metals CoA per batch.",
      moq: 1000,
      unitCostGBP: 1300,
      leadTimeDays: 45,
      compliance: [...SUPPLEMENT_COMPLIANCE, "Allergen (milk) must be emphasised in ingredients list."],
    },
  },
  /* ─────────────────────────── RECOVER ─────────────────────────── */
  {
    id: "rebuild",
    slug: "rebuild-collagen-vitamin-c",
    line: "RECOVER",
    name: "Rebuild",
    descriptor: "Collagen Peptides + Vitamin C",
    kind: "supplement",
    category: "recover",
    goals: ["recovery", "strength", "endurance"],
    headline: "For the tissue that takes the load: tendons and ligaments.",
    description:
      "15 g of hydrolysed collagen with vitamin C, taken an hour before loading. It's modelled on research showing vitamin C-enriched gelatin before exercise increased markers of collagen synthesis. Useful for runners, jumpers, climbers, and anyone coming back from a niggle.",
    price: m(36, 42, 40),
    subscribable: true,
    variantLabel: "Flavour",
    variants: [
      { id: "lemon", label: "Lemon", sku: "PF-RBD-LEM" },
      { id: "raw", label: "Unflavoured", sku: "PF-RBD-RAW" },
    ],
    size: "30 servings",
    evidence: "B",
    benefits: [
      "Timed to your tendon-loading work",
      "Vitamin C for normal collagen formation",
      "Dissolves clear in hot or cold drinks",
    ],
    ingredients: [
      { name: "Hydrolysed collagen peptides", amount: "15 g", form: "Bovine, grass-fed" },
      { name: "Vitamin C", amount: "80 mg", form: "Ascorbic acid" },
    ],
    howToUse:
      "Mix one serving in water 30–60 minutes before a short bout of tendon or rope-skipping loading, or before training.",
    science: {
      summary:
        "In a controlled trial, 15 g of vitamin C-enriched gelatin taken an hour before six minutes of rope-skipping doubled a blood marker of collagen synthesis. The evidence is promising but early, so we grade it B and keep the protocol specific.",
      references: [
        ref("Shaw G, Lee-Barthel A, Ross ML, Wang B, Baar K.", "Vitamin C-enriched gelatin supplementation before intermittent activity augments collagen synthesis", "Am J Clin Nutr", 2017),
      ],
    },
    claims: [
      "Vitamin C contributes to normal collagen formation for the normal function of cartilage.",
      "Vitamin C contributes to normal collagen formation for the normal function of bones.",
    ],
    warnings: SUPPLEMENT_WARNINGS,
    badges: ["Grass-fed", "15 g collagen", "Timed protocol"],
    art: { format: "tub", ...RECOVER },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Bovine hydrolysed collagen peptides, 2–5 kDa. Evaluate Peptan® (Rousselot) or Verisol® (Gelita). Vitamin C 100% NRV.",
      moq: 1000,
      unitCostGBP: 800,
      leadTimeDays: 40,
      compliance: [...SUPPLEMENT_COMPLIANCE, "No authorised claims for collagen itself. Claims must reference vitamin C."],
    },
  },
  {
    id: "tart",
    slug: "tart-montmorency-cherry",
    line: "RECOVER",
    name: "Tart",
    descriptor: "Montmorency Cherry Concentrate",
    kind: "supplement",
    category: "recover",
    goals: ["recovery", "sleep", "endurance"],
    headline: "Red for recovery. 90 cherries a shot.",
    description:
      "Concentrated Montmorency tart cherry, rich in anthocyanins and naturally containing melatonin. Used around hard blocks and race weeks to help you bounce back. Take a shot neat or dilute it over ice.",
    price: m(28, 32, 31),
    subscribable: true,
    variants: [{ id: "500ml", label: "500 ml · 16 servings", sku: "PF-TART-500" }],
    size: "500 ml · 16 servings",
    evidence: "B",
    benefits: [
      "Supports recovery after hard sessions",
      "Polyphenol-rich (anthocyanins)",
      "No added sugar, nothing else added",
    ],
    ingredients: [{ name: "Montmorency tart cherry concentrate", amount: "30 ml", form: "68° Brix" }],
    howToUse:
      "30 ml twice a day, diluted, for 4–5 days around hard sessions or races. Refrigerate after opening.",
    science: {
      summary:
        "Several trials report faster recovery of strength and lower muscle soreness after marathon running and strenuous exercise with tart cherry. A meta-analysis also found small improvements in endurance performance. Effects are modest and vary between studies.",
      references: [
        ref("Howatson G, et al.", "Influence of tart cherry juice on indices of recovery following marathon running", "Scand J Med Sci Sports", 2010),
        ref("Gao R, Chilibeck PD.", "Effect of tart cherry concentrate on endurance exercise performance: a meta-analysis", "J Am Coll Nutr", 2020),
      ],
    },
    claims: [],
    warnings: ["Refrigerate after opening and use within 28 days."],
    badges: ["Single origin", "No added sugar", "Vegan"],
    art: { format: "liquid", ...RECOVER, color: "#8E1B2C" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Montmorency (Prunus cerasus) concentrate 68° Brix, UK/US/Turkish orchards. Glass or rPET bottle, tamper-evident cap.",
      moq: 1200,
      unitCostGBP: 620,
      leadTimeDays: 30,
      compliance: ["Sold as a food (juice concentrate). No authorised health claims; keep copy to described research only."],
    },
  },
  /* ─────────────────────────── SLEEP ─────────────────────────── */
  {
    id: "descend",
    slug: "descend-magnesium-glycine",
    line: "SLEEP",
    name: "Descend",
    descriptor: "Magnesium Bisglycinate + Glycine",
    kind: "supplement",
    category: "sleep",
    goals: ["sleep", "recovery"],
    headline: "Two ingredients. Wind down without the grogginess.",
    description:
      "Magnesium bisglycinate is gentle on the stomach and well absorbed, and glycine helps bring core temperature down, which is one of the body's own sleep signals. No melatonin and no sedatives, so you wake up clear.",
    price: m(30, 35, 33),
    subscribable: true,
    variants: [{ id: "30", label: "30 servings · powder", sku: "PF-DSC-30" }],
    size: "30 servings",
    evidence: "B",
    benefits: [
      "Magnesium for reduced tiredness and fatigue",
      "Glycine to support falling asleep",
      "No melatonin, no morning fog",
    ],
    ingredients: [
      { name: "Magnesium", amount: "200 mg", form: "Bisglycinate" },
      { name: "Glycine", amount: "3 g" },
    ],
    howToUse: "Stir one scoop into 200 ml of warm water 30–60 minutes before bed.",
    science: {
      summary:
        "Glycine (3 g) before bed improved subjective sleep quality and next-day fatigue in small controlled studies. Magnesium supplementation has improved sleep measures in older adults with insomnia. Athletes with high sweat losses may run low on magnesium.",
      references: [
        ref("Yamadera W, et al.", "Glycine ingestion improves subjective sleep quality in human volunteers, correlating with polysomnographic changes", "Sleep Biol Rhythms", 2007),
        ref("Abbasi B, et al.", "The effect of magnesium supplementation on primary insomnia in elderly: a double-blind placebo-controlled clinical trial", "J Res Med Sci", 2012),
      ],
    },
    claims: [
      "Magnesium contributes to a reduction of tiredness and fatigue.",
      "Magnesium contributes to normal psychological function.",
      "Magnesium contributes to normal muscle function.",
    ],
    warnings: SUPPLEMENT_WARNINGS,
    badges: ["Melatonin free", "Vegan", "Unflavoured option"],
    art: { format: "tub", ...SLEEP },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Fully reacted magnesium bisglycinate (e.g. Albion® TRAACS®), pharmaceutical-grade glycine. 30 × 5.2 g.",
      moq: 1000,
      unitCostGBP: 600,
      leadTimeDays: 40,
      compliance: [
        ...SUPPLEMENT_COMPLIANCE,
        "Do not claim sleep benefits for magnesium or glycine; no authorised sleep claim exists. Research copy only.",
      ],
    },
  },
  /* ─────────────────────────── FOCUS ─────────────────────────── */
  {
    id: "signal",
    slug: "signal-caffeine-l-theanine",
    line: "FOCUS",
    name: "Signal",
    descriptor: "Caffeine + L-Theanine + B12",
    kind: "supplement",
    category: "focus",
    goals: ["focus"],
    headline: "Clean focus. The edge of coffee without the edge.",
    description:
      "100 mg of caffeine paired 1:2 with L-theanine, the calming amino acid found in green tea. The pairing is well studied for attention and task-switching, with fewer jitters than caffeine alone. B12 supports normal energy metabolism.",
    price: m(26, 30, 29),
    subscribable: true,
    variants: [{ id: "60", label: "60 capsules", sku: "PF-SIG-60" }],
    size: "60 capsules",
    evidence: "B",
    benefits: [
      "Sharper attention and task-switching",
      "Smoother than caffeine alone",
      "B12 to reduce tiredness and fatigue",
    ],
    ingredients: [
      { name: "L-Theanine", amount: "200 mg" },
      { name: "Caffeine", amount: "100 mg", form: "Natural, from green coffee" },
      { name: "Vitamin B12", amount: "10 µg", form: "Methylcobalamin" },
    ],
    howToUse: "One capsule with water in the morning or before deep work. No more than 3 per day. Avoid within 8 hours of bed.",
    science: {
      summary:
        "Controlled trials show caffeine with L-theanine improves speed and accuracy on attention-switching tasks and reduces susceptibility to distraction versus placebo, with fewer reported jitters than caffeine alone.",
      references: [
        ref("Owen GN, et al.", "The combined effects of L-theanine and caffeine on cognitive performance and mood", "Nutr Neurosci", 2008),
      ],
    },
    claims: [
      "Vitamin B12 contributes to the reduction of tiredness and fatigue.",
      "Vitamin B12 contributes to normal psychological function.",
    ],
    warnings: [...SUPPLEMENT_WARNINGS, CAFFEINE_WARNING],
    badges: ["Vegan capsule", "1:2 ratio", "100 mg caffeine"],
    art: { format: "bottle", ...FOCUS },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "HPMC capsules size 0. Evaluate Suntheanine® (Taiyo) for L-theanine. Amber glass or rPET bottle.",
      moq: 2000,
      unitCostGBP: 480,
      leadTimeDays: 35,
      compliance: [...SUPPLEMENT_COMPLIANCE, "Caffeine warning mandatory. No authorised caffeine claims; focus claims must reference B12 only."],
    },
  },
  /* ─────────────────────────── DAILY ─────────────────────────── */
  {
    id: "foundation",
    slug: "foundation-algal-omega-3",
    line: "DAILY",
    name: "Foundation",
    descriptor: "Algal Omega-3 (EPA + DHA)",
    kind: "supplement",
    category: "daily",
    goals: ["longevity", "recovery", "focus"],
    headline: "Omega-3 from the source fish get it from. No fish.",
    description:
      "1,350 mg of EPA and DHA from farmed microalgae. It's the source fish get their omega-3 from, without the ocean-harvest pressure, heavy-metal risk or fishy burps. Supports heart and brain function, the base layer for everything else.",
    price: m(34, 40, 38),
    subscribable: true,
    variants: [{ id: "60", label: "60 softgels · 30 days", sku: "PF-FND-60" }],
    size: "60 softgels",
    evidence: "A",
    benefits: [
      "EPA + DHA for normal heart function",
      "DHA for normal brain function",
      "Plant-based and ocean-friendly",
    ],
    ingredients: [
      { name: "Total omega-3", amount: "1,350 mg", form: "Schizochytrium algal oil" },
      { name: "DHA", amount: "900 mg" },
      { name: "EPA", amount: "450 mg" },
    ],
    howToUse: "Two softgels daily with a meal containing fat.",
    science: {
      summary:
        "The heart and brain claims for EPA and DHA are among the best-established in nutrition. In athletes, omega-3 supplementation has been linked to reduced muscle soreness and better preservation of muscle during disuse, though performance effects are mixed.",
      references: [
        ref("Philpott JD, Witard OC, Galloway SDR.", "Applications of omega-3 polyunsaturated fatty acid supplementation for sport performance", "Res Sports Med", 2019),
      ],
    },
    claims: [
      "EPA and DHA contribute to the normal function of the heart.",
      "DHA contributes to maintenance of normal brain function.",
      "DHA contributes to the maintenance of normal vision.",
    ],
    warnings: SUPPLEMENT_WARNINGS,
    badges: ["Vegan", "Ocean-friendly", "1,350 mg omega-3"],
    art: { format: "bottle", ...DAILY },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Algal oil softgels (carrageenan or starch shell). Evaluate life'sOMEGA (dsm-firmenich) high-EPA grades. Request oxidation (TOTOX) CoA per batch.",
      moq: 2000,
      unitCostGBP: 900,
      leadTimeDays: 50,
      compliance: [
        ...SUPPLEMENT_COMPLIANCE,
        "Heart claim needs ≥250 mg EPA+DHA/day; brain & vision claims need ≥250 mg DHA/day. Both met.",
      ],
    },
  },
  {
    id: "sun",
    slug: "sun-vitamin-d3-k2",
    line: "DAILY",
    name: "Sun",
    descriptor: "Vitamin D3 + K2",
    kind: "supplement",
    category: "daily",
    goals: ["longevity", "strength", "recovery"],
    headline: "For the months the sun doesn't do its job.",
    description:
      "Plant-based vitamin D3 from lichen, paired with K2 as MK-7. Low vitamin D is common in athletes who train indoors or live north of about 35°. It matters for muscle, bone and immune function.",
    price: m(18, 21, 20),
    subscribable: true,
    variants: [{ id: "60", label: "60 capsules · 2 months", sku: "PF-SUN-60" }],
    size: "60 capsules",
    evidence: "A",
    benefits: [
      "Supports normal muscle function",
      "Supports normal immune function",
      "K2 for the maintenance of normal bones",
    ],
    ingredients: [
      { name: "Vitamin D3", amount: "50 µg (2,000 IU)", form: "Cholecalciferol from lichen" },
      { name: "Vitamin K2", amount: "75 µg", form: "MK-7 (all-trans)" },
    ],
    howToUse: "One capsule daily with food. Get your level tested once a year to personalise your dose.",
    science: {
      summary:
        "Vitamin D insufficiency is widespread among athletes, especially in winter and among indoor-sport populations. Correcting deficiency supports musculoskeletal and immune health; supplementing beyond sufficiency hasn't been shown to boost performance.",
      references: [
        ref("Owens DJ, Allison R, Close GL.", "Vitamin D and the athlete: current perspectives and new challenges", "Sports Med", 2018),
      ],
    },
    claims: [
      "Vitamin D contributes to the maintenance of normal muscle function.",
      "Vitamin D contributes to the normal function of the immune system.",
      "Vitamin K contributes to the maintenance of normal bones.",
    ],
    warnings: [
      ...SUPPLEMENT_WARNINGS,
      "If you take anticoagulant medication (e.g. warfarin), consult your doctor before use.",
    ],
    badges: ["Vegan D3", "MK-7", "Once daily"],
    art: { format: "bottle", ...DAILY, color: "#E9B949", ink: "#0E0F0F", accent: "#0E0F0F" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "Lichen D3 (e.g. Vitashine®), MK-7 all-trans (e.g. MenaQ7®). HPMC capsules.",
      moq: 3000,
      unitCostGBP: 240,
      leadTimeDays: 35,
      compliance: [
        ...SUPPLEMENT_COMPLIANCE,
        "UK/EU: 50 µg D3 is within the 100 µg tolerable upper intake level for adults. Anticoagulant warning required for K2.",
      ],
    },
  },

  /* ─────────────────────────── APPAREL ─────────────────────────── */
  {
    id: "pulse-tights",
    slug: "pulse-graduated-compression-tights",
    line: "LAYER",
    name: "Pulse",
    descriptor: "Graduated Compression Tights",
    kind: "apparel",
    category: "apparel",
    goals: ["recovery", "endurance"],
    headline: "Pressure where it counts. Firm at the ankle, easing to the hip.",
    description:
      "Graduated compression, 18–22 mmHg at the ankle and easing up the leg, to support venous return and reduce muscle oscillation. Wear them for long runs, then keep them on for the drive home. Knitted in Italy with a bonded waistband that stays put.",
    price: m(95, 110, 105),
    subscribable: false,
    variantLabel: "Size",
    variants: ["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({
      id: s.toLowerCase(),
      label: s,
      sku: `PF-PULSE-BLK-${s}`,
    })),
    size: "Sizes XS–XXL",
    evidence: "B",
    benefits: [
      "Less muscle soreness after hard sessions",
      "Reduced muscle vibration on impact",
      "Bonded waist, rear zip pocket, reflective hits",
    ],
    specs: [
      { label: "Compression", value: "Graduated, 18–22 mmHg at ankle" },
      { label: "Fabric", value: "72% recycled polyamide, 28% elastane" },
      { label: "Weight", value: "230 g/m²" },
      { label: "Fit", value: "Second skin" },
      { label: "Features", value: "Bonded waistband · rear zip pocket · 360° reflective" },
      { label: "Care", value: "Machine wash 30°C · do not tumble dry" },
    ],
    howToUse:
      "Wear during long or high-impact sessions, and for 2–12 hours after to support recovery. Size by ankle and calf circumference, not height.",
    science: {
      summary:
        "A meta-analysis found compression garments moderately improve recovery of strength and power and reduce soreness, with the largest effects 2–96 hours after exercise. Effects on running performance itself are small.",
      references: [
        ref("Brown F, et al.", "Compression garments and recovery from exercise: a meta-analysis", "Sports Med", 2017),
        ref("Engel FA, et al.", "Is there evidence that runners can benefit from wearing compression clothing?", "Sports Med", 2016),
      ],
    },
    claims: [],
    warnings: ["Not a medical device. Do not wear if you have peripheral arterial disease or diabetic neuropathy without medical advice."],
    badges: ["Recycled yarn", "Graduated", "Made in Italy"],
    art: { format: "tights", ...CARBON },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Warp-knit compression mill (IT/PT). Pressure-tested to RAL-GZ 387 or similar methodology. Recycled PA (e.g. Q-NOVA®).",
      moq: 300,
      unitCostGBP: 2200,
      leadTimeDays: 75,
      compliance: ["Avoid medical claims (e.g. DVT prevention) unless registered as a medical device. Textile labelling regulation (EU 1007/2011)."],
    },
  },
  {
    id: "recovery-socks",
    slug: "recovery-compression-socks",
    line: "LAYER",
    name: "Recovery",
    descriptor: "Compression Socks",
    kind: "apparel",
    category: "apparel",
    goals: ["recovery", "endurance"],
    headline: "For long-haul flights and the day after the long run.",
    description:
      "Knee-high graduated compression, cushioned under the foot with a Merino-blend terry. Designed for travel days and recovery. Your calves take the brunt of most sports; this is how you give them a break.",
    price: m(32, 38, 36),
    subscribable: false,
    variantLabel: "Size",
    variants: ["S", "M", "L", "XL"].map((s) => ({ id: s.toLowerCase(), label: s, sku: `PF-RSOCK-${s}` })),
    size: "Sizes S–XL",
    evidence: "B",
    benefits: ["Graduated calf compression", "Merino-blend cushioning", "Seamless toe"],
    specs: [
      { label: "Compression", value: "Graduated, 20–25 mmHg at ankle" },
      { label: "Fabric", value: "45% nylon, 30% merino wool, 25% elastane" },
      { label: "Height", value: "Knee" },
      { label: "Care", value: "Machine wash 30°C inside out" },
    ],
    howToUse: "Put on after training or before travel and wear for several hours. Size by calf circumference.",
    science: {
      summary:
        "Compression garments worn after exercise are associated with faster recovery of strength and reduced soreness. The strongest effects appear in the 24–96 hours after intense exercise.",
      references: [ref("Brown F, et al.", "Compression garments and recovery from exercise: a meta-analysis", "Sports Med", 2017)],
    },
    claims: [],
    warnings: ["Not a medical device."],
    badges: ["Merino blend", "Graduated"],
    art: { format: "socks", ...CARBON, color: "#2A2D2F" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "Circular-knit sock factory (PT/TR). Merino ≥ 19.5 micron, mulesing-free (ZQ or RWS certified).",
      moq: 500,
      unitCostGBP: 600,
      leadTimeDays: 60,
      compliance: ["Textile labelling (EU 1007/2011 / UK Textile Products Regs 2012)."],
    },
  },
  {
    id: "infrared-longsleeve",
    slug: "infrared-recovery-long-sleeve",
    line: "LAYER",
    name: "Infrared",
    descriptor: "Bioceramic Recovery Long Sleeve",
    kind: "apparel",
    category: "apparel",
    goals: ["recovery", "sleep"],
    headline: "Sleepwear with a job to do.",
    description:
      "A soft, loose long sleeve knitted with bioceramic-embedded yarn. Mineral particles in the fibre take in body heat and return it as far-infrared energy. It's the most comfortable thing you'll own, and early research on recovery is promising. We grade it honestly as C.",
    price: m(85, 98, 92),
    subscribable: false,
    variantLabel: "Size",
    variants: ["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({
      id: s.toLowerCase(),
      label: s,
      sku: `PF-IRLS-STN-${s}`,
    })),
    size: "Sizes XS–XXL",
    evidence: "C",
    benefits: ["Bioceramic far-infrared yarn", "Brushed, breathable, relaxed fit", "Wear to sleep or after training"],
    specs: [
      { label: "Technology", value: "Bioceramic-embedded polyester yarn" },
      { label: "Fabric", value: "50% bioceramic polyester, 45% TENCEL™ lyocell, 5% elastane" },
      { label: "Weight", value: "180 g/m²" },
      { label: "Fit", value: "Relaxed" },
      { label: "Care", value: "Machine wash 30°C. Technology lasts the life of the garment." },
    ],
    howToUse: "Wear to sleep or for recovery periods of 1+ hours. Effects in studies came from overnight or multi-hour wear.",
    science: {
      summary:
        "Far-infrared-emitting fabrics have shown reduced soreness and improved perceived recovery in small randomised trials, including in elite footballers. Mechanisms are still being worked out and samples are small. That's why this is a C, and why we tell you so.",
      references: [
        ref("Loturco I, et al.", "Effects of far infrared rays emitting clothing on recovery after an intense plyometric exercise bout applied to elite soccer players: a randomized double-blind placebo-controlled trial", "Biol Sport", 2016),
        ref("Vatansever F, Hamblin MR.", "Far infrared radiation (FIR): its biological effects and medical applications", "Photonics Lasers Med", 2012),
      ],
    },
    claims: [],
    warnings: [],
    badges: ["Evidence grade C", "TENCEL™ blend"],
    art: { format: "longsleeve", color: "#D8D3C8", ink: "#0E0F0F", accent: "#FF5B24" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec:
        "Licensed bioceramic yarn (e.g. Celliant® by Hologenix, which offers brand licensing) blended with lyocell. Request emissivity test report.",
      moq: 300,
      unitCostGBP: 2100,
      leadTimeDays: 80,
      compliance: [
        "General wellness positioning only. No claims to treat, cure or prevent any condition.",
        "Only use a licensed ingredient brand name with a signed licence agreement.",
      ],
    },
  },
  {
    id: "merino-150",
    slug: "merino-150-base-layer-tee",
    line: "LAYER",
    name: "Merino 150",
    descriptor: "Base Layer Tee",
    kind: "apparel",
    category: "apparel",
    goals: ["endurance", "heat"],
    headline: "Warm when it's cold. Cool when it's not. Days between washes.",
    description:
      "150 g/m² merino wrapped around a nylon core for durability. Merino buffers humidity next to the skin and resists odour naturally, so it works from dawn starts to multi-day trips. Mulesing-free, traceable wool.",
    price: m(75, 88, 82),
    subscribable: false,
    variantLabel: "Size",
    variants: ["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({
      id: s.toLowerCase(),
      label: s,
      sku: `PF-M150-BLK-${s}`,
    })),
    size: "Sizes XS–XXL",
    benefits: ["Thermoregulating and naturally odour-resistant", "Nylon core for durability", "Flatlock seams, no chafe"],
    specs: [
      { label: "Fabric", value: "87% merino wool (17.5 µm), 13% nylon core-spun" },
      { label: "Weight", value: "150 g/m²" },
      { label: "Fit", value: "Trim" },
      { label: "Origin", value: "ZQ-certified, mulesing-free" },
      { label: "Care", value: "Machine wash 30°C wool cycle · dry flat" },
    ],
    howToUse: "Next to skin, on its own or under a shell.",
    science: {
      summary:
        "Wool fibres absorb and release moisture vapour, buffering humidity next to the skin as sweat rates change. That helps comfort during stop-start efforts and in changing conditions.",
      references: [],
    },
    claims: [],
    warnings: [],
    badges: ["ZQ merino", "Odour resistant"],
    art: { format: "tee", ...CARBON },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "Core-spun merino jersey (NZ/AU wool, knitted in IT or CN). ZQ or RWS certified supply chain.",
      moq: 300,
      unitCostGBP: 1900,
      leadTimeDays: 75,
      compliance: ["Textile fibre composition labelling. Only claim ZQ/RWS with transaction certificates."],
    },
  },
  {
    id: "glacier-tee",
    slug: "glacier-cooling-training-tee",
    line: "LAYER",
    name: "Glacier",
    descriptor: "Cooling Training Tee",
    kind: "apparel",
    category: "apparel",
    goals: ["heat", "endurance", "strength"],
    headline: "Built for the hottest hour of your week.",
    description:
      "Ultralight knit with body-mapped mesh through the back and underarm, where you sweat most. Fast-wicking yarn spreads sweat thin so it evaporates, which is the only cooling your body really has.",
    price: m(48, 56, 52),
    subscribable: false,
    variantLabel: "Size",
    variants: ["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({
      id: s.toLowerCase(),
      label: s,
      sku: `PF-GLAC-ICE-${s}`,
    })),
    size: "Sizes XS–XXL",
    benefits: ["Body-mapped ventilation", "95 g/m² ultralight knit", "UPF 30+ sun protection"],
    specs: [
      { label: "Fabric", value: "100% recycled polyester, hollow-core yarn" },
      { label: "Weight", value: "95 g/m²" },
      { label: "Fit", value: "Regular" },
      { label: "Features", value: "Mesh zones · UPF 30+ · reflective logo" },
      { label: "Care", value: "Machine wash 30°C" },
    ],
    howToUse: "Pair with Salt and a precooling protocol for sessions in heat.",
    science: {
      summary:
        "Evaporation of sweat is the dominant cooling pathway during exercise in heat. Fabrics that spread moisture and ventilate high-sweat zones support that process.",
      references: [],
    },
    claims: [],
    warnings: [],
    badges: ["Recycled", "UPF 30+"],
    art: { format: "tee", color: "#A9CBDD", ink: "#0E0F0F", accent: "#FF5B24" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "Recycled PET hollow-core knit (GRS certified). Body-mapped engineered knit if volumes allow.",
      moq: 500,
      unitCostGBP: 900,
      leadTimeDays: 60,
      compliance: ["UPF claim requires test to AS/NZS 4399 or EN 13758-1."],
    },
  },
  {
    id: "ridge-shell",
    slug: "ridge-windproof-running-shell",
    line: "LAYER",
    name: "Ridge",
    descriptor: "Windproof Running Shell",
    kind: "apparel",
    category: "apparel",
    goals: ["endurance"],
    headline: "92 grams. Packs into its own chest pocket.",
    description:
      "A featherweight wind shell for ridgelines, early starts and the last cold hour. PFC-free water-repellent finish, laser-cut back vent, and a hood that turns with your head.",
    price: m(180, 210, 195),
    subscribable: false,
    variantLabel: "Size",
    variants: ["XS", "S", "M", "L", "XL", "XXL"].map((s) => ({
      id: s.toLowerCase(),
      label: s,
      sku: `PF-RIDGE-BLK-${s}`,
    })),
    size: "Sizes XS–XXL",
    benefits: ["92 g, packs to fist size", "PFC-free DWR", "Helmet-free fitted hood"],
    specs: [
      { label: "Weight", value: "92 g (size M)" },
      { label: "Fabric", value: "10D recycled ripstop nylon" },
      { label: "Finish", value: "PFC-free durable water repellent" },
      { label: "Air permeability", value: "< 5 CFM" },
      { label: "Features", value: "Chest stash pocket · laser-cut vent · reflective trims" },
      { label: "Repair", value: "Free repair for life of garment" },
    ],
    howToUse: "Carry it. Put it on at the top.",
    science: { summary: "Wind is the fastest way to lose heat on exposed ground. Stopping it is the job.", references: [] },
    claims: [],
    warnings: [],
    badges: ["PFC-free", "Repair for life"],
    art: { format: "jacket", ...CARBON },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "Technical outerwear cut-and-sew (VN/TW/PT). 10D recycled nylon ripstop, C0 DWR.",
      moq: 300,
      unitCostGBP: 4600,
      leadTimeDays: 90,
      compliance: ["Repair-for-life promise needs a repair partner and a budgeted reserve before launch."],
    },
  },

  /* ─────────────────────────── GEAR ─────────────────────────── */
  {
    id: "precool-vest",
    slug: "precool-cooling-vest",
    line: "KIT",
    name: "Precool",
    descriptor: "Phase-Change Cooling Vest",
    kind: "gear",
    category: "gear",
    goals: ["heat", "endurance"],
    headline: "Start hot races cold.",
    description:
      "Phase-change packs hold 15°C for up to 2 hours, lowering skin and core temperature before you start. Precooling is one of the best-evidenced tools for performance in heat. Pull it on in the warm-up and take it off on the start line.",
    price: m(140, 165, 155),
    subscribable: false,
    variantLabel: "Size",
    variants: ["S/M", "L/XL"].map((s) => ({ id: s.toLowerCase().replace("/", "-"), label: s, sku: `PF-PCV-${s.replace("/", "")}` })),
    size: "Sizes S/M, L/XL",
    evidence: "A",
    benefits: ["15°C phase-change packs, not ice", "Up to 2 h cooling", "Adjustable, fits over race kit"],
    specs: [
      { label: "Cooling", value: "PCM packs, 15°C melt point" },
      { label: "Duration", value: "60–120 min depending on ambient" },
      { label: "Recharge", value: "20 min in iced water or 1 h in fridge" },
      { label: "Weight", value: "1.6 kg with packs" },
    ],
    howToUse:
      "Wear for 20–30 minutes before and during your warm-up in hot conditions. Pair with an ice slurry drink for maximum effect.",
    science: {
      summary:
        "Meta-analyses show that cooling before and during exercise improves performance in the heat, with mixed methods (vest plus ice slurry) among the most effective. Vests reduce skin temperature and perceived heat strain.",
      references: [
        ref("Tyler CJ, Sunderland C, Cheung SS.", "The effect of cooling prior to and during exercise on exercise performance and capacity in the heat: a meta-analysis", "Br J Sports Med", 2015),
        ref("Bongers CCWG, Hopman MTE, Eijsvogels TMH.", "Cooling interventions for athletes: an overview of effectiveness, physiological mechanisms, and practical considerations", "Temperature", 2017),
      ],
    },
    claims: [],
    warnings: ["Do not freeze packs below −5°C. Not for use on broken skin."],
    badges: ["Evidence grade A", "Reusable"],
    art: { format: "vest", color: "#A9CBDD", ink: "#0E0F0F", accent: "#0E0F0F" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "PCM (15°C) pack vest, ripstop outer. Request cycle-life test (≥ 500 cycles).",
      moq: 200,
      unitCostGBP: 3800,
      leadTimeDays: 70,
      compliance: ["General product safety (UK GPSR / EU GPSR 2023/988)."],
    },
  },
  {
    id: "occlusion-bands",
    slug: "occlusion-bfr-training-bands",
    line: "KIT",
    name: "Occlusion",
    descriptor: "Blood Flow Restriction Bands",
    kind: "gear",
    category: "gear",
    goals: ["strength", "recovery"],
    headline: "Heavy-load results from light weights.",
    description:
      "Pneumatic cuffs with a pressure gauge, so you train at a measured restriction instead of guessing with elastic. BFR training lets you build size and strength with 20–30% of your max load. That's useful when joints, travel or rehab mean you can't go heavy.",
    price: m(65, 75, 70),
    subscribable: false,
    variantLabel: "Set",
    variants: [
      { id: "arms", label: "Arm set", sku: "PF-BFR-ARM" },
      { id: "legs", label: "Leg set", sku: "PF-BFR-LEG", priceDelta: m(10, 12, 11) },
    ],
    size: "Arm or leg set",
    evidence: "A",
    benefits: ["Gauge-controlled pneumatic pressure", "Hypertrophy at 20–30% 1RM", "Quick-release valve"],
    specs: [
      { label: "Cuff width", value: "5 cm (arm) · 10 cm (leg)" },
      { label: "Pressure", value: "0–300 mmHg analogue gauge" },
      { label: "Includes", value: "2 cuffs · hand pump · protocol card · pouch" },
    ],
    howToUse:
      "Use 40–80% of limb occlusion pressure. Four sets of 30-15-15-15 reps at 20–30% of 1RM, with 30–60 s rest. Seek guidance from a qualified professional before starting.",
    science: {
      summary:
        "Low-load training with blood flow restriction produces muscle growth comparable to high-load training and meaningful strength gains. It's widely used in rehabilitation. Methodology and safety screening matter.",
      references: [
        ref("Patterson SD, et al.", "Blood flow restriction exercise: considerations of methodology, application, and safety", "Front Physiol", 2019),
        ref("Lixandrão ME, et al.", "Magnitude of muscle strength and mass adaptations between high-load resistance training versus low-load resistance training associated with blood-flow restriction: a systematic review and meta-analysis", "Sports Med", 2018),
      ],
    },
    claims: [],
    warnings: [
      "Not suitable if you have a history of blood clots, vascular disease, uncontrolled hypertension, or are pregnant. Consult a medical professional before use.",
    ],
    badges: ["Evidence grade A", "Gauge controlled"],
    art: { format: "bands", ...CARBON },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "Pneumatic BFR cuffs with sphygmomanometer-type gauge. Latex-free bladder.",
      moq: 300,
      unitCostGBP: 1100,
      leadTimeDays: 55,
      compliance: [
        "Position as a training product, not a medical device. Clinical/rehab claims would need UKCA/CE medical device conformity.",
        "Screening questions and warnings required on packaging and product page.",
      ],
    },
  },
  {
    id: "dusk-glasses",
    slug: "dusk-amber-blue-light-glasses",
    line: "KIT",
    name: "Dusk",
    descriptor: "Amber Evening Lenses",
    kind: "gear",
    category: "gear",
    goals: ["sleep"],
    headline: "Tell your brain the sun has set.",
    description:
      "Amber lenses filter the short-wavelength blue light that tells your body clock it's still daytime. Put them on two hours before bed and keep your screens, just without the signal. Lightweight TR90 frame, sized to fit over most faces.",
    price: m(55, 64, 60),
    subscribable: false,
    variants: [
      { id: "standard", label: "Standard fit", sku: "PF-DUSK-STD" },
      { id: "wide", label: "Wide fit", sku: "PF-DUSK-WDE" },
    ],
    size: "Standard or wide fit",
    evidence: "B",
    benefits: ["Filters > 99% of 400–500 nm light", "22 g TR90 frame", "Hard case + cloth included"],
    specs: [
      { label: "Lens", value: "Amber polycarbonate, 99% block 400–500 nm" },
      { label: "Frame", value: "TR90, 22 g" },
      { label: "Includes", value: "Hard case · microfibre pouch" },
    ],
    howToUse: "Wear for 2–3 hours before bed. Don't drive at night in them.",
    science: {
      summary:
        "Evening light suppresses melatonin, and short-wavelength (blue) light does so most strongly. Randomised trials of amber lenses in the evening report improvements in sleep quality, particularly in people with insomnia symptoms.",
      references: [
        ref("Burkhart K, Phelps JR.", "Amber lenses to block blue light and improve sleep: a randomized trial", "Chronobiol Int", 2009),
        ref("Shechter A, et al.", "Blocking nocturnal blue light for insomnia: a randomized controlled trial", "J Psychiatr Res", 2018),
      ],
    },
    claims: [],
    warnings: ["Not suitable for driving at night."],
    badges: ["99% blue block", "22 g"],
    art: { format: "glasses", color: "#1A1C1D", ink: "#F3F1EC", accent: "#F2A33A" },
    status: "live",
    whiteLabel: {
      supplier: "TBC",
      sourcingSpec: "Amber PC lens with spectral transmission report (400–500 nm). TR90 frame, custom temple print.",
      moq: 500,
      unitCostGBP: 700,
      leadTimeDays: 45,
      compliance: ["Eyewear: EN ISO 12312-1 if positioned as sunglasses; otherwise general product safety."],
    },
  },
];

export const liveProducts = products.filter((p) => p.status === "live");

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
