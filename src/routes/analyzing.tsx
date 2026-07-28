import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useState } from "react";
import { mockAnalyze, saveResult } from "@/lib/aesthetic";

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

  useEffect(() => {
    const image = sessionStorage.getItem("oryon.image") ?? undefined;
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
        <div className="relative mb-10 h-40 w-40">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blush/60 via-lavender/60 to-powder/60 blur-2xl dark:from-burgundy/40 dark:via-gold/40 dark:to-forest/40" />
          <div className="absolute inset-2 animate-float-slow rounded-full glass shadow-luxe" />
          <div className="absolute inset-8 rounded-full glass-strong shadow-soft" />
          <div className="absolute inset-0 grid place-items-center">
            <span className="text-serif text-4xl italic">M</span>
          </div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">Reading</p>
        <h1 className="mt-3 text-serif text-3xl leading-tight sm:text-4xl">
          Muse is with your image.
        </h1>
        <div className="mt-10 w-full space-y-3">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`glass flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm shadow-soft transition ${
                i > step ? "opacity-30" : "opacity-100"
              }`}
            >
              <span className={`grid h-6 w-6 place-items-center rounded-full text-[10px] ${
                i < step ? "bg-primary text-primary-foreground" : i === step ? "bg-foreground text-background" : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? "✓" : i + 1}
              </span>
              <span className="text-foreground/85">{s}</span>
              {i === step && (
                <span className="ml-auto inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/60 [animation-delay:300ms]" />
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
