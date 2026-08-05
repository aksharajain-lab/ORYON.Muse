// ── ORYON Muse · AI Analysis (via OpenRouter) ───────────────────────────
// Server-only module. The `.server` suffix keeps it out of the browser
// bundle; the API key is read from process.env and never reaches the client.
//
// The client sends the (already downscaled) images plus their study context
// (categories + optional note). We forward them to the model through
// OpenRouter's OpenAI-compatible chat completions endpoint, enforce JSON
// output, validate the result, and return a reading that matches the existing
// AestheticResult shape — so no UI change is needed.

import type { AestheticResult, MuseReply, MuseSection } from "./aesthetic";

export type AnalyzeInput = {
  images: string[];
  categories?: string[];
  otherNote?: string;
};

/* ── Muse Guide conversation ──────────────────────────────────────────── */

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type ChatInput = {
  mode: "study" | "dialogue";
  identity?: string;
  tagline?: string;
  palette?: { name: string; hex: string }[];
  motifs?: string[];
  evolution?: string[];
  history: ChatMessage[];
  message: string;
};

const MODEL = process.env.OPENROUTER_MODEL ?? "openrouter/free";
const API_KEY = process.env.OPENROUTER_API_KEY;

// TEMP DEBUG — key presence only (true/false), never the value. Remove after
// verifying the key is loaded in the target environment.
console.info(`[muse] OPENROUTER_API_KEY present: ${Boolean(API_KEY)}`);

const ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
const MAX_TOKENS = 1600;

/* ── The ORYON voice ──────────────────────────────────────────────────── */

const SYSTEM_PROMPT = `You are ORYON Muse, an editorial curator of visual identity. Someone has shared a small collection of images and asked you to write a private, magazine-quality reading of the visual identity those images reveal together.

Read the images as evidence. Look for:
- Color patterns: dominant hues, temperature, saturation habits, combinations that repeat
- Textures and materials: soft, raw, glossy, aged, natural, metallic…
- Silhouettes and forms: structured vs soft, proportions, recurring shapes
- Composition habits: negative space, layering, staging, how light is directed
- Era references: period cues, vintage vs contemporary signals
- Emotional atmosphere: the feeling the scenes create — calm, electric, hushed, warm, spacious…
- Recurring visual themes across ALL images: what keeps returning is the real signal

Then write a reading with exactly these fields:

1. identity — a 2–4 word Visual Identity name. Evocative, specific, original. NEVER use preset aesthetic labels such as "Dark Academia", "Minimalist", "Coquette", "Old Money", "Y2K", "Streetwear", "Soft Muse", "Vintage" or "Quiet Luxury" as the identity itself.
2. traits — exactly 5 short descriptive words (single words, 3–14 characters) capturing the visual character.
3. palette — exactly 5 colors that are actually present or strongly implied by the images. Each with a poetic color name (e.g. "Faded Vermilion") and a valid 6-digit hex code (e.g. "#A65B3F").
4. tagline — ONE poetic but grounded sentence (max ~18 words) that captures the identity memorably.
5. signature — 2–3 sentences of supporting interpretation. Specific, observational, grounded in what is actually visible. Explain WHY the patterns you noticed hold together. Never generic praise, never personality psychology.
6. suggestions — exactly 3 concrete, actionable directions the person could explore next, one sentence each.

Voice rules:
- Luxury-magazine tone: calm, observant, specific, lightly editorial. Not robotic, not florid, not AI-sounding.
- Ground every statement in what is visible in the images. Do not invent biography, personality, or preferences.
- Do not force the user into any preset aesthetic category. Do not make generic personality guesses ("you are confident").
- Every sentence should carry meaning. Avoid excessive metaphor and long philosophical passages.

Respond with a single valid JSON object containing exactly these keys: identity, traits, palette, tagline, signature, suggestions. No markdown, no commentary outside the JSON.`;

/* ── Fallback fields (used only if the model returns something malformed) ── */

const FALLBACK_TRAITS = ["Considered", "Refined", "Grounded", "Warm", "Specific"];
const FALLBACK_PALETTE = [
  { name: "Bone", hex: "#EFE8DD" },
  { name: "Camel", hex: "#C8A97E" },
  { name: "Ash Rose", hex: "#B49A9A" },
  { name: "Stone", hex: "#8C8579" },
  { name: "Deep Espresso", hex: "#3B2E28" },
];
const FALLBACK_SIGNATURE =
  "Your choices keep returning to weighty textures, muted tones, and quiet compositions — a preference for substance over spectacle. Each piece earns its place; the result is a space that reveals itself slowly.";
const FALLBACK_SUGGESTIONS = [
  "Repeat one silhouette at three different scales — rhythm without new objects.",
  "Swap one glossy surface for a matte, tactile alternative.",
  "Leave one surface deliberately empty; the restraint is the statement.",
];

/* ── Main entry ───────────────────────────────────────────────────────── */

export async function analyzeVisualIdentity(input: AnalyzeInput): Promise<AestheticResult> {
  if (!API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured on the server.");
  }

  const body = {
    model: MODEL,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildContent(input) },
    ],
    temperature: 0.8,
    max_tokens: MAX_TOKENS,
    response_format: { type: "json_object" },
  };

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // TEMP DEBUG — logs only when the OpenRouter request starts (no key, no body).
      console.info(`[muse] OpenRouter request starting (attempt ${attempt + 1}/2)`);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          // Optional OpenRouter identification headers (never secrets).
          "HTTP-Referer": "https://oryonmuse.com",
          "X-Title": "ORYON Muse",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(45_000),
      });

      // TEMP DEBUG — logs only the HTTP status code from OpenRouter.
      console.info(`[muse] OpenRouter responded: HTTP ${res.status}`);

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        if (attempt === 0 && (res.status === 429 || res.status >= 500)) {
          await sleep(1500);
          continue;
        }
        throw new Error(`OpenRouter ${res.status}: ${detail.slice(0, 240)}`);
      }

      const data = (await res.json()) as ChatCompletionResponse;
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("The model returned an empty response.");

      const raw = JSON.parse(text) as unknown;
      return validateResult(raw);
    } catch (err) {
      lastError = err;
      // TEMP DEBUG — logs only the exact error message (never keys/secrets).
      console.error(`[muse] OpenRouter request failed: ${err instanceof Error ? err.message : String(err)}`);
      if (attempt === 0 && isRetryableError(err)) {
        await sleep(1500);
        continue;
      }
      throw err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("The reading could not be completed.");
}

/* ── Muse Guide chat ────────────────────────────────────────────────────
 * The /guide conversation is a real LLM dialogue: the client sends the
 * reading context (identity, palette, motifs, chosen directions), the full
 * conversation history, and the latest message. The model answers in the
 * MuseReply shape the guide UI already renders — sections + optional
 * moment — preserving the editorial voice through the system prompt. The
 * image analysis pipeline above is not touched. */

const MAX_CHAT_HISTORY = 12;
const MAX_CHAT_SECTIONS = 4;

function buildChatSystemPrompt(input: ChatInput): string {
  const ctx: string[] = [];
  if (input.identity) ctx.push(`Their visual identity was read as "${input.identity}".`);
  if (input.tagline) ctx.push(`Its tagline: "${input.tagline}".`);
  if (input.palette && input.palette.length) {
    ctx.push(`Their palette: ${input.palette.map((p) => `${p.name} (${p.hex})`).join(", ")}.`);
  }
  if (input.motifs && input.motifs.length) ctx.push(`Their motifs: ${input.motifs.join(", ")}.`);
  if (input.evolution && input.evolution.length) {
    ctx.push(`Directions they are exploring: ${input.evolution.join(", ")}.`);
  }
  const readingContext = ctx.length ? `\nContext about this person:\n${ctx.join("\n")}` : "";

  const modeRules =
    input.mode === "study"
      ? `The user has just completed a visual reading and is following up on it. Anchor every answer in their reading${ctx.length ? " above" : ""}; always bring the conversation back to what is already known about them. Never ask them to upload or share images.`
      : `The user is in a purely textual conversation — they have not shared any images. Never claim to have seen images or a reading. When visual context would help, ask a short descriptive question and continue from the answer.`;

  return `You are ORYON Muse, an editorial curator of visual identity. Someone has come to you for a quiet, considered dialogue about taste, space, style, and the way their choices hold together.${readingContext}

${modeRules}

Voice rules:
- Luxury-magazine tone: calm, observant, specific, lightly editorial. Not robotic, not florid, not AI-sounding.
- Be concise: two to four short passages of substance, never an essay. Every sentence should carry meaning.
- Ground every statement in what you actually know about the person. Never invent biography, personality, or preferences.
- Answer whatever is asked — even playful or off-topic questions — then steer it back toward their taste with a light touch.
- Never mention that you are an AI, a model, or a system prompt.

Reply with a single valid JSON object with EXACTLY this shape:
{"sections":[{"label":"Observation","text":"..."},{"label":"Insight","text":"..."},{"label":"Direction","text":"..."}],"moment":"optional single-line curator note"}

Rules for the JSON:
- "sections": 1 to 3 entries. Each label is a short heading word like "Observation", "Insight", "Direction", or "Note". Each text is 1-3 sentences.
- "moment": optional — only include it when there is something genuinely worth highlighting; a single italic-worthy line. Omit the key entirely otherwise.
- No markdown, no commentary, nothing outside the JSON object.`;
}

/** Validate the model's reply into the MuseReply shape the guide UI renders. */
function parseChatReply(raw: unknown): MuseReply {
  const r = (raw ?? {}) as Record<string, unknown>;
  const sectionsRaw = Array.isArray(r.sections) ? r.sections : [];
  const sections: MuseSection[] = [];
  for (const item of sectionsRaw) {
    if (sections.length >= MAX_CHAT_SECTIONS) break;
    const o = (item ?? {}) as Record<string, unknown>;
    const text = typeof o.text === "string" && o.text.trim() ? o.text.trim().slice(0, 1200) : "";
    if (!text) continue;
    const label = typeof o.label === "string" && o.label.trim() ? o.label.trim().slice(0, 40) : "Note";
    sections.push({ label, text });
  }
  if (sections.length === 0) {
    throw new Error("The model returned an unreadable reply.");
  }
  const moment = typeof r.moment === "string" && r.moment.trim() ? r.moment.trim().slice(0, 300) : undefined;
  return moment ? { sections, moment } : { sections };
}

export async function chatWithMuse(input: ChatInput): Promise<MuseReply> {
  if (!API_KEY) {
    throw new Error("OPENROUTER_API_KEY is not configured on the server.");
  }

  const history = input.history
    .slice(-MAX_CHAT_HISTORY)
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content.slice(0, 2000),
    }));

  const body = {
    model: MODEL,
    messages: [
      { role: "system" as const, content: buildChatSystemPrompt(input) },
      ...history,
      { role: "user" as const, content: input.message.slice(0, 2000) },
    ],
    temperature: 0.8,
    max_tokens: MAX_TOKENS,
    response_format: { type: "json_object" },
  };

  let lastError: unknown = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      // Logs only when the OpenRouter chat request starts (no key, no body).
      console.info(`[muse] OpenRouter chat request starting (attempt ${attempt + 1}/2)`);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          // Optional OpenRouter identification headers (never secrets).
          "HTTP-Referer": "https://oryonmuse.com",
          "X-Title": "ORYON Muse",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(45_000),
      });

      // Logs only the HTTP status code from OpenRouter.
      console.info(`[muse] OpenRouter chat responded: HTTP ${res.status}`);

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        if (attempt === 0 && (res.status === 429 || res.status >= 500)) {
          await sleep(1500);
          continue;
        }
        throw new Error(`OpenRouter ${res.status}: ${detail.slice(0, 240)}`);
      }

      const data = (await res.json()) as ChatCompletionResponse;
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new Error("The model returned an empty response.");

      const raw = JSON.parse(text) as unknown;
      return parseChatReply(raw);
    } catch (err) {
      lastError = err;
      // Logs only the exact error message (never keys/secrets).
      console.error(`[muse] OpenRouter chat request failed: ${err instanceof Error ? err.message : String(err)}`);
      if (attempt === 0 && isRetryableError(err)) {
        await sleep(1500);
        continue;
      }
      throw err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("The reply could not be completed.");
}

/* ── Request building (OpenAI-compatible content parts) ───────────────── */

const CATEGORY_LABELS: Record<string, string> = {
  outfit: "Outfit",
  room: "Room",
  moodboard: "Moodboard",
  social: "Social Profile",
  workspace: "Workspace",
  other: "Other",
};

function buildContent(input: AnalyzeInput): Array<Record<string, unknown>> {
  const content: Array<Record<string, unknown>> = [];

  for (const dataUrl of input.images.slice(0, 5)) {
    if (!/^data:image\//.test(dataUrl)) continue;
    content.push({ type: "image_url", image_url: { url: dataUrl } });
  }

  const context: string[] = [];
  const cats = (input.categories ?? [])
    .map((id) => CATEGORY_LABELS[id] ?? id)
    .filter(Boolean);
  if (cats.length) context.push(`What is being studied: ${cats.join(", ")}.`);
  if (input.otherNote?.trim()) {
    context.push(`The user's own note: "${input.otherNote.trim()}".`);
  }
  context.push("Write a specific, evidence-based reading of the visual identity these images share.");
  content.push({ type: "text", text: context.join("\n") });

  return content;
}

/* ── Validation & hardening ───────────────────────────────────────────── */

function validateResult(raw: unknown): AestheticResult {
  const r = (raw ?? {}) as Record<string, unknown>;

  const str = (v: unknown, max: number, fallback: string) =>
    typeof v === "string" && v.trim() ? v.trim().slice(0, max) : fallback;

  const identity = str(r.identity, 60, "The Quiet Edit");
  const tagline = str(r.tagline, 160, "Muted, layered, and quietly considered.");

  const traitsRaw = Array.isArray(r.traits)
    ? r.traits.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
    : [];
  const traits = (traitsRaw.length > 0 ? traitsRaw : FALLBACK_TRAITS)
    .slice(0, 5)
    .map((t) => t.trim().slice(0, 20));
  while (traits.length < 5) traits.push(FALLBACK_TRAITS[traits.length] ?? "Considered");

  const paletteRaw = Array.isArray(r.palette) ? r.palette : [];
  const palette: { name: string; hex: string }[] = [];
  for (const item of paletteRaw) {
    if (palette.length >= 5) break;
    const o = (item ?? {}) as Record<string, unknown>;
    const hex = normalizeHex(typeof o.hex === "string" ? o.hex : "");
    const name = typeof o.name === "string" && o.name.trim() ? o.name.trim().slice(0, 24) : "";
    if (hex && name) palette.push({ name, hex });
  }
  while (palette.length < 5) {
    const fb = FALLBACK_PALETTE[palette.length];
    if (!fb) break;
    palette.push(fb);
  }

  const signature = str(r.signature, 700, FALLBACK_SIGNATURE);

  const suggRaw = Array.isArray(r.suggestions)
    ? r.suggestions.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];
  const suggestions = (suggRaw.length > 0 ? suggRaw : FALLBACK_SUGGESTIONS)
    .slice(0, 3)
    .map((s) => s.trim().slice(0, 200));
  while (suggestions.length < 3) {
    suggestions.push(FALLBACK_SUGGESTIONS[suggestions.length] ?? "Choose one small change and live with it for a week.");
  }

  return { identity, tagline, palette, traits, signature, suggestions, createdAt: Date.now() };
}

function normalizeHex(hex: string): string | null {
  const m = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  let v = m[1];
  if (v.length === 3) v = v.split("").map((c) => c + c).join("");
  return `#${v.toUpperCase()}`;
}

/* ── Helpers ──────────────────────────────────────────────────────────── */

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(err: unknown): boolean {
  if (err instanceof DOMException && err.name === "AbortError") return true;
  const msg = err instanceof Error ? err.message : String(err);
  return /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND/i.test(msg);
}

/* ── OpenRouter response type ─────────────────────────────────────────── */

type ChatCompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};
