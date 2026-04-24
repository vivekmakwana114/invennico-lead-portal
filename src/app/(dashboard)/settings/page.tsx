"use client";

import React, { useState } from "react";
import { Puzzle, DollarSign, FileText, Users } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { PricingTab } from "@/components/settings/PricingTab";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const tabs = [
  { id: "integrations", label: "Integrations", icon: Puzzle },
  { id: "pricing", label: "Pricing Logic", icon: DollarSign },
  { id: "scope", label: "Scope Document Template", icon: FileText },
  { id: "users", label: "User Management", icon: Users },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("integrations");

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-ternary mt-1">
          Configure integrations, pricing, templates, and team access
        </p>
      </div>

      {/* Tabs container */}
      <div className="border border-border rounded-xl bg-white overflow-hidden">
        {/* Tab bar */}
        <div className="border-b border-border bg-white px-2">
          <div className="flex gap-0">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 -mb-px",
                    isActive
                      ? "text-primary border-primary"
                      : "text-ternary border-transparent hover:text-foreground hover:border-border"
                  )}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-6">
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "pricing" && <PricingTab />}
          {activeTab === "scope" && (
            <div className="text-sm text-ternary py-8 text-center">
              Scope Document Template — coming soon
            </div>
          )}
          {activeTab === "users" && (
            <div className="text-sm text-ternary py-8 text-center">
              User Management — coming soon
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
