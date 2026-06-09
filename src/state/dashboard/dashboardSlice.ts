/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { dashboardService, DateRange } from "./dashboardService";
import type { AppDispatch } from "../store";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface DashboardStats {
  total: number;
  qualified: number;
  proposalSent: number;
  won: number;
  qualificationRate: number;
  pipelineValue: number;
}

export interface LeadsChartPoint      { label: string; received: number; qualified: number; }
export interface ProposalsChartPoint  { label: string; sent: number; closed: number; }
export interface PipelineChartPoint   { label: string; value: number; }
export interface SourceBreakdownPoint { name: string; value: number; count: number; }
export interface TechStackPoint       { name: string; value: number; }

export interface RecentLead {
  id: string;
  leadId: string;
  title: string;
  source: string;
  budget: string | null;
  status: string;
  createdAt: string;
}

export interface RecentActivityItem {
  leadTitle: string;
  leadId: string;
  label: string;
  actor: string;
  date: string;
}

// ── State ─────────────────────────────────────────────────────────────────────

interface DashboardState {
  dateRange: DateRange;

  stats: DashboardStats | null;
  statsLoading: boolean;

  leadsChart: LeadsChartPoint[];
  leadsChartLoading: boolean;

  proposalsChart: ProposalsChartPoint[];
  proposalsChartLoading: boolean;

  pipelineChart: PipelineChartPoint[];
  pipelineChartLoading: boolean;

  sourceBreakdown: SourceBreakdownPoint[];
  sourceBreakdownLoading: boolean;

  techStacks: TechStackPoint[];
  techStacksLoading: boolean;

  recentLeads: RecentLead[];
  recentLeadsLoading: boolean;

  recentActivity: RecentActivityItem[];
  recentActivityLoading: boolean;

  upcomingFollowups: any[];
  upcomingFollowupsLoading: boolean;
}

const initialState: DashboardState = {
  dateRange: "year",

  stats: null,
  statsLoading: false,

  leadsChart: [],
  leadsChartLoading: false,

  proposalsChart: [],
  proposalsChartLoading: false,

  pipelineChart: [],
  pipelineChartLoading: false,

  sourceBreakdown: [],
  sourceBreakdownLoading: false,

  techStacks: [],
  techStacksLoading: false,

  recentLeads: [],
  recentLeadsLoading: false,

  recentActivity: [],
  recentActivityLoading: false,

  upcomingFollowups: [],
  upcomingFollowupsLoading: false,
};

// ── Thunks ────────────────────────────────────────────────────────────────────

function makeThunk<T>(key: string, fn: (dr: DateRange) => Promise<any>) {
  return createAsyncThunk<T, DateRange>(`dashboard/${key}`, async (dateRange, thunkAPI) => {
    try {
      const res = await fn(dateRange);
      return res.data?.data as T;
    } catch (e: any) {
      return thunkAPI.rejectWithValue(e.response?.data?.message || e.message);
    }
  });
}

export const fetchStats            = makeThunk<DashboardStats>          ("stats",            (dr) => dashboardService.getStats(dr));
export const fetchLeadsChart       = makeThunk<LeadsChartPoint[]>       ("leadsChart",       (dr) => dashboardService.getLeadsChart(dr));
export const fetchProposalsChart   = makeThunk<ProposalsChartPoint[]>   ("proposalsChart",   (dr) => dashboardService.getProposalsChart(dr));
export const fetchPipelineChart    = makeThunk<PipelineChartPoint[]>    ("pipelineChart",    (dr) => dashboardService.getPipelineChart(dr));
export const fetchSourceBreakdown  = makeThunk<SourceBreakdownPoint[]>  ("sourceBreakdown",  (dr) => dashboardService.getSourceBreakdown(dr));
export const fetchTechStacks       = makeThunk<TechStackPoint[]>        ("techStacks",       (dr) => dashboardService.getTechStacks(dr));
export const fetchRecentLeads      = makeThunk<RecentLead[]>            ("recentLeads",      (dr) => dashboardService.getRecentLeads(dr));
export const fetchRecentActivity   = makeThunk<RecentActivityItem[]>    ("recentActivity",   (dr) => dashboardService.getRecentActivity(dr));
export const fetchUpcomingFollowups = makeThunk<any[]>                  ("upcomingFollowups",(dr) => dashboardService.getUpcomingFollowups(dr));

/** Fires all 9 fetches in parallel for the given date range. */
export const fetchAllDashboard = (dateRange: DateRange) => (dispatch: AppDispatch) => {
  dispatch(fetchStats(dateRange));
  dispatch(fetchLeadsChart(dateRange));
  dispatch(fetchProposalsChart(dateRange));
  dispatch(fetchPipelineChart(dateRange));
  dispatch(fetchSourceBreakdown(dateRange));
  dispatch(fetchTechStacks(dateRange));
  dispatch(fetchRecentLeads(dateRange));
  dispatch(fetchRecentActivity(dateRange));
  dispatch(fetchUpcomingFollowups(dateRange));
};

// ── Slice ─────────────────────────────────────────────────────────────────────

function loadingHandlers<T>(thunk: ReturnType<typeof createAsyncThunk<T, DateRange>>, loadingKey: keyof DashboardState, dataKey: keyof DashboardState) {
  return {
    [thunk.pending.type]: (state: DashboardState) => { (state as any)[loadingKey] = true; },
    [thunk.fulfilled.type]: (state: DashboardState, action: PayloadAction<T>) => {
      (state as any)[loadingKey] = false;
      (state as any)[dataKey] = action.payload;
    },
    [thunk.rejected.type]: (state: DashboardState) => { (state as any)[loadingKey] = false; },
  };
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    const handlers = {
      ...loadingHandlers(fetchStats,            "statsLoading",              "stats"),
      ...loadingHandlers(fetchLeadsChart,       "leadsChartLoading",         "leadsChart"),
      ...loadingHandlers(fetchProposalsChart,   "proposalsChartLoading",     "proposalsChart"),
      ...loadingHandlers(fetchPipelineChart,    "pipelineChartLoading",      "pipelineChart"),
      ...loadingHandlers(fetchSourceBreakdown,  "sourceBreakdownLoading",    "sourceBreakdown"),
      ...loadingHandlers(fetchTechStacks,       "techStacksLoading",         "techStacks"),
      ...loadingHandlers(fetchRecentLeads,      "recentLeadsLoading",        "recentLeads"),
      ...loadingHandlers(fetchRecentActivity,   "recentActivityLoading",     "recentActivity"),
      ...loadingHandlers(fetchUpcomingFollowups,"upcomingFollowupsLoading",  "upcomingFollowups"),
    };
    Object.entries(handlers).forEach(([type, handler]) => {
      builder.addCase(type, handler as any);
    });
  },
});

export const { setDateRange } = dashboardSlice.actions;
export default dashboardSlice.reducer;
