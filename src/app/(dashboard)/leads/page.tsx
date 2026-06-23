"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Users, CheckCircle, FileText, Trophy, Search, SlidersHorizontal, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { GridComponent } from "@/components/ui/GridComponent";
import { Pagination } from "@/components/ui/Pagination";
import { Dropdown } from "@/components/ui/Dropdown";
import { LEADS_COLUMNS, type LeadStatus } from "@/components/leads/LeadsColumns";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchLeads, fetchLeadsStats, mapToGridRow } from "@/state/leads/leadsSlice";
import { fetchProfile } from "@/state/users/usersSlice";

const ITEMS_PER_PAGE = 10;

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Qualified", value: "qualified" },
  { label: "Engagement Started", value: "engagement-started" },
  { label: "Proposal Sent", value: "proposal-sent" },
  { label: "Won", value: "won" },
  { label: "Dropped", value: "drop" },
];

const SOURCE_OPTIONS = ["All", "Alliance", "Direct", "Referral", "Upwork", "Freelancer"].map(
  (s) => ({ label: s, value: s })
);

const DATE_RANGE_OPTIONS = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 3 months", value: "90" },
  { label: "Last 6 months", value: "180" },
  { label: "All time", value: "0" },
];

export default function LeadsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { leadsList, totalResults, isLoading, stats } = useAppSelector((s) => s.leads);
  const { user } = useAppSelector((s) => s.auth);
  const profile = useAppSelector((s) => s.users.profile);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateRange, setDateRange] = useState("0");
  const filterPanelRef = useRef<HTMLDivElement>(null);

  const load = useCallback(() => {
    const params: Record<string, any> = { page: currentPage, limit: ITEMS_PER_PAGE };
    if (statusFilter !== "all") params.status = statusFilter;
    if (sourceFilter !== "All") params.source = sourceFilter.toLowerCase();
    if (dateRange !== "0") params.dateRange = Number(dateRange);
    dispatch(fetchLeads(params));
  }, [dispatch, currentPage, statusFilter, sourceFilter, dateRange]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => { dispatch(fetchLeadsStats()); }, [dispatch]);
  useEffect(() => { if (user?.role === "partner") dispatch(fetchProfile()); }, [dispatch, user?.role]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const dropdownMenu = document.getElementById("dropdown-portal-menu");
      if (
        filterPanelRef.current &&
        !filterPanelRef.current.contains(e.target as Node) &&
        (!dropdownMenu || !dropdownMenu.contains(e.target as Node))
      ) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
  }

  function handleFilter(setter: (v: string) => void) {
    return (value: string) => { setter(value); setCurrentPage(1); };
  }

  function resetFilters() {
    setStatusFilter("all");
    setSourceFilter("All");
    setDateRange("0");
    setCurrentPage(1);
  }

  const hasActiveFilters = statusFilter !== "all" || sourceFilter !== "All" || dateRange !== "0";
  const gridRows = useMemo(() => {
    const rows = leadsList.map(mapToGridRow);
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter(
      (r) =>
        (r.leadId as string).toLowerCase().includes(q) ||
        (r.projectName as string).toLowerCase().includes(q) ||
        (r.source as string).toLowerCase().includes(q)
    );
  }, [leadsList, search]);


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Leads Management</h1>
          <p className="text-sm text-ternary mt-0.5">Track and manage all incoming leads</p>
        </div>
        <Button
          label="Submit New Lead"
          icon={<Plus size={16} />}
          iconPlacement="left"
          variant="primary"
          className="px-4 py-2.5"
          onClick={() => {
            if (user?.role === "partner") {
              const creditSource = profile ?? user;
              const available = (creditSource.totalCredits ?? 0) - (creditSource.consumedCredits ?? 0);
              if (available <= 0) {
                toast.error("Contact admin to renew/add credit");
                return;
              }
            }
            router.push("/leads/create");
          }}
        />
      </div>

      {/* Search & Filter Panel */}
      <div ref={filterPanelRef} className="bg-white border border-border rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 p-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ternary pointer-events-none" />
            <input
              type="text"
              placeholder="Search by project name or lead ID..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-border bg-off-white text-sm text-foreground placeholder:text-ternary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>
          <Button
            label="Filters"
            icon={<SlidersHorizontal size={16} />}
            iconPlacement="left"
            variant="secondary"
            className="h-10 px-4 shrink-0"
            onClick={() => setShowFilters((v) => !v)}
          />
        </div>

        {showFilters && (
          <div className="border-t border-border px-4 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Status</label>
                <Dropdown options={STATUS_OPTIONS} value={statusFilter} onChange={handleFilter(setStatusFilter)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Source</label>
                <Dropdown options={SOURCE_OPTIONS} value={sourceFilter} onChange={handleFilter(setSourceFilter)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Date Range</label>
                <Dropdown options={DATE_RANGE_OPTIONS} value={dateRange} onChange={handleFilter(setDateRange)} />
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4 flex justify-end">
                <button onClick={resetFilters} className="text-sm text-primary font-medium hover:underline cursor-pointer">
                  Reset filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={stats.total}
          icon={<div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue"><Users size={18} /></div>}
        />
        <StatCard
          label="Qualified (Pre-Sales)"
          value={stats.qualified}
          icon={<div className="w-9 h-9 rounded-xl bg-success-bg flex items-center justify-center text-success-text"><CheckCircle size={18} /></div>}
        />
        <StatCard
          label="Proposals Sent"
          value={stats.proposalSent}
          icon={<div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple"><FileText size={18} /></div>}
        />
        <StatCard
          label="Won (From Zoho)"
          value={stats.won}
          icon={<div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600"><Trophy size={18} /></div>}
        />
      </div>

      {/* Data Grid */}
      <GridComponent
        columns={LEADS_COLUMNS}
        data={gridRows}
        rowKey={(row) => row.id as string}
        emptyMessage={isLoading ? "Loading leads..." : "No leads match your search."}
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={totalResults}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemLabel="leads"
      />
    </div>
  );
}
