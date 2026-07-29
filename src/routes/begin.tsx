import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useState } from "react";
import { ArrowRight, Home, Shirt, Layout, User, Briefcase, Sparkles, Check } from "lucide-react";

export const Route = createFileRoute("/begin")({
  head: () => ({
    meta: [
      { title: "Begin Your Study — ORYON Muse" },
      { name: "description", content: "Choose the parts of your visual world you'd like Muse to understand — room, outfit, moodboard, and more." },
      { property: "og:title", content: "Begin Your Study — ORYON Muse" },
      { property: "og:description", content: "Choose the parts of your visual world you'd like Muse to understand." },
    ],
  }),
  component: BeginPage,
});

const CATEGORIES = [
  { id: "room", label: "Room", hint: "Where you spend quiet hours", icon: Home },
  { id: "outfit", label: "Outfit", hint: "Something you wore this week", icon: Shirt },
  { id: "moodboard", label: "Moodboard", hint: "A page torn, a screenshot saved", icon: Layout },
  { id: "social", label: "Social Profile", hint: "The grid you've been building", icon: User },
  { id: "workspace", label: "Workspace", hint: "The desk where the ideas land", icon: Briefcase },
  { id: "other", label: "Other", hint: "Something Muse hasn't met yet", icon: Sparkles },
];

function BeginPage() {
  const nav = useNavigate();
  const [selected, setSelected] = useState<string[]>(["room"]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const proceed = () => {
    if (selected.length === 0) return;
    sessionStorage.setItem("oryon.categories", JSON.stringify(selected));
    nav({ to: "/upload" });
  };

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-5 pb-32 pt-10 sm:pt-16">
        <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Step 01 · Study</p>
        <h1 className="mt-3 text-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
          What would you like me to <em className="italic font-light">understand?</em>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Choose one or more parts of your visual world.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = selected.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                aria-pressed={active}
                className={`glass group relative overflow-hidden rounded-2xl p-5 text-left shadow-soft transition ${
                  active ? "ring-2 ring-primary/60 -translate-y-0.5 shadow-luxe" : "hover:-translate-y-0.5"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft">
                    <Icon className="h-4 w-4 text-foreground/80" />
                  </span>
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full border text-[10px] transition ${
                      active
                        ? "border-transparent bg-foreground text-background"
                        : "border-border/70 bg-transparent text-transparent"
                    }`}
                    aria-hidden
                  >
                    <Check className="h-3 w-3" />
                  </span>
                </div>
                <p className="mt-5 text-serif text-2xl leading-none">{c.label}</p>
                <p className="mt-2 text-xs text-muted-foreground">{c.hint}</p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20">
        <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background to-transparent" />
        <div className="relative border-t border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
            <p className="text-xs text-muted-foreground">
              {selected.length === 0
                ? "Select at least one"
                : `${selected.length} selected`}
            </p>
            <button
              onClick={proceed}
              disabled={selected.length === 0}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-luxe transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
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
