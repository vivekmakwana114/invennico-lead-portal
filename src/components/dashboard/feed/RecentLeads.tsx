"use client";

import React from "react";

const leads = [
  {
    id: "LD-1247",
    name: "E-commerce Mobile App",
    client: "Alliance",
    value: "$45K",
    status: "Qualified",
    time: "2 hours ago",
  },
  {
    id: "LD-1246",
    name: "Healthcare Dashboard",
    client: "Direct",
    value: "$62K",
    status: "Under Review",
    time: "5 hours ago",
  },
  {
    id: "LD-1245",
    name: "Real Estate Platform",
    client: "Referral",
    value: "$88K",
    status: "Qualified",
    time: "1 day ago",
  },
  {
    id: "LD-1244",
    name: "Inventory Management",
    client: "Upwork",
    value: "$34K",
    status: "Proposal Sent",
    time: "1 day ago",
  },
];

const statusStyles: Record<string, string> = {
  Qualified: "bg-success-bg text-success-text",
  "Under Review": "bg-[#FFF7ED] text-[#EA580C]",
  "Proposal Sent": "bg-[#EFF6FF] text-[#2563EB]",
};

export function RecentLeads() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-lg text-foreground mb-6">Recent Leads</h3>
      <div className="space-y-3">
        {leads.map((lead) => (
          <div key={lead.id} className="p-4 rounded-xl bg-off-white border border-transparent hover:border-border transition-all cursor-pointer group">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className=" text-sm text-foreground mb-0.5">{lead.name}</h4>
                <p className="text-[11px] text-ternary font-medium">{lead.id} · {lead.client}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${statusStyles[lead.status] || "bg-gray-100 text-gray-600"}`}>
                {lead.status}
              </span>
            </div>
            <div className="flex justify-between items-end mt-4">
              <span className="font-bold text-sm text-ternary">{lead.value}</span>
              <span className="text-xs text-ternary font-medium">{lead.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
