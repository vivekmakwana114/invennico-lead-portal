"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { LeadsChartPoint } from "@/state/dashboard/dashboardSlice";

const CustomLegend = (props: any) => {
  const { payload } = props;
  return (
    <div className="flex justify-center gap-6 pt-5">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <Image
            src={entry.dataKey === "received" ? "/assets/icons/received.svg" : "/assets/icons/qualified.svg"}
            alt={entry.value}
            width={16}
            height={16}
          />
          <span className="text-md font-medium" style={{ color: entry.dataKey === "received" ? "var(--blue)" : "var(--green)" }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

interface LeadsChartProps {
  data: LeadsChartPoint[];
  isLoading?: boolean;
}

export function LeadsChart({ data = [], isLoading }: LeadsChartProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm h-[400px] flex flex-col">
      <h3 className="font-bold text-base mb-6">Leads Received vs Qualified</h3>
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
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
                domain={[0, "auto"]}
                allowDecimals={false}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  backgroundColor: "var(--background)",
                  color: "var(--ternary)",
                }}
              />
              <Legend verticalAlign="bottom" align="center" content={<CustomLegend />} />
              <Line
                type="monotone"
                dataKey="received"
                name="Received"
                stroke="var(--blue)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--background)", strokeWidth: 2, stroke: "var(--blue)" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="qualified"
                name="Qualified"
                stroke="var(--green)"
                strokeWidth={2}
                dot={{ r: 4, fill: "var(--background)", strokeWidth: 2, stroke: "var(--green)" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
