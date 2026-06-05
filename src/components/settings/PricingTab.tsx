"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchSettings, updateSettings, clearSaveStatus } from "@/state/settings/settingsSlice";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface RateRow { role: string; key: string; value: number }
interface MultiplierRow { label: string; key: string; value: number }

const DEFAULT_RATES: RateRow[] = [
  { role: "Intern",     key: "intern",    value: 15 },
  { role: "Junior",     key: "junior",    value: 30 },
  { role: "Mid-Level",  key: "midLevel",  value: 50 },
  { role: "Senior",     key: "senior",    value: 75 },
  { role: "Architect",  key: "architect", value: 100 },
];

const DEFAULT_COMPLEXITY: MultiplierRow[] = [
  { label: "Low Complexity",    key: "low",    value: 1.0 },
  { label: "Medium Complexity", key: "medium", value: 1.3 },
  { label: "High Complexity",   key: "high",   value: 1.6 },
];

const DEFAULT_TIMELINE: MultiplierRow[] = [
  { label: "Rush Delivery (< 2 months)", key: "rush",     value: 1.4 },
  { label: "Standard (2–6 months)",      key: "standard", value: 1.0 },
  { label: "Extended (> 6 months)",      key: "extended", value: 0.9 },
];

function RateInput({
  row,
  onChange,
  last,
}: {
  row: RateRow;
  onChange: (key: string, v: number) => void;
  last: boolean;
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 py-3", !last && "border-b border-border")}>
      <span className="flex-1 text-sm text-foreground">{row.role}</span>
      <div className="flex items-center gap-1.5 w-full sm:w-56">
        <span className="text-sm text-ternary shrink-0">$</span>
        <input
          type="number"
          min={0}
          value={row.value}
          onChange={(e) => onChange(row.key, Number(e.target.value))}
          className="flex-1 min-w-0 px-3 py-1.5 border border-border rounded-lg text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
        <span className="text-sm text-ternary shrink-0">/hr</span>
      </div>
    </div>
  );
}

function MultiplierInput({
  row,
  onChange,
  last,
}: {
  row: MultiplierRow;
  onChange: (key: string, v: number) => void;
  last: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 py-3", !last && "border-b border-border")}>
      <span className="text-sm text-foreground">{row.label}</span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          min={0}
          step={0.1}
          value={row.value}
          onChange={(e) => onChange(row.key, Number(e.target.value))}
          className="w-20 px-3 py-1.5 border border-border rounded-lg text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-center"
        />
        <span className="text-sm text-ternary shrink-0">x</span>
      </div>
    </div>
  );
}

export function PricingTab() {
  const dispatch = useAppDispatch();
  const { settings, isLoading, isSaving, saveSuccess, saveError } = useAppSelector(
    (s: any) => s.settings
  );

  const [rates, setRates] = useState<RateRow[]>(DEFAULT_RATES);
  const [complexity, setComplexity] = useState<MultiplierRow[]>(DEFAULT_COMPLEXITY);
  const [timeline, setTimeline] = useState<MultiplierRow[]>(DEFAULT_TIMELINE);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!settings?.pricingConfig) return;
    const pc = settings.pricingConfig;

    if (pc.engineerRates) {
      setRates((prev) =>
        prev.map((r) => ({
          ...r,
          value: pc.engineerRates[r.key] ?? r.value,
        }))
      );
    }
    if (pc.complexityMultipliers) {
      setComplexity((prev) =>
        prev.map((r) => ({
          ...r,
          value: pc.complexityMultipliers[r.key] ?? r.value,
        }))
      );
    }
    if (pc.timelineMultipliers) {
      setTimeline((prev) =>
        prev.map((r) => ({
          ...r,
          value: pc.timelineMultipliers[r.key] ?? r.value,
        }))
      );
    }
  }, [settings]);

  useEffect(() => {
    if (saveSuccess) {
      const t = setTimeout(() => dispatch(clearSaveStatus()), 3000);
      return () => clearTimeout(t);
    }
  }, [saveSuccess, dispatch]);

  function updateRate(key: string, value: number) {
    setRates((prev) => prev.map((r) => (r.key === key ? { ...r, value } : r)));
  }

  function updateComplexity(key: string, value: number) {
    setComplexity((prev) => prev.map((r) => (r.key === key ? { ...r, value } : r)));
  }

  function updateTimeline(key: string, value: number) {
    setTimeline((prev) => prev.map((r) => (r.key === key ? { ...r, value } : r)));
  }

  function handleSave() {
    const engineerRates: Record<string, number> = {};
    rates.forEach((r) => { engineerRates[r.key] = r.value; });

    const complexityMultipliers: Record<string, number> = {};
    complexity.forEach((r) => { complexityMultipliers[r.key] = r.value; });

    const timelineMultipliers: Record<string, number> = {};
    timeline.forEach((r) => { timelineMultipliers[r.key] = r.value; });

    dispatch(updateSettings({ pricingConfig: { engineerRates, complexityMultipliers, timelineMultipliers } }));
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
      <div>
        <h2 className="text-base font-bold text-foreground">Pricing Configuration</h2>
        <p className="text-sm text-ternary mt-0.5">
          Configure hourly rates and pricing multipliers for cost estimation
        </p>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success-bg border border-success-border text-success-text text-sm font-medium">
          <CheckCircle2 size={16} />
          Pricing configuration saved successfully.
        </div>
      )}
      {saveError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-error-bg border border-error-border text-error-text text-sm font-medium">
          <AlertCircle size={16} />
          {saveError}
        </div>
      )}

      <div className="border border-border rounded-xl p-5 bg-white">
        <h3 className="text-sm font-bold text-foreground mb-1">Engineer Rates by Role</h3>
        <div>
          {rates.map((r, i) => (
            <RateInput
              key={r.key}
              row={r}
              onChange={updateRate}
              last={i === rates.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-xl p-5 bg-white">
          <h3 className="text-sm font-bold text-foreground mb-1">Fixed Project Multipliers</h3>
          <p className="text-xs text-ternary mb-2">Applied based on project complexity</p>
          <div>
            {complexity.map((r, i) => (
              <MultiplierInput
                key={r.key}
                row={r}
                onChange={updateComplexity}
                last={i === complexity.length - 1}
              />
            ))}
          </div>
        </div>

        <div className="border border-border rounded-xl p-5 bg-white">
          <h3 className="text-sm font-bold text-foreground mb-1">Timeline Multipliers</h3>
          <p className="text-xs text-ternary mb-2">Applied based on delivery speed</p>
          <div>
            {timeline.map((r, i) => (
              <MultiplierInput
                key={r.key}
                row={r}
                onChange={updateTimeline}
                last={i === timeline.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="border border-orange-200 bg-orange-50 rounded-xl px-4 py-3 text-sm text-gray-700">
        <span className="mr-1">💡</span>
        <span>
          <span className="font-semibold">Formula:</span> Budget = (months × 160 hrs × blended rate) × complexity multiplier × timeline multiplier
        </span>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isSaving && <Loader2 size={15} className="animate-spin" />}
          {isSaving ? "Saving..." : "Save Pricing Configuration"}
        </button>
      </div>
    </div>
  );
}
