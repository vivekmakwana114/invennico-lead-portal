import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured in environment variables" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { title, details, attachments, notes, source } = body;

    const prompt = `You are a senior pre-sales consultant at Invennico TechnoLabs, a digital product development company.

Company context:
- Digital tech studio building web, mobile, SaaS, AI, and enterprise systems
- Strong in MERN, Next.js, React Native, Flutter, Node.js, PostgreSQL, AWS
- Clients range from startups to enterprise
- Focus on scalable, practical, production-ready solutions

Analyze the following lead and return ONLY a valid JSON object. No markdown, no explanation, no code fences.

INPUT:
Title: ${title || "N/A"}
Source: ${source || "N/A"}
Description: ${details || "N/A"}
Internal Notes: ${notes || "None"}
Attachments: ${attachments || "None"}

OUTPUT (strict JSON only):
{
  "lead_summary": "Concise explanation of what the client wants",
  "qualification": {
    "score": 75,
    "label": "High Potential / Medium / Low",
    "reasoning": "Why this lead is good or risky"
  },
  "recommended_tech_stack": {
    "frontend": [],
    "backend": [],
    "database": [],
    "integrations": [],
    "hosting": []
  },
  "estimation": {
    "timeline": "Realistic range e.g. 4-6 months",
    "budget_range": "USD range e.g. $40,000 - $60,000",
    "breakdown": [
      { "phase": "Phase name", "timeline": "Duration", "cost_range": "USD range" }
    ]
  },
  "recommended_next_action": "What should we do next",
  "suggested_questions": ["Question 1", "Question 2"]
}

RULES:
- Be practical, not theoretical
- Do NOT oversell
- Keep estimates realistic based on industry standards
- Think like a CTO + sales strategist
- Return ONLY the JSON object`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1500,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json(JSON.parse(text));

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Gemini analyze error:", message);
    return NextResponse.json(
      { error: "Failed to analyze lead", detail: message },
      { status: 500 }
    );
  }
}
