"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Calendar, MapPin, User, Sparkles, Monitor, Server,
  Plug, Cloud, Clock, MessageCircle, Info, CheckCircle2, RefreshCw,
  Download, MessageSquare, FileText, Pencil, X, Check,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { WhatsAppReplyModal } from "@/components/leads/WhatsAppReplyModal";
import { PrepareProposalModal } from "@/components/leads/PrepareProposalModal";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { fetchLead, updateLead, mapToLeadDetail, clearCurrentLead } from "@/state/leads/leadsSlice";
import { leadsService } from "@/state/leads/leadsService";

/**
 * Splits text that contains inline numbered items like "(1) ..., (2) ..."
 * or "1. ... 2. ..." into a structured { intro, items } object so we can
 * render them as a proper ordered list instead of one run-on paragraph.
 */
function parseNumberedContent(text: string): { intro: string; items: string[] } | null {
  if (!text) return null;

  // Match patterns: "(1)", "(2)" or "1." "2." at word boundaries
  const pattern = /\s*[\[(]?(\d+)[)\].]\s+/g;
  const matches = [...text.matchAll(pattern)];
  if (matches.length < 2) return null;

  const firstMatch = matches[0];
  const intro = text.slice(0, firstMatch.index).trim();
  const items: string[] = [];

  for (let i = 0; i < matches.length; i++) {
    const start = (matches[i].index ?? 0) + matches[i][0].length;
    const end   = matches[i + 1]?.index ?? text.length;
    const item  = text.slice(start, end).trim().replace(/,\s*$/, "");
    if (item) items.push(item);
  }

  return items.length >= 2 ? { intro, items } : null;
}

function NumberedContent({ text, className = "" }: { text: string; className?: string }) {
  const parsed = parseNumberedContent(text);
  if (!parsed) return <p className={`text-sm text-ternary leading-relaxed ${className}`}>{text}</p>;
  return (
    <div className={className}>
      {parsed.intro && <p className="text-sm text-ternary leading-relaxed mb-2">{parsed.intro}</p>}
      <ol className="space-y-1.5 list-none">
        {parsed.items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-ternary">
            <span className="shrink-0 w-5 h-5 rounded-full bg-off-white border border-border text-xs font-semibold text-ternary flex items-center justify-center mt-0.5">
              {i + 1}
            </span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function scoreLabelColor(score: number) {
  if (score >= 80) return "text-success-text";
  if (score >= 60) return "text-yellow";
  return "text-error-text";
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-border rounded-2xl p-6 ${className}`}>{children}</div>;
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold text-foreground mb-4">
      {icon}{children}
    </h2>
  );
}

export default function LeadViewPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentLead: rawLead, isLoading, actionLoading } = useAppSelector((s) => s.leads);
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [proposalOpen, setProposalOpen] = useState(false);

  // Inline estimation edit state
  const [editingEstimation, setEditingEstimation] = useState(false);
  const [editTimeline, setEditTimeline] = useState("");
  const [editBudget, setEditBudget] = useState("");
  const [editMilestones, setEditMilestones] = useState<{ name: string; duration: string; cost: string }[]>([]);
  const [estimationSaving, setEstimationSaving] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchLead(id));
    return () => { dispatch(clearCurrentLead()); };
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-foreground font-medium">Loading Lead Data...</p>
      </div>
    );
  }

  if (!rawLead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-foreground font-medium">Lead not found</p>
        <Link href="/leads" className="text-sm text-primary hover:underline">← Back to Leads</Link>
      </div>
    );
  }

  const lead = mapToLeadDetail(rawLead);
  const { aiQualification: ai, techStack, milestones, suggestedQuestions, auditLog, zoho } = lead;

  function handleStatusChange(status: string) {
    dispatch(updateLead({ leadId: rawLead.id, payload: { status } }));
  }

  async function handleDownloadProposal() {
    try {
      const res = await leadsService.downloadProposal(rawLead.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Proposal-${lead.fullProjectName}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // silently fail — button only visible when file exists
    }
  }

  function handleStartEditEstimation() {
    setEditTimeline(lead.timeline || "");
    setEditBudget(lead.budget || "");
    setEditMilestones(milestones.map((m: { name: string; duration: string; cost: string }) => ({ name: m.name, duration: m.duration, cost: m.cost })));
    setEditingEstimation(true);
  }

  function handleCancelEditEstimation() {
    setEditingEstimation(false);
  }

  async function handleSaveEstimation() {
    setEstimationSaving(true);
    await dispatch(updateLead({
      leadId: rawLead.id,
      payload: {
        timeline: editTimeline.trim() || null,
        budget: editBudget.trim() || null,
        estimation: {
          ...(rawLead.estimation || {}),
          timeline: editTimeline.trim() || null,
          budgetRange: editBudget.trim() || null,
          milestones: editMilestones
            .filter((m) => m.name.trim())
            .map((m) => ({ phase: m.name.trim(), duration: m.duration.trim(), costRange: m.cost.trim() })),
        },
      },
    }));
    setEstimationSaving(false);
    setEditingEstimation(false);
  }

  function handleMilestoneChange(index: number, field: "name" | "duration" | "cost", value: string) {
    setEditMilestones((prev) => prev.map((m, i) => (i === index ? { ...m, [field]: value } : m)));
  }

  function handleAddMilestone() {
    setEditMilestones((prev) => [...prev, { name: "", duration: "", cost: "" }]);
  }

  function handleRemoveMilestone(index: number) {
    setEditMilestones((prev) => prev.filter((_, i) => i !== index));
  }

  // If user types "1000-2000", normalize to "$1000 - $2000" on blur
  function normalizeCostOnBlur(index: number) {
    setEditMilestones((prev) => prev.map((m, i) => {
      if (i !== index) return m;
      const val = m.cost.trim();
      if (!val || val.startsWith("$") || !/^\d/.test(val)) return m;
      const normalized = "$" + val.replace(/\s*[-–—]\s*/, " - $");
      return { ...m, cost: normalized };
    }));
  }

  return (
    <div className="space-y-6 pb-12">
      <Link href="/leads" className="inline-flex items-center gap-1.5 text-sm text-ternary hover:text-foreground transition-colors">
        <ArrowLeft size={15} />Back to Leads
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">

        {/* ── Left ────────────────────────────────────────────────────────── */}
        <div className="space-y-5 min-w-0">

          <Card>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">{lead.fullProjectName}</h1>
                  <StatusBadge status={lead.status} />
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ternary">
                  <span className="font-mono font-medium">{lead.leadId}</span>
                  <span className="flex items-center gap-1.5"><Calendar size={13} />{lead.dateReceived}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={13} />{lead.source}</span>
                  {lead.createdByName && (
                    <span className="flex items-center gap-1.5"><User size={13} />{lead.createdByName}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <SectionTitle icon={<FileText size={20} className="text-primary" />}>Lead Summary</SectionTitle>
            <p className="text-sm text-ternary leading-relaxed">{lead.leadSummary}</p>
          </Card>

          <Card>
            <SectionTitle icon={<Sparkles size={20} className="text-primary" />}>
              AI Qualification Analysis (Pre-Sales)
            </SectionTitle>
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Qualification Score</span>
                <span className="text-sm font-bold text-primary">{ai.score}%</span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-blue" style={{ width: `${ai.score}%` }} />
              </div>
            </div>
            <p className={`text-sm font-semibold mb-2 ${scoreLabelColor(ai.score)}`}>{ai.label}</p>
            <NumberedContent text={ai.description} className="mb-4" />
            <div className="border-l-4 border-primary bg-orange-50 rounded-r-xl px-4 py-3 mb-3">
              <p className="text-xs font-semibold text-primary mb-1">Recommended Next Action (Pre-Sales)</p>
              <NumberedContent text={ai.nextAction} />
            </div>
            <div className="flex items-start gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <Info size={14} className="text-blue mt-0.5 shrink-0" />
              <p className="text-sm text-ternary leading-relaxed">{ai.handoffNote}</p>
            </div>
          </Card>

          <Card>
            <SectionTitle icon={<span className="text-primary text-lg leading-none">◆</span>}>
              Recommended Tech Stack
            </SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {techStack.frontend?.length > 0 && (
                <TechCategory icon={<Monitor size={18} className="text-blue" />} label="Frontend" items={techStack.frontend} dotColor="bg-blue" />
              )}
              {techStack.backend?.length > 0 && (
                <TechCategory icon={<Server size={18} className="text-purple" />} label="Backend" items={techStack.backend} dotColor="bg-purple" />
              )}
              {techStack.integrations?.length > 0 && (
                <TechCategory icon={<Plug size={18} className="text-primary" />} label="Integrations" items={techStack.integrations} dotColor="bg-primary" />
              )}
              {techStack.hosting?.length > 0 && (
                <TechCategory icon={<Cloud size={18} className="text-teal-500" />} label="Hosting" items={techStack.hosting} dotColor="bg-teal-500" />
              )}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <Clock size={18} className="text-primary" />
                Estimated Timeline &amp; Budget
              </h2>
              {!editingEstimation && lead.isAnalyzed && (
                <button
                  onClick={handleStartEditEstimation}
                  className="flex items-center gap-1.5 text-xs font-medium text-ternary hover:text-foreground transition-colors cursor-pointer"
                >
                  <Pencil size={13} />
                  Edit
                </button>
              )}
            </div>

            {editingEstimation ? (
              <div className="space-y-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-ternary uppercase tracking-wide mb-1.5 block">
                      Estimated Duration
                    </label>
                    <input
                      type="text"
                      value={editTimeline}
                      onChange={(e) => setEditTimeline(e.target.value)}
                      placeholder="e.g. 4–6 months"
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ternary uppercase tracking-wide mb-1.5 block">
                      Budget Range
                    </label>
                    <input
                      type="text"
                      value={editBudget}
                      onChange={(e) => setEditBudget(e.target.value)}
                      placeholder="e.g. $40,000 – $60,000"
                      className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                {lead.aiBudgetRange && (
                  <p className="text-xs text-ternary">
                    AI original estimate: <span className="font-medium">{lead.aiBudgetRange}</span>
                  </p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-ternary mb-1">Estimated Duration</p>
                  <p className="text-2xl font-bold text-foreground">{lead.timeline}</p>
                </div>
                <div>
                  <p className="text-sm text-ternary mb-1">Budget Range</p>
                  <p className="text-2xl font-bold text-primary">{lead.budget}</p>
                  {lead.aiBudgetRange && (
                    <p className="text-xs text-ternary mt-1">
                      AI estimate: <span className="font-medium">{lead.aiBudgetRange}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {editingEstimation ? (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground">Milestone Breakdown</p>
                  <button
                    onClick={handleAddMilestone}
                    className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    + Add Row
                  </button>
                </div>
                {editMilestones.length === 0 ? (
                  <p className="text-xs text-ternary py-2">No milestones — click &quot;+ Add Row&quot; to add one.</p>
                ) : (
                  <div className="space-y-2">
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr_140px_140px_32px] gap-2 px-1">
                      <span className="text-xs font-semibold text-ternary uppercase tracking-wide">Phase</span>
                      <span className="text-xs font-semibold text-ternary uppercase tracking-wide">Duration</span>
                      <span className="text-xs font-semibold text-ternary uppercase tracking-wide">Cost Range</span>
                      <span />
                    </div>
                    {editMilestones.map((m, i) => (
                      <div key={i} className="grid grid-cols-[1fr_140px_140px_32px] gap-2 items-center">
                        <input
                          type="text"
                          value={m.name}
                          onChange={(e) => handleMilestoneChange(i, "name", e.target.value)}
                          placeholder="e.g. Discovery & Planning"
                          className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                        <input
                          type="text"
                          value={m.duration}
                          onChange={(e) => handleMilestoneChange(i, "duration", e.target.value)}
                          placeholder="e.g. 2 weeks"
                          className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                        <input
                          type="text"
                          value={m.cost}
                          onChange={(e) => handleMilestoneChange(i, "cost", e.target.value)}
                          onBlur={() => normalizeCostOnBlur(i)}
                          placeholder="e.g. $8,000–$10,000"
                          className="px-3 py-2 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        />
                        <button
                          onClick={() => handleRemoveMilestone(i)}
                          className="flex items-center justify-center w-8 h-8 rounded-lg text-ternary hover:text-error-text hover:bg-error-bg transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-4">
                  <button
                    onClick={handleSaveEstimation}
                    disabled={estimationSaving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {estimationSaving ? <RefreshCw size={13} className="animate-spin" /> : <Check size={13} />}
                    {estimationSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEditEstimation}
                    disabled={estimationSaving}
                    className="flex items-center gap-1.5 px-4 py-2 border border-border text-ternary rounded-lg text-sm font-semibold hover:bg-off-white transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <X size={13} />
                    Cancel
                  </button>
                </div>
              </div>
            ) : milestones.length > 0 ? (
              <>
                <p className="text-sm font-semibold text-foreground mb-3">Milestone Breakdown</p>
                <div className="space-y-0 border border-border rounded-xl overflow-hidden">
                  {milestones.map((m: { name: string; duration: string; cost: string }, i: number) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 text-sm border-b border-border last:border-0 hover:bg-off-white transition-colors">
                      <div>
                        <p className="font-medium text-foreground">{m.name}</p>
                        <p className="text-sm text-ternary mt-0.5">{m.duration}</p>
                      </div>
                      <span className="font-semibold text-foreground whitespace-nowrap">{m.cost}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </Card>

          {suggestedQuestions.length > 0 && (
            <Card>
              <SectionTitle icon={<MessageCircle size={18} className="text-primary" />}>
                Suggested Questions to Ask
              </SectionTitle>
              <ol className="space-y-4">
                {suggestedQuestions.map((q: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ternary">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-off-white border border-border text-xs font-semibold text-ternary flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    {q}
                  </li>
                ))}
              </ol>
            </Card>
          )}

          <Card>
            <SectionTitle icon={<Clock size={18} className="text-ternary" />}>Audit Log</SectionTitle>
            <div className="space-y-0">
              {auditLog.map((entry: { label: string; date: string; actor: string }, i: number) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{entry.label}</p>
                    <p className="text-xs text-ternary mt-0.5">{entry.date} &nbsp;·&nbsp; {entry.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ── Right sidebar ────────────────────────────────────────────────── */}
        <div className="space-y-4">

          <Card className="p-5">
            <p className="text-sm font-semibold text-foreground mb-3">Zoho CRM Sync</p>
            {zoho ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success-bg border border-success-border mb-3">
                <CheckCircle2 size={14} className="text-success-text shrink-0" />
                <span className="text-xs font-semibold text-success-text">{zoho.status}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 border border-yellow-200 mb-3">
                <CheckCircle2 size={14} className="text-yellow-500 shrink-0" />
                <span className="text-xs font-semibold text-yellow-600">Not Synced</span>
              </div>
            )}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-ternary">CRM ID:</span>
                <span className="font-medium text-foreground">{zoho?.crmId ?? "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ternary">Last Synced:</span>
                <span className="font-medium text-foreground">{zoho?.lastSynced ?? "N/A"}</span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3">
            <p className="text-sm font-semibold text-foreground">Actions</p>

            <Button label="Draft WhatsApp Reply" icon={<MessageSquare size={15} />} iconPlacement="left" variant="primary" className="w-full px-4 py-2.5 text-sm" onClick={() => setWhatsappOpen(true)} disabled={(rawLead?.whatsappDraftCount ?? 0) >= 2} />
            <Button
              label={rawLead.proposalDoc?.generatedAt ? "Proposal Generated" : "Prepare Proposal"}
              icon={<FileText size={15} />}
              iconPlacement="left"
              variant="blue"
              className="w-full px-4 py-2.5 text-sm"
              onClick={() => setProposalOpen(true)}
              disabled={!!rawLead.proposalDoc?.generatedAt}
            />

            <div className="grid grid-cols-2 gap-2">
              <Button label="Sync to Zoho" icon={<RefreshCw size={13} />} iconPlacement="left" variant="secondary" className="w-full px-3 py-2 text-sm" />
              <Button
                label="Download DOCX"
                icon={<Download size={13} />}
                iconPlacement="left"
                variant="secondary"
                className="w-full px-3 py-2 text-sm"
                onClick={handleDownloadProposal}
                disabled={!rawLead.proposalDoc?.generatedAt}
              />
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5 text-xs text-ternary leading-relaxed">
              <span className="font-semibold text-blue">Pre-Sales Actions: </span>
              Qualify leads and prepare proposals. Sales team handles Won/Lost in Zoho CRM.
            </div>

            <Button
              label="Mark as Qualified (Handoff to Sales)"
              variant="qualified"
              className="w-full px-4 py-2.5 text-sm"
              onClick={() => handleStatusChange("qualified")}
              disabled={actionLoading || rawLead.status === "qualified"}
            />
            <Button
              label="Mark as Dropped"
              variant="destructive"
              className="w-full px-4 py-2.5 text-sm"
              onClick={() => handleStatusChange("drop")}
              disabled={actionLoading || rawLead.status === "drop"}
            />
          </Card>
        </div>
      </div>

      <WhatsAppReplyModal isOpen={whatsappOpen} onClose={() => setWhatsappOpen(false)} lead={lead} />
      <PrepareProposalModal isOpen={proposalOpen} onClose={() => setProposalOpen(false)} lead={lead} />
    </div>
  );
}

function TechCategory({ icon, label, items, dotColor }: { icon: React.ReactNode; label: string; items: string[]; dotColor: string }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-2">{icon}{label}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ternary">
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${dotColor}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
