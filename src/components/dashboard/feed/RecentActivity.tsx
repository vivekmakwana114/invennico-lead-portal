"use client";

import React from "react";
import { FileText, CheckCircle2, Briefcase, TrendingUp, MessageCircle, Sparkles } from "lucide-react";
import { RecentActivityItem } from "@/state/dashboard/dashboardSlice";

interface ActivityStyle {
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
}

function getActivityStyle(label: string): ActivityStyle {
  const l = label.toLowerCase();
  if (l.includes("proposal")) return { icon: FileText, iconColor: "text-[#EA580C]", bgColor: "bg-[#FFF7ED]" };
  if (l.includes("qualified") || l.includes("won")) return { icon: CheckCircle2, iconColor: "text-[#16A34A]", bgColor: "bg-[#F0FDF4]" };
  if (l.includes("whatsapp")) return { icon: MessageCircle, iconColor: "text-[#16A34A]", bgColor: "bg-[#F0FDF4]" };
  if (l.includes("zoho") || l.includes("sync")) return { icon: TrendingUp, iconColor: "text-[#9333EA]", bgColor: "bg-[#FAF5FF]" };
  if (l.includes("ai") || l.includes("analysis") || l.includes("analyzed")) return { icon: Sparkles, iconColor: "text-[#2563EB]", bgColor: "bg-[#EFF6FF]" };
  return { icon: Briefcase, iconColor: "text-[#2563EB]", bgColor: "bg-[#EFF6FF]" };
}

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

interface RecentActivityProps {
  data: RecentActivityItem[];
  isLoading?: boolean;
}

export function RecentActivity({ data = [], isLoading }: RecentActivityProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-col h-full">
      <h3 className="font-bold text-lg text-foreground mb-8">Recent Activity</h3>
      {isLoading ? (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-off-white animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-off-white rounded animate-pulse w-3/4" />
                <div className="h-3 bg-off-white rounded animate-pulse w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-ternary">No activity yet</p>
      ) : (
        <div className="space-y-8 overflow-y-auto max-h-[400px] pr-1">
          {data.map((activity, index) => {
            const style = getActivityStyle(activity.label);
            return (
              <div key={index} className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl ${style.bgColor} flex items-center justify-center shrink-0`}
                >
                  <style.icon size={20} className={style.iconColor} />
                </div>
                <div className="flex flex-col">
                  <h4 className="text-sm text-foreground mb-0.5">{activity.label}</h4>
                  <p className="text-xs text-ternary font-medium">{activity.leadTitle}</p>
                  <p className="text-xs text-ternary mt-1 font-medium opacity-80">
                    {timeAgo(activity.date)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
