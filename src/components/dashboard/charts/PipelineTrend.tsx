"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PipelineChartPoint } from "@/state/dashboard/dashboardSlice";

interface PipelineTrendChartProps {
  data: PipelineChartPoint[];
  isLoading?: boolean;
}

export function PipelineTrendChart({ data = [], isLoading }: PipelineTrendChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-[480px] flex flex-col">
      <h3 className="font-bold text-base mb-6">Pipeline Value Trend</h3>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--purple)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--purple)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="var(--border)" opacity={0.5} />
              <XAxis
                dataKey="label"
                axisLine={{ stroke: "var(--ternary)" }}
                tickLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--ternary)", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={{ stroke: "var(--ternary)" }}
                tickLine={{ stroke: "var(--border)" }}
                tick={{ fill: "var(--ternary)", fontSize: 12 }}
                tickFormatter={(v) => `$${v}K`}
                allowDecimals={false}
                width={50}
              />
              <Tooltip
                formatter={(value) => [`$${value}K`, "Value"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--background)",
                  color: "var(--ternary)",
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--purple)"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
