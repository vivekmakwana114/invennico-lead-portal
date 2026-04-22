"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, CheckCircle, FileText, Trophy, Search, SlidersHorizontal, Plus } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { GridComponent } from "@/components/ui/GridComponent";
import { Pagination } from "@/components/ui/Pagination";
import { Dropdown } from "@/components/ui/Dropdown";
import { LEADS_COLUMNS, type LeadStatus } from "@/components/leads/LeadsColumns";
import { ALL_LEADS, ITEMS_PER_PAGE } from "@/components/leads/LeadsData";

// ── Filter Options ────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Qualified", value: "qualified" },
  { label: "Under Review", value: "under-review" },
  { label: "Proposal Sent", value: "proposal-sent" },
  { label: "Won", value: "won" },
  { label: "New", value: "new" },
  { label: "Rejected", value: "rejected" },
  { label: "Lost", value: "lost" },
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function LeadsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const filterPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target as Node)) {
        setShowFilters(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [dateRange, setDateRange] = useState("7");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const days = parseInt(dateRange, 10);
    const cutoff = days > 0 ? new Date(Date.now() - days * 86_400_000) : null;

    return ALL_LEADS.filter((l) => {
      if (q && !l.id.toLowerCase().includes(q) && !l.projectName.toLowerCase().includes(q) && !l.source.toLowerCase().includes(q)) return false;
      if (statusFilter !== "all" && l.status !== (statusFilter as LeadStatus)) return false;
      if (sourceFilter !== "All" && l.source !== sourceFilter) return false;
      if (cutoff && new Date(l.dateReceived) < cutoff) return false;
      return true;
    });
  }, [search, statusFilter, sourceFilter, dateRange]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  function handleSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleFilter(setter: (v: string) => void) {
    return (value: string) => { setter(value); setCurrentPage(1); };
  }

  const totalLeads = ALL_LEADS.length;
  const qualifiedCount = ALL_LEADS.filter((l) => l.status === "qualified").length;
  const proposalCount = ALL_LEADS.filter((l) => l.status === "proposal-sent").length;
  const wonCount = ALL_LEADS.filter((l) => l.status === "won").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Leads Management</h1>
          <p className="text-sm text-ternary mt-0.5">Track and manage all incoming leads</p>
        </div>
        <Button
          label="Submit New Lead"
          icon={<Plus size={16} />}
          iconPlacement="left"
          variant="primary"
          className="px-4 py-2.5"
          onClick={() => router.push("/leads/create")}
        />
      </div>

      {/* Search & Filter Panel */}
      <div ref={filterPanelRef} className="bg-white border border-border rounded-2xl shadow-sm">
        {/* Search row */}
        <div className="flex items-center gap-3 p-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ternary pointer-events-none" />
            <input
              type="text"
              placeholder="Search by project name, lead ID, or source..."
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

        {/* Filter dropdowns */}
        {showFilters && (
          <div className="border-t border-border px-4 py-5 grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Status</label>
              <Dropdown
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={handleFilter(setStatusFilter)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Source</label>
              <Dropdown
                options={SOURCE_OPTIONS}
                value={sourceFilter}
                onChange={handleFilter(setSourceFilter)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Date Range</label>
              <Dropdown
                options={DATE_RANGE_OPTIONS}
                value={dateRange}
                onChange={handleFilter(setDateRange)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Leads"
          value={totalLeads}
          icon={<div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue"><Users size={18} /></div>}
        />
        <StatCard
          label="Qualified (Pre-Sales)"
          value={qualifiedCount}
          icon={<div className="w-9 h-9 rounded-xl bg-success-bg flex items-center justify-center text-success-text"><CheckCircle size={18} /></div>}
        />
        <StatCard
          label="Proposals Sent"
          value={proposalCount}
          icon={<div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center text-purple"><FileText size={18} /></div>}
        />
        <StatCard
          label="Won (From Zoho)"
          value={wonCount}
          icon={<div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600"><Trophy size={18} /></div>}
        />
      </div>

      {/* Data Grid */}
      <GridComponent
        columns={LEADS_COLUMNS}
        data={paginated}
        rowKey={(row) => row.id as string}
        emptyMessage="No leads match your search."
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filtered.length}
        itemsPerPage={ITEMS_PER_PAGE}
        onPageChange={setCurrentPage}
        itemLabel="leads"
      />
    </div>
  );
}
