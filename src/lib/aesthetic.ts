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
    tagline: "You move through the world like light through linen.",
    palette: [
      { name: "Ivory Silk", hex: "#F6EFE6" },
      { name: "Blush Petal", hex: "#E9C7C1" },
      { name: "Lavender Mist", hex: "#C9BEE1" },
      { name: "Powder Blue", hex: "#BFD1E2" },
      { name: "Muted Sage", hex: "#B7C4A9" },
    ],
    traits: ["Intuitive", "Poetic", "Nostalgic", "Considered", "Quietly bold"],
    signature: "Soft textures, filtered daylight, restrained ornamentation and one unexpected antique.",
    suggestions: [
      "Introduce one heirloom object — brass, pearl, or worn silver.",
      "Layer two tonal neutrals before adding any accent color.",
      "Anchor your compositions with a single serif line of type.",
    ],
  },
  {
    identity: "Modern Nostalgic",
    tagline: "A curator of quiet detail and quiet luxury.",
    palette: [
      { name: "Bone", hex: "#EFE8DD" },
      { name: "Camel", hex: "#C8A97E" },
      { name: "Ash Rose", hex: "#B49A9A" },
      { name: "Stone", hex: "#8C8579" },
      { name: "Deep Espresso", hex: "#3B2E28" },
    ],
    traits: ["Refined", "Grounded", "Discerning", "Warm", "Understated"],
    signature: "Weighty textiles, unlacquered brass, and negative space that lets each object breathe.",
    suggestions: [
      "Swap one glossy surface for a matte, tactile one.",
      "Repeat a single silhouette across three scales.",
      "Let one wall stay empty — the composition needs it.",
    ],
  },
  {
    identity: "Dark Academia Muse",
    tagline: "Candlelight, marginalia, and the perfume of old books.",
    palette: [
      { name: "Ink", hex: "#1E1A17" },
      { name: "Oxblood", hex: "#5C1F1F" },
      { name: "Antique Gold", hex: "#B58B45" },
      { name: "Forest", hex: "#2E3B2A" },
      { name: "Parchment", hex: "#D9C9A8" },
    ],
    traits: ["Cerebral", "Devoted", "Mysterious", "Reverent", "Meticulous"],
    signature: "Chiaroscuro lighting, leather-bound spines, and a single glint of tarnished gold.",
    suggestions: [
      "Add one hand-written element — a note, a label, a monogram.",
      "Layer three textures: wool, leather, aged paper.",
      "Reduce your palette to two colors and one metal.",
    ],
  },
];

export function mockAnalyze(imageDataUrl?: string): AestheticResult {
  const pick = IDENTITIES[Math.floor(Math.random() * IDENTITIES.length)];
  return { ...pick, imageDataUrl, createdAt: Date.now() };
}

const KEY = "oryon.result";
export function saveResult(r: AestheticResult) {
  try { localStorage.setItem(KEY, JSON.stringify(r)); } catch {}
}
export function loadResult(): AestheticResult | null {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as AestheticResult) : null;
  } catch { return null; }
}
