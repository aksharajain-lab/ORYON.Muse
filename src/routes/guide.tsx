import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useRef, useState } from "react";
import { loadResult, loadEvolution, EVOLVE_DIRECTIONS, type AestheticResult } from "@/lib/aesthetic";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "The Aesthetic Guide — ORYON Muse" },
      { name: "description", content: "A private dialogue with your Aesthetic Guide — refine your palette, your rituals, and your visual signature." },
      { property: "og:title", content: "The Aesthetic Guide — ORYON Muse" },
      { property: "og:description", content: "A private dialogue with your Aesthetic Guide." },
    ],
  }),
  component: GuidePage,
});

type Msg = { id: string; role: "muse" | "you"; text: string };

const PROMPTS = [
  "Tell me about my aesthetic signature",
  "How can I refine my palette?",
  "What should I look for this season?",
  "Suggest one meaningful change",
];

function reply(input: string, r: AestheticResult | null, evo: string[]): string {
  const { identity, palette, traits, signature, suggestions, tagline } = r ?? {};
  const name = identity ?? "your aesthetic";
  const colours = palette?.map((p) => p.name).join(", ") ?? "your palette";
  const evoNames = evo
    .map((id) => EVOLVE_DIRECTIONS.find((d) => d.id === id))
    .filter(Boolean)
    .map((d) => d!.name);
  const evoContext =
    evoNames.length > 0
      ? `I know you are looking to move toward ${evoNames.join(", ")}. `
      : "";
  const low = input.toLowerCase();

  // Deep palette reflection
  if (low.includes("palette") || low.includes("colour") || low.includes("color") || low.includes("shade") || low.includes("tone")) {
    return (
      `Let's sit with your palette for a moment. The colours you gravitate toward — ${colours} — are not coincidental. ` +
      `They speak to a sensibility that ${name.toLowerCase()}s share: a preference for tones that feel lived-in, ` +
      `colours that don't demand attention but earn it over time.\n\n` +
      `Here is what I notice: the conversation between your lightest and darkest tones creates a quiet tension ` +
      `— a narrative arc within your palette. To deepen it, introduce one grounding note: a deep walnut, ` +
      `an inky charcoal, or a burnished bronze. Something that anchors the softness and gives it a spine.`
    );
  }

  // Evolution & seasonal reflection
  if (low.includes("evolve") || low.includes("season") || low.includes("change") || low.includes("refresh") || low.includes("update")) {
    const evoGuidance =
      evoNames.length > 0
        ? `Given that you are drawn toward ${evoNames.join(" and ")}, I would suggest ` +
          `looking for the places where your current ${name.toLowerCase()} sensibility naturally ` +
          `overlaps with those influences. That intersection — where you already are and where you ` +
          `want to go — is the most fertile ground for evolution.\n\n`
        : "";
    return (
      `${evoGuidance}` +
      `Evolution, for a ${name.toLowerCase()}, is never about reinvention — it is about refinement. ` +
      `Keep eighty percent of what your instincts have already chosen for you. That foundation is yours. ` +
      `Then introduce one new texture (raw silk, brushed brass, aged leather) and one unfamiliar silhouette. ` +
      `Place them in your space, wear them, live with them for a week. Notice which one your eye returns to. ` +
      `That return is your answer. The season doesn't demand a new you — it simply asks you to notice what you already are.`
    );
  }

  // Shopping & acquisition
  if (low.includes("shop") || low.includes("buy") || low.includes("list") || low.includes("purchase") || low.includes("acquire")) {
    const accent = palette?.[1]?.name ?? "blush";
    const evoNote =
      evoNames.length > 0
        ? `Given your interest in ${evoNames.join(" and ")}, prioritise pieces that ` +
          `bridge your current ${name.toLowerCase()} sensibility with those influences. ` +
          `The most lasting acquisitions are the ones that speak to both where you are and where you are going.\n\n`
        : "";
    return (
      `${evoNote}` +
      `A considered capsule, curated for your ${name.toLowerCase()} sensibility:\n\n` +
      `• An unlacquered brass object — a candlestick, a small dish — that will patina with your days\n` +
      `• A linen throw in bone or ivory — texture that asks to be touched\n` +
      `• One antique frame, emptiness inside — a composition waiting for the right thing\n` +
      `• A slim taper in ${accent}, to be lit at the same hour each evening\n\n` +
      `Nothing more for a month. Let each piece arrive slowly, and notice how it changes the room before you add another.`
    );
  }

  // Space & room
  if (low.includes("room") || low.includes("space") || low.includes("home") || low.includes("decor")) {
    const evoNote =
      evoNames.length > 0
        ? `As you move toward ${evoNames.join(" and ")}, your space will evolve gradually — ` +
          `not through replacement but through layering. Let one corner of the room reflect the direction you are ` +
          `curious about before committing the entire space.\n\n`
        : "";
    return (
      `${evoNote}` +
      `Before you add anything to the room, remove one thing from every surface. Then step back and see ` +
      `what the space is actually asking for — not what you think it should have. Move your lamp lower. ` +
      `Let one corner remain in deeper shadow. Rearrange before you buy — the same objects in a new ` +
      `conversation can feel like an entirely different room.\n\n` +
      `Your ${name.toLowerCase()} reads best when there is room to breathe. If the space still asks for ` +
      `something after you have cleared it, it will ask specifically — and you will know exactly what.`
    );
  }

  // Wardrobe & outfit
  if (low.includes("outfit") || low.includes("wear") || low.includes("dress") || low.includes("wardrobe") || low.includes("clothes")) {
    return (
      `Build your next outfit around one hero texture — the thing your hand wants to touch first. ` +
      `Let your palette stay within the ${colours} you already own. The contrast you are looking for ` +
      `comes not from a new colour but from proportion: a looser silhouette with a structured one, ` +
      `a soft texture against a precise line.\n\n` +
      `Your ${name.toLowerCase()} wardrobe is at its most compelling when each piece feels like it ` +
      `belongs to the same story, even if the chapters are different seasons.`
    );
  }

  // Identity / signature reflection
  if (low.includes("identity") || low.includes("signature") || low.includes("style") || low.includes("aesthetic") || low.includes("who")) {
    return signature
      ? `Your aesthetic signature, as I read it: ${signature}\n\n` +
        `What draws you to repeat this feeling across different spaces and moments? That repetition ` +
        `is not accident — it is your visual instinct speaking clearly.`
      : `I would need to read an image of yours first. Whenever you are ready, share what feels ` +
        `most true to you right now, and we will begin.`;
  }

  // Suggestion / advice
  if (low.includes("suggest") || low.includes("advice") || low.includes("help") || low.includes("recommend") || low.includes("what should")) {
    if (suggestions && suggestions.length > 0) {
      return (
        `Something to consider: ${suggestions[0]}\n\n` +
        `${suggestions[1] ?? ""}\n\n` +
        `Try one this week. Not all three. The magic is in the singular, intentional act — not in the list.`
      );
    }
    return `Every transformation begins with a single, deliberate choice. Tell me what you are ready to shift — a corner of a room, a morning ritual, a silhouette — and I will meet you there.`;
  }

  // Inspiration & mood
  if (low.includes("inspire") || low.includes("mood") || low.includes("feeling") || low.includes("feel")) {
    return (
      `The most inspiring spaces and outfits are not the most curated ones. They are the ones that ` +
      `feel inhabited — where the patina of use, the slight asymmetry, the object that doesn't quite match ` +
      `tell a story only you could tell.\n\n` +
      `For your ${name.toLowerCase()} sensibility, the richest inspiration often lies in what you already ` +
      `pass by daily but have stopped truly seeing. Look at your space with fresh eyes tonight. ` +
      `Notice which object or corner makes you pause. That pause is your inspiration.`
    );
  }

  // Texture & material
  if (low.includes("texture") || low.includes("material") || low.includes("fabric") || low.includes("surface")) {
    return (
      `Texture is where your ${name.toLowerCase()} sensibility speaks most clearly. You are drawn to ` +
      `surfaces that have a relationship with time — the things that soften, patina, or age gracefully.\n\n` +
      `Consider layering three distinct materials in your next composition: one matte and weighty ` +
      `(wool, stone, raw linen), one with a slight sheen (brass, silk, glazed ceramic), and one ` +
      `with visible history (aged leather, weathered wood, a worn binding). The friction between them ` +
      `creates the atmosphere you are instinctively reaching for.`
    );
  }

  // Fallback — warm, open-ended, sophisticated
  return (
    `${evoContext}` +
    `I would love to help you go deeper into your ${name.toLowerCase()} reading. ` +
    `Tell me what drew you here today — a room you are reimagining, a season you are preparing for, ` +
    `a way of dressing or being that you feel ready to understand more fully. ` +
    `The more specific you are, the more I can offer in return.`
  );
}

function GuidePage() {
  const [r, setR] = useState<AestheticResult | null>(null);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = loadResult();
    const evo = loadEvolution();
    const evoNames = evo
      .map((id) => EVOLVE_DIRECTIONS.find((d) => d.id === id))
      .filter(Boolean)
      .map((d) => d!.name);
    setR(v);
    setMsgs([
      {
        id: "m1",
        role: "muse",
        text: v
          ? evoNames.length > 0
            ? `I have been sitting with your reading — ${v.identity}. And I see you are curious about ${evoNames.join(", ")}. There is something compelling about that combination — the thread that runs from where you are to where you want to go. Shall we explore where those worlds meet?`
            : `I have been sitting with your reading — ${v.identity}. There is a particular quality to the way you see the world, and I would love to explore it with you. Shall we begin with your palette, the spaces you inhabit, or the way you move through your day?`
          : `Good to meet you. We can begin even without an image — tell me about the last space, outfit, or object that stopped you. A detail that held your attention longer than expected. The specific things you notice are where your aesthetic lives.`,
      },
    ]);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "you", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const evo = loadEvolution();
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "muse", text: reply(t, r, evo) }]);
      setTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <Shell>
      <section className="mx-auto flex max-w-3xl flex-col px-5 pt-8 sm:pt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">The Guide</p>
            <h1 className="mt-2 text-serif text-4xl leading-tight sm:text-5xl">Sit with Muse.</h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              A quiet dialogue. No small talk. Ask about palette, ritual, room, wardrobe — anything with an eye behind it.
            </p>
          </div>
          {r && (
            <div className="hidden rounded-xl border border-border/30 px-4 py-3 text-right sm:block">
              <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Reading</p>
              <p className="text-serif text-lg text-foreground/85">{r.identity}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex min-h-[520px] flex-col overflow-hidden rounded-xl border border-border/20 shadow-luxe">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-8">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.role === "you" ? "justify-end" : "justify-start"}`}>
                {m.role === "muse" && (
                  <div className="mr-3 grid h-8 w-8 flex-none place-items-center rounded-full border border-border/30">
                    <span className="text-serif text-sm italic text-foreground/60">M</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "you"
                      ? "bg-foreground text-background shadow-soft"
                      : "border border-border/20 text-foreground/85"
                  } ${m.role === "muse" ? "text-serif text-[1.02rem]" : ""}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full border border-border/30">
                  <span className="text-serif text-sm italic text-foreground/60">M</span>
                </div>
                <div className="inline-flex gap-1 rounded-xl px-4 py-3">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/40" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/40 [animation-delay:150ms]" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/40 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border/20 p-3 sm:p-4">
            <div className="mb-2.5 flex flex-wrap gap-1.5">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/30 px-2.5 py-1 text-[10px] text-foreground/60 transition hover:border-foreground/30 hover:text-foreground"
                >
                  <Sparkles className="h-2.5 w-2.5" /> {p}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 rounded-xl border border-border/30 px-2 py-1.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Muse anything…"
                className="flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                aria-label="Send"
                className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-foreground text-background shadow-soft transition hover:-translate-y-0.5"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>

        <div className="h-16" />
      </section>
    </Shell>
  );
}
