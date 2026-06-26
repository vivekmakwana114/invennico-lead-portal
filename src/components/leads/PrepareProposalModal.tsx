"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { X, FileText, CheckCircle2, Download, Database, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { generateProposal } from "@/state/leads/leadsSlice";
import { leadsService } from "@/state/leads/leadsService";
import type { LeadDetail } from "@/components/leads/LeadsDetailData";

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseApiError(raw: unknown): string {
  const str = typeof raw === "string" ? raw : (raw as any)?.message || "";

  // Strip leading HTTP status code if present: "400 {...}"
  const jsonStr = str.replace(/^\d{3}\s+/, "");
  try {
    const parsed = JSON.parse(jsonStr);
    const type: string = parsed?.error?.type ?? "";
    const msg: string = parsed?.error?.message ?? "";

    if (type === "authentication_error" || msg.toLowerCase().includes("api key")) {
      return "The AI service API key is invalid or missing. Please contact your administrator.";
    }
    if (
      type === "invalid_request_error" &&
      (msg.toLowerCase().includes("credit") || msg.toLowerCase().includes("billing"))
    ) {
      return "The AI service has run out of credits. Please contact your administrator to top up the account before generating a proposal.";
    }
    if (type === "rate_limit_error" || msg.toLowerCase().includes("rate limit")) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (msg) return msg;
  } catch {
    // not JSON — fall through
  }

  if (str.toLowerCase().includes("credit") || str.toLowerCase().includes("billing")) {
    return "The AI service has run out of credits. Please contact your administrator to top up the account before generating a proposal.";
  }

  return str || "Something went wrong. Please try again.";
}

function buildTechStack(lead: LeadDetail): string {
  return [
    ...(lead.techStack.frontend?.slice(0, 1) ?? []),
    ...(lead.techStack.backend?.slice(0, 2) ?? []),
    ...(lead.techStack.integrations?.slice(0, 1).map((i) => i.split(" ")[0]) ?? []),
  ].join(", ");
}

// ── Input shared style ────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm text-foreground placeholder:text-ternary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors";

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = "form" | "generating" | "success" | "error";

interface PrepareProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadDetail;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PrepareProposalModal({ isOpen, onClose, lead }: PrepareProposalModalProps) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s: any) => s.auth.user);

  const [proposalName, setProposalName] = useState(lead.fullProjectName);
  const [clientName, setClientName] = useState(lead.clientContact === "N/A" ? "" : lead.clientContact);
  const [budget, setBudget] = useState(lead.budget === "N/A" ? "" : lead.budget);
  const [timeline, setTimeline] = useState(lead.timeline === "N/A" ? "" : lead.timeline);
  const [techStack, setTechStack] = useState(() => buildTechStack(lead));
  const [phase, setPhase] = useState<Phase>("form");
  const [barProgress, setBarProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Sync latest lead values into form every time the modal opens (setState-during-render)
  if (prevIsOpen !== isOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setProposalName(lead.fullProjectName);
      setClientName(lead.clientContact === "N/A" ? "" : lead.clientContact);
      setBudget(lead.budget === "N/A" ? "" : lead.budget);
      setTimeline(lead.timeline === "N/A" ? "" : lead.timeline);
      setTechStack(buildTechStack(lead));
    }
  }

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Reset phase/progress when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setPhase("form");
        setBarProgress(0);
        setErrorMsg("");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleGenerate() {
    setBarProgress(0);
    setPhase("generating");

    const t1 = setTimeout(() => setBarProgress(40), 100);
    const t2 = setTimeout(() => setBarProgress(75), 3000);

    try {
      await dispatch(
        generateProposal({
          leadId: lead.id,
          payload: {
            preparedFor: clientName.trim() || undefined,
            preparedBy: authUser?.name || undefined,
          },
        })
      ).unwrap();

      clearTimeout(t1);
      clearTimeout(t2);
      setBarProgress(100);
      setTimeout(() => setPhase("success"), 400);
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      setErrorMsg(parseApiError(err));
      setPhase("error");
    }
  }

  async function handleDownload() {
    setDownloadLoading(true);
    try {
      const res = await leadsService.downloadProposal(lead.id);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `Proposal-${lead.fullProjectName}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      onClose();
    } catch {
      // user can retry from lead detail page
    } finally {
      setDownloadLoading(false);
    }
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
            AI is creating your comprehensive scope document. This may take 30–60 seconds.
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
          <p className="text-sm text-ternary">Please wait — do not close this window.</p>
        </div>
      </div>
    );
  }

  // ── Error overlay ─────────────────────────────────────────────────────────

  if (phase === "error") {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-error-bg flex items-center justify-center mb-5">
            <AlertCircle size={32} className="text-error-text" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Generation Failed</h2>
          <p className="text-sm text-ternary mb-6">{errorMsg}</p>
          <div className="flex gap-3 w-full">
            <Button label="Cancel" variant="secondary" className="flex-1 py-3 text-sm rounded-full" onClick={onClose} />
            <Button label="Try Again" variant="primary" className="flex-1 py-3 text-sm rounded-full" onClick={() => setPhase("form")} />
          </div>
        </div>
      </div>
    );
  }

  // ── Success overlay ───────────────────────────────────────────────────────

  if (phase === "success") {
    return (
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
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
              <CheckCircle2 size={18} className="text-success-text shrink-0" />
              <span className="text-sm text-foreground">Saved to Server</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3.5">
              <Database size={18} className="text-purple shrink-0" />
              <span className="text-sm text-foreground">Attached to Lead Record</span>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              label="Done"
              variant="secondary"
              className="flex-1 py-3 text-sm rounded-full"
              onClick={onClose}
            />
            <Button
              label={downloadLoading ? "Downloading..." : "Download DOCX"}
              icon={<Download size={15} />}
              iconPlacement="left"
              variant="primary"
              className="flex-1 py-3 text-sm rounded-full"
              onClick={handleDownload}
              disabled={downloadLoading}
            />
          </div>
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
          {lead.milestones.length > 0 && (
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
          )}
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
