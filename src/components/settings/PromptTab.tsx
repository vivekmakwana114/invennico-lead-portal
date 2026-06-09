"use client";

import React, { useState, useEffect } from "react";
import { Trash2, RotateCcw, Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchPrompt, savePrompt, clearPromptStatus } from "@/state/settings/settingsSlice";
import type { RootState } from "@/state/store";

const DEFAULT_PROMPT = `You are a senior pre-sales consultant at Invennico TechnoLabs, a digital product development company.

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
- Keep estimates realistic based on industry standards
- Think like a CTO + sales strategist
- Tech stack names must be SHORT and CLEAN — single standard identifiers only (e.g. "React", "Node.js", "PostgreSQL", "AWS", "TypeScript", "Flutter"). No descriptions, no parenthetical notes, no version numbers, no "with X" or "for X" suffixes
- Return ONLY the JSON object`;

export function PromptTab() {
  const dispatch = useAppDispatch();
  const { aiPrompt, promptLoading, promptSaving, promptSaveSuccess, promptSaveError } =
    useAppSelector((s: RootState) => s.settings);

  const [draft, setDraft] = useState("");
  const [serverPrompt, setServerPrompt] = useState("");

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchPrompt());
  }, [dispatch]);

  // Sync server value into editor once loaded
  useEffect(() => {
    const resolved = aiPrompt?.trim() ? aiPrompt : DEFAULT_PROMPT;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(resolved);
    setServerPrompt(resolved);
  }, [aiPrompt]);

  // Auto-clear success banner
  useEffect(() => {
    if (promptSaveSuccess) {
      const t = setTimeout(() => dispatch(clearPromptStatus()), 3000);
      return () => clearTimeout(t);
    }
  }, [promptSaveSuccess, dispatch]);

  const isDirty = draft !== serverPrompt;
  const wordCount = draft.trim() ? draft.trim().split(/\s+/).length : 0;
  const charCount = draft.length;

  function handleSave() {
    if (!draft.trim()) return;
    dispatch(savePrompt(draft.trim()));
  }

  function handleReset() {
    setDraft(serverPrompt);
  }

  function handleRestoreDefault() {
    setDraft(DEFAULT_PROMPT);
  }

  if (promptLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-ternary">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading prompt...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-foreground">AI Lead Analysis Prompt</h2>
        <p className="text-sm text-ternary mt-0.5">
          Customize the instructions the AI uses when analyzing a new lead.
        </p>
      </div>

      {/* Save feedback */}
      {promptSaveSuccess && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success-bg border border-success-border text-success-text text-sm font-medium">
          <CheckCircle2 size={16} />
          Prompt saved successfully. New leads will use this prompt for AI analysis.
        </div>
      )}
      {promptSaveError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error-bg border border-error-border text-error-text text-sm font-medium">
          <AlertCircle size={16} />
          {promptSaveError}
        </div>
      )}

      <div className="space-y-4">
        <div className="border border-border rounded-xl bg-white overflow-hidden shadow-sm flex flex-col">
          {/* Editor top bar */}
          <div className="bg-gray-50 border-b border-border px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-ternary uppercase tracking-wider">
              System Prompt Editor
            </span>
            <div className="flex items-center gap-4 text-xs font-medium text-ternary">
              <span>{wordCount} words</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Enter the AI system prompt..."
            className="w-full h-[480px] p-4 text-sm text-foreground bg-white border-0 focus:outline-none focus:ring-0 font-mono resize-y leading-relaxed"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreDefault}
              className="flex items-center gap-1.5 px-4 py-2 border border-border text-ternary rounded-lg hover:bg-off-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
              Restore Default
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty}
              className="flex items-center gap-1.5 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-off-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <RotateCcw size={15} />
              Discard Changes
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || promptSaving || !draft.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {promptSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {promptSaving ? "Saving..." : "Save Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}
