"use client";

import React, { useState } from "react";
import { Trash2, RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";

const defaultPrompt = `You are an expert Sales Engineer and Business Analyst. Your role is to analyze incoming leads and generate a highly tailored, persuasive, and realistic technical proposal and scope document.

Lead Details:
- Title: {{title}}
- Project Details: {{details}}
- Lead Source: {{source}}
- Internal Notes: {{notes}}
- Attachments Summary: {{attachments}}

Instructions:
1. Analyze the lead's requirements, objectives, and pain points.
2. Estimate the project complexity and appropriate tech stack.
3. Formulate a structured scope of work and list of deliverables.
4. Provide a realistic budget estimation and timeline.
5. Ensure all tone is professional, consultative, and value-oriented.`;

export function PromptTab() {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [savedPrompt, setSavedPrompt] = useState(defaultPrompt);

  const characterCount = prompt.length;
  const wordCount = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  function handleSave() {
    if (!prompt.trim()) {
      toast.error("Prompt cannot be empty.");
      return;
    }
    setSavedPrompt(prompt);
    toast.success("AI Prompt template saved successfully!");
  }

  function handleCancel() {
    setPrompt(savedPrompt);
    toast.info("Changes discarded.");
  }

  function handleClear() {
    setPrompt("");
    toast.info("Textarea cleared.");
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-200">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-foreground">AI System Prompt</h2>
        <p className="text-sm text-ternary mt-0.5">
          Tune the AI model&apos;s generation behavior, output structure, and context mapping.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border border-border rounded-xl bg-white overflow-hidden shadow-sm flex flex-col">
          {/* Editor Top Bar */}
          <div className="bg-gray-50 border-b border-border px-4 py-2.5 flex items-center justify-between">
            <span className="text-xs font-semibold text-ternary uppercase tracking-wider">
              System Prompt Editor
            </span>
            <div className="flex items-center gap-4 text-xs font-medium text-ternary">
              <span>{wordCount} words</span>
              <span>{characterCount} characters</span>
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Start typing your custom system prompt here..."
            className="w-full h-96 p-4 text-sm text-foreground bg-white border-0 focus:outline-none focus:ring-0 font-mono resize-y leading-relaxed"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 text-sm font-semibold transition-colors cursor-pointer"
            >
              <Trash2 size={15} />
              Clear
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={prompt === savedPrompt}
              className="flex items-center gap-1.5 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-off-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <RotateCcw size={15} />
              Reset Changes
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={prompt === savedPrompt}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <Save size={15} />
            Save Prompt Template
          </button>
        </div>
      </div>
    </div>
  );
}
