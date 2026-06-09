export interface AuditEntry {
  label: string;
  date: string;
  actor: string;
}

export interface Milestone {
  name: string;
  duration: string;
  cost: string;
}

export interface TechStack {
  frontend?: string[];
  backend?: string[];
  integrations?: string[];
  hosting?: string[];
}

export interface AIQualification {
  score: number;
  label: string;
  description: string;
  nextAction: string;
  handoffNote: string;
}

export interface ZohoSync {
  status: string;
  crmId: string;
  lastSynced: string;
}

export interface ProposalDoc {
  url?: string | null;
  filePath?: string | null;
  fileName?: string | null;
  generatedAt?: string | null;
}

export interface LeadDetail {
  id: string;
  leadId: string;
  fullProjectName: string;
  clientContact: string;
  createdByName?: string;
  source: string;
  dateReceived: string;
  status: string;
  isAnalyzed: boolean;
  budget: string;
  timeline: string;
  aiBudgetRange?: string | null;
  leadSummary: string;
  aiQualification: AIQualification;
  techStack: TechStack;
  milestones: Milestone[];
  suggestedQuestions: string[];
  auditLog: AuditEntry[];
  zoho?: ZohoSync;
  originalLeadDetails?: string;
  whatsappDraft: string | null;
  whatsappDraftCount: number;
  proposalDoc?: ProposalDoc | null;
}
