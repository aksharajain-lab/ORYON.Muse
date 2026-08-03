import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useState } from "react";
import { Check, Compass, PenLine } from "lucide-react";
import {
  EVOLVE_DIRECTIONS,
  saveEvolution,
  loadEvolution,
  loadEvolutionCustom,
} from "@/lib/aesthetic";

export const Route = createFileRoute("/evolve")({
  head: () => ({
    meta: [
      { title: "Continue Your Evolution — ORYON Muse" },
      { name: "description", content: "Choose the aesthetic worlds you'd like to explore and shape the direction of your visual identity." },
      { property: "og:title", content: "Continue Your Evolution — ORYON Muse" },
      { property: "og:description", content: "Choose the aesthetic worlds you'd like to explore." },
    ],
  }),
  component: EvolvePage,
});

function EvolvePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    setSelected(loadEvolution());
    setCustomText(loadEvolutionCustom().join(", "));
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      saveEvolution(next, parseCustom(customText));
      return next;
    });
  };

  const onCustom = (v: string) => {
    setCustomText(v);
    saveEvolution(selected, parseCustom(v));
  };

  return (
    <Shell>
      <section className="mx-auto max-w-5xl px-5 pb-32 pt-8 sm:pt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
              <Compass className="mr-1.5 inline h-3 w-3" />
              Step 03 · Evolution
            </p>
            <h1 className="mt-3 text-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl">
              Where would you like to <em className="italic font-light">evolve?</em>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Choose the worlds that call to you — as many as you like. They shape the direction
              your visual identity will take from here.
            </p>
          </div>
          <span className="hidden text-[8px] uppercase tracking-[0.35em] text-muted-foreground/70 sm:inline">
            {selected.length} world{selected.length !== 1 ? "s" : ""} chosen
          </span>
        </div>

        {/* Direction cards — 2 columns on mobile, 3 on desktop */}
        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {EVOLVE_DIRECTIONS.map((d, i) => {
            const active = selected.includes(d.id);
            return (
              <button
                key={d.id}
                onClick={() => toggle(d.id)}
                aria-pressed={active}
                className={`animate-fade-up group relative rounded-xl border p-4 text-left transition ${
                  active
                    ? "border-foreground/30 bg-foreground/[0.03] -translate-y-0.5"
                    : "border-border/30 hover:border-foreground/20 hover:-translate-y-0.5"
                }`}
                style={{ animationDelay: `${0.1 + i * 0.04}s` }}
              >
                {/* Accent bar */}
                <span
                  className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full transition-opacity ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                  }`}
                  style={{ background: d.accent }}
                />
                <div className="flex items-start justify-between gap-2 pl-3">
                  <div className="flex-1">
                    <p className="text-serif text-lg leading-none text-foreground/85">{d.name}</p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{d.description}</p>
                  </div>
                  <span
                    className={`grid h-5 w-5 flex-none place-items-center rounded-full border transition ${
                      active
                        ? "border-transparent bg-foreground text-background"
                        : "border-border/40 text-transparent"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5" />
                  </span>
                </div>
              </button>
            );
          })}

          {/* Others — custom direction */}
          <div
            className={`animate-fade-up relative col-span-2 rounded-xl border p-4 transition sm:col-span-3 ${
              selected.includes("other")
                ? "border-foreground/30 bg-foreground/[0.03]"
                : "border-border/30"
            }`}
            style={{ animationDelay: "0.5s" }}
          >
            <button
              onClick={() => toggle("other")}
              aria-pressed={selected.includes("other")}
              className="group flex w-full items-start justify-between gap-2 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-full border border-border/40 text-foreground/60">
                  <PenLine className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-serif text-lg leading-none text-foreground/85">A world of your own</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                    An aesthetic, an inspiration, a feeling not listed here.
                  </p>
                </div>
              </div>
              <span
                className={`grid h-5 w-5 flex-none place-items-center rounded-full border transition ${
                  selected.includes("other")
                    ? "border-transparent bg-foreground text-background"
                    : "border-border/40 text-transparent"
                }`}
              >
                <Check className="h-2.5 w-2.5" />
              </span>
            </button>
            {selected.includes("other") && (
              <div className="mt-3 flex items-center gap-2 border-t border-border/20 pt-3">
                <input
                  value={customText}
                  onChange={(e) => onCustom(e.target.value)}
                  placeholder="Tell Muse what world you want to explore…"
                  className="flex-1 rounded-lg border border-border/30 bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-foreground/30"
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-border/20 pt-4">
          <p className="text-center text-xs text-muted-foreground">
            {selected.length === 0
              ? "Your reading stands as it is — no direction chosen."
              : `Your evolution is recorded — ${selected.length} world${selected.length !== 1 ? "s" : ""} to carry forward.`}
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/result"
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 transition hover:text-foreground/70"
          >
            ← Back to your reading
          </Link>
        </div>
      </section>
    </Shell>
  );
}

function parseCustom(v: string): string[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
