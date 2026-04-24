"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Eye, SquarePen, Download, Clock, CircleCheck, FileText, Sparkles } from "lucide-react";
import { type Column } from "@/components/ui/GridComponent";
import { StatusBadge } from "@/components/ui/StatusBadge";

// ── Types ────────────────────────────────────────────────────────────────────

export type LeadTag = "crm-synced" | "crm-pending" | "proposal-synced" | "poc";
export type LeadStatus =
  | "qualified"
  | "under-review"
  | "proposal-sent"
  | "won"
  | "new"
  | "rejected"
  | "lost";

export interface Lead extends Record<string, unknown> {
  id: string;
  projectName: string;
  tags: LeadTag[];
  source: string;
  dateReceived: string;
  status: LeadStatus;
  budget: string;
  timeline: string;
  proposal: string;
}

// ── Cell Renderers ────────────────────────────────────────────────────────────


function TagList({ tags }: { tags: LeadTag[] }) {
  const map: Record<LeadTag, { label: string; icon: React.ReactNode; className: string }> = {
    "crm-synced": { label: "CRM Synced", icon: <CircleCheck size={12} />, className: "bg-success-bg text-success-text" },
    "crm-pending": { label: "CRM Pending", icon: <Clock size={12} />, className: "bg-yellow-50 text-yellow-600" },
    "proposal-synced": { label: "Proposal Synced", icon: <FileText size={12} />, className: "bg-blue-50 text-blue-600" },
    "poc": { label: "AI Analyzed", icon: <Sparkles size={12} />, className: "bg-primary/10 text-primary" },
  };
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {tags.map((tag) => {
        const { label, icon, className } = map[tag];
        return (
          <span key={tag} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${className}`}>
            {icon}
            {label}
          </span>
        );
      })}
    </div>
  );
}

function ActionButtons({ id }: { id: string }) {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="p-1.5 rounded-lg text-ternary hover:text-foreground hover:bg-off-white transition-colors cursor-pointer"
        title="View"
        onClick={() => router.push(`/leads/${id}`)}
      >
        <Eye size={16} />
      </button>
      {/* <button className="p-1.5 rounded-lg text-ternary hover:text-foreground hover:bg-off-white transition-colors cursor-pointer" title="Edit">
        <SquarePen size={16} />
      </button>
      <button className="p-1.5 rounded-lg text-ternary hover:text-foreground hover:bg-off-white transition-colors cursor-pointer" title="Download">
        <Download size={16} />
      </button> */}
    </div>
  );
}

// ── Column Definitions ────────────────────────────────────────────────────────

export const LEADS_COLUMNS: Column<Lead>[] = [
  {
    key: "id",
    header: "Lead ID",
    className: "text-sm font-medium text-ternary whitespace-nowrap",
  },
  {
    key: "projectName",
    header: "Project Name",
    render: (value, row) => (
      <div>
        <p className="font-medium text-foreground text-sm">{value as string}</p>
        <TagList tags={row.tags as LeadTag[]} />
      </div>
    ),
  },
  {
    key: "source",
    header: "Source",
    className: "text-sm text-ternary whitespace-nowrap",
  },
  {
    key: "dateReceived",
    header: "Date Received",
    className: "text-sm text-ternary whitespace-nowrap",
  },
  {
    key: "status",
    header: "Status",
    render: (value) => <StatusBadge status={value as LeadStatus} />,
  },
  {
    key: "budget",
    header: "Budget",
    className: "text-sm text-foreground whitespace-nowrap",
  },
  {
    key: "timeline",
    header: "Timeline",
    className: "text-sm text-ternary whitespace-nowrap",
  },
  {
    key: "proposal",
    header: "Proposal",
    className: "text-sm text-ternary whitespace-nowrap",
  },
  {
    key: "_actions",
    header: "Actions",
    headerClassName: "text-center",
    className: "text-center",
    render: (_, row) => <ActionButtons id={row.id as string} />,
  },
];
