import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import heroSoft from "@/assets/hero-soft.jpg";
import heroDark from "@/assets/hero-dark.jpg";
import { ArrowUpRight, Camera, Palette, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORYON Muse — Discover the aesthetic you already have" },
      { name: "description", content: "Your taste already has a language. ORYON Muse interprets it. Share your style, spaces, and inspirations to uncover your visual identity and evolve it with intention." },
      { property: "og:title", content: "ORYON Muse — Aesthetic Companion" },
      { property: "og:description", content: "Discover the aesthetic you already have. Personal palette, traits, and editorial guidance from a single image." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <Shell>
      {/* ── Hero Section ── */}
      <section className="relative mx-auto max-w-5xl px-5 pt-12 sm:pt-24">
        <div className="grid gap-16 sm:gap-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/40 px-3 py-1 text-[9px] uppercase tracking-[0.35em] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary/70" /> Aesthetic Intelligence
            </span>
            <h1 className="mt-6 text-serif text-[2.75rem] leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
              Discover the aesthetic <em className="font-light italic text-foreground/75">you already have.</em>
            </h1>
            <p className="mt-6 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground sm:text-lg">
              Your taste already has a language. ORYON Muse interprets it. Share your style, spaces, and inspirations
              to uncover your visual identity and evolve it with intention.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/begin"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-luxe transition hover:-translate-y-0.5"
              >
                Begin Your Study
                <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
              </Link>
              <Link
                to="/guide"
                className="inline-flex items-center gap-2 rounded-full border border-border/50 px-5 py-3 text-sm text-foreground/70 transition hover:text-foreground"
              >
                Talk to your guide
              </Link>
            </div>
          </div>

          {/* ── Sample Reading ── */}
          <div className="relative animate-reveal">
            <div className="relative overflow-hidden rounded-[1.5rem] border border-border/30 shadow-luxe sm:rounded-[2rem]">
              <img
                src={heroSoft}
                alt="Editorial soft muse moodboard"
                width={1200}
                height={1600}
                className="block h-[380px] w-full object-cover sm:h-[520px] dark:hidden"
              />
              <img
                src={heroDark}
                alt="Dark academia archival moodboard"
                width={1200}
                height={1600}
                className="hidden h-[380px] w-full object-cover sm:h-[520px] dark:block"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-background/0 to-background/10" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Sample reading</p>
                  <p className="text-serif text-lg text-foreground/85 dark:hidden">Ethereal Romantic</p>
                  <p className="text-serif text-lg text-foreground/85 hidden dark:block">The Quiet Archivist</p>
                </div>
                <div className="flex -space-x-2">
                  {/* Soft Muse palette */}
                  <span className="block h-7 w-7 rounded-full border-2 border-background shadow-soft dark:hidden" style={{ background: "#F6EFE6" }} />
                  <span className="block h-7 w-7 rounded-full border-2 border-background shadow-soft dark:hidden" style={{ background: "#E9C7C1" }} />
                  <span className="block h-7 w-7 rounded-full border-2 border-background shadow-soft dark:hidden" style={{ background: "#C9BEE1" }} />
                  <span className="block h-7 w-7 rounded-full border-2 border-background shadow-soft dark:hidden" style={{ background: "#BFD1E2" }} />
                  {/* Dark Academia palette */}
                  <span className="hidden h-7 w-7 rounded-full border-2 border-background shadow-soft dark:block" style={{ background: "#2D2A24" }} />
                  <span className="hidden h-7 w-7 rounded-full border-2 border-background shadow-soft dark:block" style={{ background: "#5C4033" }} />
                  <span className="hidden h-7 w-7 rounded-full border-2 border-background shadow-soft dark:block" style={{ background: "#B58B45" }} />
                  <span className="hidden h-7 w-7 rounded-full border-2 border-background shadow-soft dark:block" style={{ background: "#2E4A2E" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Method ── */}
      <section className="relative mx-auto mt-32 max-w-5xl px-5 sm:mt-40">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">The Method</p>
            <h2 className="mt-3 text-serif text-3xl sm:text-4xl">Three quiet acts.</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { n: "01", t: "Capture", icon: Camera, d: "An outfit. A room. A moodboard. A fragment of your visual world." },
            { n: "02", t: "Interpret", icon: Palette, d: "Palette, personality, and visual signature — carefully distilled through an editorial lens." },
            { n: "03", t: "Evolve", icon: MessageCircle, d: "Refine your instincts and shape your aesthetic direction with your personal curator." },
          ].map(({ n, t, icon: Icon, d }) => (
            <div
              key={n}
              className="group rounded-xl border border-border/30 p-5 shadow-soft transition hover:border-foreground/20 hover:shadow-luxe"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg border border-border/30 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {n}
                </span>
                <Icon className="h-4 w-4 text-foreground/60 transition group-hover:text-foreground/80" />
              </div>
              <h3 className="mt-5 text-serif text-2xl text-foreground">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Invitation ── */}
      <section className="relative mx-auto mt-24 max-w-5xl px-5 pb-20 sm:mt-28">
        <div className="relative border-t border-border/30 pt-10 sm:pt-14">
          <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">An invitation</p>
          <h2 className="mt-4 max-w-2xl text-serif text-3xl leading-tight sm:text-5xl">
            Your taste is already articulate. Muse simply names it.
          </h2>
          <div className="mt-8">
            <Link
              to="/begin"
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-luxe transition hover:-translate-y-0.5"
            >
              Begin — it takes a moment
              <ArrowUpRight className="h-4 w-4 transition group-hover:rotate-45" />
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
