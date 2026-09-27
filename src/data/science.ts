import type { Reference } from "./types.ts";

/**
 * "On our radar": ingredients we track but don't sell yet, and why.
 * Publishing this is part of the brand: evidence over hype.
 */
export const watchlist: {
  name: string;
  status: string;
  why: string;
  reference: Reference;
}[] = [
  {
    name: "Taurine",
    status: "Watching",
    why: "A 2023 study linked taurine decline to ageing in animals, and supplementation extended healthy lifespan in mice. Human performance and longevity data are still thin.",
    reference: { authors: "Singh P, et al.", title: "Taurine deficiency as a driver of aging", journal: "Science", year: 2023 },
  },
  {
    name: "Urolithin A",
    status: "Watching",
    why: "Promotes mitophagy, the recycling of damaged mitochondria. Randomised trials in older adults show improved muscle endurance markers. We're waiting on data in trained athletes.",
    reference: {
      authors: "Liu S, et al.",
      title: "Effect of urolithin A supplementation on muscle endurance and mitochondrial health in older adults: a randomized clinical trial",
      journal: "JAMA Netw Open",
      year: 2022,
    },
  },
  {
    name: "Ketone esters",
    status: "Watching",
    why: "Some evidence they blunt overreaching during heavy training blocks. Performance effects in single events are inconsistent, and regulatory status varies by market.",
    reference: {
      authors: "Poffé C, et al.",
      title: "Ketone ester supplementation blunts overreaching symptoms during endurance training overload",
      journal: "J Physiol",
      year: 2019,
    },
  },
  {
    name: "Sodium bicarbonate",
    status: "Considering",
    why: "Strong evidence for 1–10 minute efforts, but gut side-effects are common. We'd only launch it with a delivery system that solves the GI problem.",
    reference: {
      authors: "Grgic J, et al.",
      title: "International Society of Sports Nutrition position stand: sodium bicarbonate and exercise performance",
      journal: "J Int Soc Sports Nutr",
      year: 2021,
    },
  },
  {
    name: "NMN",
    status: "Not selling",
    why: "Human outcome data are limited, and NMN is not authorised as a novel food in the UK or EU. We won't sell what we can't sell legally or defend scientifically.",
    reference: {
      authors: "Yoshino M, et al.",
      title: "Nicotinamide mononucleotide increases muscle insulin sensitivity in prediabetic women",
      journal: "Science",
      year: 2021,
    },
  },
  {
    name: "Ashwagandha",
    status: "Not selling",
    why: "Some stress and recovery data exist, but several European regulators have raised safety questions, including over liver effects. Until that's resolved, it stays off our shelf.",
    reference: {
      authors: "Committee on Toxicity (UK)",
      title: "Statement on the safety of ashwagandha in food supplements",
      journal: "COT",
      year: 2024,
    },
  },
];

/** Build a PubMed search link for a reference (robust vs. hand-typed DOIs). */
export function referenceUrl(r: Reference): string {
  if (r.journal === "COT") return "https://cot.food.gov.uk/";
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(r.title)}`;
}
