"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const data = [
  { name: "Alliance", value: 35, color: "var(--primary)" },
  { name: "Direct", value: 28, color: "var(--blue)" },
  { name: "Referral", value: 22, color: "var(--green)" },
  { name: "Upwork", value: 15, color: "var(--purple)" },
  { name: "Other", value: 10, color: "var(--yellow)" },
];

/**
 * Custom Legend component to display data in a vertical list format as per screenshot.
 */
const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;

  return (
    <div className="flex flex-col gap-y-3 px-2 mt-8">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div 
              className="w-2.5 h-2.5 rounded-full shrink-0" 
              style={{ backgroundColor: entry.payload?.color || entry.color }} 
            />
            <span className="text-sm font-medium text-ternary group-hover:text-foreground transition-colors">
              {entry.value}
            </span>
          </div>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {entry.payload.value}%
          </span>
        </div>
      ))}
    </div>
  );
};

export function SourceBreakdown() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-[480px] flex flex-col">
      <h2 className="font-bold text-base mb-2">Lead Source Breakdown</h2>
      <div className="flex-1 w-full min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 40, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={data}
              cx="50%"
              cy="40%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: "12px", 
                border: "1px solid var(--border)", 
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                backgroundColor: "var(--background)",
                color: "var(--ternary)"
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              content={<CustomLegend />}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
