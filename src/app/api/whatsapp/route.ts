import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured in environment variables" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { lead_summary, tech_stack, timeline, budget, original_lead } = body;

    const prompt = `You are a pre-sales consultant writing a WhatsApp message to a potential client.

Write a professional, confident, and concise WhatsApp reply.

Tone:
- Friendly but professional
- Clear and structured
- Not too long
- No fluff

INPUT:

Lead Summary:
${lead_summary || "N/A"}

Tech Stack:
${tech_stack || "N/A"}

Timeline:
${timeline || "N/A"}

Budget:
${budget || "N/A"}

Additional Context:
${original_lead || "N/A"}

---

OUTPUT:

Write a WhatsApp message that:
- Acknowledges the requirement
- Shows understanding
- Positions capability
- Mentions rough timeline and cost (if appropriate)
- Asks 3–5 smart questions
- Suggests a call

Do NOT include emojis unless natural.
Do NOT make it too long.
Do NOT sound robotic.`;

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const message = await client.messages.create({
      // model: "claude-sonnet-4-6",
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const result = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ message: result });

  } catch (error) {
    console.error("Claude WhatsApp reply error:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
