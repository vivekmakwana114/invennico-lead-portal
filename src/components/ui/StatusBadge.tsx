"use client";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  qualified:       { label: "Qualified",      className: "bg-success-bg text-success-text border border-success-border" },
  "under-review":  { label: "Under Review",   className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
  "proposal-sent": { label: "Proposal Sent",  className: "bg-purple-50 text-purple-700 border border-purple-200" },
  won:             { label: "Won",            className: "bg-teal-50 text-teal-700 border border-teal-200" },
  new:             { label: "New",            className: "bg-gray-100 text-gray-600 border border-gray-200" },
  rejected:        { label: "Rejected",       className: "bg-gray-100 text-gray-600 border border-gray-300" },
  lost:            { label: "Lost",           className: "bg-error-bg text-error-text border border-error-border" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? { label: status, className: "bg-gray-100 text-gray-600 border border-gray-200" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.className}`}>
      {config.label}
    </span>
  );
}
