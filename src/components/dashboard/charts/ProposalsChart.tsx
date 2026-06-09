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
import { ProposalsChartPoint } from "@/state/dashboard/dashboardSlice";

interface ProposalsChartProps {
  data: ProposalsChartPoint[];
  isLoading?: boolean;
}

export function ProposalsChart({ data = [], isLoading }: ProposalsChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-[400px] flex flex-col">
      <h3 className="font-bold text-base mb-6">Proposals Sent vs Closed Deals</h3>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
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
                allowDecimals={false}
                width={40}
              />
              <Tooltip
                cursor={{ fill: "var(--off-white)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--background)",
                  color: "var(--ternary)",
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: "20px" }}
              />
              <Bar dataKey="sent" name="Sent" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={12} />
              <Bar dataKey="closed" name="Closed" fill="var(--green)" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
