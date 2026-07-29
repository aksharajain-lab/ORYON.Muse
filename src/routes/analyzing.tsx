import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useState } from "react";
import { mockAnalyze, saveResult, getAnalysisUsed } from "@/lib/aesthetic";

export const Route = createFileRoute("/analyzing")({
  head: () => ({
    meta: [
      { title: "Reading — ORYON Muse" },
      { name: "description", content: "Muse is reading the quiet grammar of your image." },
      { property: "og:title", content: "Reading — ORYON Muse" },
      { property: "og:description", content: "Muse is reading the quiet grammar of your image." },
    ],
  }),
  component: Analyzing,
});

const STEPS = [
  "Studying the light in your frame",
  "Sampling the palette beneath the palette",
  "Naming the textures you gravitate toward",
  "Listening for the silence between objects",
  "Composing your Aesthetic DNA",
];

function Analyzing() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [blocked, setBlocked] = useState(false);

  // Redirect if analysis already used
  useEffect(() => {
    if (getAnalysisUsed()) {
      setBlocked(true);
      nav({ to: "/result" });
    }
  }, [nav]);

  if (blocked) {
    return <Shell><div className="p-10 text-center text-muted-foreground">Your reading awaits…</div></Shell>;
  }

  useEffect(() => {
    const image = sessionStorage.getItem("oryon.image") ?? undefined;
    if (getAnalysisUsed()) return;
    const total = STEPS.length;
    const per = 900;
    const id = setInterval(() => {
      setStep((s) => {
        if (s >= total - 1) {
          clearInterval(id);
          const r = mockAnalyze(image);
          saveResult(r);
          setTimeout(() => nav({ to: "/result" }), 600);
          return s;
        }
        return s + 1;
      });
    }, per);
    return () => clearInterval(id);
  }, [nav]);

  return (
    <Shell>
      <section className="mx-auto flex max-w-2xl flex-col items-center px-5 pt-16 text-center sm:pt-24">
        <div className="relative mb-10 h-32 w-32">
          <div className="absolute inset-0 rounded-full border border-border/30" />
          <div className="absolute inset-3 animate-float-slow rounded-full border border-border/20" />
          <div className="absolute inset-6 rounded-full border border-border/10" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-serif text-3xl italic text-foreground/70">M</span>
          </div>
        </div>
        <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Reading</p>
        <h1 className="mt-3 text-serif text-3xl leading-tight sm:text-4xl">
          Muse is with your image.
        </h1>
        <div className="mt-10 w-full space-y-2.5">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
                i > step
                  ? "border-border/10 opacity-30"
                  : i === step
                    ? "border-foreground/20 bg-foreground/[0.02]"
                    : "border-border/20"
              }`}
            >
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${
                i < step
                  ? "bg-foreground/10 text-foreground/60"
                  : i === step
                    ? "bg-foreground text-background"
                    : "border border-border/30 text-muted-foreground"
              }`}>
                {i < step ? "✓" : i + 1}
              </span>
              <span className="text-foreground/80">{s}</span>
              {i === step && (
                <span className="ml-auto inline-flex gap-1">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/50" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/50 [animation-delay:150ms]" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-foreground/50 [animation-delay:300ms]" />
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
