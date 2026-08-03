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
    tagline: "Soft light, layered texture, and quiet neutrals — you build atmosphere rather than decoration.",
    palette: [
      { name: "Ivory Silk", hex: "#F6EFE6" },
      { name: "Blush Petal", hex: "#E9C7C1" },
      { name: "Lavender Mist", hex: "#C9BEE1" },
      { name: "Powder Blue", hex: "#BFD1E2" },
      { name: "Muted Sage", hex: "#B7C4A9" },
    ],
    traits: ["Intuitive", "Considered", "Nostalgic", "Sensitive", "Quietly confident"],
    signature:
      "Your choices keep coming back to soft light, layered texture, and quiet neutrals. That pattern suggests you prefer atmosphere over display — you're not dressing a room for an audience, you're making it feel comfortable to be in. Because you rarely use strong colour, the few accents you do include carry real weight, and people notice them precisely because everything around them is calm.",
    suggestions: [
      "Introduce one grounding object in a deeper tone — a walnut frame, a brass candlestick — so the soft palette has somewhere to rest against.",
      "Layer two tonal neutrals (ivory over bone, for example) before adding any accent colour. The depth comes from the layering, not the hue.",
      "Put one piece with visible history beside your modern items. The contrast between eras is what keeps the room from feeling one-note.",
    ],
  },
  {
    identity: "Modern Nostalgic",
    tagline: "Weighty textures, muted tones, and pieces with a past — substance over spectacle.",
    palette: [
      { name: "Bone", hex: "#EFE8DD" },
      { name: "Camel", hex: "#C8A97E" },
      { name: "Ash Rose", hex: "#B49A9A" },
      { name: "Stone", hex: "#8C8579" },
      { name: "Deep Espresso", hex: "#3B2E28" },
    ],
    traits: ["Refined", "Grounded", "Discerning", "Warm", "Understated"],
    signature:
      "You're drawn to weighty textures, weathered finishes, and muted tones, which points to a preference for substance over spectacle. Nothing in your composition asks for attention all at once; instead, the room reveals itself piece by piece. That patience — letting each object earn its place — is why your spaces feel settled rather than staged.",
    suggestions: [
      "Swap one glossy surface for a matte, tactile alternative — unlacquered brass, raw linen, honed stone. Your hand will find it before your eye does.",
      "Repeat a single silhouette at three different scales. The repetition creates rhythm without adding anything new.",
      "Leave one wall deliberately empty. Negative space does the work of a purchase, and it costs nothing.",
    ],
  },
  {
    identity: "Dark Academia Muse",
    tagline: "Deep tones, aged materials, and dim, warm light — a space for long, focused evenings.",
    palette: [
      { name: "Ink", hex: "#1E1A17" },
      { name: "Oxblood", hex: "#5C1F1F" },
      { name: "Antique Gold", hex: "#B58B45" },
      { name: "Forest", hex: "#2E3B2A" },
      { name: "Parchment", hex: "#D9C9A8" },
    ],
    traits: ["Cerebral", "Meticulous", "Devoted", "Reserved", "Magnetic"],
    signature:
      "You consistently choose deep tones, aged materials, and warm, low light. That combination suggests you want a space that helps you concentrate rather than perform — the lighting is set for reading, the surfaces for slow, careful work. The effect isn't decorative; it's functional. You're building an environment that rewards attention and punishes distraction.",
    suggestions: [
      "Lower and warm your lighting — a single amber lamp beats overhead light if you want the atmosphere you're clearly after.",
      "Add one handmade or handwritten element — a note in a frame, a label on a drawer. The human mark is what keeps the room from feeling like a set.",
      "Edit each surface down to two colours and one metal. Restraint here is what makes the depth you love actually visible.",
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
    id: "dark-academia",
    name: "Dark Academia",
    description: "Intellectual, vintage, literary, mysterious.",
    accent: "#5C1F1F",
  },
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    description: "Refined, timeless, understated elegance.",
    accent: "#C8A97E",
  },
  {
    id: "old-money",
    name: "Old Money",
    description: "Classic, heritage-inspired, polished.",
    accent: "#2B4C6B",
  },
  {
    id: "y2k-revival",
    name: "Y2K Revival",
    description: "Playful, nostalgic, futuristic — early-2000s inspired.",
    accent: "#C9A0DC",
  },
  {
    id: "coquette",
    name: "Coquette",
    description: "Romantic, delicate, feminine, dreamy.",
    accent: "#E9A8B8",
  },
  {
    id: "streetwear",
    name: "Streetwear",
    description: "Expressive, oversized silhouettes, urban influence.",
    accent: "#4A4A4A",
  },
  {
    id: "soft-muse",
    name: "Soft Muse",
    description: "Dreamy, gentle, pastel, artistic.",
    accent: "#E9C7C1",
  },
  {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean, intentional, calm, refined.",
    accent: "#8A9096",
  },
  {
    id: "vintage",
    name: "Vintage",
    description: "Nostalgic, timeless, collected pieces.",
    accent: "#B58B45",
  },
  {
    id: "other",
    name: "Others",
    description: "A world of your own — tell Muse what you're drawn to.",
    accent: "#7A7A7A",
  },
];

const EVO_KEY = "oryon.evolution";

export function saveEvolution(ids: string[], custom: string[] = []) {
  try { localStorage.setItem(EVO_KEY, JSON.stringify({ ids, custom })); } catch {}
}

export function loadEvolution(): string[] {
  try {
    const v = localStorage.getItem(EVO_KEY);
    if (!v) return [];
    const parsed = JSON.parse(v);
    // Backward compatible with the old plain-array format
    return Array.isArray(parsed) ? parsed : Array.isArray(parsed?.ids) ? parsed.ids : [];
  } catch { return []; }
}

export function loadEvolutionCustom(): string[] {
  try {
    const v = localStorage.getItem(EVO_KEY);
    if (!v) return [];
    const parsed = JSON.parse(v);
    return Array.isArray(parsed?.custom) ? parsed.custom : [];
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
 *
 * Voice: concise, observant, conversational. Replies are structured as
 * Observation → Insight → Direction, with an occasional curator note
 * ("Muse moment") rendered as a highlight. No essays.
 * ─────────────────────────────────────────────────────────────────────── */

export type MuseMode = "study" | "dialogue";

export const STUDY_PROMPTS = [
  "Make this identity more wearable",
  "Build a room around this aesthetic",
  "Find signature pieces",
  "Explore another direction",
  "Refine my visual identity",
];

export const DIALOGUE_PROMPTS = [
  "What colours do I naturally reach for?",
  "What feeling am I trying to create?",
  "Help me reimagine my room",
  "How do I find my signature style?",
];

/** A structured reply — short editorial sections, plus an occasional
 *  highlighted "Muse note". */
export type MuseSection = { label: string; text: string };
export type MuseReply = { sections: MuseSection[]; moment?: string };

const CATEGORY_LABELS: Record<string, string> = {
  outfit: "Outfit",
  room: "Room",
  moodboard: "Moodboard",
  social: "Social Profile",
  workspace: "Workspace",
  other: "Other",
};

/** Optional free-text note describing what the user is sharing, when they chose "Other". */
export function loadOtherNote(): string {
  try {
    return sessionStorage.getItem("oryon.otherNote")?.trim() ?? "";
  } catch {
    return "";
  }
}

/** The categories chosen at the start of the study flow. */
export function loadCategories(): string[] {
  try {
    const v = sessionStorage.getItem("oryon.categories");
    if (!v) return [];
    const parsed = JSON.parse(v);
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch { return []; }
}

export function categoryNames(ids: string[]): string[] {
  return ids.map((id) => CATEGORY_LABELS[id] ?? id);
}

function evolutionNames(ids: string[]): string[] {
  return ids
    .map((id) => EVOLVE_DIRECTIONS.find((d) => d.id === id))
    .filter((d): d is EvolveDirection => Boolean(d))
    .map((d) => d.name);
}

/** MODE 1 — follow-up conversation anchored to a completed reading. */
export function studyReply(
  input: string,
  r: AestheticResult,
  evo: string[] = [],
  custom: string[] = [],
  categories: string[] = [],
  context: string[] = []
): MuseReply {
  const { identity, palette, suggestions } = r;
  const low = input.toLowerCase();
  const evoNames = [...evolutionNames(evo), ...custom];
  const catNames = categoryNames(categories);
  const studied = catNames.length > 0 ? `, studied through your ${catNames.join(", ")}` : "";
  const evoNote = evoNames.length
    ? `You chose ${evoNames.join(", ")} as your direction — it shares your restraint, so this is about adding, not replacing. `
    : `Your base is consistent — the rarest starting point for change. `;

  // Palette
  if (low.includes("palette") || low.includes("colour") || low.includes("color") || low.includes("shade") || low.includes("tone")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Your palette keeps returning to ${palette.slice(0, 3).map((p) => p.name).join(", ")} — muted, warm, unhurried.`,
        },
        {
          label: "Insight",
          text: `That's a repeated choice, not a coincidence. Restraint is exactly why your few accents land so well.`,
        },
        {
          label: "Direction",
          text: `Add one deep anchor — walnut, charcoal, bronze — so the soft tones finally have contrast. Do you repeat these tones in clothes too?`,
        },
      ],
      moment: "The tones you repeat are the tones you trust.",
    };
  }

  // Evolution & direction
  if (low.includes("evolve") || low.includes("season") || low.includes("change") || low.includes("refresh") || low.includes("update") || low.includes("direction") || low.includes("explore")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `You're starting from a consistent base — the rarest starting point for change.`,
        },
        {
          label: "Insight",
          text: evoNote + `One deliberate change reads as evolution; five read as a new persona.`,
        },
        {
          label: "Direction",
          text: `Change one texture or silhouette this week. If your eye keeps returning to it, that's your direction. Where would you start?`,
        },
      ],
    };
  }

  // Signature pieces & shopping
  if (low.includes("shop") || low.includes("buy") || low.includes("list") || low.includes("purchase") || low.includes("acquire") || low.includes("piece")) {
    const accent = palette[1]?.name ?? "blush";
    return {
      sections: [
        {
          label: "Observation",
          text: `The pieces that fit your reading are the ones that age well.`,
        },
        {
          label: "Insight",
          text: `Buy where your current taste and your direction overlap — that's what still works in five years.`,
        },
        {
          label: "Direction",
          text: `A short list:\n• One brass or aged-metal object — it patinas with you\n• A natural-fibre throw in a palette tone\n• One empty antique frame\n• A candle in ${accent} for the evenings\n\nThat's the month. What gap are you really filling?`,
        },
      ],
    };
  }

  // Room & space
  if (low.includes("room") || low.includes("space") || low.includes("home") || low.includes("decor")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Remove one thing from every surface before adding anything.`,
        },
        {
          label: "Insight",
          text: `For your reading, light does more than objects — one low lamp changes the whole room.`,
        },
        {
          label: "Direction",
          text: `Once it's edited down, the room will tell you what it wants. What bothers you most in there?`,
        },
      ],
      moment: "The most honest detail in a room is usually the one you stopped noticing.",
    };
  }

  // Wardrobe & wearability
  if (low.includes("outfit") || low.includes("wear") || low.includes("wearable") || low.includes("dress") || low.includes("wardrobe") || low.includes("clothes")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Repeat your palette — ${palette.slice(0, 3).map((p) => p.name).join(", ")} — and change the proportions instead.`,
        },
        {
          label: "Insight",
          text: `Shape, not colour, creates the contrast you're drawn to: loose against structured, soft against precise.`,
        },
        {
          label: "Direction",
          text: `What do you reach for on a normal morning? That habit is your real style.`,
        },
      ],
    };
  }

  // Identity / signature / refine
  if (low.includes("identity") || low.includes("signature") || low.includes("style") || low.includes("aesthetic") || low.includes("who") || low.includes("refine")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `You keep returning to the same tones, textures, and feeling${studied} — that's your signature, and it's remarkably consistent.`,
        },
        {
          label: "Insight",
          text: `Consistency isn't indecision. It's a preference your eye learned and kept.`,
        },
        {
          label: "Direction",
          text: `To refine it: name one thing you'd remove and one thing you'd add. What's behind the consistency — a place, a person, a period?`,
        },
      ],
      moment: "Consistency across spaces isn't indecision. It's preference.",
    };
  }

  // Suggestions
  if (low.includes("suggest") || low.includes("advice") || low.includes("help") || low.includes("recommend") || low.includes("what should")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Three changes, in order of impact:`,
        },
        {
          label: "Direction",
          text: `• ${suggestions[0]}\n• ${suggestions[1] ?? ""}\n• ${suggestions[2] ?? ""}`,
        },
        {
          label: "Insight",
          text: `Do just one this week — a single change tells you more than a list. Which feels most doable?`,
        },
      ],
    };
  }

  // Inspiration & mood
  if (low.includes("inspire") || low.includes("mood") || low.includes("feeling") || low.includes("feel")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Your best inspiration is already in your saved images and usual spaces — not in magazines.`,
        },
        {
          label: "Insight",
          text: `Whatever makes you pause a second longer is the honest signal of your taste.`,
        },
        {
          label: "Direction",
          text: `What caught your eye most recently?`,
        },
      ],
    };
  }

  // Texture & material
  if (low.includes("texture") || low.includes("material") || low.includes("fabric") || low.includes("surface")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Texture is your most consistent instinct — wool, linen, leather, stone.`,
        },
        {
          label: "Insight",
          text: `Layer three — one weighty, one with sheen, one with history — and depth appears without new objects.`,
        },
        {
          label: "Direction",
          text: `Which materials do you already own and love?`,
        },
      ],
    };
  }

  // Fallback — warm, open-ended, references the reading
  return {
    sections: [
      {
        label: "Observation",
        text: `Let's work with your reading — ${identity}${studied}.`,
      },
      {
        label: "Direction",
        text: `Tell me one real detail: a room you're changing, a season ahead, a piece you keep looking at.`,
      },
    ],
  };
}

/** MODE 2 — a purely textual editorial conversation. */
export function dialogueReply(
  input: string,
  evo: string[] = [],
  custom: string[] = [],
  categories: string[] = [],
  context: string[] = []
): MuseReply {
  const low = input.toLowerCase();
  const evoNames = [...evolutionNames(evo), ...custom];
  const evoNote = evoNames.length ? `You mentioned ${evoNames.join(", ")} — noted, keeping that thread. ` : "";
  const listening = context.length > 0 ? "Thanks for sharing that. " : "";

  // Colour
  if (low.includes("palette") || low.includes("colour") || low.includes("color") || low.includes("shade") || low.includes("tone")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Tell me the three shades you keep gravitating toward — in clothes, rooms, saved photos.`,
        },
        {
          label: "Insight",
          text: `There's a pattern in them; once we see it, your palette becomes a choice, not an accident.`,
        },
        {
          label: "Direction",
          text: `What comes to mind first?`,
        },
      ],
      moment: "The colours you keep saving are a message to yourself.",
    };
  }

  // Room & space
  if (low.includes("room") || low.includes("space") || low.includes("home") || low.includes("decor")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `What does your room currently miss? Not what it *should* have — what's actually absent.`,
        },
        {
          label: "Insight",
          text: `That absence is the real brief.`,
        },
        {
          label: "Direction",
          text: `Tell me about the light, the hour you use it, the one thing that annoys you.`,
        },
      ],
    };
  }

  // Wardrobe
  if (low.includes("outfit") || low.includes("wear") || low.includes("wearable") || low.includes("dress") || low.includes("wardrobe") || low.includes("clothes")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Tell me what you reach for most — not occasion pieces, the automatic ones.`,
        },
        {
          label: "Insight",
          text: `They win for a reason, and that reason is the core of your style.`,
        },
        {
          label: "Direction",
          text: `Describe them and I'll show you the thread.`,
        },
      ],
    };
  }

  // Feeling & mood
  if (low.includes("feeling") || low.includes("mood") || low.includes("inspire") || low.includes("feel")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `How do you want to feel — entering the room, or leaving the house?`,
        },
        {
          label: "Insight",
          text: `Name the feeling first; the choices follow.`,
        },
        {
          label: "Direction",
          text: `What's the feeling you're after?`,
        },
      ],
    };
  }

  // Evolution & season
  if (low.includes("evolve") || low.includes("season") || low.includes("change") || low.includes("refresh") || low.includes("update") || low.includes("direction") || low.includes("explore")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `${listening}${evoNote}Describe the direction in your own words — a feeling, a place, someone whose taste you admire.`,
        },
        {
          label: "Insight",
          text: `A describable direction is actionable; a vague one just makes Pinterest boards.`,
        },
        {
          label: "Direction",
          text: `What does the change actually look like?`,
        },
      ],
    };
  }

  // Shopping
  if (low.includes("shop") || low.includes("buy") || low.includes("list") || low.includes("purchase") || low.includes("acquire") || low.includes("piece")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Before you buy: what is this piece actually for?`,
        },
        {
          label: "Insight",
          text: `A feeling — calm, confidence, warmth — earns the purchase. "I like it" can wait a week.`,
        },
        {
          label: "Direction",
          text: `What are you shopping for?`,
        },
      ],
    };
  }

  // Texture & material
  if (low.includes("texture") || low.includes("material") || low.includes("fabric") || low.includes("surface")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Name three surfaces you're drawn to touch — linen, leather, stone, worn wood.`,
        },
        {
          label: "Insight",
          text: `That trio is usually your whole material vocabulary.`,
        },
        {
          label: "Direction",
          text: `Which three come to mind?`,
        },
      ],
    };
  }

  // Identity / signature
  if (low.includes("identity") || low.includes("signature") || low.includes("style") || low.includes("aesthetic") || low.includes("who")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Your signature is forming — that's the interesting part.`,
        },
        {
          label: "Insight",
          text: `The things you return to — a shape, a colour, a ritual — are the pattern.`,
        },
        {
          label: "Direction",
          text: `What keeps coming back for you?`,
        },
      ],
      moment: "The things you keep returning to are rarely random.",
    };
  }

  // Suggestions
  if (low.includes("suggest") || low.includes("advice") || low.includes("help") || low.includes("recommend") || low.includes("what should")) {
    return {
      sections: [
        {
          label: "Observation",
          text: `Pick one change for this week: one object to move, one colour to wear, one corner to clear.`,
        },
        {
          label: "Insight",
          text: `Do nothing else. Your reaction is the data.`,
        },
        {
          label: "Direction",
          text: `What feels like the most honest first step?`,
        },
      ],
    };
  }

  // Fallback — warm, open-ended, built on what they've shared
  return {
    sections: [
      {
        label: "Observation",
        text: `${listening}${evoNote}I'd love to go deeper.`,
      },
      {
        label: "Direction",
        text: `Tell me about a room you're reimagining, a feeling you want, or a piece you keep coming back to.`,
      },
    ],
  };
}
