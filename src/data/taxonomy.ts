import type { Category, EvidenceGrade, Goal } from "./types.ts";

/**
 * The five frequencies: the brand's organising idea. Physiology is rhythmic
 * (heart rate variability, circadian clock, stride cadence, neural
 * oscillation, cellular repair cycles). Each maps to a product category.
 */
export const frequencies = [
  {
    id: "cadence",
    name: "Cadence",
    hz: "1.4–3 Hz",
    body: "Stride, stroke and pedal rate",
    copy: "The rhythm of output. Fuel it and it holds late into the race.",
    category: "fuel" as Category,
  },
  {
    id: "cellular",
    name: "Cellular",
    hz: "24–72 h",
    body: "Muscle and tendon repair cycles",
    copy: "Training is the stimulus. Recovery is where the adaptation happens.",
    category: "recover" as Category,
  },
  {
    id: "circadian",
    name: "Circadian",
    hz: "1 / 24 h",
    body: "Sleep–wake clock",
    copy: "Light, temperature and timing tell your body when to rebuild.",
    category: "sleep" as Category,
  },
  {
    id: "neural",
    name: "Neural",
    hz: "13–30 Hz",
    body: "Beta-band focus",
    copy: "Attention is trainable. So is how smoothly you get there.",
    category: "focus" as Category,
  },
  {
    id: "cardiac",
    name: "Cardiac",
    hz: "0.8–3 Hz",
    body: "Heart rate & HRV",
    copy: "The daily base layer that holds every other rhythm steady.",
    category: "daily" as Category,
  },
];

export const categories: Record<Category, { label: string; blurb: string }> = {
  fuel: { label: "Fuel & Hydrate", blurb: "Before and during: output, fuel, sodium." },
  recover: { label: "Recover & Build", blurb: "After: protein, tissue, recovery." },
  sleep: { label: "Sleep", blurb: "Night: the other half of training." },
  focus: { label: "Focus", blurb: "Clean, measured cognitive support." },
  daily: { label: "Daily", blurb: "The base layer: omega-3, D3, K2." },
  apparel: { label: "Apparel", blurb: "Technical layers engineered for a job." },
  gear: { label: "Kit", blurb: "Tools that change your physiology." },
};

export const goals: Record<Goal, string> = {
  endurance: "Endurance",
  strength: "Strength",
  recovery: "Recovery",
  sleep: "Sleep",
  focus: "Focus",
  heat: "Heat",
  longevity: "Longevity",
};

export const evidence: Record<EvidenceGrade, { label: string; copy: string }> = {
  A: {
    label: "Strong",
    copy: "Consistent benefit across multiple randomised trials and meta-analyses.",
  },
  B: {
    label: "Good",
    copy: "Several randomised trials support it; effect size or consistency still debated.",
  },
  C: {
    label: "Emerging",
    copy: "Early or mixed data. Plausible mechanism. We sell it and tell you so.",
  },
};
