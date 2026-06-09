"use client";

import React from "react";
import { RecentLead } from "@/state/dashboard/dashboardSlice";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-off-white text-ternary",
  qualified: "bg-success-bg text-success-text",
  "engagement-started": "bg-[#EFF6FF] text-[#2563EB]",
  "proposal-sent": "bg-[#EFF6FF] text-[#2563EB]",
  won: "bg-success-bg text-success-text",
  drop: "bg-error-bg text-error-text",
};

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  qualified: "Qualified",
  "engagement-started": "Engaged",
  "proposal-sent": "Proposal Sent",
  won: "Won",
  drop: "Dropped",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface RecentLeadsProps {
  data: RecentLead[];
  isLoading?: boolean;
}

export function RecentLeads({ data = [], isLoading }: RecentLeadsProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-lg text-foreground mb-6">Recent Leads</h3>
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-off-white animate-pulse" />
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-ternary">No leads yet</p>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
          {data.map((lead) => (
            <div
              key={lead.id}
              className="p-4 rounded-xl bg-off-white border border-transparent hover:border-border transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-foreground mb-0.5 truncate">{lead.title}</h4>
                  <p className="text-[11px] text-ternary font-medium">
                    {lead.leadId} · {lead.source}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ml-2 ${
                    STATUS_STYLES[lead.status] || "bg-off-white text-ternary"
                  }`}
                >
                  {STATUS_LABELS[lead.status] || lead.status}
                </span>
              </div>
              <div className="flex justify-between items-end mt-4">
                <span className="font-bold text-sm text-ternary">{lead.budget || "N/A"}</span>
                <span className="text-xs text-ternary font-medium">{timeAgo(lead.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
