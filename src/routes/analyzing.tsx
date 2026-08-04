import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useState } from "react";
import {
  mockAnalyze,
  saveResult,
  getAnalysisUsed,
  loadResult,
  loadCategories,
  loadOtherNote,
  getStoredImages,
  type AestheticResult,
} from "@/lib/aesthetic";

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
  "Preparing your visual reading…",
  "Observing your visual language…",
  "Distilling your aesthetic patterns…",
  "Creating your Visual Identity…",
];

// The narrative steps are paced like an editorial reveal: each step has a
// minimum dwell time so the experience stays calm, and the request itself
// drives the final handoff. The reveal can never arrive faster than the
// steps allow, and can never hang silently while the model works.
const MIN_STEP_MS = 900;

/** Call the server-side reading. Throws on any failure — the caller falls
 *  back to a local reading so the journey never breaks. */
async function requestReading(
  images: string[],
  categories: string[],
  otherNote: string,
): Promise<AestheticResult> {
  if (images.length === 0) throw new Error("No images to read.");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 50_000);
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images, categories, otherNote }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      result?: AestheticResult;
      error?: string;
    } | null;
    if (!res.ok || !data?.ok || !data.result) {
      throw new Error(data?.error ?? `Analysis failed (${res.status}).`);
    }
    return { ...data.result, imageDataUrl: images[0], createdAt: Date.now() };
  } finally {
    clearTimeout(timeout);
  }
}

function Analyzing() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [blocked, setBlocked] = useState(false);
  const [veil, setVeil] = useState(false);

  // A returning guest with a completed reading goes straight to it. A stale
  // "analysis used" flag without a saved result (e.g. after a fresh study
  // cleared the state) falls through and runs a new analysis instead of
  // surfacing an old session's content.
  useEffect(() => {
    if (getAnalysisUsed() && loadResult()) {
      setBlocked(true);
      nav({ to: "/result" });
    }
  }, [nav]);

  // NOTE: hooks must be declared before any conditional return — an early
  // return before a hook crashes React on the blocked path.
  useEffect(() => {
    if (blocked) return;
    if (getAnalysisUsed() && loadResult()) return; // gate handles the redirect

    let cancelled = false;
    const pending: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => {
      pending.push(setTimeout(() => { if (!cancelled) fn(); }, ms));
    };

    const reveal = (r: AestheticResult) => {
      if (cancelled) return;
      saveResult(r);
      // A gentle veil — the reading completes, then the reveal begins.
      setVeil(true);
      later(() => nav({ to: "/result" }), 950);
    };

    const images = getStoredImages();
    const categories = loadCategories();
    const otherNote = loadOtherNote();

    const stepTimer = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, MIN_STEP_MS);
    pending.push(stepTimer);

    const run = async () => {
      try {
        const r = await requestReading(images, categories, otherNote);
        if (cancelled) return;
        clearInterval(stepTimer);
        setStep(STEPS.length - 1);
        // Let the final step breathe before the reveal.
        later(() => reveal(r), 800);
      } catch (err) {
        // The real reading is unavailable (no key, network, rate limit…).
        // Fall back to the local reading so the study always completes.
        console.info("[muse] Gemini reading unavailable — using the local reading.", err);
        if (cancelled) return;
        clearInterval(stepTimer);
        setStep(STEPS.length - 1);
        later(() => reveal(mockAnalyze(images[0])), 500);
      }
    };
    void run();

    return () => {
      cancelled = true;
      pending.forEach(clearTimeout);
      clearInterval(stepTimer);
    };
  }, [nav, blocked]);

  if (blocked) {
    return <Shell><div className="p-10 text-center text-muted-foreground">Your reading awaits…</div></Shell>;
  }

  return (
    <Shell>
      {veil && (
        <div className="animate-veil-in pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background">
          <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground">
            Your reading is ready.
          </p>
        </div>
      )}
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
          Muse is with your images.
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
