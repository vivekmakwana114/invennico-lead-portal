"use client";

import React from "react";
import { Clock } from "lucide-react";

const followups = [
  {
    id: 1,
    title: "Fintech Dashboard",
    client: "Acme Corp",
    time: "Today, 3:00 PM",
    priority: "high",
  },
  {
    id: 2,
    title: "IoT Platform",
    client: "Tech Solutions",
    time: "Tomorrow, 10:00 AM",
    priority: "medium",
  },
  {
    id: 3,
    title: "Social Media App",
    client: "StartupXYZ",
    time: "Apr 21, 2:00 PM",
    priority: "low",
  },
];

const priorityStyles: Record<string, string> = {
  high: "bg-[#FEE2E2] text-[#B91C1C]",
  medium: "bg-[#FFEDD5] text-[#C2410C]",
  low: "bg-[#DBEAFE] text-[#1D4ED8]",
};

export function UpcomingFollowUps() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-base mb-6">Upcoming Follow-ups</h3>
      <div className="space-y-4">
        {followups.map((item) => (
          <div key={item.id} className="relative p-4 rounded-xl bg-[#FEF2F2]/50 border border-transparent hover:border-red-100 transition-all cursor-pointer group flex flex-col pl-6">
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF5C3D] rounded-l-xl opacity-80" />
            
            <div className="flex justify-between items-start mb-1">
              <h4 className=" text-sm text-foreground">{item.title}</h4>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${priorityStyles[item.priority]}`}>
                {item.priority}
              </span>
            </div>
            
            <p className="text-xs text-ternary mb-4 font-medium">{item.client}</p>
            
            <div className="flex items-center gap-2 text-ternary mt-auto">
               <Clock size={14} className="opacity-70" />
               <span className="text-xs">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
