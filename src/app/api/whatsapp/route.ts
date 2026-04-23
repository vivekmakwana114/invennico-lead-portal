import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { lead_summary, tech_stack, timeline, budget, original_lead } = body;

    const systemPrompt = `You are a pre-sales consultant writing a WhatsApp message to a potential client.

Write a professional, confident, and concise WhatsApp reply.

Tone:
- Friendly but professional
- Clear and structured
- Not too long
- No fluff`;

    const userPrompt = `
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
Do NOT sound robotic.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-5.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.5,
    });

    const result = response.choices[0].message.content;
    return NextResponse.json({ message: result });

  } catch (error) {
    console.error("Error generating WhatsApp reply:", error);
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
