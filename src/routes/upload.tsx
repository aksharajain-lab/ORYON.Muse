import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { useRef, useState } from "react";
import { Upload, ImageIcon, ArrowRight, Shirt, Home, Layout } from "lucide-react";

export const Route = createFileRoute("/upload")({
  head: () => ({
    meta: [
      { title: "Upload — ORYON Muse" },
      { name: "description", content: "Share a single image — outfit, room, or moodboard — and receive your Aesthetic DNA." },
      { property: "og:title", content: "Upload — ORYON Muse" },
      { property: "og:description", content: "Share a single image and receive your Aesthetic DNA." },
    ],
  }),
  component: UploadPage,
});

const CATS = [
  { id: "outfit", label: "An outfit", icon: Shirt, hint: "Something you wore this week" },
  { id: "room", label: "A room", icon: Home, hint: "Where you spend quiet hours" },
  { id: "moodboard", label: "A moodboard", icon: Layout, hint: "A page torn, a screenshot saved" },
];

function UploadPage() {
  const nav = useNavigate();
  const [cat, setCat] = useState("outfit");
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f?: File) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const proceed = () => {
    if (preview) sessionStorage.setItem("oryon.image", preview);
    sessionStorage.setItem("oryon.category", cat);
    nav({ to: "/analyzing" });
  };

  return (
    <Shell>
      <section className="mx-auto max-w-3xl px-5 pt-10 sm:pt-16">
        <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Step 01 · Offering</p>
        <h1 className="mt-3 text-serif text-4xl leading-tight sm:text-5xl">
          Give Muse a single, honest image.
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Not the most curated. The most <em className="italic">you</em>. Muse reads the quiet decisions —
          the light you kept, the texture you chose, the corner you didn't stage.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {CATS.map((c) => {
            const Icon = c.icon;
            const active = cat === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setCat(c.id)}
                className={`glass rounded-2xl p-4 text-left shadow-soft transition ${
                  active ? "ring-2 ring-primary/60 -translate-y-0.5 shadow-luxe" : "hover:-translate-y-0.5"
                }`}
              >
                <Icon className="h-4 w-4 text-foreground/70" />
                <p className="mt-3 text-serif text-lg">{c.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.hint}</p>
              </button>
            );
          })}
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault(); setDrag(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`glass mt-6 overflow-hidden rounded-3xl p-2 shadow-soft transition ${
            drag ? "ring-2 ring-primary/60" : ""
          }`}
        >
          {preview ? (
            <div className="relative overflow-hidden rounded-2xl">
              <img src={preview} alt="Preview" className="h-[380px] w-full object-cover sm:h-[460px]" />
              <button
                onClick={() => setPreview(null)}
                className="absolute right-3 top-3 rounded-full glass px-3 py-1.5 text-xs shadow-soft"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex h-[380px] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/70 text-center sm:h-[460px]"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full glass shadow-soft">
                <Upload className="h-5 w-5" />
              </span>
              <div>
                <p className="text-serif text-xl">Drop your image here</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">or tap to browse</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs text-foreground/70 shadow-soft">
                <ImageIcon className="h-3.5 w-3.5" /> JPG · PNG · HEIC
              </span>
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0] ?? undefined)}
          />
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            Nothing is uploaded. Your image stays on this device.
          </p>
          <button
            onClick={proceed}
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-luxe transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            Read my aesthetic
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>
    </Shell>
  );
}
