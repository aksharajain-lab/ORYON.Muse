import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useState } from "react";
import { ArrowRight, Home, Shirt, Layout, User, Briefcase, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/begin")({
  head: () => ({
    meta: [
      { title: "Begin Your Study — ORYON Muse" },
      { name: "description", content: "Choose the parts of your visual world you'd like Muse to understand — outfit, room, moodboard, and more." },
      { property: "og:title", content: "Begin Your Study — ORYON Muse" },
      { property: "og:description", content: "Choose the parts of your visual world you'd like Muse to understand." },
    ],
  }),
  component: BeginPage,
});

const MAX_SELECTIONS = 3;

const CATEGORIES = [
  { id: "outfit", label: "Outfit", hint: "Something you wore this week", icon: Shirt },
  { id: "room", label: "Room", hint: "Where you spend quiet hours", icon: Home },
  { id: "moodboard", label: "Moodboard", hint: "A page torn, a screenshot saved", icon: Layout },
  { id: "social", label: "Social Profile", hint: "The grid you've been building", icon: User },
  { id: "workspace", label: "Workspace", hint: "The desk where the ideas land", icon: Briefcase },
  { id: "other", label: "Other", hint: "A fragment that fits no shelf", icon: Sparkles },
];

function BeginPage() {
  const nav = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [otherNote, setOtherNote] = useState("");
  const [warn, setWarn] = useState(false);

  const atLimit = selected.length >= MAX_SELECTIONS;
  const otherSelected = selected.includes("other");

  const toggle = (id: string) => {
    setWarn(false);
    setSelected((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      if (s.length >= MAX_SELECTIONS) return s;
      return [...s, id];
    });
  };

  const proceed = () => {
    if (selected.length === 0) {
      setWarn(true);
      return;
    }
    sessionStorage.setItem("oryon.categories", JSON.stringify(selected));
    sessionStorage.setItem("oryon.otherNote", otherSelected ? otherNote.trim() : "");
    nav({ to: "/upload" });
  };

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-5 pb-32 pt-8 sm:pt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Step 01 · Study</p>
            <h1 className="mt-3 text-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              What would you like me to <em className="italic font-light">understand?</em>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground">
              Choose your visual worlds — one, two, or up to three.
            </p>
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Select up to 3</p>
            <p className="mt-1.5 text-serif text-2xl leading-none text-foreground/85">
              {selected.length} <span className="text-lg text-foreground/60">/ {MAX_SELECTIONS}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-2.5 sm:grid-cols-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = selected.includes(c.id);
            const locked = !active && atLimit;
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                aria-pressed={active}
                disabled={locked}
                className={`group relative rounded-xl border p-4 text-left transition-all duration-300 ease-out ${
                  active
                    ? "border-foreground/30 bg-foreground/[0.03] -translate-y-0.5"
                    : locked
                      ? "cursor-not-allowed border-border/25 opacity-40 saturate-[0.85]"
                      : "border-border/40 hover:border-foreground/20 hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className={`grid h-9 w-9 place-items-center rounded-full border text-foreground/60 transition-all duration-300 ${
                    active ? "border-foreground/30 bg-foreground/5" : "border-border/40"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border text-[9px] transition-all duration-300 ease-out ${
                      active
                        ? "scale-100 border-transparent bg-foreground text-background"
                        : "scale-50 border-border/50 text-transparent"
                    }`}
                    aria-hidden
                  >
                    <Check className="h-2.5 w-2.5" />
                  </span>
                </div>
                <p className="mt-4 text-serif text-xl leading-none sm:text-2xl">{c.label}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">{c.hint}</p>
              </button>
            );
          })}
        </div>

        {otherSelected && (
          <div className="animate-fade-up mt-5 rounded-xl border border-border/40 bg-foreground/[0.02] p-4 sm:p-5">
            <label htmlFor="other-note" className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              What are you sharing?
            </label>
            <input
              id="other-note"
              value={otherNote}
              onChange={(e) => setOtherNote(e.target.value)}
              placeholder="Tell Muse what doesn't fit a shelf — a texture, a place, a piece…"
              maxLength={140}
              className="mt-2 w-full bg-transparent font-serif text-lg text-foreground/90 placeholder:text-foreground/35 focus:outline-none sm:text-xl"
            />
            <p className="mt-2 text-[10px] text-muted-foreground/70">
              Muse reads this note alongside your images.
            </p>
          </div>
        )}

        {atLimit && (
          <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
            Three worlds chosen — deselect one to make room for another.
          </p>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20">
        <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent" />
        <div className="relative border-t border-border/30 bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0">
              <p className="text-serif text-base text-foreground/85">
                {selected.length} <span className="text-sm text-foreground/65">/ {MAX_SELECTIONS} selected</span>
              </p>
              {warn ? (
                <p className="animate-fade-up mt-1 text-[11px] italic text-muted-foreground">
                  Choose at least one area for Muse to study.
                </p>
              ) : atLimit ? (
                <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60">
                  Three chosen — deselect one to choose another
                </p>
              ) : null}
            </div>
            <button
              onClick={proceed}
              className="group inline-flex flex-none items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-luxe transition hover:-translate-y-0.5"
            >
              Continue
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
