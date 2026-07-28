import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useState } from "react";
import { loadResult, type AestheticResult } from "@/lib/aesthetic";
import { ArrowRight, Download, MessageCircle, Share2 } from "lucide-react";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "Your Aesthetic DNA — ORYON Muse" },
      { name: "description", content: "A private editorial reading of your aesthetic — palette, traits, and signature." },
      { property: "og:title", content: "Your Aesthetic DNA — ORYON Muse" },
      { property: "og:description", content: "A private editorial reading of your aesthetic — palette, traits, and signature." },
    ],
  }),
  component: ResultPage,
});

function ResultPage() {
  const nav = useNavigate();
  const [r, setR] = useState<AestheticResult | null>(null);

  useEffect(() => {
    const v = loadResult();
    if (!v) nav({ to: "/upload" });
    else setR(v);
  }, [nav]);

  if (!r) return <Shell><div className="p-10 text-center text-muted-foreground">Preparing your reading…</div></Shell>;

  const share = async () => {
    const text = `My Aesthetic DNA: ${r.identity} — ${r.tagline}`;
    try {
      if (navigator.share) await navigator.share({ title: "ORYON Muse", text });
      else { await navigator.clipboard.writeText(text); alert("Copied to clipboard."); }
    } catch {}
  };

  return (
    <Shell>
      <section className="mx-auto max-w-4xl px-5 pt-10 sm:pt-16">
        <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Volume 01 · Your reading</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <h1 className="text-serif text-4xl leading-tight sm:text-6xl">Aesthetic DNA</h1>
          <span className="hidden text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:inline">
            {new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
          </span>
        </div>

        {/* Editorial hero card */}
        <article className="mt-8 overflow-hidden rounded-[2rem] glass shadow-luxe">
          <div className="relative grid gap-0 sm:grid-cols-[1.05fr_1fr]">
            <div className="relative min-h-[280px] bg-hero sm:min-h-[420px]">
              {r.imageDataUrl ? (
                <img src={r.imageDataUrl} alt="Your offering" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-aurora" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/10 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                {r.palette.map((p) => (
                  <span key={p.hex} className="glass flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] shadow-soft">
                    <span className="h-3.5 w-3.5 rounded-full border border-white/40" style={{ background: p.hex }} />
                    {p.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Identity</p>
              <h2 className="mt-2 text-serif text-4xl leading-tight sm:text-5xl">{r.identity}</h2>
              <p className="mt-4 text-serif text-lg italic text-foreground/80">"{r.tagline}"</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {r.traits.map((t) => (
                  <span key={t} className="rounded-full border border-border/70 px-3 py-1 text-xs text-foreground/80">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <button onClick={share} className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-xs font-medium text-background shadow-luxe">
                  <Share2 className="h-3.5 w-3.5" /> Share card
                </button>
                <button onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full glass px-4 py-2.5 text-xs text-foreground/80 shadow-soft">
                  <Download className="h-3.5 w-3.5" /> Save
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* Palette */}
        <section className="mt-10 grid gap-4 sm:grid-cols-5">
          {r.palette.map((p) => (
            <div key={p.hex} className="glass rounded-2xl p-3 shadow-soft">
              <div className="h-24 w-full rounded-xl border border-white/30" style={{ background: p.hex }} />
              <div className="mt-3">
                <p className="text-serif text-base">{p.name}</p>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{p.hex}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Signature + Suggestions */}
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="glass rounded-3xl p-6 shadow-soft sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Visual signature</p>
            <p className="mt-4 text-serif text-2xl leading-snug">{r.signature}</p>
          </div>
          <div className="glass rounded-3xl p-6 shadow-soft sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Ways to evolve</p>
            <ul className="mt-4 space-y-3">
              {r.suggestions.map((s, i) => (
                <li key={s} className="flex gap-3">
                  <span className="mt-1 text-serif text-sm italic text-muted-foreground">0{i + 1}</span>
                  <span className="text-sm leading-relaxed text-foreground/85">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 pb-16">
          <Link to="/upload" className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm shadow-soft">
            Try another image
          </Link>
          <Link to="/guide" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-luxe transition hover:-translate-y-0.5">
            <MessageCircle className="h-4 w-4" /> Continue with your guide
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </Shell>
  );
}
