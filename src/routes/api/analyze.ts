// ── POST /api/analyze ──────────────────────────────────────────────────
// Server-side endpoint for the visual identity reading. Receives the
// downscaled images (data URLs) plus study context, delegates to the Gemini
// module (the API key lives there, in process.env — never in the browser),
// and returns a validated AestheticResult. Payload is size-checked so one
// oversized request can't blow the server budget.

import { createFileRoute } from "@tanstack/react-router";
import { analyzeVisualIdentity, type AnalyzeInput } from "@/lib/gemini.server";

const MAX_IMAGES = 5;
const MAX_PAYLOAD_BYTES = 14 * 1024 * 1024; // ~14 MB of decoded base64

export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Partial<AnalyzeInput>;

          const images = Array.isArray(body.images)
            ? body.images.filter((x): x is string => typeof x === "string" && x.startsWith("data:image/"))
            : [];
          if (images.length === 0) {
            return Response.json({ ok: false, error: "No images were provided." }, { status: 400 });
          }
          if (images.length > MAX_IMAGES) {
            return Response.json({ ok: false, error: `Please share at most ${MAX_IMAGES} images.` }, { status: 400 });
          }

          const totalBytes = images.reduce((n, d) => n + (d.length * 3) / 4, 0);
          if (totalBytes > MAX_PAYLOAD_BYTES) {
            return Response.json({ ok: false, error: "The images are too large — try fewer or smaller files." }, { status: 413 });
          }

          const result = await analyzeVisualIdentity({
            images,
            categories: Array.isArray(body.categories)
              ? body.categories.filter((x): x is string => typeof x === "string")
              : [],
            otherNote: typeof body.otherNote === "string" ? body.otherNote : "",
          });

          return Response.json({ ok: true, result });
        } catch (err) {
          console.error("[api/analyze]", err);
          return Response.json(
            { ok: false, error: err instanceof Error ? err.message : "The reading could not be completed." },
            { status: 500 },
          );
        }
      },
    },
  },
});
