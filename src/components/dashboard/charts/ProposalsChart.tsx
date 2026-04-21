"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", sent: 20, closed: 14 },
  { month: "Feb", sent: 24, closed: 16 },
  { month: "Mar", sent: 22, closed: 15 },
  { month: "Apr", sent: 28, closed: 19 },
  { month: "May", sent: 26, closed: 18 },
  { month: "Jun", sent: 31, closed: 21 },
];

export function ProposalsChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-[400px] flex flex-col">
      <h3 className="font-bold text-base mb-6">Proposals Sent vs Closed Deals</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={true} 
              stroke="var(--border)" 
              opacity={0.5}
            />
            <XAxis 
              dataKey="month" 
              axisLine={{ stroke: "var(--ternary)" }}
              tickLine={{ stroke: "var(--border)" }} 
              tick={{ fill: "var(--ternary)", fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={{ stroke: "var(--ternary)" }} 
              tickLine={{ stroke: "var(--border)" }} 
              tick={{ fill: "var(--ternary)", fontSize: 12 }} 
              width={40}
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
            <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
            <Bar 
              dataKey="sent" 
              name="Sent" 
              fill="var(--primary)" 
              radius={[4, 4, 0, 0]} 
              barSize={12}
            />
            <Bar 
              dataKey="closed" 
              name="Closed" 
              fill="var(--green)" 
              radius={[4, 4, 0, 0]} 
              barSize={12}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
