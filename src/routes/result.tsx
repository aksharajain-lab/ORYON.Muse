import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { loadResult, setAnalysisUsed, type AestheticResult } from "@/lib/aesthetic";
import { ArrowRight, Download, Share2, Compass } from "lucide-react";

// Resolve any CSS color (hex, rgb, oklch, lab, …) to a plain #rrggbb string.
// html-to-image passes `backgroundColor` straight to the canvas fill, which
// older engines reject for oklch()/lab() values — silently leaving an opaque
// black (or wrong-hue) backdrop behind the transparent areas of the card.
function resolveColorToHex(color: string, fallback: string): string {
  if (!color || color === "transparent" || color === "rgba(0, 0, 0, 0)") return fallback;
  if (typeof CSS !== "undefined" && typeof CSS.supports === "function" && !CSS.supports("color", color)) {
    return fallback;
  }
  try {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return fallback;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  } catch {
    return fallback;
  }
}

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
  const cardRef = useRef<HTMLElement | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Export the share card as a PNG that matches the on-screen rendering exactly:
  // same background, colours, typography, palette circles, and layout. Fonts and
  // images are fully loaded and animations are frozen (.capture-ready) before
  // capture, and the capture box is pinned to the measured card so the exported
  // canvas is always the full A4 sheet — never a crop of it.
  const exportCard = async () => {
    if (!cardRef.current || capturing) return;
    const card = cardRef.current;
    setCapturing(true);
    // Freeze the reveal sequence synchronously (before any await) so both the
    // dimension measurement and the library's clone see the settled card —
    // never a mid-animation frame with elements at partial opacity/offset.
    card.classList.add("capture-ready");
    setExportError(null);
    try {
      // 1 · Fonts fully loaded (Cormorant Garamond + Inter, including the
      //     fallback swap) so the widths measured now match the final render.
      await document.fonts?.ready;
      // 2 · Every image inside the card fully decoded. The background image
      //     is a data URL, but decode() guarantees it is painted before capture.
      await Promise.all(
        Array.from(card.querySelectorAll("img")).map((img) =>
          img.decode().catch(() => undefined),
        ),
      );
      // 3 · Let layout settle with animations frozen: two frames for the
      //     style flush, then a short beat before measuring.
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
      await new Promise((res) => setTimeout(res, 60));

      // Pin the capture to the exact on-screen card box. html-to-image's
      // default path derives dimensions from the live node but lays the clone
      // out inside a foreignObject, where aspect-ratio heights can drift and
      // get clipped. Explicit width/height (+ canvasWidth/Height) force the
      // clone's box to equal the measured card, so the export is the full A4
      // sheet — never a crop.
      const rect = card.getBoundingClientRect();
      // Measure the true rendered bounds, then add a small capture margin so
      // sub-pixel / aspect-ratio drift can never shave the bottom edge of the
      // sheet. The margin shows the page background — invisible next to the
      // card itself — and guarantees the full A4 sheet is exported.
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.ceil(rect.height) + 2);
      const pageBg = resolveColorToHex(
        getComputedStyle(document.body).backgroundColor,
        document.documentElement.classList.contains("dark") ? "#171310" : "#f6f0e6",
      );
      const dataUrl = await toPng(card, {
        width,
        height,
        canvasWidth: width,
        canvasHeight: height,
        pixelRatio: 2,
        backgroundColor: pageBg,
        cacheBust: false,
        // Pin the clone's box to the measured border-box size exactly: the
        // card is border-box (Tailwind preflight), and getBoundingClientRect
        // returns border-box dimensions — forcing the clone to the same box
        // model removes any 1-2px height drift that shaves the bottom edge
        // (invitation / footer text) during export in either theme.
        style: { margin: "0", boxSizing: "border-box", width: `${width}px`, height: `${height}px` },
      });
      const a = document.createElement("a");
      a.download = `oryon-visual-identity-${(r?.identity ?? "reading").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`;
      a.href = dataUrl;
      a.click();
    } catch {
      // Surface the failure instead of silently handing off to print-to-PDF,
      // which paginates the sheet and produces exactly the reported symptom:
      // a cropped export with the bottom text cut off.
      setExportError("The card couldn't be rendered to an image. Please try again.");
    } finally {
      card.classList.remove("capture-ready");
      setCapturing(false);
    }
  };

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

        {/* ── The Share Card — an A4 editorial sheet ── */}
        <article
          ref={cardRef}
          className={`share-card animate-reveal relative mx-auto max-w-sm overflow-hidden rounded-[1.25rem] border border-border/30 shadow-luxe sm:max-w-[30rem] sm:rounded-[1.5rem] print:max-w-none print:rounded-none print:border-0 print:shadow-none ${capturing ? "capture-ready" : ""}`}
        >
          {/* Grain texture */}
          <div className="share-card-grain pointer-events-none absolute inset-0 opacity-[0.012] mix-blend-overlay"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`, backgroundSize: "96px 96px" }}
          />

          {/* Background layer — the user's image, muted and softened, never a separate card.
              It appears first, with a slow editorial fade. */}
          {r.imageDataUrl ? (
            <>
              <img
                src={r.imageDataUrl}
                alt=""
                aria-hidden
                className="animate-fade-in absolute inset-0 h-full w-full object-cover"
                style={{ filter: "saturate(0.62) brightness(0.99) contrast(0.9)" }}
              />
              <div className="animate-fade-in absolute inset-0 bg-background/70" />
              <div className="animate-fade-in absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/85" />
            </>
          ) : (
            <div className="animate-fade-in absolute inset-0 bg-aurora" />
          )}

          <div className="relative flex min-h-[660px] flex-col px-7 pb-7 pt-8 sm:aspect-[210/297] sm:min-h-0 sm:px-9 sm:pb-8 sm:pt-9 print:aspect-auto print:min-h-0">
            {/* Masthead */}
            <div className="animate-fade-up flex items-baseline justify-between gap-4 border-b border-border/20 pb-4">
              <p className="text-[10px] uppercase tracking-[0.5em] text-card-primary">
                ORYON <span className="text-muse font-light">Muse</span>
              </p>
              <p className="text-[8px] uppercase tracking-[0.4em] text-card-meta">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
                  : "Vol. 01 · Visual Identity"}
              </p>
            </div>

            {/* Identity — the heart of the page */}
            <div className="flex flex-1 flex-col justify-center py-8 sm:py-9">
              <p className="animate-fade-up text-[9px] uppercase tracking-[0.55em] text-card-meta">
                Your Visual Identity
              </p>
              <h2 className="animate-fade-up delay-100 mt-4 text-serif text-[2.75rem] leading-[0.98] tracking-tight text-card-primary sm:text-[2.9rem]">
                {r.identity}
              </h2>
              <p className="animate-fade-up delay-200 mt-2 text-serif text-lg italic text-card-secondary">
                the {r.identity.split(" ").pop()?.toLowerCase() ?? r.identity}
              </p>

              <p className="animate-fade-up delay-300 mt-5 text-[10px] uppercase tracking-[0.35em] text-card-secondary">
                {r.traits.slice(0, 3).join("  ·  ")}
              </p>

              <div className="animate-draw-line relative my-5 h-px w-16 overflow-hidden bg-foreground/15" />

              <p className="animate-fade-up delay-400 max-w-md text-serif text-lg leading-relaxed italic text-card-secondary sm:text-xl">
                "{r.tagline}"
              </p>
              <p className="animate-fade-up delay-500 mt-3 max-w-md text-sm leading-relaxed text-card-secondary">
                {supporting}
              </p>
            </div>

            {/* Palette — a balanced editorial plate */}
            <div className="animate-fade-up delay-600 flex flex-col items-center border-y border-border/15 py-6">
              <p className="text-[8px] uppercase tracking-[0.45em] text-card-meta">Palette</p>
              <div className="mt-4 flex -space-x-3 sm:-space-x-3.5">
                {r.palette.slice(0, 3).map((p, i) => (
                  <span
                    key={p.hex}
                    className="animate-settle inline-block h-12 w-12 rounded-full border-2 border-background shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-luxe"
                    style={{ background: p.hex, animationDelay: `${0.6 + i * 0.18}s` }}
                    title={p.name}
                  />
                ))}
              </div>
              <p className="animate-fade-up delay-800 mt-3 text-[8px] uppercase tracking-[0.3em] text-card-meta">
                {r.palette.slice(0, 3).map((p) => p.name).join(" · ")}
              </p>
            </div>

            {/* Invitation + branding */}
            <div className="animate-fade-up delay-900 flex flex-col items-center gap-2.5 pt-6">
              <p className="text-serif text-lg italic text-card-secondary sm:text-xl">
                Discover your own visual identity.
              </p>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-border/30" />
                <span className="h-1 w-1 rotate-45 border border-border/40" />
                <span className="h-px w-8 bg-border/30" />
              </div>
              <p className="animate-fade-up delay-1000 text-[8px] uppercase tracking-[0.45em] text-card-meta">
                Interpreted by ORYON Muse
              </p>
            </div>
          </div>
        </article>

        {/* ── Next Step — Continue Your Evolution ── */}
        <section className="animate-fade-up delay-[1000ms] mx-auto mt-14 max-w-2xl print:hidden">
          <div className="rounded-2xl border border-border/25 px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-[8px] uppercase tracking-[0.45em] text-muted-foreground">
              <Compass className="mr-1.5 inline h-3 w-3" />
              Step 03 · Evolution
            </p>
            <h2 className="mt-3 text-serif text-3xl leading-tight sm:text-4xl">
              Continue your evolution
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Choose the aesthetic worlds you'd like to explore. Your guide will carry them into
              your conversation, alongside the reading it already holds.
            </p>
            <Link
              to="/evolve"
              className="group mt-7 inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background shadow-luxe transition duration-300 hover:-translate-y-0.5"
            >
              Continue your evolution
              <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </section>

        {/* ── Action Bar — revealed last ── */}
        <div className="animate-fade-up delay-[1300ms] mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-2.5 border-t border-border/15 pt-6 print:hidden">
          <button
            onClick={share}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-luxe transition duration-300 hover:-translate-y-0.5"
          >
            <Share2 className="h-3.5 w-3.5 transition duration-300 group-hover:scale-110" />
            Share your visual identity
          </button>
          <button
            onClick={exportCard}
            disabled={capturing}
            className="group inline-flex items-center gap-2 rounded-full border border-border/30 px-4 py-2.5 text-sm text-foreground/60 transition duration-300 hover:-translate-y-0.5 hover:text-foreground disabled:cursor-wait disabled:opacity-60"
          >
            <Download className="h-3.5 w-3.5 transition duration-300 group-hover:translate-y-0.5" />
            {capturing ? "Preparing…" : "Save"}
          </button>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-full border border-border/30 px-4 py-2.5 text-sm text-foreground/70 transition duration-300 hover:-translate-y-0.5 hover:text-foreground"
          >
            Try another image
          </Link>
        </div>

        {exportError && (
          <p className="mx-auto mt-3 max-w-md text-center text-xs text-muted-foreground">{exportError}</p>
        )}

      </section>
    </Shell>
  );
}
