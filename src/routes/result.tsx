import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useCallback, useEffect, useState } from "react";
import { loadResult, saveEvolution, loadEvolution, EVOLVE_DIRECTIONS, setAnalysisUsed, type AestheticResult } from "@/lib/aesthetic";
import { ArrowRight, Download, MessageCircle, Share2, Camera, Check, Compass } from "lucide-react";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Your Aesthetic DNA — ORYON Muse" },
      { name: "description", content: "A private editorial reading of your aesthetic — palette, traits, and signature." },
      { property: "og:title", content: "Your Aesthetic DNA — ORYON Muse" },
      { property: "og:description", content: "Discover the aesthetic you already have. Personal palette, traits, and editorial guidance from a single image." },
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
    const text = `My Aesthetic DNA: ${r.identity} — ${r.tagline}\n\nDiscover yours at ORYON Muse.`;
    try {
      if (navigator.share) await navigator.share({ title: `ORYON Muse — ${r.identity}`, text });
      else { await navigator.clipboard.writeText(text); alert("Copied to clipboard."); }
    } catch {}
  };

  if (!r) return <Shell><div className="p-10 text-center text-muted-foreground">Preparing your reading…</div></Shell>;

  return (
    <Shell>
      <section className="mx-auto max-w-5xl px-5 pt-8 pb-24 sm:pt-12">

        {/* ── Masthead ── */}
        <div className="animate-fade-up flex items-end justify-between gap-4 pb-4">
          <div>
            <h1 className="text-serif text-[2rem] leading-none tracking-[0.08em] text-foreground/85 sm:text-[2.5rem]">
              ORYON <span className="italic font-light text-foreground/45">Muse</span>
            </h1>
            <p className="mt-1 text-[8px] uppercase tracking-[0.45em] text-muted-foreground">
              Volume 01 · Aesthetic Reading
            </p>
          </div>
          <span className="hidden text-[8px] uppercase tracking-[0.4em] text-muted-foreground sm:inline">
            {r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : ""}
          </span>
        </div>

        {/* ── The Editorial Card ── */}
        <article className="animate-reveal relative overflow-hidden rounded-[1.5rem] border border-border/30 shadow-luxe sm:rounded-[2rem]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.012] mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "96px 96px" }}
          />
          <div className="relative grid sm:grid-cols-[1.1fr_0.9fr]">
            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[460px]">
              {r.imageDataUrl ? (
                <>
                  <img
                    src={r.imageDataUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition duration-1000 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
                </>
              ) : (
                <div className="absolute inset-0 bg-aurora" />
              )}
              <div className="absolute left-4 top-4">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-background/20 bg-background/60 px-2.5 py-1 text-[8px] uppercase tracking-[0.35em] text-foreground/50 backdrop-blur-sm">
                  <Camera className="h-2.5 w-2.5" /> Visual offering
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1 sm:hidden">
                {r.palette.map((p, i) => (
                  <span
                    key={p.hex}
                    className="animate-swatch-in inline-flex items-center gap-1 rounded-full border border-background/20 bg-background/70 px-2 py-0.5 text-[8px] uppercase tracking-[0.15em] text-foreground/60 backdrop-blur-sm"
                    style={{ animationDelay: `${0.3 + i * 0.08}s` }}
                  >
                    <span className="h-2 w-2 rounded-full border border-white/20" style={{ background: p.hex }} />
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-14">
              <p className="animate-fade-up text-[8px] uppercase tracking-[0.4em] text-muted-foreground">
                Your Aesthetic Identity
              </p>
              <h2 className="animate-fade-up delay-100 mt-4 text-serif text-[2.8rem] leading-[0.95] tracking-tight text-foreground sm:text-[3.8rem] lg:text-[4.2rem]">
                {r.identity}
              </h2>
              <p className="animate-fade-up delay-200 mt-4 max-w-md text-serif text-lg leading-relaxed italic text-foreground/65">
                "{r.tagline}"
              </p>
              <div className="animate-fade-up delay-300 mt-8 hidden gap-2 sm:flex">
                {r.palette.map((p) => (
                  <div key={p.hex} className="group relative">
                    <span
                      className="block h-8 w-8 cursor-default rounded-full border border-white/20 shadow-soft transition duration-300 hover:scale-110 hover:shadow-luxe"
                      style={{ background: p.hex }}
                    />
                    <span className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[7px] uppercase tracking-[0.25em] text-muted-foreground opacity-0 transition duration-200 group-hover:opacity-100">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="px-6 pb-8 sm:px-10 sm:pb-10">
            <div className="animate-draw-line relative my-7 h-px overflow-hidden bg-gradient-to-r from-border/5 via-border/40 to-border/5" />
            <div className="grid gap-7 sm:grid-cols-2 sm:gap-12">
              <div className="animate-fade-up delay-300">
                <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground">Primary Aesthetic</p>
                <p className="mt-3 text-serif text-xl leading-relaxed text-foreground/80 sm:text-2xl">
                  {r.signature}
                </p>
              </div>
              <div className="animate-fade-up delay-400">
                <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground">Influences</p>
                <p className="mt-3 text-serif text-xl leading-relaxed text-foreground/80 sm:text-2xl">
                  {r.palette.slice(0, 3).map((p) => p.name).join(" · ")}
                </p>
                <div className="mt-3 flex gap-2">
                  {r.palette.slice(0, 3).map((p) => (
                    <span key={p.hex} className="inline-block h-1 flex-1 rounded-full" style={{ background: p.hex }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="animate-draw-line relative my-7 h-px overflow-hidden bg-gradient-to-r from-border/5 via-border/40 to-border/5" />
            <div className="animate-fade-up delay-500">
              <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground">Colour Palette</p>
              <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-4">
                {r.palette.map((p, i) => (
                  <div key={p.hex} className="animate-swatch-in group relative" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                    <div className="h-16 w-full overflow-hidden rounded-lg border border-white/10 shadow-soft transition duration-500 hover:scale-[1.03] sm:h-24" style={{ background: p.hex }}>
                      <div className="h-full w-full bg-gradient-to-b from-white/8 to-transparent" />
                    </div>
                    <p className="mt-1.5 text-center text-[11px] font-medium text-foreground/75 sm:text-sm">{p.name}</p>
                    <p className="text-center text-[7px] uppercase tracking-[0.25em] text-muted-foreground">{p.hex}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-draw-line relative my-7 h-px overflow-hidden bg-gradient-to-r from-border/5 via-border/40 to-border/5" />
            <div className="animate-fade-up delay-600">
              <p className="text-[8px] uppercase tracking-[0.4em] text-muted-foreground">Personality</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.traits.map((t, i) => (
                  <span key={t} className="animate-fade-up inline-flex items-center gap-1.5 rounded-full border border-border/30 px-3.5 py-1.5 text-xs text-foreground/75 transition duration-300 hover:border-foreground/30 hover:text-foreground" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                    <span className="h-0.5 w-0.5 rounded-full bg-foreground/30" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="animate-draw-line relative my-7 h-px overflow-hidden bg-gradient-to-r from-border/5 via-border/40 to-border/5" />
            <div className="animate-fade-up delay-700 text-center">
              <p className="text-[8px] uppercase tracking-[0.5em] text-muted-foreground">
                Interpreted by <span className="italic tracking-[0.25em] text-foreground/50">ORYON Muse</span>
              </p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <span className="h-px w-6 bg-border/30" />
                <span className="h-1 w-1 rotate-45 border border-border/40" />
                <span className="h-px w-6 bg-border/30" />
              </div>
              <p className="mt-4 text-serif text-xl italic text-foreground/50 sm:text-2xl">
                Your visual identity is waiting to be discovered.
              </p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <span className="h-px flex-1 max-w-16 bg-border/15" />
                <Link to="/begin" className="inline-flex items-center gap-2 rounded-full border border-border/40 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-foreground/50 transition duration-300 hover:border-foreground/30 hover:text-foreground">
                  Begin your study <ArrowRight className="h-2.5 w-2.5" />
                </Link>
                <span className="h-px flex-1 max-w-16 bg-border/15" />
              </div>
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

