"use client";

import React from "react";
import { FileText, CheckCircle2, Briefcase, TrendingUp } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "proposal",
    title: "Proposal sent",
    subtitle: "SaaS Analytics Platform",
    time: "30 mins ago",
    icon: FileText,
    iconColor: "text-[#EA580C]",
    bgColor: "bg-[#FFF7ED]",
  },
  {
    id: 2,
    type: "qualification",
    title: "Lead qualified",
    subtitle: "Mobile Banking App",
    time: "2 hours ago",
    icon: CheckCircle2,
    iconColor: "text-[#16A34A]",
    bgColor: "bg-[#F0FDF4]",
  },
  {
    id: 3,
    type: "document",
    title: "Scope document created",
    subtitle: "E-learning Portal",
    time: "4 hours ago",
    icon: Briefcase,
    iconColor: "text-[#2563EB]",
    bgColor: "bg-[#EFF6FF]",
  },
  {
    id: 4,
    type: "sync",
    title: "Synced to Zoho CRM",
    subtitle: "CRM Integration Project",
    time: "6 hours ago",
    icon: TrendingUp,
    iconColor: "text-[#9333EA]",
    bgColor: "bg-[#FAF5FF]",
  },
];

export function RecentActivity() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-lg text-foreground mb-8">Recent Activity</h3>
      <div className="space-y-8">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl ${activity.bgColor} flex items-center justify-center shrink-0 border border-transparent`}>
              <activity.icon size={20} className={activity.iconColor} />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm text-foreground mb-0.5">{activity.title}</h4>
              <p className="text-xs text-ternary font-medium">{activity.subtitle}</p>
              <p className="text-xs text-ternary mt-1 font-medium opacity-80">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
