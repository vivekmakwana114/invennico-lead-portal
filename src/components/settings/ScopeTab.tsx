"use client";

import React, { useState, useRef } from "react";
import { GripVertical } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Section {
  id: string;
  label: string;
  enabled: boolean;
}

const defaultSections: Section[] = [
  { id: "executive-summary", label: "Executive Summary", enabled: true },
  { id: "project-overview", label: "Project Overview", enabled: true },
  { id: "technical-approach", label: "Technical Approach", enabled: true },
  { id: "tech-stack", label: "Tech Stack & Architecture", enabled: true },
  { id: "timeline", label: "Timeline & Milestones", enabled: true },
  { id: "budget", label: "Budget Breakdown", enabled: true },
  { id: "team-structure", label: "Team Structure", enabled: true },
  { id: "terms", label: "Terms & Conditions", enabled: true },
];

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        enabled ? "bg-primary" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export function ScopeTab() {
  const [sections, setSections] = useState<Section[]>(defaultSections);
  const dragIndex = useRef<number | null>(null);

  function toggleSection(id: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === index) return;
    setSections((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(index, 0, moved);
      return next;
    });
    dragIndex.current = index;
  }

  function handleDragEnd() {
    dragIndex.current = null;
  }

  function handleSave() {
    // placeholder — wire to backend when ready
    console.log("Saved sections:", sections);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Scope Document Template
        </h2>
        <p className="text-sm text-ternary mt-1">
          Customize proposal structure by enabling, disabling, or reordering sections
        </p>
      </div>

      {/* Draggable section list */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-white border border-border rounded-xl cursor-grab active:cursor-grabbing select-none"
          >
            <GripVertical size={16} className="text-gray-400 shrink-0" />
            <span className="flex-1 text-sm font-bold text-foreground">
              {section.label}
            </span>
            <Toggle
              enabled={section.enabled}
              onChange={() => toggleSection(section.id)}
            />
          </div>
        ))}
      </div>

      {/* Tip box */}
      <div className="border border-orange-200 bg-orange-50 rounded-xl px-4 py-3 text-sm text-gray-700">
        <span className="mr-1">💡</span>
        <span>
          <span className="font-semibold">Tip:</span> Drag sections to reorder
          them. Disabled sections won&apos;t appear in generated proposals.
        </span>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          Save Template Configuration
        </button>
      </div>
    </div>
  );
}
