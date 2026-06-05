import { api } from "@/lib/api";

export interface ProposalSection {
  key: string;
  enabled: boolean;
  order: number;
}

export interface PricingConfig {
  engineerRates?: {
    intern?: number;
    junior?: number;
    midLevel?: number;
    senior?: number;
    architect?: number;
  };
  complexityMultipliers?: {
    low?: number;
    medium?: number;
    high?: number;
  };
  timelineMultipliers?: {
    rush?: number;
    standard?: number;
    extended?: number;
  };
}

export interface UpdateSettingsPayload {
  proposalSections?: ProposalSection[];
  companyBranding?: {
    name?: string;
    tagline?: string;
    address?: string;
    email?: string;
    phone?: string;
    website?: string;
  };
  scopeDocumentContent?: string | null;
  googleDriveFolderId?: string | null;
  pricingConfig?: PricingConfig;
}

class SettingsService {
  getSettings() {
    return api.get("/v1/settings");
  }

  updateSettings(payload: UpdateSettingsPayload) {
    return api.put("/v1/settings", payload);
  }
}

export const settingsService = new SettingsService();
