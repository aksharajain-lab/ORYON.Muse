import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useRef, useState } from "react";
import { loadResult, type AestheticResult } from "@/lib/aesthetic";
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
  "Which colors flatter my palette?",
  "How do I evolve my style this season?",
  "Suggest a shopping list under $200",
  "What single object would elevate my room?",
];

function reply(input: string, r: AestheticResult | null): string {
  const id = r?.identity ?? "your aesthetic";
  const palette = r?.palette.slice(0, 3).map((p) => p.name).join(", ") ?? "your palette";
  const low = input.toLowerCase();
  if (low.includes("color") || low.includes("colour") || low.includes("palette"))
    return `For a ${id.toLowerCase()}, lean into ${palette}. Add one grounding tone — a deep walnut or ink — so the softness has a spine.`;
  if (low.includes("evolve") || low.includes("season"))
    return `Evolution isn't reinvention. Keep 80% of your instincts; introduce one new texture (raw silk, brushed brass, aged leather) and one new silhouette. Notice which one your eye returns to.`;
  if (low.includes("shop") || low.includes("buy") || low.includes("list"))
    return `A quiet capsule: an unlacquered brass candlestick, a linen throw in bone, a single antique frame, and a slim taper in ${r?.palette[1]?.name ?? "blush"}. Nothing more, for a month.`;
  if (low.includes("room") || low.includes("space"))
    return `Rearrange before you buy. Move your lamp lower. Remove one object from every surface. Then, if the room still asks for something, it will ask specifically.`;
  if (low.includes("outfit") || low.includes("wear"))
    return `Build around one hero texture today. Let the palette stay in ${palette}. Contrast comes from proportion, not color.`;
  return `Tell me what the image made you feel, and I'll translate it into a next step. Your ${id.toLowerCase()} reads best when you stay specific — a room, an occasion, a memory.`;
}

function GuidePage() {
  const [r, setR] = useState<AestheticResult | null>(null);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = loadResult();
    setR(v);
    setMsgs([
      {
        id: "m1",
        role: "muse",
        text: v
          ? `Welcome back. I've been sitting with your reading — ${v.identity}. Where would you like to begin: the palette, a room, or the ritual of getting dressed?`
          : `Welcome. We can begin without an image — tell me the last space or outfit that made you pause, and I'll read from there.`,
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
      setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "muse", text: reply(t, r) }]);
      setTyping(false);
    }, 900 + Math.random() * 700);
  };

  return (
    <Shell>
      <section className="mx-auto flex max-w-3xl flex-col px-5 pt-10 sm:pt-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">The Guide</p>
            <h1 className="mt-2 text-serif text-4xl leading-tight sm:text-5xl">Sit with Muse.</h1>
            <p className="mt-3 max-w-lg text-sm text-muted-foreground">
              A quiet dialogue. No small talk. Ask about palette, ritual, room, wardrobe — anything with an eye behind it.
            </p>
          </div>
          {r && (
            <div className="hidden glass rounded-2xl px-4 py-3 text-right shadow-soft sm:block">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Reading</p>
              <p className="text-serif text-lg">{r.identity}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex min-h-[520px] flex-col overflow-hidden rounded-[2rem] glass shadow-luxe">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 sm:p-8">
            {msgs.map((m) => (
              <div key={m.id} className={`flex ${m.role === "you" ? "justify-end" : "justify-start"}`}>
                {m.role === "muse" && (
                  <div className="mr-3 grid h-9 w-9 flex-none place-items-center rounded-full glass shadow-soft">
                    <span className="text-serif text-base italic">M</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === "you"
                      ? "bg-foreground text-background shadow-luxe"
                      : "text-foreground/90"
                  } ${m.role === "muse" ? "text-serif text-[1.02rem]" : ""}`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center rounded-full glass shadow-soft">
                  <span className="text-serif text-base italic">M</span>
                </div>
                <div className="inline-flex gap-1 rounded-2xl px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60 [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border/60 p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap gap-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs text-foreground/75 transition hover:-translate-y-0.5 hover:text-foreground"
                >
                  <Sparkles className="h-3 w-3" /> {p}
                </button>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-center gap-2 rounded-full glass px-2 py-2 shadow-soft"
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
                className="grid h-10 w-10 flex-none place-items-center rounded-full bg-foreground text-background shadow-luxe transition hover:-translate-y-0.5"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="h-16" />
      </section>
    </Shell>
  );
}
