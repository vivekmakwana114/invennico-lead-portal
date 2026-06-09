import { api } from "@/lib/api";

export type DateRange = "today" | "week" | "month" | "year" | "all";

class DashboardService {
  getStats(dateRange: DateRange)          { return api.get("/v1/dashboard/stats",              { params: { dateRange } }); }
  getLeadsChart(dateRange: DateRange)     { return api.get("/v1/dashboard/leads/chart",         { params: { dateRange } }); }
  getProposalsChart(dateRange: DateRange) { return api.get("/v1/dashboard/proposals/chart",     { params: { dateRange } }); }
  getPipelineChart(dateRange: DateRange)  { return api.get("/v1/dashboard/pipeline/chart",      { params: { dateRange } }); }
  getSourceBreakdown(dateRange: DateRange){ return api.get("/v1/dashboard/source/breakdown",    { params: { dateRange } }); }
  getTechStacks(dateRange: DateRange)     { return api.get("/v1/dashboard/tech/stacks",         { params: { dateRange } }); }
  getRecentLeads(dateRange: DateRange)    { return api.get("/v1/dashboard/recent/leads",        { params: { dateRange } }); }
  getRecentActivity(dateRange: DateRange) { return api.get("/v1/dashboard/recent/activity",     { params: { dateRange } }); }
  getUpcomingFollowups(dateRange: DateRange) { return api.get("/v1/dashboard/upcoming/followups", { params: { dateRange } }); }
}

export const dashboardService = new DashboardService();
