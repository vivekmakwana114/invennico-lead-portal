"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Key,
  type LucideIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  fieldLabel: string;
  placeholder: string;
  connected: boolean;
}

const integrations: Integration[] = [
  {
    id: "zoho",
    name: "Zoho CRM",
    description: "Customer relationship management",
    icon: Key,
    iconBg: "bg-purple/10",
    iconColor: "text-purple",
    fieldLabel: "API Key",
    placeholder: "zcrm_abc123...",
    connected: true,
  },
  {
    id: "google-drive",
    name: "Google Drive",
    description: "Document storage and sharing",
    icon: Key,
    iconBg: "bg-blue/10",
    iconColor: "text-blue",
    fieldLabel: "API Key",
    placeholder: "gdrive_xyz789...",
    connected: true,
  },
  {
    id: "claude",
    name: "Claude AI (Anthropic)",
    description: "Lead analysis and qualification",
    icon: Key,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    fieldLabel: "API Key",
    placeholder: "sk-ant-api03...",
    connected: true,
  },
  {
    id: "openai",
    name: "OpenAI",
    description: "Alternative AI provider (optional)",
    icon: Key,
    iconBg: "bg-ternary/10",
    iconColor: "text-ternary",
    fieldLabel: "API Key",
    placeholder: "sk-proj-abc...",
    connected: false,
  },
  {
    id: "whatsapp",
    name: "WhatsApp API",
    description: "Direct messaging integration",
    icon: Key,
    iconBg: "bg-green/10",
    iconColor: "text-green",
    fieldLabel: "API Token",
    placeholder: "whatsapp_token...",
    connected: true,
  },
];

function IntegrationCard({ integration }: { integration: Integration }) {
  const [showKey, setShowKey] = useState(false);
  const [apiKey, setApiKey] = useState("");

  return (
    <div className="border border-border rounded-xl p-5 bg-white">
      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
              integration.iconBg
            )}
          >
            <integration.icon size={20} className={integration.iconColor} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">{integration.name}</p>
            <p className="text-xs text-ternary mt-0.5">{integration.description}</p>
          </div>
        </div>

        {integration.connected ? (
          <div className="flex items-center gap-1.5 text-success-text shrink-0">
            <CheckCircle2 size={16} />
            <span className="text-sm font-medium">Connected</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-error-text shrink-0">
            <XCircle size={16} />
            <span className="text-sm font-medium">Disconnected</span>
          </div>
        )}
      </div>

      {/* API Key / Token field */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">{integration.fieldLabel}</label>
        <div className="relative">
          <input
            type={showKey ? "text" : "password"}
            value={apiKey}
            placeholder={integration.placeholder}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 border border-border rounded-lg text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowKey((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ternary hover:text-foreground transition-colors cursor-pointer"
            aria-label={showKey ? "Hide key" : "Show key"}
          >
            {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {/* Test Connection button */}
      <button
        type="button"
        className="mt-3 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-off-white transition-colors cursor-pointer"
      >
        Test Connection
      </button>
    </div>
  );
}

export function IntegrationsTab() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-foreground">API Integrations</h2>
        <p className="text-sm text-ternary mt-0.5">
          Connect external services to enable AI analysis, CRM sync, and proposal automation
        </p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </div>
    </div>
  );
}
