"use client";

import React, { useState } from "react";
import { Key, DollarSign, FileText, Users } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IntegrationsTab } from "@/components/settings/IntegrationsTab";
import { PricingTab } from "@/components/settings/PricingTab";
import { ScopeTab } from "@/components/settings/ScopeTab";
import { UserManagementTab } from "@/components/settings/UserManagementTab";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const tabs = [
  { id: "integrations", label: "Integrations", icon: Key },
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
      <div className="border border-border rounded-xl bg-white">
        {/* Tab bar */}
        <div className="border-b border-border bg-white rounded-t-xl">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] px-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 sm:px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer border-b-2 shrink-0",
                    isActive
                      ? "text-primary border-primary bg-primary/10"
                      : "text-ternary border-transparent hover:text-foreground hover:border-border"
                  )}
                >
                  <tab.icon size={16} />
                  <span className="sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab content */}
        <div className="p-4 sm:p-6">
          {activeTab === "integrations" && <IntegrationsTab />}
          {activeTab === "pricing" && <PricingTab />}
          {activeTab === "scope" && <ScopeTab />}
          {activeTab === "users" && <UserManagementTab />}
        </div>
      </div>
    </div>
  );
}
