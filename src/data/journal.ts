/**
 * Journal articles. Mention any product inline with [[product-id]] or
 * [[product-id|custom label]]. Mentions render as shoppable links, so every
 * product the brand talks about is one click from the cart.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "products"; ids: string[] };

export interface Article {
  slug: string;
  title: string;
  dek: string;
  category: string;
  readMins: number;
  date: string;
  color: string;
  body: Block[];
}

export const articles: Article[] = [
  {
    slug: "the-sodium-problem",
    title: "The sodium problem",
    dek: "Why most electrolyte drinks are built for taste, not sweat, and how to work out what you lose.",
    category: "Fuel",
    readMins: 6,
    date: "2026-09-02",
    color: "#A9CBDD",
    body: [
      { type: "p", text: "Sweat is mostly water and salt. Sodium is the electrolyte you lose most of by far: typically 20–80 mmol per litre, which is roughly 460–1,840 mg. Potassium and magnesium are lost in much smaller amounts." },
      { type: "p", text: "Yet most electrolyte tablets carry 200–300 mg of sodium. That's fine for a lunchtime jog. It isn't enough for a three-hour ride in July, or for anyone who finishes a session with salt crusted on their cap." },
      { type: "h", text: "Know your number" },
      { type: "p", text: "Weigh yourself naked before and after an hour of training, and note what you drank. Each kilogram lost is about one litre of sweat. Salty sweaters (white marks on kit, stinging eyes) sit at the top of the sodium range." },
      { type: "list", items: [
        "Under 0.5 L/h and not salty: water and food are usually enough.",
        "0.5–1.5 L/h, or salty: 500–1,000 mg sodium per hour in long sessions.",
        "Over 1.5 L/h in heat: consider more, and test it in training.",
      ] },
      { type: "h", text: "What we built" },
      { type: "p", text: "[[salt]] carries 1,000 mg of sodium per stick and no sugar, so you can dose sodium independently of carbohydrate. On long days, pair it with [[carb90|Carb 90]] and you control both dials separately." },
      { type: "products", ids: ["salt", "carb90", "glacier-tee"] },
    ],
  },
  {
    slug: "creatine-is-not-just-for-lifters",
    title: "Creatine isn't just for lifters",
    dek: "The most researched supplement in sport has a second life in endurance, cognition and healthy ageing.",
    category: "Science",
    readMins: 7,
    date: "2026-08-18",
    color: "#DB7A45",
    body: [
      { type: "p", text: "Creatine has been studied in hundreds of trials since the early 1990s. The core finding hasn't moved: about 3–5 g a day tops up muscle phosphocreatine and lets you do more work in repeated hard efforts." },
      { type: "h", text: "Endurance athletes" },
      { type: "p", text: "Endurance events are decided by surges: the climb, the break, the sprint. Creatine supports repeated high-intensity bursts and may help glycogen storage when taken with carbohydrate. The water gain is typically 0.5–1.5 kg. For most road and trail athletes, that trade-off is favourable." },
      { type: "h", text: "Your brain runs on it too" },
      { type: "p", text: "The brain uses around a fifth of your energy, and creatine buffers that supply. Meta-analyses from 2018 and 2024 report small improvements in memory, with larger effects under stress, sleep loss, and in older adults." },
      { type: "quote", text: "If we could only sell one supplement, it would be this one." },
      { type: "p", text: "[[base]] is 5 g of micronised creatine monohydrate and nothing else. Stir it into your morning coffee and forget about it." },
      { type: "products", ids: ["base", "isolate", "foundation"] },
    ],
  },
  {
    slug: "sleep-is-a-training-session",
    title: "Sleep is a training session",
    dek: "Light, temperature and timing: the three levers you control tonight.",
    category: "Recovery",
    readMins: 5,
    date: "2026-07-29",
    color: "#262A5C",
    body: [
      { type: "p", text: "Growth hormone pulses, glycogen resynthesis, memory consolidation of new motor skills: most of the adaptation you train for is finished off in your sleep. Treat it like a session with a warm-up." },
      { type: "h", text: "1. Light" },
      { type: "p", text: "Bright, blue-rich light in the evening delays melatonin release and shifts your clock later. Dim the house two hours out, or wear [[dusk-glasses|amber lenses]] and keep your screens." },
      { type: "h", text: "2. Temperature" },
      { type: "p", text: "Core temperature falls as you fall asleep. A warm shower then a cool room (16–19°C) helps that happen. Glycine appears to help too, by increasing blood flow to the skin. It's one half of [[descend]]." },
      { type: "h", text: "3. Timing" },
      { type: "p", text: "The same wake time seven days a week is the strongest circadian anchor there is. Caffeine has a 5–6 hour half-life, so a 4pm espresso is still half there at 10pm. Keep [[signal]] for mornings." },
      { type: "products", ids: ["dusk-glasses", "descend", "infrared-longsleeve", "tart"] },
    ],
  },
  {
    slug: "start-hot-races-cold",
    title: "Start hot races cold",
    dek: "Precooling is one of the best-evidenced tools in endurance sport, and it's still underused.",
    category: "Heat",
    readMins: 4,
    date: "2026-06-30",
    color: "#E59A6B",
    body: [
      { type: "p", text: "In the heat, your performance ceiling is partly set by how much thermal headroom you have before your brain starts turning the pace down. Precooling buys you headroom before the gun goes." },
      { type: "p", text: "The research favours mixed methods: a [[precool-vest|cooling vest]] through the warm-up plus an ice-slurry drink 30 minutes out. Then hold your sodium with [[salt]] and dress for evaporation in the [[glacier-tee|Glacier tee]]." },
      { type: "products", ids: ["precool-vest", "salt", "glacier-tee", "carb90"] },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
