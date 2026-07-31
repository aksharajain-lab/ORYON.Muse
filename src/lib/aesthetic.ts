export type AestheticResult = {
  identity: string;
  tagline: string;
  palette: { name: string; hex: string }[];
  traits: string[];
  signature: string;
  suggestions: string[];
  imageDataUrl?: string;
  createdAt: number;
};

const IDENTITIES = [
  {
    identity: "Ethereal Romantic",
    tagline: "You move through the world like light through linen — softly, with intention, leaving warmth where you've been.",
    palette: [
      { name: "Ivory Silk", hex: "#F6EFE6" },
      { name: "Blush Petal", hex: "#E9C7C1" },
      { name: "Lavender Mist", hex: "#C9BEE1" },
      { name: "Powder Blue", hex: "#BFD1E2" },
      { name: "Muted Sage", hex: "#B7C4A9" },
    ],
    traits: ["Intuitive", "Poetic", "Nostalgic", "Considered", "Quietly bold"],
    signature:
      "Your visual world lives in the space between delicacy and strength. You gravitate toward light that diffuses, surfaces that feel alive to the touch, and the kind of quiet that makes a room breathe. There is a restrained poetry in your choices — nothing shouts, but everything in your composition has been considered, even the pauses. You collect moments the way others collect objects, and your instinct for texture is finely tuned to the sensory poetry of everyday life.",
    suggestions: [
      "Introduce one heirloom object — brass worn soft by time, a pearl you return to, or silver with a story. Let it be the anchor your softer pieces need.",
      "Layer two tonal neutrals before adding any accent colour. The restraint itself becomes the statement — a study in patience.",
      "Place a single unexpected antique in an otherwise modern composition. That dialogue between eras is where your aesthetic lives most fully.",
    ],
  },
  {
    identity: "Modern Nostalgic",
    tagline: "You are a curator of quiet detail and quiet luxury — each decision deliberate, each object a conversation.",
    palette: [
      { name: "Bone", hex: "#EFE8DD" },
      { name: "Camel", hex: "#C8A97E" },
      { name: "Ash Rose", hex: "#B49A9A" },
      { name: "Stone", hex: "#8C8579" },
      { name: "Deep Espresso", hex: "#3B2E28" },
    ],
    traits: ["Refined", "Grounded", "Discerning", "Warm", "Understated"],
    signature:
      "There is an intentional stillness in the way you compose your surroundings. Weighty textiles and weathered metals speak to a person who values substance over spectacle — who understands that true luxury is felt, not displayed. Your eye for proportion is nearly architectural, and the restraint you exercise in your palette creates a quiet drama that reveals itself slowly. You collect with the patience of a gallerist, each addition earning its place through careful consideration of how it sits with everything else in the room.",
    suggestions: [
      "Swap one glossy surface for a matte, tactile alternative — unlacquered brass, raw linen, honed stone. Let your fingers do the deciding.",
      "Repeat a single silhouette across three different scales. The rhythm it creates will be more powerful than any colour could be.",
      "Leave one wall completely empty. Not as an oversight, but as a deliberate composition of negative space — a breath your room needs.",
    ],
  },
  {
    identity: "Dark Academia Muse",
    tagline: "Candlelight, marginalia, and the perfume of old books — your aesthetic is a love letter to the studied life.",
    palette: [
      { name: "Ink", hex: "#1E1A17" },
      { name: "Oxblood", hex: "#5C1F1F" },
      { name: "Antique Gold", hex: "#B58B45" },
      { name: "Forest", hex: "#2E3B2A" },
      { name: "Parchment", hex: "#D9C9A8" },
    ],
    traits: ["Cerebral", "Devoted", "Mysterious", "Reverent", "Meticulous"],
    signature:
      "Your world is one of layered shadows and borrowed light — a chiaroscuro where every object carries the weight of its own history. You are drawn to the patina of time: worn leather, pages softened by hands, brass dulled to a honey glow. There is a ritual quality to your choices; nothing is accidental. Each texture, each dim corner, each scent carries meaning. You inhabit your spaces the way one inhabits a living archive — every object a reference, every shadow a footnote, and the quiet is full of stories waiting to be told.",
    suggestions: [
      "Add one handwritten element — a note tucked into a frame, a label on a drawer, a monogram carved into a surface. The personal mark transforms the object.",
      "Layer three distinct textures — wool's weight, leather's grain, paper's fragility. The friction between them creates the atmosphere you're seeking.",
      "Edit your palette to two colours and one metal. The discipline will clarify everything. Let the absence of colour speak as loudly as the colours themselves.",
    ],
  },
];

export function mockAnalyze(imageDataUrl?: string): AestheticResult {
  const pick = IDENTITIES[Math.floor(Math.random() * IDENTITIES.length)];
  return { ...pick, imageDataUrl, createdAt: Date.now() };
}

/* ── Aesthetic Evolution ── */

export type EvolveDirection = {
  id: string;
  name: string;
  description: string;
  accent: string;
};

export const EVOLVE_DIRECTIONS: EvolveDirection[] = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    description: "Understated refinement. The absence of logos, the presence of intention. Wool, cashmere, bone china, and the quiet confidence of knowing less is more.",
    accent: "#C8A97E",
  },
  {
    id: "soft-muse",
    name: "Soft Muse",
    description: "Dreamy, romantic, gently luminous. Linens in pearl and blush, filtered daylight, dried florals, and the poetry of soft edges.",
    accent: "#E9C7C1",
  },
  {
    id: "dark-academia",
    name: "Dark Academia",
    description: "Scholarly, atmospheric, rich with history. Leather-bound volumes, amber light, tweed and velvet, the romance of the studied life.",
    accent: "#5C1F1F",
  },
  {
    id: "japandi",
    name: "Japandi",
    description: "Wabi-sabi meets Scandinavian calm. Muted earth tones, handcrafted ceramics, imperfect beauty, and the art of intentional emptiness.",
    accent: "#8B8B78",
  },
  {
    id: "old-money",
    name: "Old Money",
    description: "Inherited taste, not purchased style. Classic silhouettes, navy and cream, weathered leather, heirloom silver, and the grace of things that endure.",
    accent: "#2B4C6B",
  },
  {
    id: "modern-minimalism",
    name: "Modern Minimalism",
    description: "Edited, precise, architectural. Monochrome foundations, sculptural forms, pure lines, and the radical luxury of empty space.",
    accent: "#4A4A4A",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Curated nostalgia with a contemporary eye. Mid-century silhouettes, patina and aged finishes, flea-market finds, and stories woven into every piece.",
    accent: "#B58B45",
  },
  {
    id: "organic-modern",
    name: "Organic Modern",
    description: "Nature refined through a contemporary lens. Raw linen, weathered stone, sculptural branches, and the texture of the natural world in modern forms.",
    accent: "#7A9B7A",
  },
];

const EVO_KEY = "oryon.evolution";
export function saveEvolution(ids: string[]) {
  try { localStorage.setItem(EVO_KEY, JSON.stringify(ids)); } catch {}
}
export function loadEvolution(): string[] {
  try {
    const v = localStorage.getItem(EVO_KEY);
    return v ? (JSON.parse(v) as string[]) : [];
  } catch { return []; }
}

const KEY = "oryon.result";
export function saveResult(r: AestheticResult) {
  try {
    localStorage.setItem(KEY, JSON.stringify(r));
  } catch {
    // The image data URL can exceed the localStorage quota (~5 MB on mobile).
    // Save the reading without the image rather than losing the result entirely.
    try {
      const { imageDataUrl: _omit, ...rest } = r;
      localStorage.setItem(KEY, JSON.stringify(rest));
    } catch { /* storage unavailable — the result page will redirect to /upload */ }
  }
}
export function loadResult(): AestheticResult | null {
  try {
    const v = localStorage.getItem(KEY);
    if (!v) return null;
    const parsed = JSON.parse(v) as AestheticResult | null;
    // Guard against missing/corrupt data (e.g. older saved results or partial writes)
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.identity !== "string" || !Array.isArray(parsed.palette) || !Array.isArray(parsed.traits)) {
      return null;
    }
    return parsed;
  } catch { return null; }
}

/* ── Guest Usage Limits ── */

export const ANALYSIS_LIMIT = 1;
export const ANALYSIS_FOLLOWUP_LIMIT = 3;
export const DIRECT_CHAT_LIMIT = 5;

const ANALYSIS_USED_KEY = "oryon.analysis_used";
const GUIDE_ANALYSIS_MSGS_KEY = "oryon.guide_analysis_msgs";
const GUIDE_DIRECT_MSGS_KEY = "oryon.guide_direct_msgs";

export function getAnalysisUsed(): boolean {
  try { return localStorage.getItem(ANALYSIS_USED_KEY) === "true"; } catch { return false; }
}

export function setAnalysisUsed() {
  try { localStorage.setItem(ANALYSIS_USED_KEY, "true"); } catch {}
}

export function getGuideAnalysisMessages(): number {
  try {
    const v = localStorage.getItem(GUIDE_ANALYSIS_MSGS_KEY);
    return v ? parseInt(v, 10) : 0;
  } catch { return 0; }
}

export function incrementGuideAnalysisMessages(): number {
  const next = getGuideAnalysisMessages() + 1;
  try { localStorage.setItem(GUIDE_ANALYSIS_MSGS_KEY, String(next)); } catch {}
  return next;
}

export function getGuideDirectMessages(): number {
  try {
    const v = localStorage.getItem(GUIDE_DIRECT_MSGS_KEY);
    return v ? parseInt(v, 10) : 0;
  } catch { return 0; }
}

export function incrementGuideDirectMessages(): number {
  const next = getGuideDirectMessages() + 1;
  try { localStorage.setItem(GUIDE_DIRECT_MSGS_KEY, String(next)); } catch {}
  return next;
}
