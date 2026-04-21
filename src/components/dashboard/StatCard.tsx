"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    isUp: boolean;
  };
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  trend,
  icon,
  description,
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-white p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow", className)}>
      <div className="flex justify-between items-start mb-4">
        <div>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs px-2 py-1 rounded-lg",
            trend.isUp ? "bg-success-bg text-success-text" : "bg-error-bg text-error-text"
          )}>
            {trend.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trend.isUp ? "+" : "-"}{trend.value}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
        <p className="text-ternary text-sm font-medium">{label}</p>
        {description && (
          <p className="text-ternary text-xs mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}
