// ── POST /api/chat ─────────────────────────────────────────────────────
// Server-side endpoint for the Muse Guide conversation. Receives the
// reading context (identity, palette, motifs, chosen directions), the
// conversation history, and the latest user message; delegates to the
// OpenRouter module and returns a validated MuseReply (sections + optional
// moment) for the existing guide UI to render. The image analysis
// pipeline (/api/analyze) is untouched.

import { createFileRoute } from "@tanstack/react-router";
import { chatWithMuse, type ChatInput, type ChatMessage } from "@/lib/gemini.server";

const MAX_HISTORY = 12;
const MAX_MESSAGE_LENGTH = 2000;

function cleanHistory(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (m): m is ChatMessage =>
        Boolean(m) &&
        typeof (m as ChatMessage).role === "string" &&
        typeof (m as ChatMessage).content === "string",
    )
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: m.content.slice(0, MAX_MESSAGE_LENGTH),
    }))
    .slice(-MAX_HISTORY);
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as Partial<ChatInput>;

          const message = typeof body.message === "string" ? body.message.trim() : "";
          if (!message) {
            return Response.json({ ok: false, error: "No message was provided." }, { status: 400 });
          }

          const palette = Array.isArray(body.palette)
            ? body.palette
                .filter(
                  (p): p is { name: string; hex: string } =>
                    Boolean(p) &&
                    typeof (p as { name?: unknown }).name === "string" &&
                    typeof (p as { hex?: unknown }).hex === "string",
                )
                .slice(0, 8)
            : [];

          const reply = await chatWithMuse({
            mode: body.mode === "study" ? "study" : "dialogue",
            identity: typeof body.identity === "string" && body.identity ? body.identity : undefined,
            tagline: typeof body.tagline === "string" && body.tagline ? body.tagline : undefined,
            palette,
            motifs: Array.isArray(body.motifs)
              ? body.motifs.filter((x): x is string => typeof x === "string").slice(0, 12)
              : undefined,
            evolution: Array.isArray(body.evolution)
              ? body.evolution.filter((x): x is string => typeof x === "string").slice(0, 8)
              : undefined,
            history: cleanHistory(body.history),
            message: message.slice(0, MAX_MESSAGE_LENGTH),
          });

          return Response.json({ ok: true, reply });
        } catch (err) {
          // Logs only the exact exception message (never keys/secrets).
          console.error(`[api/chat] exception: ${err instanceof Error ? err.message : String(err)}`);
          return Response.json(
            { ok: false, error: err instanceof Error ? err.message : "The reply could not be completed." },
            { status: 500 },
          );
        }
      },
    },
  },
});
