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

  getPrompt() {
    return api.get("/v1/settings/prompt");
  }

  updatePrompt(aiPrompt: string) {
    return api.put("/v1/settings/prompt", { aiPrompt });
  }

  uploadProposalTemplate(file: File) {
    const form = new FormData();
    form.append("template", file);
    return api.post("/v1/settings/proposal/template", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  downloadProposalTemplate() {
    // Trigger a browser download via a hidden anchor — bearer token injected automatically
    api
      .get("/v1/settings/proposal/template/download", { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(res.data as Blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "proposal-template.docx";
        a.click();
        URL.revokeObjectURL(url);
      });
  }
}

export const settingsService = new SettingsService();
