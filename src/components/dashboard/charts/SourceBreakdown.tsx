"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";
import { SourceBreakdownPoint } from "@/state/dashboard/dashboardSlice";

const COLORS = [
  "var(--primary)",
  "var(--blue)",
  "var(--green)",
  "var(--purple)",
  "var(--yellow)",
  "var(--ternary)",
];

const CustomLegend = ({ payload }: any) => {
  if (!payload) return null;
  return (
    <div className="flex flex-col gap-y-3 px-2 mt-8">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center justify-between group cursor-pointer">
          <div className="flex items-center gap-3">
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.payload?.fill || entry.color }}
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

interface SourceBreakdownProps {
  data: SourceBreakdownPoint[];
  isLoading?: boolean;
}

export function SourceBreakdown({ data = [], isLoading }: SourceBreakdownProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-[480px] flex flex-col">
      <h2 className="font-bold text-base mb-2">Lead Source Breakdown</h2>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
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
                nameKey="name"
                stroke="none"
              >
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [`${value}% (${props.payload.count})`, name]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--background)",
                  color: "var(--ternary)",
                }}
              />
              <Legend verticalAlign="bottom" content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
