"use client";

import React, { useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const defaultRates = [
  { role: "Intern",    rate: 15 },
  { role: "Junior",   rate: 30 },
  { role: "Mid-Level",rate: 50 },
  { role: "Senior",   rate: 75 },
  { role: "Architect",rate: 100 },
];

const defaultFixedMultipliers = [
  { label: "Low Complexity",    value: "1.0x" },
  { label: "Medium Complexity", value: "1.3x" },
  { label: "High Complexity",   value: "1.6x" },
];

const defaultTimelineMultipliers = [
  { label: "Rush Delivery (< 2 months)", value: "1.4x" },
  { label: "Standard (2-6 months)",      value: "1.0x" },
  { label: "Extended (> 6 months)",      value: "0.9x" },
];

function RateRow({
  role,
  value,
  onChange,
  last,
}: {
  role: string;
  value: number;
  onChange: (v: number) => void;
  last: boolean;
}) {
  return (
    <div className={cn("flex items-center gap-4 py-3", !last && "border-b border-border")}>
      <span className="flex-1 text-sm text-foreground">{role}</span>
      <div className="flex items-center gap-1 w-56">
        <span className="text-sm text-ternary">$</span>
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 px-3 py-1.5 border border-border rounded-lg text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
        />
        <span className="text-sm text-ternary w-10 text-right">/hour</span>
      </div>
    </div>
  );
}

function MultiplierRow({
  label,
  value,
  onChange,
  last,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  last: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-4 py-3", !last && "border-b border-border")}>
      <span className="text-sm text-foreground">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 px-3 py-1.5 border border-border rounded-lg text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-center"
      />
    </div>
  );
}

export function PricingTab() {
  const [rates, setRates] = useState(defaultRates);
  const [fixedMultipliers, setFixedMultipliers] = useState(defaultFixedMultipliers);
  const [timelineMultipliers, setTimelineMultipliers] = useState(defaultTimelineMultipliers);

  const updateRate = (index: number, value: number) =>
    setRates((prev) => prev.map((r, i) => (i === index ? { ...r, rate: value } : r)));

  const updateFixed = (index: number, value: string) =>
    setFixedMultipliers((prev) => prev.map((m, i) => (i === index ? { ...m, value } : m)));

  const updateTimeline = (index: number, value: string) =>
    setTimelineMultipliers((prev) => prev.map((m, i) => (i === index ? { ...m, value } : m)));

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div>
        <h2 className="text-base font-bold text-foreground">Pricing Configuration</h2>
        <p className="text-sm text-ternary mt-0.5">
          Configure hourly rates and pricing multipliers for cost estimation
        </p>
      </div>

      {/* Engineer Rates */}
      <div className="border border-border rounded-xl p-5 bg-white">
        <h3 className="text-sm font-bold text-foreground mb-1">Engineer Rates by Role</h3>
        <div>
          {rates.map((r, i) => (
            <RateRow
              key={r.role}
              role={r.role}
              value={r.rate}
              onChange={(v) => updateRate(i, v)}
              last={i === rates.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Multipliers row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fixed Project Multipliers */}
        <div className="border border-border rounded-xl p-5 bg-white">
          <h3 className="text-sm font-bold text-foreground mb-1">Fixed Project Multipliers</h3>
          <div>
            {fixedMultipliers.map((m, i) => (
              <MultiplierRow
                key={m.label}
                label={m.label}
                value={m.value}
                onChange={(v) => updateFixed(i, v)}
                last={i === fixedMultipliers.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Timeline Multipliers */}
        <div className="border border-border rounded-xl p-5 bg-white">
          <h3 className="text-sm font-bold text-foreground mb-1">Timeline Multipliers</h3>
          <div>
            {timelineMultipliers.map((m, i) => (
              <MultiplierRow
                key={m.label}
                label={m.label}
                value={m.value}
                onChange={(v) => updateTimeline(i, v)}
                last={i === timelineMultipliers.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button
          type="button"
          className="px-6 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
        >
          Save Pricing Configuration
        </button>
      </div>
    </div>
  );
}
