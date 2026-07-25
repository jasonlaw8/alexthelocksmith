import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/chat-prompt";

// Haiku 4.5: fast + inexpensive, right for a high-traffic customer FAQ bot
// (same choice as the playapexgolf chatbot this is modeled on).
const MODEL = "claude-haiku-4-5";

// Rolling history window sent to the model.
const MAX_HISTORY = 12;
// Server-side sanity bounds (cheap cost guard). Real abuse protection needs a
// shared store (Upstash/Vercel KV) — not built yet; the widget also caps
// messages per session.
const MAX_MESSAGES = 40;
const MAX_CHARS_PER_MESSAGE = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const messages = (body?.messages ?? []) as ChatMessage[];

  if (!Array.isArray(messages) || messages.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }
  if (messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Conversation too long." }, { status: 400 });
  }

  const trimmed = messages
    .slice(-MAX_HISTORY)
    .filter((m) => m?.content?.trim())
    .map((m) => ({
      role: m.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: String(m.content).slice(0, MAX_CHARS_PER_MESSAGE),
    }));

  if (trimmed.length === 0) {
    return Response.json({ error: "No messages provided." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set.");
    return Response.json(
      {
        error:
          "The assistant isn't wired up yet - please call (650) 444-1034 or message us on WhatsApp.",
      },
      { status: 500 },
    );
  }

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 500,
      // The knowledge base is large and identical on every request — cache it
      // so repeat turns read the prefix at ~10% cost instead of reprocessing.
      system: [
        {
          type: "text",
          text: SYSTEM_PROMPT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: trimmed,
    });

    const reply = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    return Response.json({
      reply: reply || "Sorry, I didn't catch that - could you rephrase?",
    });
  } catch (err) {
    console.error("Anthropic request failed:", err);
    return Response.json(
      { error: "Couldn't reach the assistant. Please try again in a moment." },
      { status: 502 },
    );
  }
}
