import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useRef, useState } from "react";
import {
  loadResult,
  loadEvolution,
  loadEvolutionCustom,
  loadCategories,
  categoryNames,
  EVOLVE_DIRECTIONS,
  getGuideAnalysisMessages,
  incrementGuideAnalysisMessages,
  getGuideDirectMessages,
  incrementGuideDirectMessages,
  ANALYSIS_FOLLOWUP_LIMIT,
  DIRECT_CHAT_LIMIT,
  studyReply,
  dialogueReply,
  STUDY_PROMPTS,
  DIALOGUE_PROMPTS,
  type AestheticResult,
  type MuseReply,
} from "@/lib/aesthetic";
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

const ANALYSIS_LIMIT_MSG =
  "We've reached the end of this reading's conversation. Everything you've shared has been " +
  "noted and kept in mind. To keep going — with more readings, a saved profile, and a guide " +
  "that remembers you — create your own Muse profile. Until then, sit with what you've learned.";

const DIRECT_LIMIT_MSG =
  "This conversation is wrapping up — I've enjoyed it. To go further, with image readings " +
  "and a guide who remembers your taste, create your own Muse profile. Your aesthetic is " +
  "still forming, and that's the interesting part.";

type Msg = { id: string; role: "muse" | "you"; text?: string; reply?: MuseReply };

function MuseContent({ text, reply }: { text?: string; reply?: MuseReply }) {
  if (reply) {
    return (
      <div className="space-y-2.5">
        {reply.sections.map((s, i) => (
          <div key={s.label} className="animate-msg-in" style={{ animationDelay: `${0.25 + i * 0.14}s` }}>
            <p className="text-[8px] font-sans uppercase tracking-[0.3em] text-muted-foreground/70">
              {s.label}
            </p>
            <p className="mt-1">{s.text}</p>
          </div>
        ))}
        {reply.moment && (
          <div
            className="animate-msg-in relative rounded-lg border border-foreground/10 bg-foreground/[0.04] px-4 py-2.5 pl-8"
            style={{ animationDelay: `${0.25 + reply.sections.length * 0.14}s` }}
          >
            <span className="absolute left-3 top-2.5 text-[10px] text-muse">✦</span>
            <p className="font-serif italic leading-relaxed text-foreground/90">{reply.moment}</p>
          </div>
        )}
      </div>
    );
  }
  return <>{text}</>;
}

function GuidePage() {
  const [r, setR] = useState<AestheticResult | null>(null);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const v = loadResult();
    const evo = loadEvolution();
    const isAnalysis = !!v;
    const savedCount = isAnalysis ? getGuideAnalysisMessages() : getGuideDirectMessages();
    setMsgCount(savedCount);
    if (savedCount >= (isAnalysis ? ANALYSIS_FOLLOWUP_LIMIT : DIRECT_CHAT_LIMIT)) {
      setLimitReached(true);
    }
    const evoNames = [
      ...evo
        .map((id) => EVOLVE_DIRECTIONS.find((d) => d.id === id))
        .filter(Boolean)
        .map((d) => d!.name),
      ...loadEvolutionCustom(),
    ];
    const catNames = categoryNames(loadCategories());
    const studied = catNames.length > 0 ? `, studied through your ${catNames.join(", ")}` : "";
    setR(v);
    const limitMsg = v ? ANALYSIS_LIMIT_MSG : DIRECT_LIMIT_MSG;
    const greeting = v
      ? evoNames.length > 0
        ? `Your reading came back as ${v.identity}${studied}, and you're curious about ${evoNames.join(", ")} — a useful combination: the foundation's there, we're adding to it. Which part feels most like you right now — the colours, the textures, or the atmosphere?`
        : `Your reading came back as ${v.identity}${studied}. There's a lot to work with. Which part feels most like you — the colours, the textures, or the atmosphere?`
      : `Good to meet you. Tell me about the last space, outfit, or object that stopped you. Those details are where your taste actually lives.`;

    const initial: Msg[] = [{ id: "m1", role: "muse", text: greeting }];
    if (savedCount >= (v ? ANALYSIS_FOLLOWUP_LIMIT : DIRECT_CHAT_LIMIT)) {
      initial.push({ id: "limit", role: "muse", text: limitMsg });
    }
    setMsgs(initial);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const isAnalysis = !!r;
  const maxMsgs = isAnalysis ? ANALYSIS_FOLLOWUP_LIMIT : DIRECT_CHAT_LIMIT;
  const limitMsg = isAnalysis ? ANALYSIS_LIMIT_MSG : DIRECT_LIMIT_MSG;
  const prompts = isAnalysis ? STUDY_PROMPTS : DIALOGUE_PROMPTS;

  const send = (text: string) => {
    const t = text.trim();
    if (!t || limitReached) return;

    const newCount = isAnalysis
      ? incrementGuideAnalysisMessages()
      : incrementGuideDirectMessages();
    setMsgCount(newCount);
    if (newCount >= maxMsgs) {
      setLimitReached(true);
    }

    setMsgs((m) => [...m, { id: crypto.randomUUID(), role: "you", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const context = msgs.filter((m) => m.role === "you").map((m) => m.text ?? "");
      const evo = loadEvolution();
      const custom = loadEvolutionCustom();
      const cats = loadCategories();
      const answer = r
        ? studyReply(t, r, evo, custom, cats, [...context, t])
        : dialogueReply(t, evo, custom, cats, [...context, t]);
      const nextMsgs: Msg[] = [{ id: crypto.randomUUID(), role: "muse", reply: answer }];
      if (newCount >= maxMsgs) {
        nextMsgs.push({ id: "limit", role: "muse", text: limitMsg });
      }
      setMsgs((m) => [...m, ...nextMsgs]);
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
              <div key={m.id} className={`animate-msg-in flex ${m.role === "you" ? "justify-end" : "justify-start"}`}>
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
                  <MuseContent text={m.text} reply={m.reply} />
                </div>
              </div>
            ))}
            {typing && (
              <div className="animate-msg-in flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-full border border-border/30">
                  <span className="text-serif text-sm italic text-foreground/60">M</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-border/20 px-4 py-3.5">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/50" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/50 [animation-delay:150ms]" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/50 [animation-delay:300ms]" />
                  <span className="ml-1 text-[8px] uppercase tracking-[0.3em] text-muted-foreground/70">
                    reading
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border/20 p-3 sm:p-4">
            {!limitReached && (
              <div className="mb-2.5 flex flex-wrap gap-1.5">
                {prompts.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border/30 px-2.5 py-1 text-[10px] text-foreground/60 transition hover:border-foreground/30 hover:text-foreground"
                  >
                    <Sparkles className="h-2.5 w-2.5" /> {p}
                  </button>
                ))}
              </div>
            )}
            {limitReached ? (
              <div className="flex flex-col items-center gap-2 py-2">
                <span className="h-px w-12 bg-border/30" />
                <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground/60">
                  {isAnalysis ? "Reading complete" : "Conversation complete"}
                </p>
                <span className="h-px w-12 bg-border/30" />
              </div>
            ) : (
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
            )}
          </div>
        </div>

        <div className="h-16" />
      </section>
    </Shell>
  );
}
