/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { leadsService, GetLeadsParams } from "./leadsService";

// ── Helpers ───────────────────────────────────────────────────────────────────

const HANDOFF_NOTE =
  "After marking as 'Qualified', this lead will be handed off to the sales team in Zoho CRM for further pipeline management.";

function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "N/A";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}


/** Map a raw backend lead object to the LeadDetail shape expected by the UI. */
export function mapToLeadDetail(lead: any) {
  return {
    id: lead.id,
    leadId: lead.leadId || `LD-${lead.leadNumber}`,
    fullProjectName: lead.title,
    clientContact: lead.clientContact || "N/A",
    createdByName: lead.createdBy?.name || null,
    source: capitalize(lead.source),
    dateReceived: formatDate(lead.createdAt),
    status: lead.status,
    isAnalyzed: lead.isAnalyzed ?? false,
    budget: lead.budget || "N/A",
    timeline: lead.timeline || "N/A",
    leadSummary: lead.analysis?.summary || "N/A",
    aiQualification: {
      score: lead.analysis?.qualification?.score ?? 0,
      label: lead.analysis?.qualification?.label || "N/A",
      description: lead.analysis?.qualification?.description || "N/A",
      nextAction: lead.analysis?.qualification?.nextAction || "N/A",
      handoffNote: HANDOFF_NOTE,
    },
    techStack: {
      frontend: lead.analysis?.techStack?.frontend || [],
      backend: [
        ...(lead.analysis?.techStack?.backend || []),
        ...(lead.analysis?.techStack?.database || []),
      ],
      integrations: lead.analysis?.techStack?.integrations || [],
      hosting: lead.analysis?.techStack?.hosting || [],
    },
    milestones: (lead.estimation?.milestones || []).map((m: any) => ({
      name: m.phase || "Phase",
      duration: m.duration || "N/A",
      cost: m.costRange || "N/A",
    })),
    suggestedQuestions: lead.analysis?.suggestedQuestions || [],
    auditLog: (lead.auditLog || []).map((entry: any) => ({
      label: entry.label,
      date: formatDate(entry.date),
      actor: entry.actor,
    })),
    zoho:
      lead.zoho?.crmId
        ? {
            status: lead.zoho.status || "Synced",
            crmId: lead.zoho.crmId,
            lastSynced: lead.zoho.lastSynced ? formatDate(lead.zoho.lastSynced) : "N/A",
          }
        : undefined,
    aiBudgetRange: lead.estimation?.aiBudgetRange || null,
    originalLeadDetails: lead.details,
    whatsappDraft: lead.whatsappDraft || null,
    whatsappDraftCount: lead.whatsappDraftCount ?? 0,
    proposalDoc: lead.proposalDoc || null,
    pdfFile: lead.pdfFile || null,
  };
}

/** Map a raw backend lead to the flat row shape used by the leads grid. */
export function mapToGridRow(lead: any) {
  return {
    id: lead.id,
    leadId: lead.leadId || `LD-${lead.leadNumber}`,
    projectName: lead.title,
    tags: lead.tags || [],
    source: capitalize(lead.source),
    dateReceived: formatDate(lead.createdAt),
    status: lead.status,
    budget: lead.budget || "N/A",
    timeline: lead.timeline || "N/A",
  };
}

// ── State ─────────────────────────────────────────────────────────────────────

interface LeadsStats {
  total: number;
  qualified: number;
  proposalSent: number;
  won: number;
}

interface LeadsState {
  leadsList: any[];
  totalResults: number;
  totalPages: number;
  currentLead: any | null;
  stats: LeadsStats;
  isLoading: boolean;
  actionLoading: boolean;
  error: string | null;
  actionError: string | null;
}

const initialState: LeadsState = {
  leadsList: [],
  totalResults: 0,
  totalPages: 1,
  currentLead: null,
  stats: { total: 0, qualified: 0, proposalSent: 0, won: 0 },
  isLoading: false,
  actionLoading: false,
  error: null,
  actionError: null,
};

// ── Thunks ────────────────────────────────────────────────────────────────────

export const fetchLeadsStats = createAsyncThunk(
  "leads/fetchStats",
  async (_, thunkAPI) => {
    try {
      const res = await leadsService.getLeadsStats();
      return res.data?.data || { total: 0, qualified: 0, proposalSent: 0, won: 0 };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch stats");
    }
  }
);

export const fetchLeads = createAsyncThunk(
  "leads/fetchAll",
  async (params: GetLeadsParams | undefined, thunkAPI) => {
    try {
      const res = await leadsService.getLeads(params);
      return res.data?.data || { results: [], totalResults: 0, totalPages: 1 };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch leads"
      );
    }
  }
);

export const fetchLead = createAsyncThunk(
  "leads/fetchOne",
  async (leadId: string, thunkAPI) => {
    try {
      const res = await leadsService.getLead(leadId);
      return res.data?.data?.lead || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch lead"
      );
    }
  }
);

export const updateLead = createAsyncThunk(
  "leads/update",
  async ({ leadId, payload }: { leadId: string; payload: any }, thunkAPI) => {
    try {
      const res = await leadsService.updateLead(leadId, payload);
      return res.data?.data?.lead || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update lead"
      );
    }
  }
);

export const deleteLead = createAsyncThunk(
  "leads/delete",
  async (leadId: string, thunkAPI) => {
    try {
      await leadsService.deleteLead(leadId);
      return leadId;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete lead"
      );
    }
  }
);

export const generateProposal = createAsyncThunk(
  "leads/generateProposal",
  async ({ leadId, payload }: { leadId: string; payload: { preparedFor?: string; preparedBy?: string; scopeDoc?: string } }, thunkAPI) => {
    try {
      const res = await leadsService.generateProposal(leadId, payload);
      return res.data?.data?.lead || null;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to generate proposal"
      );
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    clearLeadsState: (state) => {
      state.error = null;
      state.actionError = null;
      state.isLoading = false;
      state.actionLoading = false;
    },
    clearCurrentLead: (state) => {
      state.currentLead = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchLeadsStats
      .addCase(fetchLeadsStats.fulfilled, (state, action: PayloadAction<any>) => {
        state.stats = action.payload;
      })

      // fetchLeads
      .addCase(fetchLeads.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.leadsList = action.payload.results || [];
        state.totalResults = action.payload.totalResults || 0;
        state.totalPages = action.payload.totalPages || 1;
      })
      .addCase(fetchLeads.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // fetchLead
      .addCase(fetchLead.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentLead = null;
      })
      .addCase(fetchLead.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLead.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // updateLead
      .addCase(updateLead.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateLead.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        if (action.payload) {
          state.currentLead = action.payload;
          state.leadsList = state.leadsList.map((l) =>
            l.id === action.payload.id ? action.payload : l
          );
        }
      })
      .addCase(updateLead.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // deleteLead
      .addCase(deleteLead.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false;
        state.leadsList = state.leadsList.filter((l) => l.id !== action.payload);
      })
      .addCase(deleteLead.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })

      // generateProposal
      .addCase(generateProposal.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(generateProposal.fulfilled, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        if (action.payload) {
          state.currentLead = action.payload;
          state.leadsList = state.leadsList.map((l) =>
            l.id === action.payload.id ? action.payload : l
          );
        }
      })
      .addCase(generateProposal.rejected, (state, action: PayloadAction<any>) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearLeadsState, clearCurrentLead } = leadsSlice.actions;
export default leadsSlice.reducer;
