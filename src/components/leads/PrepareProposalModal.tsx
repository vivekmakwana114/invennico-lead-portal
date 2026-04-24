"use client";

import { useState, useEffect } from "react";
import { X, FileText, FolderOpen, CheckCircle2, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { LeadDetail } from "@/components/leads/LeadsDetailData";

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildTechStack(lead: LeadDetail): string {
  return [
    ...(lead.techStack.frontend?.slice(0, 1) ?? []),
    ...(lead.techStack.backend?.slice(0, 2) ?? []),
    ...(lead.techStack.integrations?.slice(0, 1).map((i) => i.split(" ")[0]) ?? []),
  ].join(", ");
}

function buildDrivePath(lead: LeadDetail): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.toLocaleString("default", { month: "short" });
  const safe = lead.fullProjectName.replace(/[/\\:*?"<>|]/g, "-");
  return `/Proposals/${year}/${month}/${safe} - Proposal v1.0.pdf`;
}

// ── Input shared style ────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-ternary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "form" | "generating" | "success";

interface PrepareProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadDetail;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PrepareProposalModal({ isOpen, onClose, lead }: PrepareProposalModalProps) {
  const [proposalName, setProposalName] = useState(lead.fullProjectName);
  const [clientName, setClientName] = useState(lead.clientContact);
  const [budget, setBudget] = useState(lead.budget);
  const [timeline, setTimeline] = useState(lead.timeline);
  const [techStack, setTechStack] = useState(() => buildTechStack(lead));
  const [phase, setPhase] = useState<Phase>("form");
  const [barProgress, setBarProgress] = useState(0);

  const drivePath = buildDrivePath(lead);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Animated progress bar during generation
  useEffect(() => {
    if (phase !== "generating") return;
    const t1 = setTimeout(() => setBarProgress(85), 50);
    const t2 = setTimeout(() => setBarProgress(100), 1600);
    const t3 = setTimeout(() => setPhase("success"), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setPhase("form");
        setBarProgress(0);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleGenerate() {
    setBarProgress(0);
    setPhase("generating");
  }

  // ── Generating overlay ────────────────────────────────────────────────────

  if (phase === "generating") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30 mb-5">
            <FileText size={28} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Generating Proposal...</h2>
          <p className="text-sm text-ternary mb-7">
            AI is creating your comprehensive scope document
          </p>
          <div className="w-full h-2.5 rounded-full bg-border overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${barProgress}%`,
                transition: "width 1500ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>
          <p className="text-sm text-ternary">This will take a few moments...</p>
        </div>
      </div>
    );
  }

  // ── Success overlay ───────────────────────────────────────────────────────

  if (phase === "success") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-success-bg flex items-center justify-center mb-5">
            <CheckCircle2 size={32} className="text-success-text" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Proposal Generated Successfully!</h2>
          <p className="text-sm text-ternary mb-6">
            Your scope document has been created and saved.
          </p>

          {/* Checklist */}
          <div className="w-full bg-off-white border border-border rounded-2xl divide-y divide-border mb-6">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <CheckCircle2 size={18} className="text-success-text shrink-0" />
              <span className="text-sm text-foreground">Proposal Generated Successfully</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <FolderOpen size={18} className="text-blue shrink-0" />
              <span className="text-sm text-foreground">Saved to Google Drive</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Database size={18} className="text-purple shrink-0" />
              <span className="text-sm text-foreground">Attached to Zoho Lead</span>
            </div>
          </div>

          <Button
            label="Done"
            variant="primary"
            className="w-full py-3 text-sm rounded-full"
            onClick={onClose}
          />
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-blue flex items-center justify-center shadow-sm shrink-0">
              <FileText size={20} className="text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-foreground">Prepare Scope Document / Proposal</h2>
              <p className="text-xs text-ternary mt-0.5 truncate">{lead.fullProjectName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ternary hover:bg-off-white hover:text-foreground transition-colors cursor-pointer shrink-0 mt-0.5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Proposal Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Proposal Name</label>
            <input
              type="text"
              value={proposalName}
              onChange={(e) => setProposalName(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Client Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Client Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Budget + Timeline */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Budget</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground">Timeline</label>
              <input
                type="text"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* Tech Stack */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground">Tech Stack</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* Milestones */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Milestones</p>
            <div className="space-y-2">
              {lead.milestones.map((m, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-off-white border border-border"
                >
                  <span className="w-7 h-7 rounded-full bg-error-bg border border-error-border text-primary text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground">
                    {m.name}{" "}
                    <span className="text-ternary">({m.duration})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Drive Folder */}
          <div className="rounded-xl border border-border p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FolderOpen size={16} className="text-ternary shrink-0" />
              Google Drive Folder
            </div>
            <p className="font-mono text-xs text-ternary break-all leading-relaxed">
              {drivePath}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-border shrink-0">
          <Button
            label="Cancel"
            variant="secondary"
            className="px-5 py-2.5 text-sm"
            onClick={onClose}
          />
          <Button
            label="Generate Proposal"
            icon={<FileText size={15} />}
            iconPlacement="left"
            variant="blue"
            className="px-5 py-2.5 text-sm"
            onClick={handleGenerate}
          />
        </div>
      </div>
    </div>
  );
}
