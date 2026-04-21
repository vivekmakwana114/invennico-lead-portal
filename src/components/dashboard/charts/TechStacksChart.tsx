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

const data = [
  { name: "React + Node.js", value: 45 },
  { name: "Next.js + PostgreSQL", value: 38 },
  { name: "Vue.js + Express", value: 28 },
  { name: "React Native + Firebase", value: 22 },
  { name: "Angular + .NET", value: 16 },
];

export function TechStacksChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-[400px] flex flex-col">
      <h3 className="font-bold text-base mb-6">Most Used Tech Stacks</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ right: 30, top: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.5} />
            <XAxis type="number"  />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={{ stroke: "var(--ternary)" }}
              tickLine={false} 
              tick={{ fill: "var(--ternary)", fontSize: 14, fontWeight: 500 }}
              width={140}
            />
            <Tooltip 
              cursor={{ fill: "var(--off-white)" }}
              contentStyle={{ 
                borderRadius: "12px", 
                border: "1px solid var(--border)", 
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                backgroundColor: "var(--background)",
                color: "var(--ternary)"
              }}
            />
            <Bar 
              dataKey="value" 
              fill="var(--primary)" 
              radius={[0, 4, 4, 0]} 
              barSize={20}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="var(--primary)" opacity={1 - (index * 0.15)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
