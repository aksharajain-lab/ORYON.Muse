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

/* ── Muse Conversation Modes ────────────────────────────────────────────
 * Two deliberately separate experiences share the /guide route:
 *
 *   MODE 1 · "study"    — Begin your study. Follow-up dialogue to a
 *                         completed image reading. Always anchored to the
 *                         Aesthetic DNA; never requests further images.
 *   MODE 2 · "dialogue" — Talk to your guide. Purely textual. Never
 *                         references images or uploads; when visual
 *                         context would help, it asks descriptive
 *                         questions and continues from the answers.
 * ─────────────────────────────────────────────────────────────────────── */

export type MuseMode = "study" | "dialogue";

export const STUDY_PROMPTS = [
  "Tell me about my aesthetic signature",
  "How can I refine my palette?",
  "What should I look for this season?",
  "Suggest one meaningful change",
];

export const DIALOGUE_PROMPTS = [
  "What colours do I naturally reach for?",
  "What feeling am I trying to create?",
  "Help me reimagine my room",
  "How do I find my signature style?",
];

function evolutionNames(ids: string[]): string[] {
  return ids
    .map((id) => EVOLVE_DIRECTIONS.find((d) => d.id === id))
    .filter((d): d is EvolveDirection => Boolean(d))
    .map((d) => d.name);
}

/** MODE 1 — follow-up conversation anchored to a completed reading. */
export function studyReply(input: string, r: AestheticResult, evo: string[]): string {
  const { identity, palette, signature, suggestions } = r;
  const low = input.toLowerCase();
  const evoNames = evolutionNames(evo);
  const evoContext = evoNames.length
    ? `I know you are looking to move toward ${evoNames.join(", ")}. `
    : "";

  // Palette
  if (low.includes("palette") || low.includes("colour") || low.includes("color") || low.includes("shade") || low.includes("tone")) {
    return (
      `Let's sit with your palette for a moment. The colours in your reading — ${palette.map((p) => p.name).join(", ")} — are not coincidental. ` +
      `They speak to the ${identity.toLowerCase()} sensibility: a preference for tones that feel lived-in, ` +
      `colours that don't demand attention but earn it over time.\n\n` +
      `What I notice in your reading is the conversation between your lightest and darkest tones — a quiet tension, ` +
      `a narrative arc within the palette. To deepen it, introduce one grounding note: a deep walnut, ` +
      `an inky charcoal, or a burnished bronze. Something that anchors the softness and gives it a spine.`
    );
  }

  // Evolution & season
  if (low.includes("evolve") || low.includes("season") || low.includes("change") || low.includes("refresh") || low.includes("update")) {
    const evoGuidance = evoNames.length
      ? `Given that you are drawn toward ${evoNames.join(" and ")}, I would suggest ` +
        `looking for where your current ${identity.toLowerCase()} sensibility naturally ` +
        `overlaps with those influences. That intersection — where you already are and where you ` +
        `want to go — is the most fertile ground for evolution.\n\n`
      : "";
    return (
      `${evoGuidance}` +
      `Evolution, for a ${identity.toLowerCase()}, is never about reinvention — it is about refinement. ` +
      `Keep eighty percent of what your instincts have already chosen for you. That foundation is yours. ` +
      `Then introduce one new texture and one unfamiliar silhouette, and live with them for a week. ` +
      `Notice which one your eye returns to — that return is your answer. The season doesn't demand a new ` +
      `you; it simply asks you to notice what you already are.`
    );
  }

  // Shopping
  if (low.includes("shop") || low.includes("buy") || low.includes("list") || low.includes("purchase") || low.includes("acquire")) {
    const accent = palette[1]?.name ?? "blush";
    const evoNote = evoNames.length
      ? `Given your interest in ${evoNames.join(" and ")}, prioritise pieces that ` +
        `bridge your current ${identity.toLowerCase()} sensibility with those influences. ` +
        `The most lasting acquisitions speak to both where you are and where you are going.\n\n`
      : "";
    return (
      `${evoNote}` +
      `A considered capsule, curated from your reading:\n\n` +
      `• An unlacquered brass object — a candlestick, a small dish — that will patina with your days\n` +
      `• A linen throw in bone or ivory — texture that asks to be touched\n` +
      `• One antique frame, emptiness inside — a composition waiting for the right thing\n` +
      `• A slim taper in ${accent}, lit at the same hour each evening\n\n` +
      `Nothing more for a month. Let each piece arrive slowly, and notice how it changes the room before you add another.`
    );
  }

  // Room & space
  if (low.includes("room") || low.includes("space") || low.includes("home") || low.includes("decor")) {
    const evoNote = evoNames.length
      ? `As you move toward ${evoNames.join(" and ")}, let one corner of the room reflect that direction ` +
        `before you commit the entire space — evolution through layering, not replacement.\n\n`
      : "";
    return (
      `${evoNote}` +
      `Before you add anything to the room, remove one thing from every surface, then step back. ` +
      `Move your lamp lower; let one corner remain in deeper shadow. Rearrange before you buy — ` +
      `the same objects in a new conversation can feel like an entirely different room.\n\n` +
      `Your ${identity.toLowerCase()} reads best when there is room to breathe. Clear the space, and it ` +
      `will ask for exactly what it needs.`
    );
  }

  // Wardrobe
  if (low.includes("outfit") || low.includes("wear") || low.includes("dress") || low.includes("wardrobe") || low.includes("clothes")) {
    return (
      `Build your next outfit around one hero texture — the thing your hand wants to touch first. ` +
      `Stay within the ${palette.map((p) => p.name).join(", ")} your reading already gave you. ` +
      `The contrast you are looking for comes not from a new colour but from proportion: a looser ` +
      `silhouette with a structured one, a soft texture against a precise line.\n\n` +
      `Your ${identity.toLowerCase()} wardrobe is at its most compelling when every piece belongs ` +
      `to the same story, even across different seasons.`
    );
  }

  // Identity / signature
  if (low.includes("identity") || low.includes("signature") || low.includes("style") || low.includes("aesthetic") || low.includes("who")) {
    return (
      `Your aesthetic signature, as I read it: ${signature}\n\n` +
      `What draws you to repeat this feeling across different spaces and moments? That repetition ` +
      `is not accident — it is your visual instinct speaking clearly.`
    );
  }

  // Suggestions
  if (low.includes("suggest") || low.includes("advice") || low.includes("help") || low.includes("recommend") || low.includes("what should")) {
    return (
      `Something to consider: ${suggestions[0]}\n\n` +
      `${suggestions[1] ?? ""}\n\n` +
      `Try one this week. Not all three. The magic is in the singular, intentional act — not in the list.`
    );
  }

  // Inspiration & mood
  if (low.includes("inspire") || low.includes("mood") || low.includes("feeling") || low.includes("feel")) {
    return (
      `The most inspiring spaces and outfits are not the most curated ones; they are the ones that feel ` +
      `inhabited — where patina, slight asymmetry, and the object that doesn't quite match tell a story only you could tell.\n\n` +
      `For your ${identity.toLowerCase()} sensibility, the richest inspiration lies in what you already pass by daily. ` +
      `Look at your space with fresh eyes tonight and notice which object or corner makes you pause. That pause is your inspiration.`
    );
  }

  // Texture & material
  if (low.includes("texture") || low.includes("material") || low.includes("fabric") || low.includes("surface")) {
    return (
      `Texture is where your ${identity.toLowerCase()} sensibility speaks most clearly — surfaces that have ` +
      `a relationship with time, that soften and patina and age gracefully.\n\n` +
      `Layering three distinct materials in your next composition — one matte and weighty, one with a slight ` +
      `sheen, one with visible history — creates the atmosphere you are instinctively reaching for.`
    );
  }

  // Fallback — always anchored to the reading, opens a reflective thread
  return (
    `${evoContext}` +
    `Returning to your reading — ${identity}. Tell me what drew you to explore this today: a room you are ` +
    `reimagining, a season you are preparing for, a way of dressing you feel ready to understand more fully. ` +
    `The more specific you are, the more I can offer in return.`
  );
}

/** MODE 2 — a purely textual editorial conversation. */
export function dialogueReply(input: string, evo: string[], context: string[]): string {
  const low = input.toLowerCase();
  const evoNames = evolutionNames(evo);
  const evoNote = evoNames.length
    ? `I also hear you are curious about ${evoNames.join(", ")} — I will keep that thread with us as we talk. `
    : "";
  const listening = context.length > 0
    ? "I have been listening to what you have described, and a point of view is beginning to take shape. "
    : "";

  // Colour
  if (low.includes("palette") || low.includes("colour") || low.includes("color") || low.includes("shade") || low.includes("tone")) {
    return (
      `Let's find your colours together. Tell me the three shades you reach for most often — in what you wear, ` +
      `in the rooms you love, even in the small objects you keep near you. Once you name them, we can look at ` +
      `what they have in common and build a palette from there.`
    );
  }

  // Room & space
  if (low.includes("room") || low.includes("space") || low.includes("home") || low.includes("decor")) {
    return (
      `Let's reimagine your room. Begin with this: what does it currently miss? Not what you think it should ` +
      `have — what you notice is absent when you stand in the doorway. Describe that feeling of absence, ` +
      `and I will help you answer it.`
    );
  }

  // Wardrobe
  if (low.includes("outfit") || low.includes("wear") || low.includes("dress") || low.includes("wardrobe") || low.includes("clothes")) {
    return (
      `Tell me about the pieces you wear most often — not the occasion pieces, the ones that feel like you ` +
      `without thinking. Once I know what you keep returning to, we can find the thread that runs through all of it.`
    );
  }

  // Feeling & mood
  if (low.includes("feeling") || low.includes("mood") || low.includes("inspire") || low.includes("feel")) {
    return (
      `What feeling are you trying to create? Name the emotion before the object — how you want to feel when ` +
      `you walk into the room or leave the house. When the feeling is clear, the choices almost make themselves.`
    );
  }

  // Evolution & season
  if (low.includes("evolve") || low.includes("season") || low.includes("change") || low.includes("refresh") || low.includes("update")) {
    return (
      `${evoNote}` +
      `Evolution is rarely about replacing everything — it is about noticing what you already reach for and ` +
      `giving it more room. Describe the direction you are curious about: a feeling, a place, a person whose ` +
      `style you admire. Describe it in your own words, and we will begin there.`
    );
  }

  // Shopping
  if (low.includes("shop") || low.includes("buy") || low.includes("list") || low.includes("purchase") || low.includes("acquire")) {
    return (
      `Before you buy anything, answer one question: what gap is this piece filling? If the answer is a feeling — ` +
      `calm, warmth, confidence — that is worth pursuing. If it is only a trend, let it pass. Tell me what you are ` +
      `looking for and what it should do for you, and I will help you choose with intention.`
    );
  }

  // Texture & material
  if (low.includes("texture") || low.includes("material") || low.includes("fabric") || low.includes("surface")) {
    return (
      `Think of the surfaces you love to touch — linen, leather, stone, wool, worn wood. Name the three that make ` +
      `you pause. Layer those three materials together and you will have a composition that feels unmistakably yours.`
    );
  }

  // Identity / signature
  if (low.includes("identity") || low.includes("signature") || low.includes("style") || low.includes("aesthetic") || low.includes("who")) {
    return (
      `Your signature is still being written — that is the beauty of it. Describe the things you return to: a shape, ` +
      `a colour, a ritual, a piece you have owned for years. The pattern among them is your signature, and I can help you read it.`
    );
  }

  // Suggestions
  if (low.includes("suggest") || low.includes("advice") || low.includes("help") || low.includes("recommend") || low.includes("what should")) {
    return (
      `Begin with one deliberate choice this week: a single object to move, a single colour to wear, a single corner ` +
      `to clear. Tell me which of those feels most true to you right now, and I will guide you through it.`
    );
  }

  // Fallback — confident, open-ended, built on what they've shared
  return (
    `${listening}${evoNote}` +
    `Tell me more — a room you are reimagining, the feeling you want to walk into, or the pieces you return to ` +
    `again and again. The more specific you are, the more I can help you shape it.`
  );
}
