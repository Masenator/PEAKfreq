import type { Stack } from "./types.ts";

/** Protocols: curated bundles sold at a bundle discount. */
export const stacks: Stack[] = [
  {
    id: "endurance",
    slug: "endurance-protocol",
    name: "Endurance Protocol",
    goal: "endurance",
    tagline: "Go longer. Fade later.",
    description:
      "For marathons, sportives, ultras and long mountain days. Fuel and sodium for the event, creatine and cherry for the training block, compression for the drive home.",
    items: [
      { productId: "carb90", when: "During: 60–90 g carbohydrate per hour" },
      { productId: "salt", when: "During: 1 stick per hour in heat" },
      { productId: "base", when: "Daily: 5 g, any time" },
      { productId: "tart", when: "Race week: 30 ml twice daily" },
      { productId: "pulse-tights", when: "After: wear 2–12 h post-session" },
    ],
    discount: 0.1,
    color: "#FF5B24",
  },
  {
    id: "strength",
    slug: "strength-protocol",
    name: "Strength Protocol",
    goal: "strength",
    tagline: "Build it. Keep it.",
    description:
      "The evidence-A core of strength training: creatine and protein. Add Surge for sessions and Rebuild for the tendons that take the load, plus BFR for deload weeks and travel.",
    items: [
      { productId: "base", when: "Daily: 5 g" },
      { productId: "isolate", when: "Post-session: 30 g" },
      { productId: "surge", when: "Pre-session: 30–45 min before" },
      { productId: "rebuild", when: "Pre-loading: 60 min before" },
      { productId: "occlusion-bands", when: "Deload & travel: 1–2× weekly" },
    ],
    discount: 0.1,
    color: "#EDE9E1",
  },
  {
    id: "sleep",
    slug: "sleep-recover-protocol",
    name: "Sleep & Recover Protocol",
    goal: "sleep",
    tagline: "Recovery is a nightly practice.",
    description:
      "Sleep is where adaptation happens. Cut the light signal, lower the temperature signal, and give recovery the raw materials it needs.",
    items: [
      { productId: "dusk-glasses", when: "2–3 h before bed" },
      { productId: "descend", when: "30–60 min before bed" },
      { productId: "tart", when: "Evening: 30 ml in hard blocks" },
      { productId: "infrared-longsleeve", when: "Overnight" },
    ],
    discount: 0.1,
    color: "#262A5C",
  },
  {
    id: "heat",
    slug: "heat-protocol",
    name: "Heat Protocol",
    goal: "heat",
    tagline: "Stay cool. Hold pace.",
    description:
      "Built for hot races, summer blocks and training camps. Start cold, replace what you sweat, and let the kit do the evaporating.",
    items: [
      { productId: "precool-vest", when: "Warm-up: 20–30 min" },
      { productId: "salt", when: "Before + during: 1 stick per hour" },
      { productId: "carb90", when: "During: 60–90 g/h" },
      { productId: "glacier-tee", when: "Race & training" },
    ],
    discount: 0.1,
    color: "#A9CBDD",
  },
  {
    id: "foundation",
    slug: "daily-foundation-protocol",
    name: "Daily Foundation",
    goal: "longevity",
    tagline: "The base layer for a long life of training.",
    description:
      "Four evidence-backed daily basics that most people are short on. Start here before anything else.",
    items: [
      { productId: "foundation", when: "Daily: 2 softgels with food" },
      { productId: "sun", when: "Daily: 1 capsule with food" },
      { productId: "base", when: "Daily: 5 g" },
      { productId: "descend", when: "Nightly" },
    ],
    discount: 0.1,
    color: "#3E5641",
  },
];

export function getStack(slug: string): Stack | undefined {
  return stacks.find((s) => s.slug === slug);
}
