"use client";

import React, { useState, useRef, useEffect } from "react";
import { GripVertical, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchSettings, updateSettings, clearSaveStatus } from "@/state/settings/settingsSlice";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Mapping between frontend display IDs and backend camelCase keys ───────────

const SECTION_MAP: { id: string; label: string }[] = [
  { id: "coverPage",             label: "Cover Page"                      },
  { id: "clientBusinessDetails", label: "Client Business Details"         },
  { id: "aboutInvennico",        label: "About Invennico TechnoLabs"      },
  { id: "executiveSummary",      label: "Executive Summary"               },
  { id: "proposedSolution",      label: "Proposed Solution"               },
  { id: "scopeOfWork",           label: "Scope of Work"                   },
  { id: "deliverables",          label: "Deliverables"                    },
  { id: "technicalArchitecture", label: "Technical Architecture"          },
  { id: "whyChooseUs",           label: "Why Choose Us?"                  },
  { id: "assumptions",           label: "Assumptions"                     },
  { id: "outOfScope",            label: "Out of Scope"                    },
  { id: "milestones",            label: "Project Milestones & Timelines"  },
  { id: "clientQuestions",       label: "Questions for Client"            },
  { id: "postLaunchSupport",     label: "Post-Launch Support"             },
];

interface Section {
  id: string;
  label: string;
  enabled: boolean;
}

// Build section list from backend proposalSections data
function buildSectionsFromBackend(proposalSections: any[]): Section[] {
  if (!proposalSections?.length) {
    return SECTION_MAP.map((s) => ({ ...s, enabled: true }));
  }

  const sorted = [...proposalSections].sort((a, b) => a.order - b.order);
  return sorted.map((bs) => {
    const meta = SECTION_MAP.find((s) => s.id === bs.key);
    return {
      id: bs.key,
      label: meta?.label || bs.key,
      enabled: bs.enabled,
    };
  });
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
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
  const dispatch = useAppDispatch();
  const { settings, isLoading, isSaving, saveSuccess, saveError } = useAppSelector(
    (s: any) => s.settings
  );

  const [sections, setSections] = useState<Section[]>([]);
  const dragIndex = useRef<number | null>(null);

  // Load settings on mount
  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  // Populate sections whenever settings load
  useEffect(() => {
    if (settings?.proposalSections) {
      setSections(buildSectionsFromBackend(settings.proposalSections));
    }
  }, [settings]);

  // Auto-clear success banner after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const t = setTimeout(() => dispatch(clearSaveStatus()), 3000);
      return () => clearTimeout(t);
    }
  }, [saveSuccess, dispatch]);

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

  async function handleSave() {
    const proposalSections = sections.map((s, idx) => ({
      key: s.id,
      enabled: s.enabled,
      order: idx + 1,
    }));

    dispatch(updateSettings({ proposalSections }));
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 gap-3 text-ternary">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-semibold text-foreground">Scope Document Template</h2>
        <p className="text-sm text-ternary mt-1">
          Customize proposal structure by enabling, disabling, or reordering sections
        </p>
      </div>

      {/* Save feedback banners */}
      {saveSuccess && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success-bg border border-success-border text-success-text text-sm font-medium">
          <CheckCircle2 size={16} />
          Template configuration saved successfully.
        </div>
      )}
      {saveError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error-bg border border-error-border text-error-text text-sm font-medium">
          <AlertCircle size={16} />
          {saveError}
        </div>
      )}

      {/* Draggable section list */}
      <div className="space-y-2">
        {sections.map((section, index) => (
          <div
            key={section.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnd={handleDragEnd}
            className="flex items-center gap-3 px-3 sm:px-4 py-3 bg-white border border-border rounded-xl select-none cursor-grab active:cursor-grabbing"
          >
            <GripVertical size={16} className="text-gray-400 shrink-0" />
            <span className="flex-1 text-sm font-bold text-foreground">{section.label}</span>
            <Toggle enabled={section.enabled} onChange={() => toggleSection(section.id)} />
          </div>
        ))}
      </div>

      {/* Tip */}
      <div className="border border-orange-200 bg-orange-50 rounded-xl px-4 py-3 text-sm text-gray-700">
        <span className="mr-1">💡</span>
        <span>
          <span className="font-semibold">Tip:</span> Drag sections to reorder them. Disabled
          sections won&apos;t appear in generated proposals.
        </span>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          {isSaving && <Loader2 size={15} className="animate-spin" />}
          {isSaving ? "Saving..." : "Save Template Configuration"}
        </button>
      </div>
    </div>
  );
}
