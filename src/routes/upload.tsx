import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useRef, useState } from "react";
import { Upload, ImageIcon, ArrowRight, Plus, X } from "lucide-react";
import { clearResult } from "@/lib/aesthetic";
import { downscaleImage } from "@/lib/image";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload — ORYON Muse" },
      { name: "description", content: "Share up to five images — outfit, room, or moodboard — and receive your Aesthetic DNA." },
      { property: "og:title", content: "Upload — ORYON Muse" },
      { property: "og:description", content: "Share up to five images and receive your Aesthetic DNA." },
    ],
  }),
  component: UploadPage,
});

const MAX_IMAGES = 5;
const MAX_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

const CATEGORY_LABELS: Record<string, string> = {
  room: "Room",
  outfit: "Outfit",
  moodboard: "Moodboard",
  social: "Social Profile",
  workspace: "Workspace",
  other: "Other",
};

function UploadPage() {
  const nav = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [otherNote, setOtherNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("oryon.categories");
      if (raw) setCategories(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    try {
      setOtherNote(sessionStorage.getItem("oryon.otherNote") ?? "");
    } catch {
      /* ignore */
    }
  }, []);

  const readFile = (f: File) =>
    new Promise<string>((resolve, reject) => {
      const r = new FileReader();
      r.onload = (e) => resolve(e.target?.result as string);
      r.onerror = () => reject(new Error("read failed"));
      r.readAsDataURL(f);
    });

  const handleFiles = async (files: FileList | File[] | null | undefined) => {
    if (!files) return;
    const list = Array.from(files);
    setError(null);
    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setError(`You can share up to ${MAX_IMAGES} images.`);
      return;
    }
    const accepted: File[] = [];
    for (const f of list.slice(0, room)) {
      if (!ACCEPTED.includes(f.type)) {
        setError("Only JPG, PNG or WEBP images.");
        continue;
      }
      if (f.size > MAX_BYTES) {
        setError("Each image must be under 10 MB.");
        continue;
      }
      accepted.push(f);
    }
    const dataUrls = await Promise.all(accepted.map(readFile));
    // Downscale on-device before storing, so the analysis request stays light
    // and the share card loses nothing visually. Falls back to the original
    // if a file can't be re-encoded.
    const optimized = await Promise.all(
      dataUrls.map((d) => downscaleImage(d).catch(() => d)),
    );
    setImages((prev) => [...prev, ...optimized].slice(0, MAX_IMAGES));
  };

  const remove = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  const proceed = () => {
    // Respond immediately on the first click; never allow a second one.
    if (images.length === 0 || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    // Drop any previous reading before writing the new submission, so the
    // result page can never show an earlier session's content.
    clearResult();
    sessionStorage.setItem("oryon.image", images[0]);
    sessionStorage.setItem("oryon.images", JSON.stringify(images));
    nav({ to: "/analyzing" });
  };

  const canAdd = images.length < MAX_IMAGES;

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-5 pb-32 pt-8 sm:pt-14">
        <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground">Step 02 · Offering</p>
        <h1 className="mt-3 text-serif text-4xl leading-tight sm:text-5xl">
          Share the images Muse will read.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Not the most curated. The most <em className="italic">you</em>. Muse reads the quiet decisions —
          the light you kept, the texture you chose, the corner you didn't stage.
        </p>

        {categories.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full border border-border/30 px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-foreground/60"
              >
                {CATEGORY_LABELS[c] ?? c}
              </span>
            ))}
          </div>
        )}
        {otherNote && (
          <p className="mt-3 max-w-xl text-[11px] italic leading-relaxed text-muted-foreground/80">
            Also sharing — <span className="text-foreground/75">{otherNote}</span>
          </p>
        )}

        <div className="mt-5 border-b border-border/20 pb-3 text-xs text-muted-foreground">
          <span className="mr-4">Upload up to 5 images</span>
          <span className="mr-4">JPG · PNG · WEBP</span>
          <span>10 MB max each</span>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={`mt-6 rounded-xl border-2 border-dashed transition ${
            drag ? "border-foreground/40 bg-foreground/[0.02]" : "border-border/30 hover:border-border/60"
          }`}
        >
          {images.length === 0 ? (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex h-[320px] w-full flex-col items-center justify-center gap-4 text-center sm:h-[400px]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full border border-border/40 text-foreground/70">
                <Upload className="h-5 w-5" />
              </span>
              <div>
                <p className="text-serif text-lg text-foreground/80">Drop your images here</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  or tap to browse
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/30 px-4 py-1.5 text-[10px] text-foreground/70">
                <ImageIcon className="h-3 w-3" /> Up to 5 · JPG · PNG · WEBP · 10 MB
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-lg"
                >
                  <img
                    src={src}
                    alt={`Selection ${i + 1}`}
                    className="h-36 w-full object-cover sm:h-40"
                  />
                  <button
                    onClick={() => remove(i)}
                    aria-label="Remove image"
                    className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-background/80 text-foreground/70 backdrop-blur-sm"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {canAdd && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/30 text-center text-muted-foreground transition hover:text-foreground sm:h-40"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-border/30">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em]">Add more</span>
                </button>
              )}
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            hidden
            onChange={(e) => {
              void handleFiles(e.target.files);
              if (inputRef.current) inputRef.current.value = "";
            }}
          />
        </div>

        {error && (
          <p className="mt-3 text-xs text-destructive">{error}</p>
        )}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20">
        <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent" />
        <div className="relative border-t border-border/30 bg-background/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-3.5">
            <p className="text-xs text-muted-foreground">
              {submitting
                ? "Muse is preparing your visual reading…"
                : images.length === 0
                  ? "Nothing stays on our servers — it lives on your device."
                  : `${images.length} of ${MAX_IMAGES} selected`}
            </p>
            <button
              onClick={proceed}
              disabled={images.length === 0 || submitting}
              aria-busy={submitting}
              className="group inline-flex flex-none items-center gap-2.5 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-luxe transition duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {submitting ? (
                <>
                  <span className="inline-flex items-center gap-1" aria-hidden>
                    <span className="h-1 w-1 animate-pulse rounded-full bg-background/70" />
                    <span className="h-1 w-1 animate-pulse rounded-full bg-background/70 [animation-delay:150ms]" />
                    <span className="h-1 w-1 animate-pulse rounded-full bg-background/70 [animation-delay:300ms]" />
                  </span>
                  Preparing your visual reading…
                </>
              ) : (
                <>
                  Read my aesthetic
                  <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
