"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { StatCard } from "@/components/dashboard/StatCard";
import { LeadsChart } from "@/components/dashboard/charts/LeadsChart";
import { ProposalsChart } from "@/components/dashboard/charts/ProposalsChart";
import { PipelineTrendChart } from "@/components/dashboard/charts/PipelineTrend";
import { SourceBreakdown } from "@/components/dashboard/charts/SourceBreakdown";
import { TechStacksChart } from "@/components/dashboard/charts/TechStacksChart";
import { RecentLeads } from "@/components/dashboard/feed/RecentLeads";
import { RecentActivity } from "@/components/dashboard/feed/RecentActivity";
import { UpcomingFollowUps } from "@/components/dashboard/feed/UpcomingFollowUps";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import {
  fetchStats,
  fetchLeadsChart,
  fetchProposalsChart,
  fetchPipelineChart,
  fetchSourceBreakdown,
  fetchTechStacks,
  fetchRecentLeads,
  fetchRecentActivity,
  fetchUpcomingFollowups,
  setDateRange,
} from "@/state/dashboard/dashboardSlice";
import type { DateRange } from "@/state/dashboard/dashboardService";
import { useInView } from "@/hooks/useInView";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DATE_FILTERS: { label: string; value: DateRange }[] = [
  { label: "Today",      value: "today" },
  { label: "This Week",  value: "week"  },
  { label: "This Month", value: "month" },
  { label: "This Year",  value: "year"  },
];

function formatPipelineValue(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000)     return `$${Math.round(value / 1_000)}K`;
  return `$${value}`;
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const {
    dateRange,
    stats,            statsLoading,
    leadsChart,       leadsChartLoading,
    proposalsChart,   proposalsChartLoading,
    pipelineChart,    pipelineChartLoading,
    sourceBreakdown,  sourceBreakdownLoading,
    techStacks,       techStacksLoading,
    recentLeads,      recentLeadsLoading,
    recentActivity,   recentActivityLoading,
  } = useAppSelector((s) => s.dashboard);

  // Tracks which (section + dateRange) combinations have already been fetched.
  // Key format: "<section>-<dateRange>" — naturally expires when dateRange changes.
  const fetched = useRef<Set<string>>(new Set());

  // One ref per viewport zone
  const [statsRef,      statsInView]      = useInView();
  const [chartsRow1Ref, chartsRow1InView] = useInView();
  const [chartsRow2Ref, chartsRow2InView] = useInView();
  const [techRef,       techInView]       = useInView();
  const [feedRef,       feedInView]       = useInView();

  // Clear the fetched cache whenever dateRange changes so filter switches always re-fetch.
  // The Set only guards against scroll-triggered duplicates within the same dateRange session.
  useEffect(() => {
    fetched.current = new Set();
  }, [dateRange]);

  // Helper: dispatch only if not already fetched in this dateRange session
  function lazy(key: string, action: () => void) {
    if (!fetched.current.has(key)) {
      fetched.current.add(key);
      action();
    }
  }

  // Zone 1 — Stats cards (top of page, visible immediately)
  useEffect(() => {
    if (statsInView) lazy("stats", () => dispatch(fetchStats(dateRange)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statsInView, dateRange]);

  // Zone 2 — Leads chart + Proposals chart
  useEffect(() => {
    if (!chartsRow1InView) return;
    lazy("leadsChart",     () => dispatch(fetchLeadsChart(dateRange)));
    lazy("proposalsChart", () => dispatch(fetchProposalsChart(dateRange)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartsRow1InView, dateRange]);

  // Zone 3 — Pipeline chart + Source breakdown
  useEffect(() => {
    if (!chartsRow2InView) return;
    lazy("pipelineChart",   () => dispatch(fetchPipelineChart(dateRange)));
    lazy("sourceBreakdown", () => dispatch(fetchSourceBreakdown(dateRange)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chartsRow2InView, dateRange]);

  // Zone 4 — Tech stacks chart
  useEffect(() => {
    if (techInView) lazy("techStacks", () => dispatch(fetchTechStacks(dateRange)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techInView, dateRange]);

  // Zone 5 — Feed (recent leads, activity, follow-ups)
  useEffect(() => {
    if (!feedInView) return;
    lazy("recentLeads",       () => dispatch(fetchRecentLeads(dateRange)));
    lazy("recentActivity",    () => dispatch(fetchRecentActivity(dateRange)));
    lazy("upcomingFollowups", () => dispatch(fetchUpcomingFollowups(dateRange)));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedInView, dateRange]);

  function handleDateRange(value: DateRange) {
    dispatch(setDateRange(value));
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground">Pre-Sales Dashboard</h3>
          <p className="text-sm text-ternary font-medium mt-1">
            Track lead qualification and proposal automation metrics
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {DATE_FILTERS.map(({ label, value }) => (
            <Button
              key={value}
              label={label}
              variant={dateRange === value ? "primary" : "secondary"}
              onClick={() => handleDateRange(value)}
              className={cn("h-9 px-4 text-sm", dateRange === value && "ring-2 ring-primary/30")}
            />
          ))}
        </div>
      </div>

      {/* Zone 1 — Stats Grid */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          label="Total Leads Received"
          value={statsLoading ? "—" : (stats?.total ?? 0)}
          icon={<Image src="/assets/icons/total_leads.svg" alt="Total Leads" width={24} height={24} />}
        />
        <StatCard
          label="Qualified by Pre-Sales"
          value={statsLoading ? "—" : (stats?.qualified ?? 0)}
          icon={<Image src="/assets/icons/qulified_pre_sales.svg" alt="Qualified" width={24} height={24} />}
        />
        <StatCard
          label="Proposals Sent"
          value={statsLoading ? "—" : (stats?.proposalSent ?? 0)}
          icon={<Image src="/assets/icons/proposal_sent.svg" alt="Proposals" width={24} height={24} />}
        />
        <StatCard
          label="Qualified Pipeline Value"
          value={statsLoading ? "—" : formatPipelineValue(stats?.pipelineValue ?? 0)}
          icon={<Image src="/assets/icons/qulified_pipeline_valued.svg" alt="Pipeline Value" width={24} height={24} />}
        />
        <StatCard
          label="Qualification Rate"
          value={statsLoading ? "—" : `${stats?.qualificationRate ?? 0}%`}
          icon={<Image src="/assets/icons/qulification_rate.svg" alt="Qualification Rate" width={24} height={24} />}
        />
        <StatCard
          label="Won (From Zoho CRM)"
          value={statsLoading ? "—" : (stats?.won ?? 0)}
          icon={<Image src="/assets/icons/won.svg" alt="Won" width={24} height={24} />}
        />
      </div>

      {/* Zone 2 — Charts Row 1 */}
      <div ref={chartsRow1Ref} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LeadsChart     data={leadsChart}     isLoading={leadsChartLoading} />
        <ProposalsChart data={proposalsChart} isLoading={proposalsChartLoading} />
      </div>

      {/* Zone 3 — Charts Row 2 */}
      <div ref={chartsRow2Ref} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineTrendChart data={pipelineChart} isLoading={pipelineChartLoading} />
        </div>
        <SourceBreakdown data={sourceBreakdown} isLoading={sourceBreakdownLoading} />
      </div>

      {/* Zone 4 — Tech Stacks */}
      <div ref={techRef}>
        <TechStacksChart data={techStacks} isLoading={techStacksLoading} />
      </div>

      {/* Zone 5 — Feed */}
      <div ref={feedRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentLeads    data={recentLeads}    isLoading={recentLeadsLoading} />
        <RecentActivity data={recentActivity} isLoading={recentActivityLoading} />
        <UpcomingFollowUps />
      </div>
    </div>
  );
}
