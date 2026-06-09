"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TechStackPoint } from "@/state/dashboard/dashboardSlice";

interface TechStacksChartProps {
  data: TechStackPoint[];
  isLoading?: boolean;
}

export function TechStacksChart({ data = [], isLoading }: TechStacksChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-[400px] flex flex-col">
      <h3 className="font-bold text-base mb-6">Most Used Tech Stacks</h3>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-ternary text-sm">
          No analyzed leads yet
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ right: 30, top: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={{ stroke: "var(--ternary)" }}
                tickLine={false}
                tick={{ fill: "var(--ternary)", fontSize: 13, fontWeight: 500 }}
                width={140}
              />
              <Tooltip
                cursor={{ fill: "var(--off-white)" }}
                formatter={(value) => [value, "Leads"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--background)",
                  color: "var(--ternary)",
                }}
              />
              <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={20}>
                {data.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill="var(--primary)" opacity={1 - index * 0.1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
