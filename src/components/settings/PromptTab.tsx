"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Save, Loader2, CheckCircle2, AlertCircle, RotateCcw, Trash2,
  ChevronDown, ChevronUp, Brain, MessageSquare, RefreshCw, Search, FileText,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchPrompt, saveSinglePrompt, clearPromptStatus } from "@/state/settings/settingsSlice";
import type { AiPrompts } from "@/state/settings/settingsService";
import type { RootState } from "@/state/store";

// ── Default prompts — MUST match the constants in the backend services exactly ─
// Only the dynamic runtime data (title, description, notes, lead JSON payload)
// is injected at runtime. Everything else is the customisable prompt below.

const DEFAULTS: AiPrompts = {
  // Matches DEFAULT_LEAD_ANALYSIS_PROMPT in src/services/ai.service.js
  leadAnalysis:
`You are a senior pre-sales consultant at Invennico TechnoLabs, a digital product development company.

Company context:
- Digital tech studio building web, mobile, SaaS, AI, and enterprise systems
- Strong in MERN, Next.js, React Native, Flutter, Node.js, PostgreSQL, AWS
- Clients range from startups to enterprise
- Focus on scalable, practical, production-ready solutions

Analyze the following lead and return ONLY a valid JSON object. No markdown, no explanation, no code fences.

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
    "timeline": "Duration only, e.g. 4-6 months",
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
- Do NOT repeat any recommand tech stack in the output
- Keep estimates realistic based on industry standards
- Think like a CTO + sales strategist
- Tech stack names must be SHORT and CLEAN — single standard identifiers only (e.g. "React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "Flutter"). No descriptions, no parenthetical notes, no version numbers, no "with X" or "for X" suffixes
- Return ONLY the JSON object`,

  // Matches DEFAULT_WHATSAPP_FIRST_PROMPT in src/services/ai.service.js
  whatsappFirst:
`You are a pre-sales consultant writing a WhatsApp message to a potential client.

Write a professional, confident, and concise WhatsApp reply.

Tone:
- Friendly but professional
- Clear and structured
- Not too long
- No fluff

Write a message that:
- Acknowledges the requirement
- Shows understanding
- Positions capability
- Mentions rough timeline and cost (if appropriate)
- Asks 3-5 smart questions
- Suggests a call

Do NOT include emojis unless natural.
Do NOT make it too long.
Do NOT sound robotic.`,

  // Matches DEFAULT_WHATSAPP_REGEN_PROMPT in src/services/ai.service.js
  whatsappRegen:
`Please revise the WhatsApp message based on the following update. Keep the same tone and structure. Return only the revised WhatsApp message — no explanation, no preamble.`,

  // Matches DEFAULT_GEMINI_FULL_PROMPT in src/services/gemini.service.js
  geminiResearch:
`Find this project lead on the internet using Google Search and return the result as JSON.

Search online to find:
- Which freelance platform(s) this project was posted on, and the direct URL to the specific posting
- Who posted the project (the client/buyer): their full name, location, contact details, and social media profiles (LinkedIn, GitHub, Twitter/X, personal website). The client is the person who POSTED the job — not any developers, contractors, or team members mentioned inside the description.
- The stated budget, currency, and payment type

Return ONLY valid JSON in this exact structure. No markdown fences, no explanation, no extra text:

{
  "client": {
    "name": "person's full name, or null",
    "contact": "email or phone found online, or null",
    "socialLinks": {
      "linkedin": "full LinkedIn URL, or null",
      "github": "full GitHub URL, or null",
      "twitter": "full Twitter/X URL, or null",
      "personalSite": "personal website URL, or null"
    },
    "company": "company name, or null",
    "location": "city/country, or null",
    "industry": "industry or sector, or null",
    "businessDescription": "2-3 sentence description of the client's business, or null"
  },
  "platforms": [
    {
      "name": "platform name confirmed by search results",
      "projectUrl": "URL from search results verbatim, or null",
      "overview": "1-2 sentence description of this platform"
    }
  ],
  "budget": {
    "stated": "exact budget from the lead or posting, or null",
    "currency": "currency code e.g. USD GBP EUR, or null",
    "paymentPreference": "Fixed Price / Hourly / Milestone-based, or null"
  }
}`,

  // Matches DEFAULT_PROPOSAL_FULL_PROMPT in src/services/ai.service.js
  proposal:
`You are a senior pre-sales consultant at Invennico TechnoLabs, a digital product development company.

Generate a professional software development proposal based on the input data below. Return ONLY a valid JSON object — no markdown, no code fences, no extra text.

Generate exactly this JSON structure. Draw all facts from INPUT DATA — do not invent business details or numbers.

{
  "clientBusinessDetails": {
    "businessOverview": "2 sentences about the client's business",
    "whatClientDoes": "1 sentence on their core product or service",
    "industryContext": "1 sentence on the industry and domain",
    "businessObjectives": "2 sentences on their goals for this project"
  },
  "aboutInvennico": "3 sentences introducing Invennico TechnoLabs — highlight strengths in web, mobile, SaaS, AI, and enterprise delivery",
  "executiveSummary": {
    "visionUnderstanding": "2 sentences on what the client wants to achieve",
    "proposedSolution": "2 sentences on the solution being proposed",
    "keyOutcomes": "2 sentences on measurable business outcomes",
    "whyThisApproach": "2 sentences justifying the technical and delivery approach"
  },
  "proposedSolution": {
    "overview": "2 sentences on system architecture and purpose",
    "components": ["Component 1", "Component 2", "Component 3", "Component 4"]
  },
  "scopeOfWork": [
    {
      "number": "2.1",
      "name": "Module Name",
      "description": "1 sentence module introduction",
      "scopeIncludes": [
        { "groupTitle": "Group Name", "items": ["Feature 1", "Feature 2", "Feature 3"] }
      ],
      "objective": "1 sentence objective"
    }
  ],
  "deliverables": [
    { "groupTitle": "Group Name", "items": ["Item 1", "Item 2", "Item 3"] }
  ],
  "technicalArchitecture": [
    { "groupTitle": "Layer Name", "items": ["Tech 1", "Tech 2", "Tech 3"] }
  ],
  "whyChooseUs": [
    {
      "title": "Strength title",
      "description": "1 sentence explanation (omit or empty string if using items only)",
      "items": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
    }
  ],
  "assumptions": [
    { "groupTitle": "Category Name", "items": ["Assumption 1", "Assumption 2", "Assumption 3"] }
  ],
  "outOfScope": [
    { "groupTitle": "Category Name", "items": ["Item 1", "Item 2", "Item 3"] }
  ],
  "milestones": [
    { "phase": "Phase name", "milestone": "Milestone name", "activities": ["Activity 1", "Activity 2", "Activity 3"], "duration": "X weeks" }
  ],
  "postLaunchSupport": {
    "intro": "1 sentence on post-launch support purpose",
    "includedSupport": ["Item 1", "Item 2", "Item 3", "Item 4"],
    "warrantyDescription": "2 sentences on warranty period and what it covers",
    "retainerIntro": "1 sentence introducing optional ongoing support",
    "optionalRetainer": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    "retainerClosing": "1 sentence on SLA and commercials agreed separately"
  }
}

RULES:
- scopeOfWork: 5-7 modules; max 2 groups per module; max 4 items per group; 1 sentence each for description and objective
- deliverables: 4-5 groups; max 5 items per group; items are short phrases not sentences
- technicalArchitecture: 5 groups (Frontend, Backend, Database, Hosting, Security); max 4 short tech names per group
- whyChooseUs: exactly 5 items; each has title + description or items (or both); max 3 bullet items per point
- assumptions: 2-3 groups; max 4 items per group
- outOfScope: 2-3 groups; max 4 items per group; total at least 5 items
- milestones: 4-5 phases; max 4 activities per phase; activities are short phrases not sentences
- proposedSolution.components: max 5 items
- Professional tone, no emojis, no markdown inside string values
- Return ONLY the JSON object`,
};

// ── Section config ─────────────────────────────────────────────────────────────

const SECTIONS: {
  key: keyof AiPrompts;
  title: string;
  icon: React.ReactNode;
  description: string;
  hint: string;
}[] = [
  {
    key: "leadAnalysis",
    title: "Lead Analysis",
    icon: <Brain size={16} />,
    description: "Full prompt used when Claude analyses a lead — includes persona, JSON output schema, and rules.",
    hint: "Only the INPUT block (title, description, notes, PDF content) is appended at runtime. Everything else is here.",
  },
  {
    key: "whatsappFirst",
    title: "WhatsApp First Message",
    icon: <MessageSquare size={16} />,
    description: "Instructions for generating the first WhatsApp outreach message.",
    hint: "At runtime the INPUT block is always appended: Lead Summary (AI analysis), Tech Stack, Timeline, Budget, and Original Lead Description (raw client requirement). Do not include these here.",
  },
  {
    key: "whatsappRegen",
    title: "WhatsApp Follow-up (Refinement)",
    icon: <RefreshCw size={16} />,
    description: "Instructions for refining the WhatsApp message when a revision is requested.",
    hint: "The partner's follow-up notes are always appended after this instruction.",
  },
  {
    key: "geminiResearch",
    title: "Gemini Lead Research",
    icon: <Search size={16} />,
    description: "Full prompt sent to Gemini — includes role, search tasks, and JSON output schema.",
    hint: "At runtime the LEAD DATA block (title, description, contact, attachments) and a final JSON response instruction are always appended after this prompt.",
  },
  {
    key: "proposal",
    title: "Proposal Generation",
    icon: <FileText size={16} />,
    description: "Full prompt for the AI proposal generator — includes persona, JSON structure, and rules.",
    hint: "Only INPUT DATA (lead details, company info) and SECTIONS TO GENERATE are appended at runtime. Everything else is here.",
  },
];

// ── Single section component ───────────────────────────────────────────────────

function PromptSection({
  section,
  serverValue,
  savingKey,
  saveSuccessKey,
  saveErrorKey,
  saveError,
  onClearStatus,
}: {
  section: typeof SECTIONS[number];
  serverValue: string;
  savingKey: keyof AiPrompts | null;
  saveSuccessKey: keyof AiPrompts | null;
  saveErrorKey: keyof AiPrompts | null;
  saveError: string | null;
  onClearStatus: () => void;
}) {
  const dispatch = useAppDispatch();
  const [draft, setDraft] = useState(serverValue?.trim() ? serverValue : DEFAULTS[section.key]);
  const [prevServerValue, setPrevServerValue] = useState(serverValue);
  const [isOpen, setIsOpen] = useState(false);

  // Sync draft when the server value changes (setState-during-render avoids the useEffect cascade)
  if (prevServerValue !== serverValue) {
    setPrevServerValue(serverValue);
    setDraft(serverValue?.trim() ? serverValue : DEFAULTS[section.key]);
  }

  // Auto-clear success/error banner after 3s
  useEffect(() => {
    if (saveSuccessKey === section.key || saveErrorKey === section.key) {
      const t = setTimeout(() => onClearStatus(), 3000);
      return () => clearTimeout(t);
    }
  }, [saveSuccessKey, saveErrorKey, section.key, onClearStatus]);

  const isSaving = savingKey === section.key;
  const isSuccess = saveSuccessKey === section.key;
  const isError = saveErrorKey === section.key;
  const savedValue = serverValue?.trim() ? serverValue : DEFAULTS[section.key];
  const isDirty = draft !== savedValue;
  const wordCount = draft.trim().split(/\s+/).filter(Boolean).length;
  const charCount = draft.length;

  function handleSave() {
    dispatch(saveSinglePrompt({ key: section.key, value: draft.trim() }));
  }

  function handleDiscard() {
    setDraft(savedValue);
  }

  function handleRestoreDefault() {
    setDraft(DEFAULTS[section.key]);
  }

  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-off-white transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-primary">{section.icon}</span>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{section.title}</span>
              {isDirty && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-warning-bg text-warning-text border border-warning-border">
                  Unsaved
                </span>
              )}
              {isSuccess && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-success-bg text-success-text border border-success-border">
                  Saved
                </span>
              )}
            </div>
            <p className="text-xs text-ternary mt-0.5">{section.description}</p>
          </div>
        </div>
        {isOpen ? <ChevronUp size={16} className="text-ternary shrink-0" /> : <ChevronDown size={16} className="text-ternary shrink-0" />}
      </button>

      {isOpen && (
        <div className="border-t border-border">
          {/* Hint */}
          <div className="px-5 py-2.5 bg-blue-50 border-b border-blue-100">
            <p className="text-xs text-blue-700">{section.hint}</p>
          </div>

          {/* Feedback banners */}
          {isSuccess && (
            <div className="flex items-center gap-2 mx-5 mt-3 px-4 py-2.5 rounded-xl bg-success-bg border border-success-border text-success-text text-xs font-medium">
              <CheckCircle2 size={14} /> Prompt saved — new AI calls will use this custom prompt.
            </div>
          )}
          {isError && (
            <div className="flex items-center gap-2 mx-5 mt-3 px-4 py-2.5 rounded-xl bg-error-bg border border-error-border text-error-text text-xs font-medium">
              <AlertCircle size={14} /> {saveError}
            </div>
          )}

          {/* Editor top bar */}
          <div className="bg-gray-50 border-b border-border px-5 py-2 flex items-center justify-between mt-3">
            <span className="text-xs font-semibold text-ternary uppercase tracking-wider">Prompt Editor</span>
            <div className="flex items-center gap-4 text-xs font-medium text-ternary">
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full h-52 p-4 text-sm text-foreground bg-white border-0 focus:outline-none focus:ring-0 font-mono resize-y leading-relaxed"
          />

          {/* Section action bar */}
          <div className="px-5 py-3 border-t border-border bg-gray-50 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRestoreDefault}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-ternary rounded-lg hover:bg-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 size={13} /> Restore Default
              </button>
              <button
                type="button"
                onClick={handleDiscard}
                disabled={!isDirty}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border text-foreground rounded-lg hover:bg-white text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              >
                <RotateCcw size={13} /> Discard
              </button>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
              {isSaving ? "Saving..." : "Save Prompt"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Tab root ───────────────────────────────────────────────────────────────────

export function PromptTab() {
  const dispatch = useAppDispatch();
  const { aiPrompts, promptLoading, promptSavingKey, promptSaveSuccessKey, promptSaveErrorKey, promptSaveError } =
    useAppSelector((s: RootState) => s.settings);

  useEffect(() => {
    dispatch(fetchPrompt());
  }, [dispatch]);

  const handleClearStatus = useCallback(() => {
    dispatch(clearPromptStatus());
  }, [dispatch]);

  if (promptLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-ternary">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading prompts...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in-50 duration-200">
      <div>
        <h2 className="text-base font-bold text-foreground">AI Prompts</h2>
        <p className="text-sm text-ternary mt-0.5">
          Customize instructions for each AI feature. Leave blank (or restore default) to use the built-in prompt.
          Each section saves independently.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <PromptSection
          key={section.key}
          section={section}
          serverValue={aiPrompts[section.key]}
          savingKey={promptSavingKey}
          saveSuccessKey={promptSaveSuccessKey}
          saveErrorKey={promptSaveErrorKey}
          saveError={promptSaveError}
          onClearStatus={handleClearStatus}
        />
      ))}
    </div>
  );
}
