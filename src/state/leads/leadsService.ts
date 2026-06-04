import { api } from "@/lib/api";

export interface GetLeadsParams {
  status?: string;
  source?: string;
  search?: string;
  dateRange?: number;
  sortBy?: string;
  limit?: number;
  page?: number;
}

export interface CreateLeadPayload {
  title: string;
  details: string;
  source: string;
  notes?: string | null;
  attachments?: string[];
  clientContact?: string | null;
  isAnalyzed?: boolean;
  analysis?: {
    summary?: string | null;
    qualification?: {
      score?: number | null;
      label?: string | null;
      description?: string | null;
      nextAction?: string | null;
      handoffNote?: string | null;
    };
    techStack?: {
      frontend?: string[];
      backend?: string[];
      database?: string[];
      integrations?: string[];
      hosting?: string[];
    };
    suggestedQuestions?: string[];
  };
  estimation?: {
    timeline?: string | null;
    budgetRange?: string | null;
    milestones?: { phase?: string; duration?: string; costRange?: string }[];
  };
  budget?: string | null;
  timeline?: string | null;
  whatsappDraft?: string | null;
}

export interface AnalyzeLeadPayload {
  title: string;
  details: string;
  source: string;
  notes?: string | null;
  attachments?: string | null;
}

export interface GenerateWhatsappPayload {
  leadSummary: string;
  techStack?: string | null;
  timeline?: string | null;
  budget?: string | null;
  originalLead?: string | null;
}

class LeadsService {
  getLeads(params?: GetLeadsParams) {
    return api.get("/v1/leads", { params });
  }

  getLeadsStats() {
    return api.get("/v1/leads/stats");
  }

  getLead(leadId: string) {
    return api.get(`/v1/leads/${leadId}`);
  }

  createLead(payload: CreateLeadPayload) {
    return api.post("/v1/leads", payload);
  }

  updateLead(leadId: string, payload: Partial<CreateLeadPayload> & { status?: string; tags?: string[] }) {
    return api.patch(`/v1/leads/${leadId}`, payload);
  }

  deleteLead(leadId: string) {
    return api.delete(`/v1/leads/${leadId}`);
  }

  uploadPdf(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/v1/leads/upload/pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  analyzeLead(payload: AnalyzeLeadPayload) {
    return api.post("/v1/leads/analyze", payload);
  }

  generateWhatsapp(payload: GenerateWhatsappPayload) {
    return api.post("/v1/leads/whatsapp", payload);
  }
}

export const leadsService = new LeadsService();
