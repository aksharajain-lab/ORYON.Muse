import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import heroSoft from "@/assets/hero-soft.jpg";
import heroDark from "@/assets/hero-dark.jpg";
import { ArrowUpRight, Camera, MessageCircle, Palette } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ORYON Muse — Discover the aesthetic you already have" },
      { name: "description", content: "A premium AI aesthetic companion. Upload a photo of your outfit, room, or moodboard and receive your Aesthetic DNA — palette, traits, and editorial guidance." },
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
      <section className="relative mx-auto max-w-5xl px-5 pt-10 sm:pt-16">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.32em] text-muted-foreground shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Aesthetic Intelligence
            </span>
            <h1 className="mt-6 text-serif text-[2.75rem] leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-[4.5rem]">
              Discover the aesthetic <em className="font-light italic text-foreground/80">you already have.</em>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              ORYON Muse is a private atelier for your visual identity. Share an outfit, a room, a moodboard —
              receive a considered read of your palette, your instincts, and the quiet signature you didn't know you had.
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
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm text-foreground/80 shadow-soft transition hover:text-foreground"
              >
                Talk to your guide
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4 sm:max-w-md">
              {[
                ["01", "Analyze"],
                ["02", "Distill"],
                ["03", "Evolve"],
              ].map(([n, l]) => (
                <div key={n} className="glass rounded-2xl px-4 py-3 shadow-soft">
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{n}</dt>
                  <dd className="mt-1 text-serif text-lg text-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative animate-reveal">
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-blush/40 via-lavender/30 to-powder/40 blur-2xl dark:from-burgundy/30 dark:via-gold/20 dark:to-forest/30" />
            <div className="relative overflow-hidden rounded-[2rem] glass shadow-luxe">
              <img
                src={heroSoft}
                alt="Editorial soft muse moodboard"
                width={1200}
                height={1600}
                className="block h-[420px] w-full object-cover sm:h-[560px] dark:hidden"
              />
              <img
                src={heroDark}
                alt="Dark academia editorial scene"
                width={1200}
                height={1600}
                className="hidden h-[420px] w-full object-cover sm:h-[560px] dark:block"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-background/0 to-background/20" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                <div className="glass rounded-2xl px-4 py-3 shadow-soft">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Sample reading</p>
                  <p className="text-serif text-lg text-foreground">Ethereal Romantic</p>
                </div>
                <div className="flex -space-x-2">
                  {["#F6EFE6", "#E9C7C1", "#C9BEE1", "#BFD1E2"].map((c) => (
                    <span key={c} className="h-8 w-8 rounded-full border border-white/60 shadow-soft" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-24 max-w-5xl px-5 sm:mt-32">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">The Method</p>
            <h2 className="mt-3 text-serif text-3xl sm:text-4xl">Three quiet acts.</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Camera, t: "A single image", d: "An outfit hanging by the window. Your reading nook. A page torn from a magazine." },
            { icon: Palette, t: "A private reading", d: "Palette, personality, and visual signature — distilled with an editor's restraint." },
            { icon: MessageCircle, t: "A living dialogue", d: "Refine your instincts with a companion trained on your particular grammar of taste." },
          ].map(({ icon: Icon, t, d }, i) => (
            <div key={t} className="glass group relative overflow-hidden rounded-3xl p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-luxe">
              <span className="absolute right-5 top-5 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">0{i + 1}</span>
              <Icon className="h-5 w-5 text-foreground/70" />
              <h3 className="mt-6 text-serif text-2xl">{t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto mt-24 max-w-5xl px-5 pb-20 sm:mt-32">
        <div className="glass relative overflow-hidden rounded-[2rem] p-8 shadow-luxe sm:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">An invitation</p>
          <h2 className="mt-4 max-w-2xl text-serif text-3xl leading-tight sm:text-5xl">
            Your taste is already articulate. Muse simply names it.
          </h2>
          <div className="mt-8">
            <Link
              to="/upload"
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
