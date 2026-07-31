import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useCallback, useEffect, useState } from "react";
import { loadResult, saveEvolution, loadEvolution, EVOLVE_DIRECTIONS, setAnalysisUsed, type AestheticResult } from "@/lib/aesthetic";
import { ArrowRight, Download, Share2, Check, Compass } from "lucide-react";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Your Visual Identity — ORYON Muse" },
      { name: "description", content: "A private editorial reading of your visual identity — palette, traits, and signature." },
      { property: "og:title", content: "Your Visual Identity — ORYON Muse" },
      { property: "og:description", content: "Discover the visual identity you already have. Palette, traits, and editorial guidance from a single image." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const nav = useNavigate();
  const [r, setR] = useState<AestheticResult | null>(null);
  const [evoSelected, setEvoSelected] = useState<string[]>([]);

  // NOTE: every hook must be declared before any conditional return —
  // calling hooks after an early return crashes React ("Rendered more
  // hooks than during the previous render") and was the production bug.
  useEffect(() => {
    const v = loadResult();
    if (!v) nav({ to: "/upload" });
    else {
      setR(v);
      setAnalysisUsed();
    }
  }, [nav]);

  useEffect(() => {
    setEvoSelected(loadEvolution());
  }, []);

  const toggleEvo = useCallback((id: string) => {
    setEvoSelected((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev;
      saveEvolution(next);
      return next;
    });
  }, []);

  const share = async () => {
    if (!r) return;
    const text = `My Visual Identity: ${r.identity} — ${r.tagline}\n\nDiscover yours at ORYON Muse.`;
    try {
      if (navigator.share) await navigator.share({ title: `ORYON Muse — ${r.identity}`, text });
      else { await navigator.clipboard.writeText(text); alert("Copied to clipboard."); }
    } catch {}
  };

  // A single supporting line drawn from the reading — the card stays scannable.
  const supporting =
    r && r.signature
      ? (r.signature.split(/(?<=[.!?])\s+/)[0] ?? r.signature)
      : "";

  if (!r) return <Shell><div className="p-10 text-center text-muted-foreground">Preparing your reading…</div></Shell>;

  return (
    <Shell>
      <section className="mx-auto max-w-5xl px-5 pt-8 pb-24 sm:pt-12">

        {/* ── The Share Card ── */}
        <article className="animate-reveal relative overflow-hidden rounded-[1.5rem] border border-border/30 shadow-luxe sm:rounded-[2rem]">
          {/* Grain texture */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.012] mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "96px 96px" }}
          />

          {/* Background layer — the user's image, muted and softened, never a separate card */}
          {r.imageDataUrl ? (
            <>
              <img
                src={r.imageDataUrl}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "saturate(0.62) brightness(0.99) contrast(0.9)" }}
              />
              <div className="absolute inset-0 bg-background/70" />
              <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/85" />
            </>
          ) : (
            <div className="absolute inset-0 bg-aurora" />
          )}

          <div className="relative flex min-h-[560px] flex-col justify-between px-6 py-7 sm:min-h-[640px] sm:px-10 sm:py-9">
            {/* Masthead */}
            <div className="animate-fade-up flex items-baseline justify-between gap-4 border-b border-border/20 pb-4">
              <p className="text-[10px] uppercase tracking-[0.5em] text-foreground/75">
                ORYON <span className="italic font-light text-foreground/50">Muse</span>
              </p>
              <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
                  : "Vol. 01 · Visual Identity"}
              </p>
            </div>

            {/* Asymmetric composition — identity left, palette right */}
            <div className="grid gap-10 py-8 sm:grid-cols-[1.25fr_0.75fr] sm:items-end">
              <div className="max-w-xl">
                <p className="animate-fade-up text-[9px] uppercase tracking-[0.55em] text-muted-foreground">
                  Your Visual Identity
                </p>
                <h2 className="animate-fade-up delay-100 mt-4 text-serif text-[2.9rem] leading-[0.95] tracking-tight text-foreground sm:text-[4.2rem]">
                  {r.identity}
                </h2>
                <p className="animate-fade-up delay-200 mt-2 text-serif text-lg italic text-foreground/45 sm:text-xl">
                  the {r.identity.split(" ").pop()?.toLowerCase() ?? r.identity}
                </p>

                <p className="animate-fade-up delay-300 mt-6 text-[10px] uppercase tracking-[0.35em] text-foreground/55">
                  {r.traits.slice(0, 3).join("  ·  ")}
                </p>

                <div className="animate-draw-line relative my-6 h-px w-16 overflow-hidden bg-foreground/15" />

                <p className="animate-fade-up delay-400 max-w-md text-serif text-lg leading-relaxed italic text-foreground/75 sm:text-xl">
                  "{r.tagline}"
                </p>
                <p className="animate-fade-up delay-500 mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {supporting}
                </p>
              </div>

              <div className="animate-fade-up delay-500 flex flex-col items-start sm:items-end">
                <p className="text-[8px] uppercase tracking-[0.45em] text-muted-foreground">Palette</p>
                <div className="mt-3 flex -space-x-3 sm:-space-x-4">
                  {r.palette.slice(0, 3).map((p) => (
                    <span
                      key={p.hex}
                      className="inline-block h-14 w-14 rounded-full border-2 border-background shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-luxe sm:h-16 sm:w-16"
                      style={{ background: p.hex }}
                      title={p.name}
                    />
                  ))}
                </div>
                <p className="mt-3 text-[8px] uppercase tracking-[0.3em] text-muted-foreground/70">
                  {r.palette.slice(0, 3).map((p) => p.name).join(" · ")}
                </p>
              </div>
            </div>

            {/* Bottom center — invitation + branding */}
            <div className="animate-fade-up delay-600 flex flex-col items-center gap-2.5 border-t border-border/20 pt-5">
              <p className="text-serif text-lg italic text-foreground/60 sm:text-xl">
                Discover your own visual identity.
              </p>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-border/30" />
                <span className="h-1 w-1 rotate-45 border border-border/40" />
                <span className="h-px w-8 bg-border/30" />
              </div>
              <p className="text-[8px] uppercase tracking-[0.45em] text-muted-foreground">
                Interpreted by ORYON Muse
              </p>
            </div>
          </div>
        </article>

        {/* ── Aesthetic Evolution ── */}
        <section className="animate-fade-up delay-[900ms] mt-14">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[0.45em] text-muted-foreground">
                <Compass className="mr-1.5 inline h-3 w-3" />
                Step 03 · Evolution
              </p>
              <h2 className="mt-3 text-serif text-3xl leading-tight sm:text-4xl">
                Where would you like your aesthetic to evolve?
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Select up to three directions that resonate with where you'd like to grow. Your guide will consider both your current identity and your chosen path.
              </p>
            </div>
            <span className="hidden text-[8px] uppercase tracking-[0.35em] text-muted-foreground/70 sm:inline">
              {evoSelected.length}/3 selected
            </span>
          </div>

          <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {EVOLVE_DIRECTIONS.map((d, i) => {
              const active = evoSelected.includes(d.id);
              return (
                <button
                  key={d.id}
                  onClick={() => toggleEvo(d.id)}
                  className={`animate-fade-up group relative rounded-xl border p-4 text-left transition ${
                    active
                      ? "border-foreground/30 bg-foreground/[0.03]"
                      : "border-border/30 hover:border-foreground/20"
                  }`}
                  style={{ animationDelay: `${0.3 + i * 0.06}s` }}
                >
                  {/* Accent bar */}
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-0.5 rounded-full transition-opacity ${
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
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-border/20 pt-4">
            <p className="text-xs text-muted-foreground">
              {evoSelected.length === 0
                ? "Your guide will focus on your current identity until you choose."
                : `${evoSelected.length} direction${evoSelected.length !== 1 ? "s" : ""} selected — your guide will consider these influences.`}
            </p>
            <Link
              to="/guide"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-luxe transition duration-300 hover:-translate-y-0.5"
            >
              Continue with your guide
              <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* ── Action Bar ── */}
        <div className="animate-fade-up delay-[1100ms] mt-8 flex flex-wrap items-center justify-center gap-2.5 border-t border-border/15 pt-6">
          <button
            onClick={share}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-luxe transition duration-300 hover:-translate-y-0.5"
          >
            <Share2 className="h-3.5 w-3.5 transition duration-300 group-hover:scale-110" />
            Share this reading
          </button>
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center gap-2 rounded-full border border-border/30 px-4 py-2.5 text-sm text-foreground/60 transition duration-300 hover:-translate-y-0.5 hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5 transition duration-300 group-hover:translate-y-0.5" />
            Save
          </button>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-full border border-border/30 px-4 py-2.5 text-sm text-foreground/50 transition duration-300 hover:-translate-y-0.5 hover:text-foreground"
          >
            Try another image
          </Link>
        </div>

      </section>
    </Shell>
  );
}
