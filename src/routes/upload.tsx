import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useEffect, useRef, useState } from "react";
import { Upload, ImageIcon, ArrowRight, Plus, X } from "lucide-react";

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
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("oryon.categories");
      if (raw) setCategories(JSON.parse(raw));
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
    setImages((prev) => [...prev, ...dataUrls].slice(0, MAX_IMAGES));
  };

  const remove = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  const proceed = () => {
    if (images.length === 0) return;
    sessionStorage.setItem("oryon.image", images[0]);
    sessionStorage.setItem("oryon.images", JSON.stringify(images));
    nav({ to: "/analyzing" });
  };

  const canAdd = images.length < MAX_IMAGES;

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-5 pb-32 pt-10 sm:pt-16">
        <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Step 02 · Offering</p>
        <h1 className="mt-3 text-serif text-4xl leading-tight sm:text-5xl">
          Share the images Muse will read.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Not the most curated. The most <em className="italic">you</em>. Muse reads the quiet decisions —
          the light you kept, the texture you chose, the corner you didn't stage.
        </p>

        {categories.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <span
                key={c}
                className="inline-flex items-center rounded-full glass px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-foreground/75 shadow-soft"
              >
                {CATEGORY_LABELS[c] ?? c}
              </span>
            ))}
          </div>
        )}

        <div className="mt-6 glass rounded-2xl px-4 py-3 text-xs text-muted-foreground shadow-soft sm:text-sm">
          <ul className="grid gap-1 sm:grid-cols-3">
            <li>• Upload up to 5 images</li>
            <li>• JPG, PNG or WEBP</li>
            <li>• Maximum 10 MB per image</li>
          </ul>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={`glass mt-6 rounded-3xl p-3 shadow-soft transition ${
            drag ? "ring-2 ring-primary/60" : ""
          }`}
        >
          {images.length === 0 ? (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex h-[360px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/70 text-center sm:h-[440px]"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full glass shadow-soft">
                <Upload className="h-5 w-5" />
              </span>
              <div>
                <p className="text-serif text-xl">Drop your images here</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  or tap to browse
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-foreground/70 shadow-soft">
                <ImageIcon className="h-3.5 w-3.5" /> Up to 5 · JPG · PNG · WEBP · 10 MB
              </span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-2xl shadow-soft"
                >
                  <img
                    src={src}
                    alt={`Selection ${i + 1}`}
                    className="h-40 w-full object-cover sm:h-44"
                  />
                  <button
                    onClick={() => remove(i)}
                    aria-label="Remove image"
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full glass shadow-soft"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {canAdd && (
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/70 text-center text-muted-foreground transition hover:text-foreground sm:h-44"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full glass shadow-soft">
                    <Plus className="h-4 w-4" />
                  </span>
                  <span className="text-xs uppercase tracking-[0.28em]">Add more</span>
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
        <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-background to-transparent" />
        <div className="relative border-t border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
            <p className="text-xs text-muted-foreground">
              {images.length === 0
                ? "Nothing stays on our servers — it lives on your device."
                : `${images.length} of ${MAX_IMAGES} selected`}
            </p>
            <button
              onClick={proceed}
              disabled={images.length === 0}
              className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-luxe transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Read my aesthetic
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
